<?php
require __DIR__ . '../../../vendor/autoload.php';

use setasign\Fpdi\Fpdi;

// Koneksi DB
require('../config/koneksi.php');

// Ambil id_siswa dari GET
$id_siswa = isset($_GET['id_siswa']) ? (int)$_GET['id_siswa'] : 0;
$pemeriksa = isset($_GET['pemeriksa']) ? $_GET['pemeriksa'] : '-';

// Default data
$nama   = "-";
$kelas  = "-";

// Query data siswa
if ($id_siswa > 0) {
    $stmt = $db->prepare("SELECT nama, kelas FROM tbl_siswa WHERE id = ?");
    $stmt->bind_param("i", $id_siswa);
    $stmt->execute();
    $stmt->bind_result($nama, $kelas);
    $stmt->fetch();
    $stmt->close();
}
$db->close();

// Buat PDF dari template
$pdf = new Fpdi();
$pdf->AddPage();
$pdf->setSourceFile("../storage/template_surat_sakit.pdf");
$tplIdx = $pdf->importPage(1);
$pdf->useTemplate($tplIdx, 0, 0, 210);

// Atur font
$pdf->SetFont('Arial', 'U', 11); // 'U' untuk underline

// Isi data pasien
$pdf->SetXY(42, 45.5);
$pdf->Write(10, $nama);

$pdf->SetXY(70, 45.5);
$pdf->Write(10, $kelas);

// Pemeriksa
$pdf->SetXY(47, 54.3);
$pdf->Write(10, $pemeriksa);

// nama ttd
$pdf->SetXY(40, 105);
$pdf->Write(10, $pemeriksa);

// Isi tanggal otomatis
$pdf->SetXY(56, 71);
$pdf->Write(10, date('d-m-Y'));

// Jika ada tanda tangan otomatis (gambar)
$pdf->Image("../../public/image/ttd.png",28, 94, 40, 20);

$pdf->Output("I", "Surat-Sakit.pdf");
