<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/group.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/users.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
if (!empty($_POST['user_count']) and !empty($_POST['token']) and check_user($_POST['user_count'], $_POST['token'])) {
    echo json_encode(array('user_info' => get_user_data($_POST['user_count']), 'group_info' => select_group($_POST['user_count']), 'friend_info' => get_user_friend($_POST['user_count'])));
} else {
    echo '0';
}