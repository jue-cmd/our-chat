<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/connect_db.php';
function delete_word($id, $talk_token)
{
    global $db;
    global $dbname;
    $sql = "SELECT * FROM `talk` WHERE `id` = {$id}";
    $ret = $db->query($sql)->fetch_array(MYSQLI_ASSOC);
    if ($ret != null and $ret['token'] == $talk_token) {
        if ($ret['file_url'] != null) {
            unlink($ret['file_url']);
        }
        $sql = "DELETE FROM `{$dbname}`.`talk` WHERE `id` = {$id}";
        $ret = $db->query($sql);
        return $ret;
    }
}
function delete_word_all()
{
    global $db;
    global $dbname;
    $sql = "DELETE FROM `{$dbname}`.`talk`";
    $ret = $db->query($sql);
    return $ret;
}
function delete_user($user_count)
{
    global $db;
    global $dbname;
    $sql = "DELETE FROM `{$dbname}`.`user` WHERE `user_count` = {$user_count}";
    $ret = $db->query($sql);
    $sql = "UPDATE `chat_sql`.`talk` SET `Name` = '此用户已注销' WHERE `user_count` = {$user_count}";
    $db->query($sql);
    return $ret;
}
function post_add($text, $name, $tittle, $is_important)
{
    global $db;
    global $dbname;
    $mysql = "INSERT INTO `{$dbname}`.`poster` (`poster_text`, `poster_peopel`, `tittle`, `is_important`) VALUES ('{$text}', '{$name}', '{$tittle}','{$is_important}')";
    $ret = $db->query($mysql);
    return $ret;
}
function post_update($text, $name, $tittle, $is_important, $id)
{
    global $db;
    global $dbname;
    $mysql = "INSERT INTO `UPDATE `{$dbname}`.`poster` SET `poster_text` = '{$text}', `poster_peopel` = '{$name}', `tittle` = '{$tittle}' , `is_important`='{$is_important}' WHERE `id` = {$id}";
    $ret = $db->query($mysql);
    return $ret;
}
function post_delete($id)
{
    global $db;
    global $dbname;
    $mysql = "DELETE FROM `{$dbname}`.`poster` WHERE `id` = {$id}";
    $ret = $db->query($mysql);
    return $ret;
}
function set_admin($user_count)
{
    global $db;
    global $dbname;
    $mysql = "UPDATE `chat_sql`.`user` SET `is_admin` = 1 WHERE `user_count` = {$user_count}";
    $ret = $db->query($mysql);
    return $ret;
}
function unset_admin($user_count)
{
    global $db;
    global $dbname;
    $mysql = "UPDATE `chat_sql`.`user` SET `is_admin` = 0 WHERE `user_count` = {$user_count}";
    $ret = $db->query($mysql);
    return $ret;
}
function delete_allow_sort($id)
{
    global $db;
    global $dbname;
    $mysql = "DELETE FROM `{$dbname}`.`allow_file_sort` WHERE `id` = {$id}";
    $ret = $db->query($mysql);
    return $ret;
}
function add_allow_sort($str)
{
    global $db;
    global $dbname;
    $mysql = "INSERT INTO `{$dbname}`.`allow_file_sort` (`file_sort`) VALUES ('{$str}')";
    $ret = $db->query($mysql);
    return $ret;
}