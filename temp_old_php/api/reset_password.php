<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $otp = $_POST['otp'] ?? '';
    $new_password = $_POST['new_password'] ?? '';

    if (!$email || !$otp || !$new_password) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    if (strlen($new_password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters.']);
        exit;
    }

    // Double check OTP one last time
    $stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND otp = ? AND created_at >= (NOW() - INTERVAL 5 MINUTE)");
    $stmt->bind_param("ss", $email, $otp);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized or link expired.']);
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Update user password
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashed_password, $email);
    
    if ($stmt->execute()) {
        // Delete the used OTP
        $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Password reset successfully! You can now login.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update password.']);
    }
}
?>
