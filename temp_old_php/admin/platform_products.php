<?php
session_start();
include '../api/db.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: ../login.php");
    exit;
}

// Handle Actions
if (isset($_POST['add'])) {
    $name = $conn->real_escape_string($_POST['name']);
    $price = (float)$_POST['price'];
    $description = $conn->real_escape_string($_POST['description']);
    $rate_type = $conn->real_escape_string($_POST['rate_type'] ?? 'one-time');
    $duration = $conn->real_escape_string($_POST['duration'] ?? 'N/A');
    
    $conn->query("INSERT INTO platform_products (name, price, description, rate_type, duration) VALUES ('$name', $price, '$description', '$rate_type', '$duration')");
    header("Location: platform_products.php");
    exit;
}

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $conn->query("DELETE FROM platform_products WHERE id = $id");
    header("Location: platform_products.php");
    exit;
}

$products = $conn->query("SELECT * FROM platform_products ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Products | Admin | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-white text-dark-black min-h-screen flex">

    <!-- Admin Sidebar -->
    <div class="w-64 h-screen sidebar fixed top-0 left-0 flex flex-col p-6 border-r-2 border-dark-black bg-white overflow-y-auto">
        <div class="flex items-center mb-12">
            <svg class="w-8 h-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
                <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
            </svg>
            <h1 class="text-2xl font-black uppercase tracking-tighter">Admin</h1>
        </div>
        <nav class="flex-1 space-y-2">
            <a href="dashboard.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Dashboard</span></a>
            <a href="users.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Users</span></a>
            <a href="subscriptions.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Subscriptions</span></a>
            <a href="platform_products.php" class="nav-item active flex items-center p-4 font-bold text-lg bg-lime-green border-2 border-dark-black rounded-2xl shadow-[4px_4px_0_#191a23]"><span>Products</span></a>
            <a href="testimonials.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Testimonials</span></a>
            <a href="team.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Team</span></a>
            <a href="settings.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Settings</span></a>
        </nav>
        <div class="mt-8"><a href="logout.php" class="flex items-center p-4 font-bold text-lg text-red-600 hover:bg-red-50 rounded-2xl transition-all"><span>Logout</span></a></div>
    </div>

    <main class="flex-1 ml-64 p-8 md:p-12">
        <header class="flex justify-between items-center mb-12">
            <div>
                <h2 class="text-5xl font-black uppercase">Products</h2>
                <p class="text-xl text-gray-600 font-medium">Manage digital products available for users to purchase.</p>
            </div>
        </header>

        <!-- Add Form -->
        <div class="card-positivus mb-12 bg-white">
            <h3 class="text-2xl font-black uppercase mb-6">Add New Product</h3>
            <form method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Product Name</label>
                    <input type="text" name="name" required placeholder="e.g. SEO Audit Template" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Price (₹)</label>
                    <input type="number" step="0.01" name="price" required placeholder="e.g. 1999" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Rate Type</label>
                    <input type="text" name="rate_type" placeholder="e.g. ONE-TIME" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Duration</label>
                    <input type="text" name="duration" placeholder="e.g. N/A or 1 HOUR" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-black uppercase mb-2">Description</label>
                    <textarea name="description" rows="3" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all"></textarea>
                </div>
                <div class="md:col-span-2">
                    <button type="submit" name="add" class="btn-positivus bg-dark-black text-white hover:bg-lime-green hover:text-dark-black px-12">Save Product</button>
                </div>
            </form>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php while($row = $products->fetch_assoc()): ?>
            <div class="card-positivus relative group flex flex-col justify-between bg-white hover:shadow-[8px_8px_0_#b9ff66] transition-shadow duration-300">
                <div>
                    <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete this product?')" class="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </a>
                    
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="text-2xl font-bold leading-tight pr-8"><?php echo htmlspecialchars($row['name']); ?></h4>
                        <?php if(!empty($row['rate_type'])): ?>
                            <span class="badge-lime text-[10px] uppercase font-bold"><?php echo htmlspecialchars($row['rate_type']); ?></span>
                        <?php endif; ?>
                    </div>
                    <p class="text-dark-black font-bold text-3xl mb-4">₹<?php echo number_format($row['price']); ?></p>
                    <?php if(!empty($row['duration'])): ?>
                        <p class="text-gray-500 font-bold text-sm mb-2 uppercase tracking-wider">Duration: <?php echo htmlspecialchars($row['duration']); ?></p>
                    <?php endif; ?>
                    <p class="text-gray-600 font-medium line-clamp-3 mb-4"><?php echo htmlspecialchars($row['description']); ?></p>
                </div>
            </div>
            <?php endwhile; ?>
        </div>
    </main>
</body>
</html>
