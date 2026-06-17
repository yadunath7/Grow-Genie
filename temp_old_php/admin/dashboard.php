<?php
session_start();
include '../api/db.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: ../login.php");
    exit;
}

// Fetch stats
$total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
$total_ideas = $conn->query("SELECT COUNT(*) FROM ideas")->fetch_row()[0];
$premium_users = $conn->query("SELECT COUNT(*) FROM users WHERE subscription_status = 'active'")->fetch_row()[0];
$admin_profit = $conn->query("SELECT SUM(amount) FROM orders")->fetch_row()[0] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-white text-dark-black min-h-screen flex">

    <!-- Admin Sidebar -->
    <div class="w-64 h-screen sidebar fixed top-0 left-0 flex flex-col p-6 border-r-2 border-dark-black bg-white">
        <div class="flex items-center mb-12">
            <svg class="w-8 h-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
                <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
            </svg>
            <h1 class="text-2xl font-black uppercase tracking-tighter">Admin</h1>
        </div>
        
        <nav class="flex-1 space-y-2">
            <a href="dashboard.php" class="nav-item active flex items-center p-4 font-bold text-lg bg-lime-green border-2 border-dark-black rounded-2xl shadow-[4px_4px_0_#191a23]">
                <span>Dashboard</span>
            </a>
            <a href="users.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Users</span>
            </a>
            <a href="subscriptions.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Subscriptions</span>
            </a>
            <a href="platform_products.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Products</span>
            </a>
            <a href="testimonials.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Testimonials</span>
            </a>
            <a href="team.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Team</span>
            </a>
            <a href="settings.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Settings</span>
            </a>
        </nav>

        <div class="mt-auto">
            <a href="logout.php" class="flex items-center p-4 font-bold text-lg text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                <span>Logout</span>
            </a>
        </div>
    </div>

    <main class="flex-1 ml-64 p-8 md:p-12">
        <header class="flex justify-between items-center mb-12">
            <div>
                <h2 class="text-5xl font-black uppercase">System Overview</h2>
                <p class="text-xl text-gray-600 font-medium">Manage GrowGenie platform performance.</p>
            </div>
            <div class="bg-white border-2 border-dark-black rounded-full px-6 py-2 shadow-[4px_4px_0_#191a23]">
                <span class="text-sm font-black uppercase tracking-wider">Admin Session</span>
            </div>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div class="card-positivus">
                <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Users</p>
                <h3 class="text-4xl font-black"><?php echo $total_users; ?></h3>
                <div class="mt-4 badge-lime font-bold text-xs inline-block px-2 py-1">Registered</div>
            </div>
            <div class="card-positivus">
                <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Ideas</p>
                <h3 class="text-4xl font-black"><?php echo $total_ideas; ?></h3>
                <div class="mt-4 badge-lime font-bold text-xs inline-block px-2 py-1">AI Generated</div>
            </div>
            <div class="card-positivus">
                <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Premium Users</p>
                <h3 class="text-4xl font-black"><?php echo $premium_users; ?></h3>
                <div class="mt-4 badge-lime font-bold text-xs inline-block px-2 py-1">Active Plans</div>
            </div>
            <div class="card-positivus bg-lime-green border-2 border-dark-black shadow-[4px_4px_0_#191a23]">
                <p class="text-sm font-bold text-dark-black uppercase tracking-widest mb-2">Admin Sales Profit</p>
                <h3 class="text-4xl font-black text-dark-black">₹<?php echo number_format($admin_profit, 2); ?></h3>
                <div class="mt-4 bg-dark-black text-lime-green font-bold text-xs inline-block px-2 py-1 rounded">Platform Revenue</div>
            </div>
        </div>

        <div class="section-heading">
            <span class="heading-tag">Recent Activity</span>
            <p class="heading-desc">Platform usage trends and highlights.</p>
        </div>

        <!-- Placeholder for chart or more stats -->
        <div class="card-positivus bg-light-gray flex items-center justify-center h-64 border-dashed">
            <p class="text-gray-400 font-bold italic">Visual Analytics Placeholder</p>
        </div>
    </main>
</body>
</html>
