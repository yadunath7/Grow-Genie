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
    $stmt = $conn->prepare("SELECT content FROM faq_knowledge WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    $content = isset($data['content']) ? $data['content'] : '';
    echo json_encode(['status' => 'success', 'content' => $content]);

} elseif ($action === 'train') {
    $content = $_POST['content'] ?? '';
    if (empty($content)) {
        echo json_encode(['status' => 'error', 'message' => 'Content cannot be empty.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO faq_knowledge (user_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
    $stmt->bind_param("is", $user_id, $content);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Genie Assistant trained successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to train Genie Assistant.']);
    }

} elseif ($action === 'chat') {
    $question = $_POST['question'] ?? '';
    if (empty($question)) {
        echo json_encode(['status' => 'error', 'message' => 'Question cannot be empty.']);
        exit;
    }

    // Fetch knowledge
    $stmt = $conn->prepare("SELECT content FROM faq_knowledge WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $kb = $result->fetch_assoc();
    $content = $kb['content'] ?? '';

    if (empty($content)) {
        echo json_encode(['status' => 'success', 'answer' => "I haven't been trained yet! Please paste some information in the Knowledge Base first."]);
        exit;
    }

    // Simple Genie simulation (Keyword matching)
    // In a real app, this would call OpenAI or a vector DB.
    $sentences = explode('.', $content);
    $found = [];
    $words = explode(' ', strtolower($question));
    
    foreach ($sentences as $s) {
        foreach ($words as $w) {
            if (strlen($w) > 3 && strpos(strtolower($s), $w) !== false) {
                $found[] = trim($s);
                break;
            }
        }
    }

    if (count($found) > 0) {
        $answer = "Based on my training: " . implode('. ', array_slice($found, 0, 2)) . ".";
    } else {
        $answer = "I'm not sure about that. Try training me with more specific details about '" . $words[0] . "'.";
    }

    echo json_encode(['status' => 'success', 'answer' => $answer]);
}
?>
