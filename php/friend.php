<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
$c = $_GET['c'];
if (check_user($_POST['user_count'], $_POST['token'])) {
    switch ($c) {
        case 1: //搜索好友
            if ($_POST['user_name_count'] != '') {
                $ret = search_people_obscure($_POST['user_name_count']);
                if ($ret != null) {
                    echo json_encode($ret);
                } else {
                    echo '0';
                }
            }
            break;
        case 2: //添加好友
            if ($_POST['user_count'] != $_POST['user_count_add']) {
                if (search_user_friend($_POST['user_count'], $_POST['user_count_add']) == null) {
                    $user_add_count = $_POST['user_count_add'];
                    //查找用户是否存在
                    if (search_user_count($user_add_count)) {
                        add_friend($_POST['user_count'], $user_add_count, $_POST['remark']);
                        echo 'ok';
                    } else {
                        echo 'no_ok';
                    }
                } else {
                    echo -1;
                }
            } else {
                echo -2;
            }
            break;
        case 3: //列出所有好友
            $ret = get_user_friend($_POST['user_count']);
            if ($ret == null) {
                echo 0;
            } else {
                echo json_encode($ret);
            }
            break;
        case 4: //获取好友请求
            $ret = get_friend_quest($_POST['user_count']);
            if ($ret == null) {
                echo 0;
            } else {
                echo json_encode($ret);
            }
            break;
        case 5:
            $ret = get_friend_quest_num($_POST['user_count']);
            if ($ret == null) {
                echo -1;
            } else {
                echo $ret;
            }
            break;
        case 6: //处理好友请求
            $alias = $_POST['alias'];
            if ($alias == '') {
                $alias = "";
            }
            $c = $_POST['c'];
            if (c_friend_quest($_POST['user_count'], $_POST['user_a'], $alias, $c)) {
                echo 1;
            } else {
                echo 0;
            }
            break;
        case 7: //删除好友

            break;
    }
}