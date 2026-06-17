<?php
session_start();
include 'api/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$stmt = $conn->prepare("SELECT name, email, subscription_status, trial_end_date FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Fetch products bought by user
$stmt_orders = $conn->prepare("
    SELECT o.created_at, o.amount, p.name, p.rate_type 
    FROM orders o 
    JOIN platform_products p ON o.item_id = p.id 
    WHERE o.user_id = ? AND o.item_type = 'product'
    ORDER BY o.created_at DESC
");
$stmt_orders->bind_param("i", $user_id);
$stmt_orders->execute();
$orders = $stmt_orders->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-white text-dark-black min-h-screen flex">

    <div id="sidebar-container"></div>

    <main class="flex-1 ml-64 p-8 md:p-12 min-h-screen relative overflow-x-hidden transition-all duration-300">
        <header class="flex justify-between items-center mb-12">
            <div class="flex items-center">
                <button onclick="toggleSidebar()" class="sidebar-toggle bg-white border-dark-black text-dark-black mr-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
                <div>
                    <h2 class="text-5xl font-bold mb-2">My Profile</h2>
                    <p class="text-xl text-gray-600 font-medium">Manage your account details and purchased products</p>
                </div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- User Info -->
            <div class="lg:col-span-1 space-y-10">
                <div class="card-positivus bg-lime-green border-2 border-dark-black shadow-[8px_8px_0_#191a23]">
                    <div class="w-24 h-24 bg-white border-4 border-dark-black rounded-full flex items-center justify-center text-5xl mb-6 shadow-[4px_4px_0_#191a23]">
                        👤
                    </div>
                    <h3 class="text-3xl font-black text-dark-black mb-1"><?php echo htmlspecialchars($user['name']); ?></h3>
                    <p class="text-dark-black font-medium mb-6"><?php echo htmlspecialchars($user['email']); ?></p>
                </div>

                <div class="card-positivus bg-white border-2 border-dark-black shadow-[8px_8px_0_#191a23]">
                    <h4 class="text-2xl font-black uppercase mb-6">Subscription Plan</h4>
                    
                    <div class="mb-4">
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</span>
                        <span class="inline-block px-4 py-1 border-2 border-dark-black rounded-full text-sm font-bold uppercase <?php echo $user['subscription_status'] === 'premium' || $user['subscription_status'] === 'active' ? 'bg-lime-green' : 'bg-gray-200'; ?>">
                            <?php echo htmlspecialchars($user['subscription_status']); ?>
                        </span>
                    </div>

                    <div>
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-1">Valid Until</span>
                        <p class="text-xl font-bold text-dark-black"><?php echo date('d M Y', strtotime($user['trial_end_date'])); ?></p>
                    </div>

                    <a href="dashboard.php" class="btn-positivus bg-dark-black text-white hover:bg-lime-green hover:text-dark-black transition shadow-[4px_4px_0_#b9ff66] w-full mt-8 block text-center">Upgrade Plan</a>
                </div>
            </div>

            <!-- Purchased Products -->
            <div class="lg:col-span-2">
                <div class="card-positivus bg-light-gray border-2 border-dark-black shadow-[8px_8px_0_#191a23] h-full">
                    <h3 class="text-3xl font-black uppercase mb-8">My Products</h3>
                    
                    <?php if($orders->num_rows > 0): ?>
                        <div class="space-y-4">
                            <?php while($order = $orders->fetch_assoc()): ?>
                                <div class="bg-white border-2 border-dark-black rounded-2xl p-6 flex justify-between items-center hover:shadow-[4px_4px_0_#b9ff66] transition-shadow">
                                    <div>
                                        <div class="flex items-center gap-3 mb-1">
                                            <h4 class="text-xl font-bold text-dark-black"><?php echo htmlspecialchars($order['name']); ?></h4>
                                            <span class="badge-lime text-[10px] uppercase font-bold py-0.5 px-2 border border-dark-black shadow-[2px_2px_0_#000]"><?php echo htmlspecialchars($order['rate_type']); ?></span>
                                        </div>
                                        <p class="text-sm font-medium text-gray-500">Purchased on <?php echo date('d M Y', strtotime($order['created_at'])); ?></p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-black text-lime-green">₹<?php echo number_format($order['amount']); ?></p>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-16">
                            <div class="text-6xl mb-4">🛍️</div>
                            <h4 class="text-2xl font-bold text-gray-400 mb-2">No Products Yet</h4>
                            <p class="text-gray-500 font-medium mb-6">Explore the marketplace to accelerate your startup.</p>
                            <a href="products.php" class="btn-positivus bg-lime-green text-dark-black">Go to Marketplace</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </main>

    <script src="assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // we don't have an 'active' state for profile in sidebar but rendering it anyway
            renderSidebar('profile'); 
            await checkAuth();
        });
    </script>
</body>
</html>
