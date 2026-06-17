<?php
session_start();
require 'db.php';
require 'mail_config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($action === 'fetch') {
    $stmt = $conn->prepare("SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $invoices = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $invoices]);

} elseif ($action === 'save') {
    $client_name = $_POST['client_name'] ?? '';
    $amount = $_POST['amount'] ?? '';
    $date = $_POST['date'] ?? date('Y-m-d');
    $gst_number = $_POST['gst_number'] ?? '';
    $recipient_email = $_POST['recipient_email'] ?? '';
    $status = $_POST['status'] ?? 'pending';

    if (!$client_name || !$amount) {
        echo json_encode(['status' => 'error', 'message' => 'Client name and amount are required.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO invoices (user_id, client_name, amount, date, gst_number, recipient_email, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $client_name, $amount, $date, $gst_number, $recipient_email, $status);
    if ($stmt->execute()) {
        // Send Email if recipient_email is provided
        if (!empty($recipient_email)) {
            $subject = "New Invoice from GrowGenie";
            $body = "
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;'>
                    <h2 style='color: #191a23;'>Hello $client_name,</h2>
                    <p>A new invoice has been generated for you.</p>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr><td style='padding: 8px; font-weight: bold;'>Amount:</td><td style='padding: 8px;'>₹$amount</td></tr>
                        <tr><td style='padding: 8px; font-weight: bold;'>Date:</td><td style='padding: 8px;'>$date</td></tr>
                        <tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>$status</td></tr>
                    </table>
                    <p>Please log in to your account or contact us for more details.</p>
                    <hr>
                    <p style='font-size: 12px; color: #888;'>Generated via GrowGenie</p>
                </div>
            ";
            sendMail($recipient_email, $subject, $body);
        }
        echo json_encode(['status' => 'success', 'message' => 'Invoice saved and email sent.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save invoice.']);
    }
} elseif ($action === 'update_status') {
    $invoice_id = $_POST['invoice_id'] ?? '';
    $status = $_POST['status'] ?? '';

    if (!$invoice_id || !$status) {
        echo json_encode(['status' => 'error', 'message' => 'Invoice ID and status are required.']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE invoices SET status = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("sii", $status, $invoice_id, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Status updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update status.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
}
?>
