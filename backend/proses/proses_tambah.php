<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$nis = $_POST["nis"] ?? null;
$nama = $_POST["nama"] ?? null;
$kelas = $_POST["kelas"] ?? null;
$tinggi = $_POST["tinggi_badan"] ?? null;
$berat = $_POST["berat_badan"] ?? null;
$gol_darah = $_POST["golongan_darah"] ?? null;

$sql = "INSERT INTO tbl_siswa (nis, nama, kelas, tinggi_badan, berat_badan, golongan_darah) VALUES ('$nis', '$nama', '$kelas', '$tinggi', '$berat', '$gol_darah')";

if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}

