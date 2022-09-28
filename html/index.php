<?php
$c = $_GET['c'];
switch ($c) {
    case 1:
        include_once "./login.html";
        break;
    case 2:
        include_once "./chat.html";
        break;
    case 3:
        include_once "./poster.html";
        break;
    case 4:
        include_once "../users/settings/index.html";
        break;
    case 5:
        include_once $_SERVER['DOCUMENT_ROOT'] . "/users/user_space/personal_page/index.html";
        break;
}