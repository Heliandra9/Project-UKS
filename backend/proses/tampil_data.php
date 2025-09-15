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
                CONCAT(stock_obat, ' ', satuan) AS stock_dengan_satuan,
                is_deleted
            FROM tbl_obat;";
} elseif ($type === 'transaksi_obat') {
    $sql = "SELECT 
                t.id AS id_transaksi,
                t.id_kunjungan,
                t.id_obat,
                o.nama_obat,
                o.kode_obat,
                o.jenis_obat,
                o.kandungan,
                t.qty,
                o.satuan,
                t.jenis_transaksi,
                t.keterangan,
                t.petugas,
                t.created_at
            FROM tbl_transaksi_obat t
            JOIN tbl_obat o ON t.id_obat = o.id
            WHERE t.jenis_transaksi IN ('Masuk', 'Keluar')
            ORDER BY t.created_at DESC;
    ";
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
                t.keterangan,
                GROUP_CONCAT(CONCAT(o.nama_obat, ' (', t.qty, ')') SEPARATOR ', ') AS obat_dengan_qty
            FROM tbl_kunjungan k
            JOIN tbl_siswa s ON k.id_siswa = s.id
            LEFT JOIN tbl_transaksi_obat t ON k.id = t.id_kunjungan
            LEFT JOIN tbl_obat o ON t.id_obat = o.id
            GROUP BY k.id
            ORDER BY k.id DESC;
            ";

    $result = $db->query($sql);
    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => $db->error]);
        exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        // Konversi tanggal ke ISO 8601 dengan timezone Asia/Jakarta
        if (!empty($row['tanggal'])) {
            $date = new DateTime($row['tanggal'], new DateTimeZone('Asia/Jakarta'));
            $row['tanggal'] = $date->format(DateTime::ATOM); // contoh: 2025-09-10T08:00:00+07:00
        }
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
