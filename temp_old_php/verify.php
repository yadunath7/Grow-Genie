<?php
// verify.php
session_start();
require 'api/db.php';

if (!isset($_SESSION['user_id'])) {
    die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
}

$user_id = $_SESSION['user_id'];
$payment_id = $_POST['razorpay_payment_id'] ?? '';
$type = $_POST['type'] ?? 'subscription'; // 'subscription' or 'product'
$amount = $_POST['amount'] ?? 0;
$product_ids = $_POST['product_ids'] ?? '';

$key_id = "rzp_test_SjRPQ06Qae73n3";
$key_secret = "if1stPEM4AVmycLfpkd2XFml";

if (!$payment_id) {
    die(json_encode(['status' => 'error', 'message' => 'Payment ID missing']));
}

// Verify payment with Razorpay
$url = "https://api.razorpay.com/v1/payments/" . $payment_id;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ":" . $key_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($http_code === 200 && $data['status'] === 'captured') {
    $plan_name = $_POST['plan_name'] ?? '';
    $days = (int)($_POST['days'] ?? 30);
    
    if ($type === 'subscription') {
        // Update user status
        $stmt = $conn->prepare("UPDATE users SET subscription_status = 'active', trial_end_date = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE id = ?");
        $stmt->bind_param("ii", $days, $user_id);
        $stmt->execute();
        
        // Log order
        $stmt_order = $conn->prepare("INSERT INTO orders (user_id, item_type, item_id, amount, payment_id) VALUES (?, 'subscription', 0, ?, ?)");
        $stmt_order->bind_param("ids", $user_id, $amount, $payment_id);
        $stmt_order->execute();
    } else {
        // Log product order
        $p_ids = explode(',', $product_ids);
        foreach($p_ids as $pid) {
            if(!empty($pid)) {
                $stmt_order = $conn->prepare("INSERT INTO orders (user_id, item_type, item_id, amount, payment_id) VALUES (?, 'product', ?, ?, ?)");
                $p_amount = $amount / count($p_ids); // Simple split for mock
                $stmt_order->bind_param("iids", $user_id, $pid, $p_amount, $payment_id);
                $stmt_order->execute();
            }
        }
    }
    
    echo json_encode(['status' => 'success', 'message' => 'Payment verified successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid payment status.']);
}
?>
