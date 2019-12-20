<?php
//Use to serve file
define('FM_SESSION_ID', 'filemanager');
session_name(FM_SESSION_ID);

session_start();

if ($_SESSION["filemanager"]['logged'] === null) {
    header('HTTP/1.0 403 Forbidden');
    echo 'Forbidden!';
    exit;
}

$path = realpath(dirname(__FILE__) . '/../files/' . $_GET['file']);

$parts = explode('/', pathinfo($path, PATHINFO_DIRNAME));

// if (end($parts) !== 'my_files') exit();

if (!is_file($path)) {
    header('HTTP/1.0 403 Forbidden');
    echo 'Forbidden!';
    exit;
}

header('Content-Type: ' . mime_content_type($path));
header('Content-Length: ' . filesize($path));

readfile($path);
