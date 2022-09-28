<?php
function save_file($save_path, $allow_file_list, $POST_name)
{
    if (!empty($_FILES[$POST_name]['tmp_name'])) //判断是否选择文件
    {
        $temp = explode(".", $_FILES[$POST_name]["name"]);
        $extension = end($temp);
        if (in_array($extension, $allow_file_list)) {
            if ($_FILES[$POST_name]["error"] > 0) {
                return $_FILES[$POST_name]["error"];
            } else {
                $new_name = md5(rand()) . "." . $extension;
                move_uploaded_file($_FILES[$POST_name]["tmp_name"], $_SERVER['DOCUMENT_ROOT'] . $save_path . $new_name); //储存文件
                return array('file_name' => $new_name, 'extension' => $extension);
            }
        } else {
            return false;
        }
    }
    return null;
}