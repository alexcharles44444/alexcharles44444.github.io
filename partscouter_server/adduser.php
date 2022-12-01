<?php
header("Access-Control-Allow-Origin: *");
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
