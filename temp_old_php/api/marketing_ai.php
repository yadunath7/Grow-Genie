<?php
// api/marketing_ai.php
session_start();
require 'db.php';
require 'ai_handler.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$action = $_POST['action'] ?? '';

if ($action === 'generate_strategy') {
    $product = $_POST['product'] ?? '';
    $budget = $_POST['budget'] ?? '';

    if (!$product || !$budget) {
        echo json_encode(['status' => 'error', 'message' => 'Product and budget are required.']);
        exit;
    }

    $systemMessage = "You are a world-class growth hacker and digital marketing director. 
    Generate a market-dominating strategy and specific high-converting campaigns.
    You MUST return ONLY a JSON object with these keys:
    - 'plan_title': A bold strategy name.
    - 'online_strategy': Comprehensive digital approach.
    - 'offline_strategy': Guerrilla and traditional marketing tactics.
    - 'allocation': Object with platforms and % (e.g. {'Facebook Ads': 40, ...}).
    - 'top_campaigns': Array of 3 objects with {'name', 'channel', 'hook'}.
    - 'step_by_step': Array of 5 execution steps.";

    $prompt = "Product: {$product}. Budget: ₹{$budget}/month.
    Create a detailed growth plan. Focus on maximizing ROI in the Indian market. 
    Include specific 'hooks' for the campaigns that will grab attention.";

    $strategy = callGenieAI($prompt, $systemMessage);

    if (isset($strategy['error'])) {
        echo json_encode(['status' => 'error', 'message' => 'Genie strategy generation failed.']);
        exit;
    }

    echo json_encode(['status' => 'success', 'data' => $strategy]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
}
?>
