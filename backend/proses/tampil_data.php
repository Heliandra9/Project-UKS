<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include('../config/koneksi.php');

if ($db->connect_error) {
    die("Koneksi gagal: " . $db->connect_error);
}

$type = isset($_GET['type']) ? $_GET['type'] : 'siswa';

if ($type === 'obat') {
    $sql = "SELECT 
                id, 
                nama_obat, 
                kode_obat, 
                jenis_obat, 
                kandungan, 
                CONCAT(stock_obat, ' ', satuan) AS stock_dengan_satuan
            FROM tbl_obat;";
} elseif ($type === 'user') {
    $sql = "SELECT * FROM tbl_user";
} elseif ($type === 'siswa') {
    $sql = "SELECT * FROM tbl_siswa";
} elseif ($type === 'kunjungan') {
    $sql = "SELECT 
                k.id AS id_kunjungan,
                k.id_siswa,
                s.nama AS nama_siswa,
                s.kelas,
                k.tanggal,
                k.keluhan,
                k.keterangan,
                o.id AS id_obat,
                o.nama_obat AS nama_obat_kunjungan,
                t.qty,
                t.tanggal_kunjungan
            FROM tbl_kunjungan k
            JOIN tbl_siswa s ON k.id_siswa = s.id
            LEFT JOIN tbl_transaksi_obat t ON k.id = t.id_kunjungan
            LEFT JOIN tbl_obat o ON t.id_obat = o.id
            ORDER BY k.id DESC;";

    $result = $db->query($sql);
    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => $db->error]);
        exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
} else {
    echo json_encode(['error' => 'Invalid type']);
    exit;
}

$result = $db->query($sql);
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
