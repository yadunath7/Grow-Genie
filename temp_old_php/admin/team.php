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
    $position = $conn->real_escape_string($_POST['position']);
    $description = $conn->real_escape_string($_POST['description'] ?? '');
    $linkedin_url = $conn->real_escape_string($_POST['linkedin_url'] ?? '');
    
    $image_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $target_dir = "../uploads/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        $file_name = time() . "_" . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $file_name;
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $image_url = "uploads/" . $file_name;
        }
    }

    $conn->query("INSERT INTO team_members (name, position, image_url, description, linkedin_url) VALUES ('$name', '$position', '$image_url', '$description', '$linkedin_url')");
    header("Location: team.php");
    exit;
}

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $conn->query("DELETE FROM team_members WHERE id = $id");
    header("Location: team.php");
    exit;
}

$team = $conn->query("SELECT * FROM team_members ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Management | GrowGenie</title>
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
            <a href="team.php" class="nav-item active flex items-center p-4 font-bold text-lg bg-lime-green border-2 border-dark-black rounded-2xl shadow-[4px_4px_0_#191a23]"><span>Team</span></a>
            <a href="settings.php" class="nav-item flex items-center p-4 font-bold text-lg hover:bg-light-gray transition-all"><span>Settings</span></a>
        </nav>
        <div class="mt-auto"><a href="logout.php" class="flex items-center p-4 font-bold text-lg text-red-600 hover:bg-red-50 rounded-2xl transition-all"><span>Logout</span></a></div>
    </div>

    <main class="flex-1 ml-64 p-8 md:p-12">
        <header class="flex justify-between items-center mb-12">
            <div>
                <h2 class="text-5xl font-black uppercase">Team Management</h2>
                <p class="text-xl text-gray-600 font-medium">Manage the core team members of GrowGenie.</p>
            </div>
        </header>

        <!-- Add Form -->
        <div class="card-positivus mb-12">
            <h3 class="text-2xl font-black uppercase mb-6">Add Team Member</h3>
            <form method="POST" enctype="multipart/form-data" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Name</label>
                    <input type="text" name="name" required class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Position</label>
                    <input type="text" name="position" required class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">Profile Image</label>
                    <input type="file" name="image" accept="image/*" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-3 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-black uppercase mb-2">LinkedIn URL</label>
                    <input type="url" name="linkedin_url" placeholder="https://linkedin.com/in/..." class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-black uppercase mb-2">Description</label>
                    <textarea name="description" rows="3" class="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all"></textarea>
                </div>
                <div class="md:col-span-2">
                    <button type="submit" name="add" class="btn-positivus px-12">Save Member</button>
                </div>
            </form>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <?php while($row = $team->fetch_assoc()): ?>
            <div class="card-positivus relative group text-center">
                <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete this?')" class="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </a>
                <div class="w-24 h-24 bg-light-gray border-2 border-dark-black rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <?php if($row['image_url']): ?>
                        <img src="../<?php echo htmlspecialchars($row['image_url']); ?>" alt="" class="w-full h-full object-cover">
                    <?php else: ?>
                        <span class="text-3xl">👤</span>
                    <?php endif; ?>
                </div>
                <h4 class="text-xl font-black uppercase"><?php echo htmlspecialchars($row['name']); ?></h4>
                <p class="text-lime-green font-bold text-sm uppercase mb-2"><?php echo htmlspecialchars($row['position']); ?></p>
                <?php if($row['description']): ?>
                    <p class="text-xs text-gray-600 mb-2"><?php echo htmlspecialchars(substr($row['description'], 0, 100)) . '...'; ?></p>
                <?php endif; ?>
                <?php if($row['linkedin_url']): ?>
                    <a href="<?php echo htmlspecialchars($row['linkedin_url']); ?>" target="_blank" class="text-blue-600 hover:underline text-xs font-bold">LinkedIn</a>
                <?php endif; ?>
            </div>
            <?php endwhile; ?>
        </div>
    </main>
</body>
</html>
