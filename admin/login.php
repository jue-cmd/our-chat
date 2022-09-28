<?php
include_once "../config_file/db_func.php";
include_once "../funcation/token_.php";
include_once "../config_file/connect_db.php";
$ret = select_db("admin");
foreach ($ret as $row) {
    if ($row["user"] == $_POST['user_name'] && $row["pwd"] == $_POST["pass_word"]) {
        $token = token_make();
        $ret = array("token" => $token);
        $sql = "UPDATE `admin` SET `token` = '{$token}' WHERE `user` = '{$_POST['user_name']}'";

        $db->query($sql);
        echo json_encode($ret);
        return 0;
    }
}
echo 0;
