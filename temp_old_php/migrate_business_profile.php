<?php
include 'api/db.php';

$query = "CREATE TABLE IF NOT EXISTS business_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_name VARCHAR(255),
    logo_path VARCHAR(255),
    stamp_path VARCHAR(255),
    address TEXT,
    contact_details VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
)";

if ($conn->query($query) === TRUE) {
    echo "Successfully created business_profile table.";
} else {
    echo "Error creating table: " . $conn->error;
}
?>
