<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/config_file/db_func.php";
switch ($_GET['c']) {
    case 1: //获取用户数据
        $ret = user_search($_POST["user_count"]);
        if ($ret) {
            $data = array("user_count" => $ret['user_count'], "user_name" => $ret['user_name'], "pic" => $ret['pic'], "others" => read_others($ret['others']));
            echo json_encode($data);
        }
        break;
    case 2:
        break;

}