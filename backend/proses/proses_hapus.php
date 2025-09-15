<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$id   = $_POST["id"]   ?? null;
$type = $_POST["type"] ?? "siswa";

if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID tidak boleh kosong"]);
    exit;
}

switch ($type) {
    case 'obat':
        $table     = 'tbl_obat';
        $column    = 'id';
        $paramType = 'i';

        // Ambil data obat sebelum dihapus (soft delete)
        $cek = $db->prepare("SELECT * FROM tbl_obat WHERE id = ?");
        if (!$cek) {
            echo json_encode(["status" => "error", "message" => "Query prepare gagal: " . $db->error]);
            exit;
        }
        $cek->bind_param("i", $id);
        if (!$cek->execute()) {
            echo json_encode(["status" => "error", "message" => "Query cek gagal: " . $cek->error]);
            exit;
        }
        $result = $cek->get_result();
        $obat   = $result->fetch_assoc();
        $cek->close();
        break;

    case 'user':
        $table     = 'tbl_user';
        $column    = 'id_user';
        $paramType = 'i';
        break;

    default:
        $table     = 'tbl_siswa';
        $column    = 'id';
        $paramType = 'i';
        break;
}

// --- Proses hapus ---
if ($type === 'obat') {
    // Soft delete untuk obat → hanya update flag
    $stmt = $db->prepare("UPDATE tbl_obat SET is_deleted = 1 WHERE id = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Query prepare gagal: " . $db->error]);
        exit;
    }
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Update gagal: " . $stmt->error]);
        exit;
    }
} else {
    // Hard delete untuk selain obat
    $stmt = $db->prepare("DELETE FROM $table WHERE $column = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Query prepare gagal: " . $db->error]);
        exit;
    }
    $stmt->bind_param($paramType, $id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Delete gagal: " . $stmt->error]);
        exit;
    }
}

if ($stmt->affected_rows > 0) {
    // Catat ke tbl_transaksi_obat kalau yang dihapus adalah obat
    if ($type === "obat" && !empty($obat)) {
        $id_obat         = $obat["id"];
        $qty             = $obat["stock_obat"]; // stok terakhir sebelum dihapus
        $jenis_transaksi = "Keluar";
        $keterangan      = "Dihapus Admin";
        $petugas         = "Admin"; // TODO: ganti sesuai session login
        $created_at      = date("Y-m-d H:i:s");
        $updated_at      = date("Y-m-d H:i:s");

        $log = $db->prepare("INSERT INTO tbl_transaksi_obat 
            (id_kunjungan, id_obat, qty, jenis_transaksi, keterangan, petugas, created_at, updated_at) 
            VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)");
        if (!$log) {
            echo json_encode(["status" => "error", "message" => "Prepare insert log gagal: " . $db->error]);
            exit;
        }

        $log->bind_param(
            "iisssss",
            $id_obat,
            $qty,
            $jenis_transaksi,
            $keterangan,
            $petugas,
            $created_at,
            $updated_at
        );

        if (!$log->execute()) {
            echo json_encode(["status" => "error", "message" => "Insert log gagal: " . $log->error]);
            exit;
        }

        $log->close();
    }

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Data $id tidak ditemukan atau tidak dihapus"
    ]);
}

$stmt->close();
$db->close();
