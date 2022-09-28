<?php
$c = $_GET['c'];
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/token_.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
//包含必要头文件
$data = $_POST; //接收数据
switch ($c) {
    case 1:
        $user_count = $data['user_count'];
        $user_passwd = $data['user_passwd'];
        if ($ret = login_checker($user_count, md5($user_passwd))) {
            $token_ret = token_do($ret['user_count']);
            if ($token_ret) {
                $return_data = array('token' => $token_ret, 'user_count' => $ret['user_count'], 'user_name' => $ret['user_name']);
                echo json_encode($return_data);
            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
        break;
    case 2: //注册用户
        $user_name = $data['user_name'];
        $user_passwd = $data['user_password'];
        if ($user_name != '' && $user_passwd != '') {
            if ($ret = inscert_user($user_name, $user_passwd)) {
                echo json_encode($ret);
            } else {
                echo -1;
            }
        }
        break;
}