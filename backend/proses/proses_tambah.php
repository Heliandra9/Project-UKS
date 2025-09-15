<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require('../config/koneksi.php');

$type = $_GET["type"] ?? "siswa";

function sendResponse($status, $message, $data = null)
{
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]);
    exit;
}

if ($type === "obat") {
    $kode_obat = $_POST["kode_obat"] ?? null;
    $nama_obat = $_POST["nama_obat"] ?? null;
    $satuan = $_POST["satuan"] ?? null;
    $kandungan = $_POST["kandungan"] ?? null;
    $stock_obat = $_POST["stock_obat"] ?? null;

    if (!$kode_obat || !$nama_obat || !$satuan || !$kandungan || $stock_obat === null) {
        sendResponse("error", "Data obat tidak lengkap.");
    }

    // Cek apakah obat sudah ada
    $cek = $db->prepare("SELECT * FROM tbl_obat WHERE kode_obat=?");
    $cek->bind_param("s", $kode_obat);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        sendResponse("error", "Data obat sudah ada.");
    }

    // Insert ke tbl_obat
    $stmt = $db->prepare("INSERT INTO tbl_obat (kode_obat, nama_obat, satuan, kandungan, stock_obat) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $kode_obat, $nama_obat, $satuan, $kandungan, $stock_obat);

    if ($stmt->execute()) {
        // Ambil ID obat yang baru ditambahkan
        $id_obat = $db->insert_id;

        // Insert ke tbl_transaksi_obat
        $id_kunjungan = null; // sesuai permintaan
        $qty = $stock_obat;
        $jenis_transaksi = "Masuk";
        $keterangan = "Penambahan stok awal";
        $petugas = "Admin"; // bisa diganti sesuai session user
        $created_at = date("Y-m-d H:i:s");
        $updated_at = date("Y-m-d H:i:s");

        $transaksi = $db->prepare("INSERT INTO tbl_transaksi_obat (id_kunjungan, id_obat, qty, jenis_transaksi, keterangan, petugas, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        // Karena bind_param tidak bisa langsung NULL untuk integer, gunakan trik berikut:
        if ($id_kunjungan === null) {
            $transaksi->bind_param("iissssss", $nullVar, $id_obat, $qty, $jenis_transaksi, $keterangan, $petugas, $created_at, $updated_at);
            $nullVar = null; // bind dengan null
        } else {
            $transaksi->bind_param("iiisssss", $id_kunjungan, $id_obat, $qty, $jenis_transaksi, $keterangan, $petugas, $created_at, $updated_at);
        }

        $transaksi->execute();

        sendResponse("success", "Obat berhasil ditambahkan.", [
            "kode_obat" => $kode_obat,
            "nama_obat" => $nama_obat,
            "satuan" => $satuan,
            "kandungan" => $kandungan,
            "stock_obat" => $stock_obat
        ]);
    } else {
        sendResponse("error", "Gagal menambahkan obat: " . $stmt->error);
    }

} elseif ($type === "user") {
    $username = $_POST["username"] ?? null;
    $password = $_POST["password"] ?? null;
    $tipe_user = $_POST["tipe_user"] ?? null;

    if (!$username || !$password || !$tipe_user) {
        sendResponse("error", "Data user tidak lengkap.");
    }

    $cek = $db->prepare("SELECT * FROM tbl_user WHERE username=?");
    $cek->bind_param("s", $username);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        sendResponse("error", "Username sudah terdaftar.");
    }

    $stmt = $db->prepare("INSERT INTO tbl_user (username, password, tipe_user) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $password, $tipe_user);
    if ($stmt->execute()) {
        sendResponse("success", "User berhasil ditambahkan.", [
            "username" => $username,
            "tipe_user" => $tipe_user
        ]);
    } else {
        sendResponse("error", "Gagal menambahkan user: " . $stmt->error);
    }
} elseif ($type === "kunjungan") {
    $obatRaw = $_POST["obat"] ?? "[]";
    $obat = json_decode($obatRaw, true);
    if (!is_array($obat))
        $obat = [];

    $id_siswa = $_POST["id_siswa"] ?? null;
    $tanggal = $_POST["tanggal"] ?? date('Y-m-d H:i:s');
    $keluhan = $_POST["keluhan"] ?? null;
    $keterangan = $_POST["keterangan"] ?? null; // Tambahkan ini

    if (!$id_siswa || !$keterangan) {
        sendResponse("error", "Data tidak lengkap. id_siswa atau keterangan kosong.");
    }

    // Tambahkan field keterangan pada query dan bind_param
    $stmt = $db->prepare("INSERT INTO tbl_kunjungan (id_siswa, tanggal, keluhan, keterangan) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $id_siswa, $tanggal, $keluhan, $keterangan);
    if (!$stmt->execute()) {
        sendResponse("error", "Gagal insert kunjungan: " . $stmt->error);
    }
    $id_kunjungan = $stmt->insert_id;

    if (!empty($obat)) {
        // insert ke tbl_transaksi_obat
        $stmtObat = $db->prepare("INSERT INTO tbl_transaksi_obat (id_kunjungan, id_obat, qty, jenis_transaksi) VALUES (?, ?, ?, ?)");
        if (!$stmtObat) {
            echo json_encode(["status" => "error", "message" => "Prepare insert transaksi obat gagal: " . $db->error]);
            exit;
        }

        // update jumlah obat di tbl_obat
        $stmtUpdateStock = $db->prepare("UPDATE tbl_obat SET stock_obat = stock_obat - ? WHERE id = ?");
        if (!$stmtUpdateStock) {
            echo json_encode(["status" => "error", "message" => "Prepare update stock gagal: " . $db->error]);
            exit;
        }

        foreach ($obat as $o) {
            $id_obat = $o['id_obat'] ?? null;
            $qty = $o['jumlah'] ?? 0;
            $jenis = $o['jenis'] ?? "Keluar"; // default keluar (misal resep diberikan ke siswa)

            if (!$id_obat || $qty <= 0)
                continue;

            // Insert transaksi obat
            $stmtObat->bind_param("iiis", $id_kunjungan, $id_obat, $qty, $jenis);
            if (!$stmtObat->execute()) {
                echo json_encode(["status" => "error", "message" => "Gagal insert transaksi obat: " . $stmtObat->error]);
                exit;
            }

            // Update stock obat (hanya jika keluar)
            if ($jenis === "Keluar") {
                $stmtUpdateStock->bind_param("ii", $qty, $id_obat);
                if (!$stmtUpdateStock->execute()) {
                    echo json_encode(["status" => "error", "message" => "Gagal update stock obat: " . $stmtUpdateStock->error]);
                    exit;
                }
            }
        }
    }


    sendResponse("success", "Kunjungan berhasil ditambahkan.", [
        "id_kunjungan" => $id_kunjungan,
        "id_siswa" => $id_siswa,
        "tanggal" => $tanggal,
        "keterangan" => $keterangan, // Tambahkan ini di response
        "obat" => $obat
    ]);
} else {
    // Default: siswa
    $nis = $_POST["nis"] ?? null;
    $nama = $_POST["nama"] ?? null;
    $kelas = $_POST["kelas"] ?? null;
    $tinggi = $_POST["tinggi_badan"] ?? null;
    $berat = $_POST["berat_badan"] ?? null;
    $gol_darah = $_POST["golongan_darah"] ?? null;

    if (!$nis || !$nama || !$kelas || !$tinggi || !$berat || !$gol_darah) {
        sendResponse("error", "Data siswa tidak lengkap.");
    }

    $cek = $db->prepare("SELECT * FROM tbl_siswa WHERE nis=?");
    $cek->bind_param("s", $nis);
    $cek->execute();
    $result = $cek->get_result();
    if ($result->num_rows > 0) {
        sendResponse("error", "Data siswa sudah ada.");
    }

    $stmt = $db->prepare("INSERT INTO tbl_siswa (nis, nama, kelas, tinggi_badan, berat_badan, golongan_darah) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdds", $nis, $nama, $kelas, $tinggi, $berat, $gol_darah);
    if ($stmt->execute()) {
        sendResponse("success", "Siswa berhasil ditambahkan.", [
            "nis" => $nis,
            "nama" => $nama,
            "kelas" => $kelas,
            "tinggi_badan" => $tinggi,
            "berat_badan" => $berat,
            "golongan_darah" => $gol_darah
        ]);
    } else {
        sendResponse("error", "Gagal menambahkan siswa: " . $stmt->error);
    }
}
