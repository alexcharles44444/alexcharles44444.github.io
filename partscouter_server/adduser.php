<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache");
header("Pragma: no-cache");

require "./addinvoice.php";
global $_conn;
$user = $_REQUEST["user"];
$pass = $_REQUEST["pass"];

$data = mysqli_query($_conn, "select * from users where user='" . $user . "' and password='" . $pass . "';");
$assoc = $data->fetch_assoc();
if ($assoc == null) {
    mysqli_query($_conn, "
                INSERT INTO users VALUES (
                    '" . $user . "',
                    '" . $pass . "'
                );");
    mysqli_query($_conn, 'create table ' . $user . ' (
                 sent char(1),
                 xml text(16383)
                 );');
}
