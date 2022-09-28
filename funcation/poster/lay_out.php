<?php
include_once($_SERVER['DOCUMENT_ROOT'].'/config_file/db_func.php');
include_once($_SERVER['DOCUMENT_ROOT'].'/funcation/checker.php');
function out_poster()
{
    $data = select_db('poster');
    return $data;
}