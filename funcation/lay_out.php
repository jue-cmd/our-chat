<?php
include_once($_SERVER['DOCUMENT_ROOT']."/config_file/db_func.php");
$user=select_db("user");
function make_head($user_count)
{
	global $user;
	foreach($user as $row)
	{
		if($row['user_count']==$user_count)
		{
			return $row['pic'];
		}
	}
}
function select_files($in_data , $in_data_url)
{
	//echo $in_data_url;

	if($in_data!=NULL)
	{
		if($in_data=='jpg'||$in_data=='png'||$in_data=='jpeg' || $in_data=='gif')
		{
			$tmp = '<img src ="'.$in_data_url.'" class = "content img" </img>';
		}
		else if($in_data=='pdf')
		{
			$tmp='这有个pdf';
		}
		else if($in_data=='mp4')
		{
			$tmp = '这有个视频文件';
		}
		else if( $in_data=='mp3'||$in_data=='wav')
		{
			$tmp = '这有个音频文件';
		}
		else
		{
			$tmp = '这有个'.$in_data;
		}
		$str='<a href="'.$in_data_url.'" target="_blank"><font color = "white" >'.$tmp.'</font></a>';
	}
	else
	{
		$str = "";
	}
	return $str;
}
function admin_ctrl($user_count,$c_id)
{
	include_once('../config_file/db_func.php');
	$str = NULL;	
		if(check_admin($user_count))
		{
			$str='<button class="button"onclick="delete_word('.$c_id.')">撤回</button>';
		}
		else
		{
			$str = "";
		}
	return $str;
}
function out_chat_list()
{
    $rows = select_db('talk');
	$out_data = [];
    if ($rows!=NULL) 
    {
		foreach($rows as $row)
		{
			$row['word']=base64_decode($row['word']);
			$row+=array("user_pic" => make_head($row['user_count']));
			$out_data[]=$row;
		}
		return $out_data;
    }
	else
	{
		return false;
	}
} 
	
