<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/ctrl_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/group.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/save_file.php';

if (!empty($_GET['c'])) {
    $c = $_GET['c'];
    if (check_user($_POST['user_count'], $_POST['token'])) {
        switch ($c) {
            case 1: //创建聊群
                $file = save_file("/group/pic", array('png', 'jpg', 'gif', 'jpeg'), "create_group_pic");
                if ($file == null) {
                    create_group($_POST['user_count'], $_POST['create_group_name'], $_POST['creat_group_text'], $_POST['creat_group_check'], '');
                    echo 1;
                    return;
                } else {
                    create_group($_POST['user_count'], $_POST['create_group_name'], $_POST['creat_group_text'], $_POST['creat_group_check'], $file['file_name']);
                    echo 1;
                    return;
                }
                echo 0;
                break;
            case 2: //搜索群组
                echo json_encode(search_group_obscure($_POST['group_count']));
                break;
            case 3: //加入群组
                if ($ret = search_group($_POST["group_count"])) {
                    if ($ret != null) {
                        if (search_user_count($_POST['user_count']) && join_group($ret['token'], $_POST['user_count'])) {
                            echo -2;
                        }
                    }
                } else {
                    echo -1;
                }
                break;
            case 4: //显示加入的群组
                echo json_encode(select_group($_POST['user_count']));
                break;
        }
    }
} else {
    echo '<br><b>Notice</b>:  Notice: Undefined index: user in /var/lib/www/check.php</b> on line <b>123</b><br>';
    for ($i = 0; $i < rand(0, 25); $i++) {
        echo json_encode(array('group_count' => rand()));
    }
}