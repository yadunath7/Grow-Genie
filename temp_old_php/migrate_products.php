<?php
require 'api/db.php';

// Ensure table exists
$conn->query("CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    rate_type VARCHAR(50) DEFAULT 'one-time',
    duration VARCHAR(50) DEFAULT 'N/A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)");

echo "Products table verified/created.\n";

// Add some sample products if none exist
$check = $conn->query("SELECT COUNT(*) as count FROM products");
$row = $check->fetch_assoc();

if ($row['count'] == 0) {
    // We need a user_id. Let's pick the first user or skip.
    $user_check = $conn->query("SELECT id FROM users LIMIT 1");
    if ($user_row = $user_check->fetch_assoc()) {
        $uid = $user_row['id'];
        $stmt = $conn->prepare("INSERT INTO products (user_id, name, price, description, rate_type, duration) VALUES (?, ?, ?, ?, ?, ?)");
        
        $samples = [
            ['Genie Startup Consulting', 2500.00, 'Expert guidance on scaling your startup with Genie.', 'hourly', '1 Hour'],
            ['Business Roadmap Suite', 999.00, 'Full documentation for your startup roadmap.', 'one-time', 'N/A'],
            ['Marketing Copywriting', 1499.00, 'Professional ad copy and social media content.', 'weekly', '7 Days'],
            ['GST Invoice Setup', 4999.00, 'One-time setup for professional invoicing.', 'one-time', 'N/A']
        ];

        foreach ($samples as $s) {
            $stmt->bind_param("isdsss", $uid, $s[0], $s[1], $s[2], $s[3], $s[4]);
            $stmt->execute();
        }
        echo "Sample products added.\n";
    }
}
?>
