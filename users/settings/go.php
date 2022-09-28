<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/funcation/checker.php";
include_once $_SERVER['DOCUMENT_ROOT'] . "/config_file/db_func.php";
$c = $_GET["c"];
if (check_user($_POST['user_count'], $_POST['token'])) {
    switch ($c) {
        case 1: //上传头像
            if (!empty($_FILES['file']['tmp_name'])) //判断是否选择文件
            {
                echo $_FILES['file']['name'];
                // 允许上传的图片后缀
                $allowedExts = array("gif", "jpeg", "jpg", "png");
                $temp = explode(".", $_FILES["file"]["name"]);
                $extension = end($temp);
                if (in_array($extension, $allowedExts)) {
                    if ($_FILES["file"]["error"] > 0) {
                        echo "错误:" . $_FILES["file"]["error"] . "<br>";
                    } else {
                        $new_name = md5(rand(0, 99999999999999999)) . "." . $extension; //对文件进项随机命名
                        move_uploaded_file($_FILES["file"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'] . "/users/user_pictures/" . $new_name); //储存文件
                    }
                    //向数据库插入数据
                    if (insert_user_picture($_POST['user_count'], $new_name)) {
                        echo 1;
                        return;
                    }
                } else {
                    echo "非法的文件格式";
                    return;
                }
            }
            break;
        case 2:
            $ret = user_search($_POST['user_count']);
            if ($ret) {
                echo updata_user_text($_POST['context'], $_POST['user_count']);
            }
            break;
    }
}