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
    $stmt = $conn->prepare("SELECT * FROM platform_products ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $products]);
} elseif ($action === 'save') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $description = $_POST['description'] ?? '';
    $rate_type = $_POST['rate_type'] ?? 'one-time';
    $duration = $_POST['duration'] ?? 'N/A';

    if (!$name) {
        echo json_encode(['status' => 'error', 'message' => 'Product name is required.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO products (user_id, name, price, description, rate_type, duration) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isdsss", $user_id, $name, $price, $description, $rate_type, $duration);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product saved successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save product.']);
    }
} elseif ($action === 'delete') {
    $id = $_POST['id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete product.']);
    }
    echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
}
?>
