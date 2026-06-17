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
    $stmt = $conn->prepare("SELECT * FROM ideas WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $ideas = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $ideas]);

} elseif ($action === 'generate') {
    $idea_name = $_POST['idea_name'] ?? '';
    $startup_idea = $_POST['startup_idea'] ?? '';
    $category = $_POST['category'] ?? '';
    $budget = $_POST['budget'] ?? '';
    $language = $_POST['language'] ?? 'English';

    if (!$idea_name || !$startup_idea || !$category || !$budget) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    require 'ai_handler.php';

    $systemMessage = "You are an expert business consultant. Generate a highly detailed execution plan for a startup. 
    You MUST return ONLY a JSON object with EXACTLY these four top-level keys:
    1. 'roadmap': An object where keys are month titles (e.g. 'Month 1: Foundation') and values are the detailed strategy for that month as a single string (generate exactly 6 months).
    2. 'market_strategy': A detailed string explaining the go-to-market strategy, target audience, and positioning.
    3. 'ad_copy': An object with keys 'facebook', 'instagram', and 'google', each containing a creative ad copy string.
    4. 'product_desc': A highly compelling and SEO-friendly product/service description string.
    
    IMPORTANT:
    - Use {$language} for all content output.
    - Be practical, actionable, and specific to the category and budget provided.
    - Return valid JSON only, without markdown wrapping.";

    $prompt = "Startup Name: {$idea_name}. 
    Startup Idea: {$startup_idea}. 
    Category: {$category}. 
    Budget: ₹{$budget}. 
    Generate the complete business plan JSON.";

    $genie_roadmap = callGenieAI($prompt, $systemMessage);

    if (isset($genie_roadmap['error']) || !isset($genie_roadmap['roadmap'])) {
        echo json_encode(['status' => 'error', 'message' => 'Genie plan generation failed.']);
        exit;
    }

    $roadmap_json = json_encode($genie_roadmap);

    $stmt = $conn->prepare("INSERT INTO ideas (user_id, idea_name, category, budget, roadmap) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $user_id, $idea_name, $category, $budget, $roadmap_json);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'data' => $genie_roadmap]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save idea.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
}
?>
