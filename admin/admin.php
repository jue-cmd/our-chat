<?php
$c = $_GET['c'];
include_once $_SERVER['DOCUMENT_ROOT'] . '/admin/func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . "/config_file/db_func.php";
include_once $_SERVER['DOCUMENT_ROOT'] . "/funcation/ctrl_func.php";
if (check_admin_token($_POST['user_name'], $_POST['token'])) {
    switch ($c) {
        case 1:
            $ret = select_db("user");
            echo json_encode($ret);
            break;
        case 2: //删除用户
            echo delete_user($_POST['user_count']);
            break;
        case 3: //设为管理员
            echo set_admin($_POST['user_count']);
            break;
        case 4: //解除管理员
            echo unset_admin($_POST['user_count']);
            break;
        case 5: //清空聊天记录
            echo delete_word_all();
            break;
        case 6: //显示允许的文件
            echo json_encode(select_db("allow_file_sort"));
            break;
        case 7: //删除允许的文件
            echo delete_allow_sort($_POST['id']);
            break;
        case 8: //添加允许文件
            echo add_allow_sort($_POST['str']);
            break;

    }
} else {
    echo 0;
}
