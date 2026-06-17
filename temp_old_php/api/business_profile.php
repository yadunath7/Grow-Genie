<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($action === 'fetch') {
    $stmt = $conn->prepare("SELECT * FROM business_profile WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $profile = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'data' => $profile]);

} elseif ($action === 'save') {
    $company_name = $_POST['company_name'] ?? '';
    $address = $_POST['address'] ?? '';
    $contact_details = $_POST['contact_details'] ?? '';

    // Handle File Uploads
    $upload_dir = '../uploads/profiles/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $logo_path = $_POST['existing_logo'] ?? '';
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === 0) {
        $logo_name = 'logo_' . $user_id . '_' . time() . '_' . $_FILES['logo']['name'];
        move_uploaded_file($_FILES['logo']['tmp_name'], $upload_dir . $logo_name);
        $logo_path = 'uploads/profiles/' . $logo_name;
    }

    $stamp_path = $_POST['existing_stamp'] ?? '';
    if (isset($_FILES['stamp']) && $_FILES['stamp']['error'] === 0) {
        $stamp_name = 'stamp_' . $user_id . '_' . time() . '_' . $_FILES['stamp']['name'];
        move_uploaded_file($_FILES['stamp']['tmp_name'], $upload_dir . $stamp_name);
        $stamp_path = 'uploads/profiles/' . $stamp_name;
    }

    $stmt = $conn->prepare("INSERT INTO business_profile (user_id, company_name, logo_path, stamp_path, address, contact_details) 
                           VALUES (?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           company_name = VALUES(company_name), 
                           logo_path = VALUES(logo_path), 
                           stamp_path = VALUES(stamp_path), 
                           address = VALUES(address), 
                           contact_details = VALUES(contact_details)");
    
    $stmt->bind_param("isssss", $user_id, $company_name, $logo_path, $stamp_path, $address, $contact_details);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully.', 'logo' => $logo_path, 'stamp' => $stamp_path]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update profile.']);
    }
}
?>
