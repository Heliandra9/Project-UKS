<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$type = $_POST["type"] ?? "siswa";

if ($type === "obat") {
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $jenis_obat = $_POST["jenis_obat"] ?? null;
    $kandungan = $_POST["kandungan"] ?? null;
    $stock_obat = $_POST["stock_obat"] ?? null;

    $cek = $db->query("SELECT * FROM tbl_obat WHERE kode_obat='$kode_obat' AND nama_obat='$nama_obat' AND jenis_obat='$jenis_obat' AND kandungan='$kandungan' AND stock_obat='$stock_obat'");
    if ($cek->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Data obat sudah ada."]);
        exit;
    }

    $sql = "INSERT INTO tbl_obat (kode_obat, nama_obat, jenis_obat, kandungan, stock_obat) 
            VALUES ('$kode_obat', '$nama_obat', '$jenis_obat', '$kandungan', '$stock_obat')";
} else {
    $nis = $_POST["nis"] ?? null;
    $nama = $_POST["nama"] ?? null;
    $kelas = $_POST["kelas"] ?? null;
    $tinggi = $_POST["tinggi_badan"] ?? null;
    $berat = $_POST["berat_badan"] ?? null;
    $gol_darah = $_POST["golongan_darah"] ?? null;

    $cek = $db->query("SELECT * FROM tbl_siswa WHERE nis='$nis' AND nama='$nama' AND kelas='$kelas' AND tinggi_badan='$tinggi' AND berat_badan='$berat' AND golongan_darah='$gol_darah'");
    if ($cek->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Data siswa sudah ada."]);
        exit;
    }

    $sql = "INSERT INTO tbl_siswa (nis, nama, kelas, tinggi_badan, berat_badan, golongan_darah) 
            VALUES ('$nis', '$nama', '$kelas', '$tinggi', '$berat', '$gol_darah')";
}

if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}
?>
