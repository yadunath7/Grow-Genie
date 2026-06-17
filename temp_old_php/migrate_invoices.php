<?php
include 'api/db.php';

$columns = [
    "gst_number" => "VARCHAR(255) DEFAULT ''",
    "recipient_email" => "VARCHAR(255) DEFAULT ''",
    "status" => "VARCHAR(50) DEFAULT 'pending'"
];

echo "Starting migration...<br>";

foreach ($columns as $col => $type) {
    $check = $conn->query("SHOW COLUMNS FROM invoices LIKE '$col'");
    if ($check->num_rows == 0) {
        $query = "ALTER TABLE invoices ADD COLUMN $col $type";
        if ($conn->query($query) === TRUE) {
            echo "Successfully added: $col <br>";
        } else {
            echo "Error adding $col: " . $conn->error . "<br>";
        }
    } else {
        echo "Column $col already exists. <br>";
    }
}

echo "Migration finished.";
?>
