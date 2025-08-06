<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

// Gunakan $_GET untuk parameter type dari URL
$type = $_GET["type"] ?? "siswa";

if ($type === "obat") {
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $jenis_obat = $_POST["jenis_obat"] ?? null;
    $kandungan = $_POST["kandungan"] ?? null;
    $stock_obat = $_POST["stock_obat"] ?? null;

    $cek = $db->prepare("SELECT * FROM tbl_obat WHERE kode_obat=?");
    $cek->bind_param("s", $kode_obat);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Data obat sudah ada."]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO tbl_obat (kode_obat, nama_obat, jenis_obat, kandungan, stock_obat) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $kode_obat, $nama_obat, $jenis_obat, $kandungan, $stock_obat);
}
elseif ($type === "user") {
    $username = $_POST["username"] ?? null;
    $password = $_POST["password"] ?? null;
    $tipe_user = $_POST["tipe_user"] ?? null;

    if (!$username || !$password || !$tipe_user) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
        exit;
    }

    $cek = $db->prepare("SELECT * FROM tbl_user WHERE username=?");
    $cek->bind_param("s", $username);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Username sudah terdaftar."]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO tbl_user (username, password, tipe_user) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $password, $tipe_user);
}
else {
    // Default fallback: siswa
    $nis = $_POST["nis"] ?? null;
    $nama = $_POST["nama"] ?? null;
    $kelas = $_POST["kelas"] ?? null;
    $tinggi = $_POST["tinggi_badan"] ?? null;
    $berat = $_POST["berat_badan"] ?? null;
    $gol_darah = $_POST["golongan_darah"] ?? null;

    if (!$nis || !$nama || !$kelas || !$tinggi || !$berat || !$gol_darah) {
        echo json_encode(["status" => "error", "message" => "Data siswa tidak lengkap."]);
        exit;
    }

    $cek = $db->prepare("SELECT * FROM tbl_siswa WHERE nis=?");
    $cek->bind_param("s", $nis);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Data siswa sudah ada."]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO tbl_siswa (nis, nama, kelas, tinggi_badan, berat_badan, golongan_darah) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdds", $nis, $nama, $kelas, $tinggi, $berat, $gol_darah);
}

// Jalankan INSERT jika ada statement
if (isset($stmt) && $stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}
?>
