<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/connect_db.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/token_.php';
//用户处理函数
function get_user_data($user_count)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "SELECT `user_name`,`Is_Talk`,`is_admin`,`pic`,`personal_text`,`best_pictures`,`chat_sound`,`personal_data`
          FROM `user` WHERE `user_count`={$user_count} LIMIT 1";
    $ret = $db->query($sql);
    if ($ret->num_rows == 0) {
        return null;
    }
    $ret = $ret->fetch_array(MYSQLI_ASSOC);
    $ret_array = array(
        'user_name' => $ret['user_name'],
        'is_talk' => $ret['Is_Talk'],
        'is_admin' => $ret['is_admin'],
        'pic' => $ret['pic'],
        'best_pictures' => $ret['best_pictures'],
        'best_pictures' => chat_decode($ret['best_pictures']),
        'chat_sound' => $ret['chat_sound'],
        'personal_data' => chat_decode($ret['personal_data']),
        'personal_text' => $ret['personal_text'],
    );
    return $ret_array;
}
//查找用户好友
function search_user_friend($user_count, $user_friend_count)
{
    global $db;
    $sql = "SELECT * FROM `friend_data` WHERE `count_A`='{$user_count}' AND `count_B`='{$user_friend_count}' LIMIT 1";
    $ret = $db->query($sql);
    if ($ret->num_rows != 0) {
        return $ret->fetch_array(MYSQLI_ASSOC);
    } else {
        return null;
    }
}
function user_search($user_name_or_count) //查找用户

{
    global $db;
    global $dbname;

    $sql = "SELECT * FROM `{$dbname}`.`user` WHERE `user_count`='{$user_name_or_count}' OR `user_name`='{$user_name_or_count}' LIMIT 1";
    $mysql_ret = $db->query($sql);
    if ($mysql_ret->num_rows == 0) {
        return false;
    } else {
        return $mysql_ret->fetch_array(MYSQLI_ASSOC);
    }
}
function updata_user_text($context, $user_count)
{
    global $db;
    $context = mysqli_escape_string($db, $context);
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "UPDATE `user` SET `personal_text` = '{$context}' WHERE `user_count` = '{$user_count}'";
    return $db->query($sql);
}
//生成账户
function create_count()
{
    return rand();
}
//添加用户
function inscert_user($user_name, $user_passwd)
{
    global $db;
    global $dbname;
    $user_name = mysqli_escape_string($db, $user_name);
    $ret = user_search($user_name);
    if ($ret) {
        return false;
    } else {
        $user_passwd = md5($user_passwd);
        $user_count = create_count();
        $mysql = "INSERT INTO `{$dbname}`.`user` (`user_name`, `user_count`, `user_pwd`, `Is_Talk`, `is_admin` , `pic`)
                VALUES ('{$user_name}', '{$user_count}', '{$user_passwd}', 1, 0,'no_set.webp')";
        $db->query($mysql);
        $token = token_do($user_count);
        $ret_array = array('user_count' => $user_count, 'token' => $token);
        return $ret_array;
    }
}
//更新用户
function update_user($user_id, $table_name, $value)
{
    global $db;
    global $dbname;
    $mysql = "UPDATE `{$dbname}`.`user` SET `$table_name` = {$value} WHERE `user_id` = {$user_id}";
    $db->query($mysql);
}

function get_sql_data($sql)
{
    global $db;
    $ret = $db->query($sql);
    if ($ret->num_rows > 0) {
        if ($ret->num_rows == 1) {
            return $ret->fetch_array(MYSQLI_ASSOC);
        } else {
            $rows = [];
            while ($rows[] = $ret->fetch_array(MYSQLI_ASSOC));
        }
    } else {
        return null;
    }
}

function chat_encode($in_data) //聊天解码

{
    return base64_encode(json_encode($in_data));
}
function chat_decode($in_data) //聊天编码

{
    return json_decode(base64_decode($in_data));
}
function select_db($table) //查找数据库 列出所有

{
    global $db;
    switch ($table) {
        case "poster":
            $sql = "SELECT * FROM poster  ORDER BY `is_important` DESC";
            $mysqli_result = $db->query($sql);
            $rows = [];
            while ($row = $mysqli_result->fetch_array(MYSQLI_ASSOC)) {
                $rows[] = $row;
            }
            break;
        default:
            $sql = "SELECT * FROM {$table} ";
            $mysqli_result = $db->query($sql);

            if ($mysqli_result == false) {
                return false;
            }
            $rows = [];
            while ($row = $mysqli_result->fetch_array(MYSQLI_ASSOC)) {
                $rows[] = $row;
            }
    }
    return $rows;
}

