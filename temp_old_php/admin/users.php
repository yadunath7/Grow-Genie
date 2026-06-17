<?php
session_start();
include '../api/db.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: ../login.php");
    exit;
}

// Handle Actions
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $conn->query("DELETE FROM users WHERE id = $id");
    header("Location: users.php");
    exit;
}

if (isset($_POST['update_status'])) {
    $id = (int)$_POST['user_id'];
    $status = $_POST['status'];
    $conn->query("UPDATE users SET subscription_status = '$status' WHERE id = $id");
    header("Location: users.php");
    exit;
}

$users = $conn->query("SELECT * FROM users ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management | Admin | GrowGenie</title>
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
            <a href="dashboard.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all">
                <span>Dashboard</span>
            </a>
            <a href="users.php" class="nav-item active flex items-center p-4 font-bold text-lg bg-lime-green border-2 border-dark-black rounded-2xl shadow-[4px_4px_0_#191a23]">
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
                <h2 class="text-5xl font-black uppercase">User Management</h2>
                <p class="text-xl text-gray-600 font-medium">Control user access and subscriptions.</p>
            </div>
        </header>

        <div class="card-positivus overflow-hidden !p-0">
            <table class="w-full text-left">
                <thead class="bg-dark-black text-white">
                    <tr>
                        <th class="p-6 font-black uppercase">ID</th>
                        <th class="p-6 font-black uppercase">Name</th>
                        <th class="p-6 font-black uppercase">Email</th>
                        <th class="p-6 font-black uppercase">Status</th>
                        <th class="p-6 font-black uppercase">Joined</th>
                        <th class="p-6 font-black uppercase text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-dark-black/5">
                    <?php while($row = $users->fetch_assoc()): ?>
                    <tr class="hover:bg-light-gray/30 transition-colors">
                        <td class="p-6 font-bold">#<?php echo $row['id']; ?></td>
                        <td class="p-6 font-bold"><?php echo htmlspecialchars($row['name']); ?></td>
                        <td class="p-6 font-medium text-gray-600"><?php echo htmlspecialchars($row['email']); ?></td>
                        <td class="p-6">
                            <form method="POST" class="flex items-center gap-2">
                                <input type="hidden" name="user_id" value="<?php echo $row['id']; ?>">
                                <select name="status" class="bg-white border-2 border-dark-black rounded-lg p-1 text-xs font-black uppercase">
                                    <option value="trial" <?php echo $row['subscription_status'] === 'trial' ? 'selected' : ''; ?>>Trial</option>
                                    <option value="active" <?php echo $row['subscription_status'] === 'active' ? 'selected' : ''; ?>>Premium</option>
                                    <option value="expired" <?php echo $row['subscription_status'] === 'expired' ? 'selected' : ''; ?>>Expired</option>
                                </select>
                                <button type="submit" name="update_status" class="bg-dark-black text-white p-1 rounded-lg hover:bg-lime-green hover:text-dark-black transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                            </form>
                        </td>
                        <td class="p-6 font-medium text-gray-400 text-sm"><?php echo date('M d, Y', strtotime($row['created_at'])); ?></td>
                        <td class="p-6 text-center">
                            <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete this user?')" class="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-wider">
                                Delete
                            </a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
