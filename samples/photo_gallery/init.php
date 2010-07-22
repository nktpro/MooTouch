<?php

error_reporting(E_ALL);

define('ROOT_PATH', dirname(__FILE__));

$paths = array(
    ROOT_PATH . '/library',
    get_include_path()
);

set_include_path(implode(PATH_SEPARATOR, $paths));

require_once 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance()
        ->setFallbackAutoloader(true);

$frontendOptions = array(
	'lifetime' => 3600 * 12, // cache lifetime of 12 hours
	'automatic_serialization' => true
);

$backendOptions = array(
	'cache_dir' => ROOT_PATH . '/cache' // Directory where to put the cache files
);

$cache = Zend_Cache::factory(
	'Core',
	'File',
	$frontendOptions,
	$backendOptions
);