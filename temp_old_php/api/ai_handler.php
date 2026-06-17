<?php
// api/ai_handler.php

function callGenieAI($prompt, $systemMessage = "You are a helpful startup assistant.") {
    $apiKey = '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';
    $url = 'https://api.groq.com/openai/v1/chat/completions';

    $data = [
        'model' => 'llama-3.3-70b-versatile',
        'messages' => [
            ['role' => 'system', 'content' => $systemMessage],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.7,
        'response_format' => ['type' => 'json_object']
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
        return ['error' => curl_error($ch)];
    }
    curl_close($ch);

    $result = json_decode($response, true);
    if (isset($result['choices'][0]['message']['content'])) {
        return json_decode($result['choices'][0]['message']['content'], true);
    }
    
    return ['error' => 'Invalid AI response', 'raw' => $response];
}
?>
