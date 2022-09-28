<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/connect_db.php';
function search_token($user_count)
{
    $rows = select_db('user_token');
    foreach ($rows as $row) {
        if ($row['user_count'] == $user_count) {
            return $row;
        }
    }
    return false;
}

function update_token($id, $_token)
{
    global $dbname;
    global $db;
    $sql = "UPDATE `{$dbname}`.`user_token` SET `token` = '{$_token}' WHERE `id` = {$id}";
    $db->query($sql);
}

function insert_token($user_count, $_token)
{
    global $dbname;
    global $db;
    $sql = "INSERT INTO `{$dbname}`.`user_token` (`user_count`, `token`) VALUES ('{$user_count}', '{$_token}')";
    $db->query($sql);
}

function token_make()
{
    return md5(base64_encode(rand()));
}

function token_do($user_count)
{
    if (user_search($user_count)) {
        $data = search_token($user_count);
        if ($data) {
            $ret = $data["id"];
            if ($data['device_num'] > 2) {
                $token = token_make();
                update_token($ret, $token);
                global $db;
                global $dbname;
                $db->query("UPDATE `{$dbname}`.`user_token` SET `device_num` = '1' WHERE `id` = {$data['id']}");
            } else {
                global $db;
                global $dbname;
                $num = $data['device_num'] + 1;
                $db->query("UPDATE `{$dbname}`.`user_token` SET `device_num` = '{$num}' WHERE `id` = {$data['id']}");
                $token = $data['token'];
            }
        } else {
            $token = token_make();
            insert_token($user_count, $token);
        }
        return $token;
    } else {
        return false;
    }
}
function device_num_jian($user_count)
{
    global $db;
    global $dbname;
    $data = search_token($user_count);
    $num = $data['device_num'] - 1;
    return $db->query("UPDATE `{$dbname}`.`user_token` SET `device_num` = '{$num}' WHERE `id` = {$data['id']}");
}