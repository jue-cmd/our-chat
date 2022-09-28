<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/token_.php';
//创建聊群
function create_group($user_count, $group_name, $group_text, $join_check, $pic_name)
{
    //添加记录
    global $db;
    //过滤字符防止sql注入
    $group_name = mysqli_escape_string($db, $group_name);
    $group_text = mysqli_escape_string($db, $group_text);
    $join_check = mysqli_escape_string($db, $join_check);
    $pic_name = mysqli_escape_string($db, $pic_name);
    $group_token = token_make();
    $time = date('Y-m-d H:i:s');
    $sql = "INSERT INTO `group_data` (`group_name`, `group_text`, `join_check`, `token`, `creat_time`, `pic`)
                 VALUES ('{$group_name}', '{$group_text}', '{$join_check}', '{$group_token}', '{$time}', '{$pic_name}')";
    if ($db->query($sql)) {
        $user_count = mysqli_escape_string($db, $user_count);
        $sql = "INSERT INTO `group_member_data` (`token`, `user_count`, `jion_time`, `permission`, `talk`, `alias`)
                     VALUES ('{$group_token}', '{$user_count}', '{$time}', '-1', '1', '群主')";
        if ($db->query($sql)) {
            return true;
        }
    }
    return false;
}
//查找群组
function search_group_obscure($group_count)
{
    global $db;
    $group_count = mysqli_escape_string($db, $group_count);
    $sql = "SELECT `id`,`group_name`,`join_check`,`pic` FROM `group_data` WHERE `group_name` LIKE '%{$group_count}%' OR `id` = CONVERT('{$group_count}',SIGNED)";
    $ret = $db->query($sql);
    if ($ret && $ret->num_rows != 0) {
        $ret_rows = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($row != null) {
                $ret_rows[] = $row;
            }
        }
        return $ret_rows;
    }
    return null;
}
//加入群组
function join_group($group_token, $user_count)
{
    global $db;
    $time = date('Y-m-d H:i:s');
    $group_token = mysqli_escape_string($db, $group_token);
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "INSERT INTO `group_member_data` (`token`, `user_count`, `jion_time`, `permission`, `talk`, `alias`)
                                     VALUES ('{$group_token}', '{$user_count}', '{$time}', '0', '1', 'null')";
    return $db->query($sql);
}
function search_group($group_count)
{
    global $db;
    global $dbname;
    $group_count = mysqli_escape_string($db, $group_count);
    $sql = "SELECT `id`,`group_name`,`join_check`,`pic` FROM `group_data` WHERE `id` = {$group_count}' LIMIT 1";
    $ret = $db->query($sql);
    if ($ret->num_rows != 0) {
        $ret_rows = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            $ret_rows[] = $row;
        }
        return $ret_rows;
    }
    return null;
}
//列出聊群
function select_group($user_count)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "select * from `group_member_data`,`group_data`  where `group_member_data`.`user_count`='{$user_count}' and `group_member_data`.`token`=`group_data`.`token`;";
    $ret = $db->query($sql);
    if ($ret && $ret->num_rows != 0) {
        $rows = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($row != null) {
                $rows[] = $row;
            }
        }
        return $rows;
    }
}

//删除群组
function delete_group()
{

}