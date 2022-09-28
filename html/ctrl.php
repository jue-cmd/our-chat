<?php
$c = $_GET['c'];
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/ctrl_func.php';
$data = $_POST;
switch ($c) {
    case 1: //撤回消息
        $user_count = $data['user_count'];
        $token = $data['token'];
        if (check_admin($user_count) && token_checker($user_count, $token)) {
            $id = $data['id'];
            echo $id;
            delete_word($id, $_POST['talk_token']);
        } else {
            echo 0;
        }
}