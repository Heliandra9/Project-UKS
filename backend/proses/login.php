<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require('../config/koneksi.php');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$query = $db->query("SELECT * FROM tbl_user WHERE username='$username' AND password='$password'");
if ($query && $query->num_rows > 0) {
    $data = $query->fetch_assoc();
    $response = [
        'status' => 'sukses',
        'tipe_user' => $data['tipe_user'],
        'username' => $data['username'],
        'message' => 'Login successful'
    ];
} else {
    $response = [
        'status' => 'error',
        'message' => 'Invalid username or password'
    ];
}

echo json_encode($response);
exit;