//插入记录
function insret_word($word, $token, $file_url, $file_sort, $user_count)
{
    global $db, $dbname;
    $token = mysqli_escape_string($db, $token);
    $user_count = mysqli_escape_string($db, $user_count);
    $word = mysqli_escape_string($db, $word);

    $ret = time();
    $sql = "INSERT INTO `{$dbname}`.`talk` (`time`, `context`, `file_url`, `file_sort`,`token`, `user_count`)
                                    VALUES ('{$ret}','{$word}','{$file_url}','{$file_sort}','{$token}','{$user_count}')";
    return $db->query($sql);
}
/**
 * 获取聊天数据
 */
function get_friend_chat_data($token, $from)
{
    global $db;
    $token = mysqli_escape_string($db, $token);
    $from = mysqli_escape_string($db, $from);
    $sql = "SELECT * FROM `talk` WHERE `token`='{$token}' AND `id` > {$from}";
    $ret = $db->query($sql);
    if ($ret->num_rows != 0) {
        $return_array = [];
        while ($return_array[] = $ret->fetch_array(MYSQLI_ASSOC));
    } else {
        return 0;
    }
    return $return_array;
}

//获取最新id
function get_new_talk_id($token)
{
    global $db;
    $token = mysqli_escape_string($db, $token);
    $mysql = "SELECT * FROM  `talk`  WHERE `token` = '{$token}' ORDER BY `id`  DESC LIMIT 1";
    $ret = $db->query($mysql);
    return $ret->fetch_array(MYSQLI_ASSOC)["id"];
}
//更新用户图片
function insert_user_picture($user_count, $pic_name)
{
    global $db;
    global $dbname;
    $user_count = mysqli_escape_string($db, $user_count);
    $pic_name = mysqli_escape_string($db, $pic_name);
    $sql = "UPDATE `{$dbname}`.`user` SET `pic` = '{$pic_name}' WHERE `user_count` = {$user_count}";
    return $db->query($sql);
}

function get_group_newest_num($user_count)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "SELECT
             COUNT(*),`talk`.`token` ,`group_member_data`.`token` FROM `talk`, `group_member_data`
             WHERE `talk`.`token`=`group_member_data`.`token`
             AND (`group_member_data`.`user_count`='{$user_count}')
             GROUP BY `group_member_data`.`token`;";
    $ret = $db->query($sql);
    if ($ret and $ret->num_rows != 0) {
        $tmp_array = [];
        while ($tmp = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($tmp != null) {
                $tmp_array[] = array('token' => $tmp['token'], 'num' => $tmp['COUNT(*)'], 'newest_id' => get_new_talk_id($tmp['token']));
            }
        }
        return $tmp_array;
    } else {
        return [];
    }
}
function get_friend_newest_num($user_count)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "SELECT
             COUNT(*),`token` FROM `talk`, `friend_data`
             WHERE `talk`.`token`=`friend_data`.`friend_token`
             AND (`friend_data`.`count_A`='{$user_count}' OR `friend_data`.`count_B`='{$user_count}')
             GROUP BY `friend_data`.`friend_token`;";
    $ret = $db->query($sql);
    if ($ret and $ret->num_rows != 0) {
        $tmp_array = [];
        while ($tmp = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($tmp != null) {
                $tmp_array[] = array('token' => $tmp['token'], 'num' => $tmp['COUNT(*)'], 'newest_id' => get_new_talk_id($tmp['token']));
            }
        }
        return $tmp_array;
    } else {
        return [];
    }
}
function get_friend_quest_num($user_Count)
{
    global $db;
    $user_Count = mysqli_escape_string($db, $user_Count);
    $sql = "SELECT
           count(*)
           FROM `user`,`friend_quest`
           WHERE `user`.`user_count` = `friend_quest`.`user_a` AND `friend_quest`.`user_b`='{$user_Count}';";
    $ret = $db->query($sql);
    if ($ret) {
        return $ret->fetch_array(MYSQLI_ASSOC)['count(*)'];
    }
}

function get_friend_quest($user_Count)
{
    global $db;
    $user_Count = mysqli_escape_string($db, $user_Count);
    $sql = "SELECT
           `user_count`,`time`,`remark`,`user_name`,`pic`
           FROM `user`,`friend_quest`
           WHERE `user`.`user_count` = `friend_quest`.`user_a` AND `friend_quest`.`user_b`='{$user_Count}';";
    $ret = $db->query($sql);
    if ($ret and $ret->num_rows != 0) {
        $tmp_array = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($row != null) {
                $tmp_array[] = $row;
            }
        }
        return $tmp_array;
    } else {
        return 0;
    }
}
/* 处理好友请求 */
function c_friend_quest($user_A, $user_B, $alias, $c)
{
    global $db, $dbname;
    $user_A = mysqli_escape_string($db, $user_A);
    $user_B = mysqli_escape_string($db, $user_B);
    $alias = mysqli_escape_string($db, $alias);
    if ($c) {
        $token = token_make();
        $time = date('Y-m-d H:i:s');
        $ret = $db->query("SELECT * FROM `friend_quest` WHERE (`user_a`='{$user_A}'AND `user_b`='{$user_B}') OR (`user_b`='{$user_A}'AND `user_a`='{$user_B}') LIMIT 1");
        if ($ret->num_rows != 0) {
            if ($db->query("SELECT COUNT(*)")) {
                return $db->query("DELETE FROM `friend_quest` WHERE (`user_a`='{$user_A}'AND `user_b`='{$user_B}') OR (`user_a`='{$user_B}'AND `user_b`='{$user_A}')") and
                $db->query("INSERT INTO `{$dbname}`.`friend_data` (`count_A`, `count_B`, `friend_token`, `alias`, `time`) VALUES ('{$user_B}', '{$user_A}', '{$token}', '{$user_A}', '{$time}');") and
                $db->query("INSERT INTO `{$dbname}`.`friend_data` (`count_A`, `count_B`, `friend_token`, `alias`, `time`) VALUES ('{$user_A}', '{$user_B}', '{$token}', '{$alias}', '{$time}');");
            }
        } else {
            return false;
        }
    } else {
        return $db->query("DELETE FROM `friend_quest` WHERE (`user_a`='{$user_A}'AND `user_b`='{$user_B}') OR (`user_b`='{$user_A}'AND `user_a`='{$user_B}');");
    }
}

