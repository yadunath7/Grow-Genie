<?php
// api/market_insight.php
session_start();
require 'db.php';
require 'ai_handler.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$platform = $_GET['platform'] ?? 'Facebook Ads';

$systemMessage = "You are a marketing data scientist. 
Provide a single, powerful, and data-driven market insight for the specific platform mentioned. 
The insight should be concise (1-2 sentences), mention a percentage or specific trend, and be focused on the Indian market if applicable.
Return ONLY a JSON object with the key 'insight'.";

$prompt = "Provide a high-impact market insight for: {$platform}.";

$result = callGenieAI($prompt, $systemMessage);

if (isset($result['error'])) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch insight.']);
    exit;
}

echo json_encode(['status' => 'success', 'insight' => $result['insight']]);
?>
