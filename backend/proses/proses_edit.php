<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require('../config/koneksi.php');

// Cek apakah ini edit siswa atau obat
if (isset($_POST["nis"])) {
    // Edit siswa
    $nis = $_POST["nis"];
    $nama = $_POST["nama"];
    $kelas = $_POST["kelas"];
    $tinggi = $_POST["tinggi_badan"];
    $berat = $_POST["berat_badan"];
    $gol_darah = $_POST["golongan_darah"];

    $sql = "UPDATE tbl_siswa SET nama='$nama', kelas='$kelas', tinggi_badan='$tinggi', berat_badan='$berat', golongan_darah='$gol_darah' WHERE nis='$nis'";
} else if (isset($_POST["kode_obat"])) {
    // Edit obat
    $kode_obat = $_POST["kode_obat"];
    $nama_obat = $_POST["nama_obat"];
    $jenis_obat = $_POST["jenis_obat"];
    $kandungan = $_POST["kandungan"];
    $stock_obat = $_POST["stock_obat"];

    $sql = "UPDATE tbl_obat SET nama_obat='$nama_obat', jenis_obat='$jenis_obat', kandungan='$kandungan', stock_obat='$stock_obat' WHERE kode_obat='$kode_obat'";
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

if ($db->query($sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}
?>

