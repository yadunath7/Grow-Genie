<?php
$host = "localhost";
$user = "root";        // change if needed
$pass = "000";            // put your password
$db = "growgenie";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>