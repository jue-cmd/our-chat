<?php

$host = '127.0.0.1';
$u = '';
$p = '';
$dbname = '';
$db = new mysqli($host, $u, $p, $dbname);

if ($db->connect_errno != 0) {
    die("连接失败: " . $conn->connect_error);
}
header("Access-Control-Allow-Origin:*");
//连接数据库