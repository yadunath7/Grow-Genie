<?php
// api/ai_chat.php — Groq-powered conversational endpoint for the FAQ voice chatbot
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$question = trim($_POST['question'] ?? '');
if (empty($question)) {
    echo json_encode(['status' => 'error', 'message' => 'Question cannot be empty.']);
    exit;
}

$apiKey = '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';
$url    = 'https://api.groq.com/openai/v1/chat/completions';

$systemMsg = "You are Genie, a smart and friendly business assistant for GrowGenie — an AI-powered startup platform. "
           . "Answer questions concisely (2-4 sentences). Help with startup advice, marketing, invoices, and business growth. "
           . "Be warm, practical, and encouraging.";

$data = [
    'model'       => 'llama-3.3-70b-versatile',
    'messages'    => [
        ['role' => 'system', 'content' => $systemMsg],
        ['role' => 'user',   'content' => $question]
    ],
    'temperature' => 0.7,
    'max_tokens'  => 256
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['status' => 'error', 'message' => 'Network error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$result = json_decode($response, true);
if (isset($result['choices'][0]['message']['content'])) {
    echo json_encode([
        'status' => 'success',
        'answer' => trim($result['choices'][0]['message']['content'])
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Genie is momentarily unavailable. Please try again!']);
}
?>
