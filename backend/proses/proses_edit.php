<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require('../config/koneksi.php');

$nis = isset($_POST["nis"]) ? $_POST["nis"] : null;
$nama = isset($_POST["nama"]) ? $_POST["nama"] : null;
$kelas = isset($_POST["kelas"]) ? $_POST["kelas"] : null;
$tinggi = isset($_POST["tinggi_badan"]) ? $_POST["tinggi_badan"] : null;
$berat = isset($_POST["berat_badan"]) ? $_POST["berat_badan"] : null;
$gol_darah = isset($_POST["golongan_darah"]) ? $_POST["golongan_darah"] : null;


$sql = "UPDATE tbl_siswa SET nama='$nama', kelas='$kelas', tinggi_badan='$tinggi', berat_badan='$berat', golongan_darah='$gol_darah' WHERE nis='$nis'";

if ($db->query($sql)) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $db->error]);
}

