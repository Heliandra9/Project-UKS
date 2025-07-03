<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include('../config/koneksi.php'); // Pastikan file koneksi sudah benar;

// Koneksi ke database


if ($db->connect_error) {
    die("Koneksi gagal: " . $db->connect_error);
}

// Query data
$sql = "SELECT * FROM tbl_obat";
$result = $db->query($sql);

$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Return JSON
echo json_encode($data);
?>
