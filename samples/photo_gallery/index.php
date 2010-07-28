<?php
include 'init.php';

define('FRAMEWORK_PATH', '../../framework/');
$mootoolsScripts = include '../blank/mootools_files.php';

$flickr = new Zend_Service_Flickr('60b877f55da92e05b809c8d0c055ff05');
$tags = array('singapore', 'dog', 'computer');
$photos = array();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no;" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-touch-fullscreen" content="yes" />

        <title>Photo Gallery</title>

        <link href="../blank/favicon.png" rel="shortcut icon" type="image/x-icon" />
        <link href="../blank/app_icon.png" rel="apple-touch-icon" />
        <link href="../blank/app_startup.png" rel="apple-touch-startup-image" />

        <link href="themes/sample.css" media="screen" rel="stylesheet" type="text/css" />

        <?php foreach ($mootoolsScripts as $package => $files): ?>
        <?php foreach ($files as $file): ?>
                <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootools/<?php echo $package ?>/<?php echo $file ?>.js"></script>
        <?php endforeach; ?>
        <?php endforeach; ?>

                <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootouch/MooTouch.js"></script>
                <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootouch/Namespace.js"></script>
                <script type="text/javascript">
                    //            Namespace.setBasePath("<?php echo FRAMEWORK_PATH ?>js");
                    Namespace.setBasePath('MooTouch', '<?php echo FRAMEWORK_PATH ?>js/mootouch');
        </script>
        <script type="text/javascript" src="js/main.js"></script>
    </head>

    <body>
        <div id="rootView" class="frameLayout">
            <div id="defaultScreen" class="top linearLayout vertical">
                <div>
                    <div id="navigationBar" class="bar navigation">
                        <div>
                            <h1><span role="title" class="title">My Gallery</span></h1>

                            <a href="#viewAlbums" role="backControl" class="left button bar back">Back</a>

                            <span role="rightControls" class="right monoLayout">
                                <a id="control1" class="button bar">Test 1</a>
                                <a id="control2" class="button bar">Test 2</a>
                                <a id="control3" class="button bar">Test 3</a>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flexible">
                    <div id="mainContentView" class="frameLayout">
                        <div id="albumListView" class="scrollView top">
                            <div class="scroller">
                                <div id="albumList" class="tableLayout fixed navigatable">
                                    <?php foreach($tags as $tag): ?>
                                    <?php
                                        if (!($photos[$tag] = $cache->load($tag))){
                                            $photos[$tag] = array();

                                            $results = $flickr->tagSearch($tag, array('sort' => 'interestingness-desc', 'per_page' => 50));

                                            foreach ($results as $result) {
                                                $photos[$tag][] = array(
                                                    'title' => $result->title,
                                                    'square' => $result->Square->uri,
                                                    'thumbnail' => $result->Thumbnail->uri
                                                );
                                            }

                                            $cache->save($photos[$tag], $tag);
                                        }
                                    ?>
                                    <a href="#viewPhotos/album/<?= $tag ?>">
                                        <span style="width: 75px">
                                            <img width="75" height="75" alt="<?= $photos[$tag][0]['title'] ?>" src="<?= $photos[$tag][0]['square'] ?>" />
                                        </span>
                                        <span><?= ucfirst($tag) ?> (<?= count($photos[$tag]) ?>)</span>
                                    </a>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>

                        <div id="photoListView" class="scrollView">
                            <div id="photoListContainer" class="scroller monoLayout">
                                <?php foreach($tags as $tag): ?>
                                <div id="photoList-<?= $tag ?>" class="photoList">
                                    <?php foreach($photos[$tag] as $photo): ?>

                                    <img width="100" height="100" alt="<?= $photo['title'] ?>" src="<?= $photo['thumbnail'] ?>" />

                                    <?php endforeach; ?>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>