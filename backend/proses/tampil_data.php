<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include('../config/koneksi.php');

if ($db->connect_error) {
    die("Koneksi gagal: " . $db->connect_error);
}

$type = isset($_GET['type']) ? $_GET['type'] : 'siswa';

if ($type === 'obat') {
    $sql = "SELECT * FROM tbl_obat";
} elseif($type === 'siswa') {
    $sql = "SELECT * FROM tbl_siswa";
} elseif($type === 'kunjungan') {
    $sql = "SELECT * FROM tbl_kunjungan INNER JOIN tbl_siswa ON tbl_kunjungan.id_siswa = tbl_siswa.id";
} else {
    echo json_encode(['error' => 'Invalid type']);
    exit;
}

$result = $db->query($sql);
$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>