<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

// Gunakan $_GET untuk parameter type dari URL
$type = $_GET["type"] ?? "siswa";

// var_dump($_POST);
// exit;


if ($type === "obat") {
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $satuan = $_POST["satuan"] ?? null;
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

    $stmt = $db->prepare("INSERT INTO tbl_obat (kode_obat, nama_obat, satuan, kandungan, stock_obat) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $kode_obat, $nama_obat, $satuan, $kandungan, $stock_obat);
} elseif ($type === "user") {
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
} elseif ($type === "kunjungan") {
    $obatRaw = $_POST["obat"] ?? "[]";
    $obat = json_decode($obatRaw, true);
    if (!is_array($obat)) $obat = [];

    $id_siswa = $_POST["id_siswa"] ?? null;
    $tanggal = $_POST["tanggal"] ?? date('Y-m-d');
    $keluhan = $_POST["keluhan"] ?? null;
    $keterangan = $_POST["keterangan"] ?? null;

    if (!$id_siswa || !$keterangan) {
        echo json_encode([
            "status" => "error",
            "message" => "Data tidak lengkap. id_siswa atau keterangan kosong"
        ]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO tbl_kunjungan (id_siswa, tanggal, keluhan, keterangan) VALUES (?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare statement gagal: " . $db->error]);
        exit;
    }
    
    $stmt->bind_param("isss", $id_siswa, $tanggal, $keluhan, $keterangan);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Gagal insert kunjungan: " . $stmt->error]);
        exit;
    }

    $id_kunjungan = $stmt->insert_id;

    if (!empty($obat)) {
        $stmtObat = $db->prepare("INSERT INTO tbl_transaksi_obat (id_kunjungan, id_obat, qty, tanggal_kunjungan) VALUES (?, ?, ?, ?)");
        if (!$stmtObat) {
            echo json_encode(["status" => "error", "message" => "Prepare statement gagal: " . $db->error]);
            exit;
        }

        foreach ($obat as $o) {
            $id_obat = $o['id_obat'] ?? null;
            $qty = $o['jumlah'] ?? 0;
            if (!$id_obat || $qty <= 0) continue;

            $stmtObat->bind_param("iiis", $id_kunjungan, $id_obat, $qty, $tanggal);
            if (!$stmtObat->execute()) {
                echo json_encode(["status" => "error", "message" => "Gagal insert transaksi obat: " . $stmtObat->error]);
                exit;
            }
        }
    }
} else {
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
if (isset($stmt)) {
    if ($stmt->execute()) {
        // Kirim data tergantung tipe
        if ($type === "obat") {
            echo json_encode([
                "status" => "success",
                "message" => "Data obat berhasil disimpan.",
                "data" => [
                    "kode_obat" => $kode_obat,
                    "nama_obat" => $nama_obat,
                    "satuan" => $satuan,
                    "kandungan" => $kandungan,
                    "stock_obat" => $stock_obat
                ]
            ]);
        } elseif ($type === "user") {
            echo json_encode([
                "status" => "success",
                "message" => "User berhasil disimpan.",
                "data" => [
                    "username" => $username,
                    "tipe_user" => $tipe_user
                    // Jangan kirim password kembali demi keamanan
                ]
            ]);
        } elseif ($type === "siswa") {
            echo json_encode([
                "status" => "success",
                "message" => "Data siswa berhasil disimpan.",
                "data" => [
                    "nis" => $nis,
                    "nama" => $nama,
                    "kelas" => $kelas,
                    "tinggi_badan" => $tinggi,
                    "berat_badan" => $berat,
                    "golongan_darah" => $gol_darah
                ]
            ]);
        } elseif ($type === "kunjungan") {
            echo json_encode([
                "status" => "success",
                "message" => "Kunjungan berhasil ditambahkan.",
                "data" => [
                    "id_kunjungan" => $id_kunjungan,
                    "id_siswa" => $id_siswa,
                    "tanggal" => $tanggal,
                    "keterangan" => $keterangan,
                    "obat" => $obat, // array obat yang sudah didecode dari json
                ]
            ]);
            exit;
        }
    } else {
        // fallback generic success tanpa data
        echo json_encode(["status" => "success", "message" => "Data berhasil disimpan."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
