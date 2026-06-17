<?php
session_start();
include '../api/db.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: ../login.php");
    exit;
}

$message = "";

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_POST['settings'] as $key => $value) {
        $safe_key = $conn->real_escape_string($key);
        $safe_value = $conn->real_escape_string($value);
        $conn->query("UPDATE settings SET setting_value = '$safe_value' WHERE setting_key = '$safe_key'");
    }
    $message = "Settings updated successfully!";
}

$settings_res = $conn->query("SELECT * FROM settings");
$settings = [];
while($row = $settings_res->fetch_assoc()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Settings | Admin | GrowGenie</title>
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
            <a href="dashboard.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Dashboard</span></a>
            <a href="users.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Users</span>
            </a>
            <a href="subscriptions.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Subscriptions</span>
            </a>
            <a href="platform_products.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Products</span>
            </a>
            <a href="testimonials.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Testimonials</span></a>
            <a href="team.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Team</span></a>
            <a href="settings.php" class="nav-item active flex items-center p-4 font-bold text-lg bg-lime-green border-2 border-dark-black rounded-2xl shadow-[4px_4px_0_#191a23]"><span>Settings</span></a>
        </nav>
        <div class="mt-auto"><a href="logout.php" class="flex items-center p-4 font-bold text-lg text-red-600 hover:bg-red-50 rounded-2xl transition-all"><span>Logout</span></a></div>
    </div>

    <main class="flex-1 ml-64 p-8 md:p-12">
        <header class="flex justify-between items-center mb-12">
            <div>
                <h2 class="text-5xl font-black uppercase">Global Settings</h2>
                <p class="text-xl text-gray-600 font-medium">Update API keys and platform configuration.</p>
            </div>
        </header>

        <?php if($message): ?>
            <div class="bg-lime-green border-2 border-dark-black p-6 rounded-2xl mb-8 shadow-[4px_4px_0_#191a23] font-black uppercase">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-8 max-w-4xl">
            <!-- General -->
            <div class="card-positivus">
                <h3 class="text-2xl font-black uppercase mb-6">General Configuration</h3>
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-black uppercase mb-2">Site Title</label>
                        <input type="text" name="settings[site_title]" value="<?php echo htmlspecialchars($settings['site_title'] ?? 'GrowGenie'); ?>" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                    </div>
                </div>
            </div>

            <!-- API Keys -->
            <div class="card-positivus">
                <h3 class="text-2xl font-black uppercase mb-6">API & Credentials</h3>
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-black uppercase mb-2">Groq API Key</label>
                        <input type="text" name="settings[groq_api_key]" value="<?php echo htmlspecialchars($settings['groq_api_key'] ?? ''); ?>" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-mono text-sm focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-black uppercase mb-2">Razorpay Key ID</label>
                        <input type="text" name="settings[razorpay_key_id]" value="<?php echo htmlspecialchars($settings['razorpay_key_id'] ?? ''); ?>" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-mono text-sm focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-black uppercase mb-2">Razorpay Secret Key</label>
                        <input type="password" name="settings[razorpay_key_secret]" value="<?php echo htmlspecialchars($settings['razorpay_key_secret'] ?? ''); ?>" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-mono text-sm focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                    </div>
                </div>
            </div>

            <!-- Feature Toggles -->
            <div class="card-positivus">
                <h3 class="text-2xl font-black uppercase mb-6">Feature Toggles</h3>
                <div class="space-y-6">
                    <div class="flex items-center justify-between">
                        <span class="font-bold uppercase">Voice Assistant</span>
                        <select name="settings[enable_voice_assistant]" class="bg-white border-2 border-dark-black rounded-xl p-2 font-black">
                            <option value="1" <?php echo ($settings['enable_voice_assistant'] ?? '1') == '1' ? 'selected' : ''; ?>>ENABLED</option>
                            <option value="0" <?php echo ($settings['enable_voice_assistant'] ?? '1') == '0' ? 'selected' : ''; ?>>DISABLED</option>
                        </select>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-bold uppercase">Marketing Module</span>
                        <select name="settings[enable_marketing_module]" class="bg-white border-2 border-dark-black rounded-xl p-2 font-black">
                            <option value="1" <?php echo ($settings['enable_marketing_module'] ?? '1') == '1' ? 'selected' : ''; ?>>ENABLED</option>
                            <option value="0" <?php echo ($settings['enable_marketing_module'] ?? '1') == '0' ? 'selected' : ''; ?>>DISABLED</option>
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn-positivus w-full py-6 text-2xl">SAVE ALL SETTINGS</button>
        </form>
    </main>
</body>
</html>
