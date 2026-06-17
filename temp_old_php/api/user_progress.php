<?php
// api/user_progress.php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

// 1. Calculate Sales Progress
// Goal: 100,000 INR
$sales_goal = 100000;
$sales_query = $conn->prepare("SELECT SUM(amount) as total_sales FROM invoices WHERE user_id = ?");
$sales_query->bind_param("i", $user_id);
$sales_query->execute();
$sales_result = $sales_query->get_result()->fetch_assoc();
$total_sales = $sales_result['total_sales'] ?? 0;
$sales_percent = min(100, round(($total_sales / $sales_goal) * 100));

// 2. Calculate Learning/Search Progress
// Goal: 20 Generations/Searches
$learning_goal = 20;
$learning_query = $conn->prepare("SELECT COUNT(*) as total_queries FROM ideas WHERE user_id = ?");
$learning_query->bind_param("i", $user_id);
$learning_query->execute();
$learning_result = $learning_query->get_result()->fetch_assoc();
$total_queries = $learning_result['total_queries'] ?? 0;
$learning_percent = min(100, round(($total_queries / $learning_goal) * 100));

echo json_encode([
    'status' => 'success',
    'sales' => [
        'current' => $total_sales,
        'goal' => $sales_goal,
        'percent' => $sales_percent
    ],
    'learning' => [
        'current' => $total_queries,
        'goal' => $learning_goal,
        'percent' => $learning_percent
    ]
]);
?>
