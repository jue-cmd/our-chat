<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/connect_db.php';
function login_checker($user_name, $user_pwd)
{
    global $db;
    $sql = "SELECT * FROM `user` WHERE `user_count`='{$user_name}' OR `user_name`='{$user_name}' LIMIT 1;";
    $ret = $db->query($sql);
    if ($ret->num_rows == 0) {
        return false;
    } else {
        return $ret->fetch_array(MYSQLI_ASSOC);
    }
}

function token_checker($user_count, $token)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $token = mysqli_escape_string($db, $token);
    $sql = "SELECT COUNT(*) FROM `user_token` WHERE `user_count`='{$user_count}' AND `token`='{$token}'";
    if ($db->query($sql)->fetch_array(MYSQLI_ASSOC)['COUNT(*)'] == 1) {
        return true;
    } else {
        return false;
    }
}

function check_admin($user_count)
{
    $rows = select_db('user');
    foreach ($rows as $row) {
        if ($row['user_count'] == $user_count && $row['is_admin'] == 1) {
            return true;
        }
    }
    return false;
}

function check_user($user_count, $token)
{
    return token_checker($user_count, $token);
}
function check_friend($user_count, $token)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $token = mysqli_escape_string($db, $token);
    $sql = "SELECT * FROM `friend_data` WHERE `count_A`='{$user_count}' AND `friend_token`='{$token}' LIMIT 1";
    $ret = $db->query($sql);
    if ($ret->num_rows == 0) {
        return false;
    } else {
        return true;
    }
}
function check_group($user_count, $token)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $token = mysqli_escape_string($db, $token);
    $sql = "select count(*) from `group_member_data` where `group_member_data`.`user_count`='{$user_count}' and `group_member_data`.`token`='{$token}' limit 1;";
    $ret = $db->query($sql);
    if ($ret && $ret->num_rows > 0) {
        return true;
    }
    return false;
}