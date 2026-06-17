<?php
require 'db.php';
require 'mail_config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email not found.']);
        exit;
    }

    // Generate 6-digit OTP
    $otp = sprintf("%06d", mt_rand(0, 999999));

    // Clear old OTPs for this email
    $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    // Store new OTP
    $stmt = $conn->prepare("INSERT INTO password_resets (email, otp) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $otp);
    
    if ($stmt->execute()) {
        $subject = "Your GrowGenie OTP for Password Reset";
        $body = "
            <div style='font-family: Arial, sans-serif; padding: 20px;'>
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the following OTP to proceed:</p>
                <div style='font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 15px; display: inline-block; border-radius: 10px; border: 2px solid #191a23;'>$otp</div>
                <p>This OTP is valid for 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        ";
        
        if (sendMail($email, $subject, $body)) {
            echo json_encode(['status' => 'success', 'message' => 'OTP sent to your email.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to send email. Check mail configuration.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
    }
}
?>
