<?php
session_start();
require 'db.php';
error_reporting(0);
header('Content-Type: application/json');

$action = $_POST['action'] ?? ($_GET['action'] ?? '');

if ($action === 'register') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$name || !$email || !$password) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->fetch_assoc()) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $trial_end_date = date('Y-m-d', strtotime('+5 days'));

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, trial_end_date) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $hashed_password, $trial_end_date);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Registration successful.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed.']);
    }
} elseif ($action === 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Check for hardcoded Admin credentials first
    if (strtolower($email) === 'admin@growgenie.com') {
        if ($password === 'yadu@123') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['user_id'] = 0; 
            $_SESSION['user_name'] = 'Admin';
            echo json_encode(['status' => 'success', 'message' => 'Admin login successful.', 'is_admin' => true]);
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Incorrect admin password.']);
            exit;
        }
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        
        $current_date = date('Y-m-d');
        if ($user['subscription_status'] === 'trial' && $current_date > $user['trial_end_date']) {
            $update_stmt = $conn->prepare("UPDATE users SET subscription_status = 'expired' WHERE id = ?");
            $update_stmt->bind_param("i", $user['id']);
            $update_stmt->execute();
            $user['subscription_status'] = 'expired';
        }

        $_SESSION['user_name'] = $user['name'];
        $_SESSION['subscription_status'] = $user['subscription_status'];
        
        $is_admin = (strtolower($user['email']) === 'admin@growgenie.com');
        if ($is_admin) {
            $_SESSION['admin_logged_in'] = true;
        }
        
        echo json_encode(['status' => 'success', 'message' => 'Login successful.', 'is_admin' => $is_admin]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }
} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Logged out.']);
} elseif ($action === 'check') {
    if (isset($_SESSION['user_id'])) {
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user) {
            echo json_encode([
                'status' => 'success',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'subscription_status' => $user['subscription_status'],
                    'trial_end_date' => $user['trial_end_date']
                ]
            ]);
        } else {
            session_destroy();
            echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Not logged in.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
}
?>
