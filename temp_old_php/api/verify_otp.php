<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $otp = $_POST['otp'] ?? '';

    if (!$email || !$otp) {
        echo json_encode(['status' => 'error', 'message' => 'Email and OTP are required.']);
        exit;
    }

    // Check if OTP matches and is within 5 minutes
    $stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND otp = ? AND created_at >= (NOW() - INTERVAL 5 MINUTE)");
    $stmt->bind_param("ss", $email, $otp);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'OTP verified.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired OTP.']);
    }
}
?>
