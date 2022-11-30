<?php

// header("Access-Control-Allow-Origin: *");
require "./addinvoice.php";
global $_conn;
$q = $_REQUEST["q"];
$user = $_REQUEST["user"];

$q = str_replace("'", "\'", $q);
mysqli_query($_conn, "
            INSERT INTO " .
    $user .
    "(
                sent,
                xml 
            ) VALUES (
                '0',
            '" . $q . "'
            );");
