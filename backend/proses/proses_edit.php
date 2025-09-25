<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require('../config/koneksi.php');

$type = $_POST['type'] ?? $_GET['type'] ?? '';

if ($type === "siswa") {
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

    $stmt = $db->prepare("UPDATE tbl_siswa SET nama=?, kelas=?, tinggi_badan=?, berat_badan=?, golongan_darah=? WHERE nis=?");
    $stmt->bind_param("ssddss", $nama, $kelas, $tinggi, $berat, $gol_darah, $nis);
} elseif ($type === "obat") {
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $satuan = $_POST["satuan"] ?? null;
    $kandungan = $_POST["kandungan"] ?? null;
    $stock_obat = $_POST["stock_obat"] ?? null;
    $jenis_obat = $_POST["jenis_obat"] ?? null; // Tambahkan ini

    if (!$kode_obat || !$nama_obat || !$satuan || !$kandungan || !$stock_obat || !$jenis_obat) {
        echo json_encode(["status" => "error", "message" => "Data obat tidak lengkap."]);
        exit;
    }

    $stmt = $db->prepare("UPDATE tbl_obat SET nama_obat=?, satuan=?, kandungan=?, stock_obat=?, jenis_obat=? WHERE kode_obat=?");
    $stmt->bind_param("sssiss", $nama_obat, $satuan, $kandungan, $stock_obat, $jenis_obat, $kode_obat);
} elseif ($type === "user") {
    $id_user = $_POST["id_user"] ?? null;
    $username = $_POST["username"] ?? null;
    $password = $_POST["password"] ?? null;
    $tipe_user = $_POST["tipe_user"] ?? null;

    if (!$id_user || !$username || !$password || !$tipe_user) {
        echo json_encode(["status" => "error", "message" => "Data user tidak lengkap."]);
        exit;
    }

    $stmt = $db->prepare("UPDATE tbl_user SET username=?, password=?, tipe_user=? WHERE id_user=?");
    $stmt->bind_param("sssi", $username, $password, $tipe_user, $id_user);
} else {
    echo json_encode(["status" => "error", "message" => "Tipe data tidak dikenali."]);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
