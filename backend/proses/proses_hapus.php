<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$id = $_POST["id"] ?? null;
$type = $_POST["type"] ?? "siswa";

if ($type === "obat") {
    $sql = "DELETE FROM tbl_obat WHERE id='$id'";
} else {
    $sql = "DELETE FROM tbl_siswa WHERE id='$id'";
}

if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}