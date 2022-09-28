<?php
$c = $_GET['c'];
include_once $_SERVER['DOCUMENT_ROOT'] . '/config_file/db_func.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/lay_out.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/funcation/token_.php';
$data = $_POST;
if (token_checker($data['user_count'], $data['token'])) {
    switch ($c) {
        case 1: //插入数据
            if (check_friend($_POST['user_count'], $_POST['chat_token']) or check_group($_POST['user_count'], $_POST['chat_token'])) {
                $word = $data['word'];

                $user_count = $data['user_count'];
                $token = $data['token'];
                $chat_token = $data['chat_token'];
                //处理文本消息
                $word = htmlspecialchars($word);
                if (!empty($_FILES['file']['tmp_name'])) //判断是否选择文件
                {
                    echo $_FILES['file']['name'];
                    $temp = explode(".", $_FILES["file"]["name"]);
                    $extension = end($temp);
                    $row = select_db("allow_file_sort");
                    $allow_file_list = [];
                    foreach ($row as $tmp) {
                        $allow_file_list[] = $tmp["file_sort"];
                    }
                    if (in_array($extension, $allow_file_list)) {
                        if ($_FILES["file"]["error"] > 0) {
                            echo $_FILES["file"]["error"];
                            return;
                        } else {
                            $new_name = "../upload/" . md5(rand()) . "." . $extension; //对文件进项随机命名
                            move_uploaded_file($_FILES["file"]["tmp_name"], $new_name); //储存文件
                            $file_url = $new_name;
                            $file_sort = $extension;
                        }
                    } else {
                        echo "-2";
                        return;
                    }
                } else {
                    $file_sort = null;
                    $file_url = null;
                }
                if (insret_word($word, $chat_token, $file_url, $file_sort, $_POST['user_count'])) {
                    echo 1;
                } else {
                    echo -1;
                }
            }
            break;
        case 2: //读取数据
            if ($_POST['chat_token'] != "" and check_friend($_POST['user_count'], $_POST['chat_token'])) {
                echo json_encode(get_friend_chat_data($_POST['chat_token'], $_POST['from']));
            } else {
                echo -1;
            }
            break;
        case 3: //登出
            device_num_jian($data['user_count']);
            echo 1;
            break;
        case 4: //验证管理员
            if (check_admin($data['user_count'])) {
                echo '1';
            } else {
                echo '2';
            }
            break;
        case 5: //查询最新记录个数
            echo json_encode(array('friend' => get_friend_newest_num($_POST['user_count']), 'group' => (get_group_newest_num($_POST['user_count']))));
            break;
        case 6: //获取用户自定义数据
            echo json_encode(get_user_data($data['user_count']));
            break;
        case 7: //获取房间token

            break;
        case 8: //获取群聊数据

            break;
        case 9: //获取用户 头像 昵称 个性签名
            echo json_encode(get_people_data($_POST['user_count_searched']));
            break;
    }
} else {
    echo 0;
}