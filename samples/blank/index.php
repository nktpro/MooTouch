<?php
    define('FRAMEWORK_PATH', '../../framework/');
	$mootoolsScripts = include 'mootools_files.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no;" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-touch-fullscreen" content="YES" />

        <title>Sample App</title>

        <link href="favicon.png" rel="shortcut icon" type="image/x-icon" />
        <link href="app_icon.png" rel="apple-touch-icon" />
        <link href="app_startup.png" rel="apple-touch-startup-image" />

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
        <div id="rootView" class="frameLayout">
            <div id="defaultScreen" class="top linearLayout vertical">
                <div>
                    <div id="defaultNavigationBar" class="bar navigation">
                        <div>
                            <a role="backControl" class="button bar back">Back</a>

                            <h1><span role="title" class="title">所有網頁 圖片</span></h1>

                            <span role="controlsContainer" class="monoLayout">
                                <a id="testControl1" class="button bar">Button 1</a>
                                <a id="testControl2" class="button bar ">Control 2</a>
                                <a id="testControl3" class="button bar ">Test 3</a>
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <button id="nextState" class="modal normal">Test 1</button>
                    <button id="previousState" class="modal normal">Test 2</button>
                </div>

                <div class="flexible">
                    <div id="testScrollView" class="scrollView">
                        <div class="scroller">
                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque aliquet vulputate enim. Vivamus at tempus magna. Aenean consequat fermentum tellus, in feugiat felis feugiat pharetra. Pellentesque rhoncus rutrum metus, non cursus lacus iaculis vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse venenatis malesuada dolor sit amet vestibulum. Sed semper placerat pharetra. Fusce quis elit nisi, nec ornare nulla. Cras id lacus elit, sit amet vestibulum turpis. Suspendisse congue tellus sed justo sagittis ac volutpat urna feugiat. Aliquam mollis bibendum purus at lacinia. Morbi suscipit, magna at fermentum vehicula, magna arcu aliquam leo, ut lacinia nibh nunc non tortor. Sed tortor odio, adipiscing a cursus et, pharetra eu sapien. Curabitur euismod, ipsum id vehicula pretium, dui ligula interdum eros, volutpat malesuada ante felis a nibh. Nulla vestibulum sagittis felis, nec egestas nulla feugiat non. In semper, leo sit amet convallis tincidunt, lectus nunc mollis purus, eu tincidunt enim quam eu tellus. Suspendisse sollicitudin venenatis quam, non molestie odio vestibulum id. Sed vestibulum tortor in magna adipiscing sit amet facilisis purus feugiat.

Phasellus rhoncus lorem sed ipsum aliquet elementum vulputate mauris porta. In in turpis leo. Vivamus quis dui tortor, in porttitor odio. Proin placerat pretium libero id condimentum. Vestibulum enim nulla, pulvinar at vulputate ut, blandit ut ipsum. Donec ornare, tortor sed condimentum pretium, nisl turpis cursus velit, a feugiat mauris ipsum non justo. Aliquam ut nulla velit. Sed consectetur mauris rutrum arcu sagittis eu consectetur diam interdum. Maecenas imperdiet, tortor eu facilisis tincidunt, nisi lacus tincidunt ante, id rutrum tortor mauris vitae felis. Integer at magna mauris, quis accumsan sapien. Aliquam ac quam lorem. Fusce bibendum augue sed lectus dignissim placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id dolor eu magna viverra aliquam non condimentum turpis. Suspendisse ac molestie nisl. Donec cursus diam vel libero semper molestie. Pellentesque augue lorem, imperdiet ut feugiat id, ultrices pulvinar nunc.

Vestibulum leo nibh, scelerisque sit amet pulvinar at, semper vitae diam. Quisque nulla erat, dapibus volutpat euismod eu, sagittis ut nulla. Vestibulum tempus orci nec quam tincidunt luctus. Aenean tortor quam, sodales in tempus fermentum, viverra nec tellus. Etiam a metus quis odio facilisis rhoncus. Curabitur laoreet ullamcorper eros in adipiscing. Maecenas diam neque, mollis in vulputate ut, facilisis sit amet purus. Cras varius vulputate volutpat. Phasellus sed sem et magna posuere pretium et at justo. In ultrices varius ipsum vel fringilla. Curabitur gravida dolor ligula, in bibendum dolor. Praesent nulla purus, ullamcorper scelerisque elementum vel, pretium feugiat enim. Sed purus nisl, interdum eu ultrices nec, iaculis nec lectus. Sed ultrices varius sodales. Aenean commodo lacinia eros eget convallis.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed sit amet neque quis ipsum euismod luctus in nec eros. Mauris tempus, eros porta porta consectetur, velit nulla vulputate nunc, et gravida urna augue in orci. In nulla lacus, egestas sed hendrerit in, tempor vel diam. Nulla semper tempus ultricies. Nam et urna ac odio interdum bibendum. Mauris in dolor sed nibh gravida porttitor ut nec lectus. Duis malesuada venenatis enim. Vestibulum egestas gravida ligula, vitae tincidunt nisi tempus sed. Vestibulum tristique elementum eros, sit amet pharetra arcu facilisis id. Morbi non ligula lectus. Proin ligula leo, rhoncus suscipit rhoncus ut, mattis in ligula. Praesent nec suscipit augue. Sed placerat imperdiet aliquet. Vestibulum elit quam, venenatis et porttitor fringilla, porttitor a est. Duis vel eros lacus. Maecenas ipsum turpis, varius eget placerat id, condimentum non ante. Nulla et fringilla justo. Praesent tempus luctus sollicitudin.

In eu diam tellus, ac pulvinar risus. Cras feugiat tristique orci at molestie. Nam adipiscing luctus est eget ultrices. Pellentesque at aliquam velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Praesent at nunc ac risus dictum adipiscing. Proin ullamcorper ligula sed tortor facilisis at accumsan lacus pharetra. Curabitur bibendum, leo sit amet mattis tempus, tortor sem tempus mi, sit amet malesuada lorem dolor at sem. Ut ipsum sapien, tempor non dictum eget, volutpat ac nisi.
                            </div>
                        </div>
                    </div>

                </div>

                <div>
                    <div id="defaultTabBar" class="bar tab linearLayout horizontal fixed">
                        <a href="#browse" id="browseTab" class="tab">
                            <span id="" class="icon browse"></span> Browse
                        </a>
                        <a href="#search" id="searchTab" class="tab">
                            <span id="" class="icon search"></span> Search
                        </a>
                        <a href="#courses" id="coursesTab" class="tab">
                            <span id="" class="icon courses"></span> Courses
                        </a>
                        <a href="#articles" id="articlesTab" class="tab">
                            <span id="" class="icon articles"></span> Articles
                        </a>
                        <a href="#profile" id="profileTab" class="tab">
                            <span id="" class="icon user"></span> My Account
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </body>
</html>