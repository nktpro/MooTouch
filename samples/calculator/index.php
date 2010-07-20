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

        <title>Sample Calculator</title>

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
            <div id="calculatorContainer">
                <table>
                    <tr>
                        <td><button class="modal normal">7</button></td>
                        <td><button class="modal normal">8</button></td>
                        <td><button class="modal normal">9</button></td>
                    </tr>
                    <tr>
                        <td><button class="modal normal">4</button></td>
                        <td><button class="modal normal">5</button></td>
                        <td><button class="modal normal">6</button></td>
                    </tr>
                    <tr>
                        <td><button class="modal normal">1</button></td>
                        <td><button class="modal normal">2</button></td>
                        <td><button class="modal normal">3</button></td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>