<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/poster/ctrl.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/poster/lay_out.php';
$c = $_GET['c'];
$data = $_POST;
if (token_checker($data['user_count'], $data['token'])) //校验权限
{
    switch ($c) {
        case 1: //获取公告
            echo json_encode(out_poster());
            break;
        case 2: //发布公告
            if (check_admin($data['user_count'])) //校验权限
            {
                $ret = insect_post($data['tittle'], $data['context'], $data['name'], $data['is_important'], $data['user_count']);
                if ($ret) {
                    echo "ok";
                } else {
                    echo "不ok";
                }
            }
            break;
        case 3: //修改公告

            break;
        case 4: //删除公告
            if (check_admin($data['user_count']) && token_checker($data['user_count'], $data['token'])) //校验权限
            {
                delete_post($data['id']);
            }
            break;
        case 5:
            if (check_admin($data['user_count'])) {
                echo 1;
            } else {
                echo 0;
            }
    }
}