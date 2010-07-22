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

        <link href="themes/sample.css" media="screen" rel="stylesheet" type="text/css" />

        <?php foreach($mootoolsScripts as $package => $files): ?>
            <?php foreach($files as $file): ?>
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
        <div id="rootView">
            <div id="calculator">
                <div id="result"></div>
                <table width="100%">
                    <tr>
                        <td><a class="button modal cancel">C</a></td>
                        <td><a class="button modal normal">&pi;</a></td>
                        <td><a class="button modal orange">&radic;</a></td>
                        <td><a class="button modal orange">&divide;</a></td>
                    </tr>
                    <tr>
                        <td><a class="button modal normal">7</a></td>
                        <td><a class="button modal normal">8</a></td>
                        <td><a class="button modal normal">9</a></td>
                        <td><a class="button modal orange">&times;</a></td>
                    </tr>
                    <tr>
                        <td><a class="button modal normal">4</a></td>
                        <td><a class="button modal normal">5</a></td>
                        <td><a class="button modal normal">6</a></td>
                        <td><a class="button modal orange">+</a></td>
                    </tr>
                    <tr>
                        <td><a class="button modal normal">1</a></td>
                        <td><a class="button modal normal">2</a></td>
                        <td><a class="button modal normal">3</a></td>
                        <td><a class="button modal orange">&ndash;</a></td>
                    </tr>
                    <tr>
                        <td colspan="2"><a class="button modal normal">0</a></td>
                        <td><a class="button modal normal">.</a></td>
                        <td><a class="button modal orange">=</a></td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>