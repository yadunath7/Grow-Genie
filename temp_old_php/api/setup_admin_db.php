<?php
include 'db.php';

// Create Testimonials table
$conn->query("CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Create Team table
$conn->query("CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Create Settings table
$conn->query("CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value TEXT NOT NULL
)");

// Insert default settings
$conn->query("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
    ('site_title', 'GrowGenie'),
    ('groq_api_key', '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'),
    ('razorpay_key_id', 'rzp_test_SjRPQ06Qae73n3'),
    ('razorpay_key_secret', 'if1stPEM4AVmycLfpkd2XFml'),
    ('enable_voice_assistant', '1'),
    ('enable_marketing_module', '1')
");

echo "Admin tables created successfully.";
?>
