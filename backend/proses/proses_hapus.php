<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$id   = $_POST["id"] ?? null;
$type = $_POST["type"] ?? "siswa";

if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID tidak boleh kosong"]);
    exit;
}

// Tentukan tabel dan kolom ID yang benar
switch ($type) {
    case 'obat':
        $table = 'tbl_obat';
        $column = 'id';
        $paramType = 'i'; // sesuaikan jika bukan integer
        break;

    case 'user':
        $table = 'tbl_user';
        $column = 'id_user';
        $paramType = 'i'; // ubah ke 's' jika id_user berupa string (VARCHAR)
        break;

    default:
        $table = 'tbl_siswa';
        $column = 'id';
        $paramType = 'i';
        break;
}

$stmt = $db->prepare("DELETE FROM $table WHERE $column = ?");
$stmt->bind_param($paramType, $id);
$stmt->execute();

// Periksa apakah baris benar-benar dihapus
if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Data $id tidak ditemukan atau tidak dihapus"]);
}
