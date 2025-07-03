<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$id = $_POST["id"] ?? null;
$sql = "DELETE FROM tbl_siswa WHERE id='$id'";
if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}