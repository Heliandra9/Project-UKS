<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$type = $_POST["type"] ?? "siswa";

if ($type === "obat") {
    // Tambah data obat
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $jenis_obat = $_POST["jenis_obat"] ?? null;
    $kandungan = $_POST["kandungan"] ?? null;
    $stock_obat = $_POST["stock_obat"] ?? null;

    $sql = "INSERT INTO tbl_obat (kode_obat, nama_obat, jenis_obat, kandungan, stock_obat) VALUES ('$kode_obat', '$nama_obat', '$jenis_obat', '$kandungan', '$stock_obat')";
} else {
    // Tambah data siswa
    $nis = $_POST["nis"] ?? null;
    $nama = $_POST["nama"] ?? null;
    $kelas = $_POST["kelas"] ?? null;
    $tinggi = $_POST["tinggi_badan"] ?? null;
    $berat = $_POST["berat_badan"] ?? null;
    $gol_darah = $_POST["golongan_darah"] ?? null;

    $sql = "INSERT INTO tbl_siswa (nis, nama, kelas, tinggi_badan, berat_badan, golongan_darah) VALUES ('$nis', '$nama', '$kelas', '$tinggi', '$berat', '$gol_darah')";
}

if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}
?>