function get_user_friend($user_count)
{
    global $db;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "SELECT
             `count_B`,`friend_token`,`alias`,`user_name`,`personal_text`,`best_pictures`,`pic`
             FROM `friend_data`,`user`
             WHERE (`user`.`user_count`=`friend_data`.`count_B`)
             AND (`friend_data`.`count_A`='{$user_count}')
             LIMIT 1000;";
    $ret = $db->query($sql);
    if ($ret and $ret->num_rows != 0) {
        $ret_row = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            if ($row != null) {
                $ret_row[] = array(
                    'user_count' => $row["count_B"],
                    'alias' => $row['alias'],
                    'token' => $row['friend_token'],
                    'pic' => $row['pic'],
                    'user_name' => $row['user_name'],
                );
            }
        }
        return $ret_row;
    } else {
        return null;
    }
}

function search_people_obscure($user_name_or_count)
{
    global $dbname;
    global $db;
    $user_name_or_count = mysqli_real_escape_string($db, $user_name_or_count);
    $sql = "SELECT
             `user_count`,`user_name` ,`pic` ,`personal_text` ,`best_pictures`
              FROM `{$dbname}`.`user`
              WHERE `user_name` LIKE '%{$user_name_or_count}%' OR `user_count` = '{$user_name_or_count}'
              LIMIT 0,500";
    $ret = $db->query($sql);
    if ($ret->num_rows == 0) {
        return null;
    } else {
        $mysql_ret = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            $mysql_ret[] = $row;
        }
        return $mysql_ret;
    }
}
function get_people_data($user_count_search)
{
    global $db;
    $user_count_search = mysqli_real_escape_string($db, $user_count_search);
    $sql = "SELECT
             `user_name` ,`pic`
              FROM `user`,`friend_data`
              WHERE `user_count` = '$user_count_search'
               LIMIT 1";
    $ret = $db->query($sql);
    if ($ret->num_rows == 0) {
        return 0;
    } else {
        $mysql_ret = [];
        while ($row = $ret->fetch_array(MYSQLI_ASSOC)) {
            $mysql_ret[] = $row;
        }
        return $mysql_ret;
    }
}
//添加好友
function add_friend($user_A, $user_B, $remark)
{
    global $db, $dbname;
    $user_A = mysqli_escape_string($db, $user_A);
    $user_B = mysqli_escape_string($db, $user_B);
    $remark = mysqli_escape_string($db, $remark);
    $time = date('Y-m-d H:i:s');
    $sql = "INSERT INTO `{$dbname}`.`friend_quest` (`user_a`, `user_b`, `time`, `remark`) VALUES ('{$user_A}', '{$user_B}', '{$time}', '{$remark}')";
    $db->query($sql);
}
function sllow_friend_add()
{
}
//删除朋友
function delete_friend($token)
{
}
function search_user_count($user_count)
{
    global $db;
    global $dbname;
    $user_count = mysqli_escape_string($db, $user_count);
    $sql = "SELECT * FROM `{$dbname}`.`user` WHERE `user_count`='{$user_count}' LIMIT 1";
    $mysql_ret = $db->query($sql);
    if ($mysql_ret->num_rows == 0) {
        return null;
    } else {
        return $mysql_ret->fetch_array(MYSQLI_ASSOC);
    }
}

function get_newest_message($user_count, $message_num = 0)
{
    $time = 0;
    while (true) {
        //遍历数组
        $friend_num = get_friend_newest_num($user_count);
        $group_num = get_group_newest_num($user_count);
        $all = 0;
        for ($i = 0; $i < count($friend_num); $i++) {
            $all += $friend_num[$i]->num;
        }
        for ($i = 0; $i < count($group_num); $i++) {
            $all += $group_num[$i]->num;
        }
        if ($all != $message_num) {
        }
        sleep(1);
    }
}