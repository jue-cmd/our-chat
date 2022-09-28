<?php
include_once($_SERVER['DOCUMENT_ROOT'].'/config_file/connect_db.php');
function insect_post($tittle,$context,$name,$is_important,$user_count)
{
    global $db;
    global $dbname;
    $mysql="INSERT INTO `{$dbname}`.`poster` (`poster_text`, `poster_peopel`, `tittle`, `is_important`, `user_count`) VALUES ('{$context}', '{$name}', '{$tittle}','{$is_important}', '{$user_count}')";
    $ret = $db->query($mysql);
    return $ret;
}

function delete_post($id)
{
    global $db,$dbname;
    $mysql="DELETE FROM `{$dbname}`.`poster` WHERE `id` = {$id}";
    $db->query($mysql);
    return;
}

function update_post()
{
    return;
}