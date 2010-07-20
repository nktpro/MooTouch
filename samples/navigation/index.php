<?php
    define('FRAMEWORK_PATH', '../../framework/');
	$mootoolsScripts = include '../blank/mootools_files.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no;" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-touch-fullscreen" content="yes" />

        <title>Sample Navigation</title>

        <link href="../blank/favicon.png" rel="shortcut icon" type="image/x-icon" />
        <link href="../blank/app_icon.png" rel="apple-touch-icon" />
        <link href="../blank/app_startup.png" rel="apple-touch-startup-image" />

        <link href="<?php echo FRAMEWORK_PATH ?>themes/default.css" media="screen" rel="stylesheet" type="text/css" />

        <?php foreach($mootoolsScripts as $package => $files): ?>
            <?php foreach($files as $file): ?>
            <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootools/<?php echo $package ?>/<?php echo $file ?>.js"></script>
            <?php endforeach; ?>
        <?php endforeach; ?>

        <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootouch/MooTouch.js"></script>
        <script type="text/javascript" src="<?php echo FRAMEWORK_PATH ?>js/mootouch/Namespace.js"></script>
        <script type="text/javascript">
            Namespace.setBasePath("<?php echo FRAMEWORK_PATH ?>js");
            Namespace.setBasePath('MooTouch', 'mootouch');
        </script>
        <script type="text/javascript" src="js/main.js"></script>
    </head>

    <body>
        <div id="rootView">
            <div id="defaultScreen" class="linearLayout vertical">
                <div>
                    <div id="defaultNavigationBar" class="bar navigation">
                        <div>
                            <h1><span role="title" class="title">所有網頁 圖片</span></h1>

                            <a role="backControl" class="button bar back">Back</a>

                            <span role="controlsContainer" class="monoLayout">
                                <a id="testControl1" class="button bar">Button 1</a>
                                <a id="testControl2" class="button bar ">Control 2 Very Long</a>
                                <a id="testControl3" class="button bar ">Test 3</a>
                            </span>
                        </div>
                    </div>
                </div>


                <div class="flexible">
                    <ul style="text-align:center; padding-top: 20px">
                        <li>
                            <button id="forwardButton" class="modal normal">Forward</button>
                        </li>

                        <li style="padding-top: 20px">
                            <button id="backButton" class="modal normal">Back</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>