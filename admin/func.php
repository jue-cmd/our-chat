<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/token_.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/connect_db.php';
function check_admin_token($user_name, $token)
{
    $ret = select_db("admin");
    foreach ($ret as $row) {
        if ($row["user"] == $user_name && $row["token"] == $token) {
            return true;
        }
    }
    return false;
}