<?php
if ($_GET['user_name'] == 'admin' && $_GET['pwd'] == 'admin') {
    echo 'ok';
} else {
    echo 'no_ok';
}