<?php
include 'api/db.php';

$query = "CREATE TABLE IF NOT EXISTS faq_knowledge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    content TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";

if ($conn->query($query) === TRUE) {
    echo "Successfully created faq_knowledge table.";
} else {
    echo "Error creating table: " . $conn->error;
}
?>
