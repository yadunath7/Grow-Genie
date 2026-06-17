<?php
session_start();
include 'api/db.php';

$type = isset($_GET['type']) ? $_GET['type'] : 'meta_fb';

$campaigns = [
    'meta_fb' => ['name' => 'Meta Facebook Ads', 'icon' => '📘', 'fields' => ['Ad Format', 'Primary Text', 'Headline']],
    'instagram' => ['name' => 'Instagram Ads', 'icon' => '📸', 'fields' => ['Story or Feed', 'Hashtags', 'CTA Button']],
    'google' => ['name' => 'Google Search Ads', 'icon' => '🔍', 'fields' => ['Keywords', 'Display URL', 'Headlines']],
    'flyers' => ['name' => 'Physical Flyers', 'icon' => '📄', 'fields' => ['Paper Size', 'Quantity', 'Distribution Area']],
    'billboards' => ['name' => 'Billboard Ads', 'icon' => '🏙️', 'fields' => ['Location Type', 'Duration', 'Size']],
    'events' => ['name' => 'Event Stalls', 'icon' => '🎪', 'fields' => ['Event Name', 'Booth Type', 'Materials Needed']]
];

$current = isset($campaigns[$type]) ? $campaigns[$type] : $campaigns['meta_fb'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $current['name']; ?> | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-white min-h-screen flex">

    <div id="sidebar-container"></div>

    <main class="flex-1 ml-64 p-8 md:p-12 min-h-screen relative overflow-x-hidden">
        <header class="flex items-center mb-12">
            <a href="marketing.php" class="mr-6 p-3 bg-white border-2 border-dark-black rounded-xl hover:bg-light-gray transition shadow-[4px_4px_0_#191a23]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </a>
            <div>
                <div class="flex items-center space-x-4 mb-2">
                    <span class="text-4xl"><?php echo $current['icon']; ?></span>
                    <h2 class="text-4xl font-bold"><?php echo $current['name']; ?></h2>
                </div>
                <p class="text-xl text-gray-600 font-medium">Configure your high-converting campaign</p>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Form Section -->
            <div class="card-positivus bg-light-gray">
                <h3 class="text-2xl font-bold mb-8 uppercase tracking-tight">Product Details</h3>
                <form id="campaign-form" class="space-y-6">
                    <div>
                        <label class="block font-bold mb-2">What are you promoting?</label>
                        <input type="text" id="prod_title" required class="input-positivus" placeholder="e.g. Aura Bottle v2">
                    </div>

                    <div>
                        <label class="block font-bold mb-2">Area where you sell</label>
                        <input type="text" id="target_audience" class="input-positivus" placeholder="e.g. Delhi, Mumbai, or specific pin codes">
                    </div>

                    <!-- UGC Upload Section -->
                    <div class="pt-6">
                        <label class="block font-bold mb-4 text-xl">UGC Content (Videos/Posters)</label>
                        <div class="border-2 border-dashed border-dark-black rounded-3xl p-10 bg-white hover:bg-lime-green/10 transition group cursor-pointer text-center" onclick="document.getElementById('file-upload').click()">
                            <input type="file" id="file-upload" class="hidden" multiple accept="image/*,video/*">
                            <div class="w-16 h-16 bg-light-gray border-2 border-dark-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-green transition shadow-[4px_4px_0_#191a23]">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                            <p class="font-bold text-lg mb-1">Click to upload assets</p>
                            <p class="text-gray-500">MP4, MOV, JPG or PNG (Max 50MB)</p>
                            <div id="file-list" class="mt-4 flex flex-wrap gap-2 justify-center"></div>
                        </div>
                    </div>

                    <button type="submit" class="w-full btn-positivus py-6 text-2xl mt-8">
                        Create a Campaign
                    </button>
                </form>
            </div>

            <!-- Genie Expert Section -->
            <div class="space-y-8">
                <div class="card-positivus lime flex flex-col h-[600px]">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold">Genie Marketing Expert</h3>
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span class="text-sm font-bold text-dark-black uppercase">Expert Online</span>
                        </div>
                    </div>

                    <!-- Chat Container -->
                    <div id="expert-chat" class="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
                        <div class="p-5 bg-white border-2 border-dark-black rounded-3xl shadow-[4px_4px_0_#191a23]">
                            <p class="font-bold text-dark-black">Genie Expert:</p>
                            <p class="text-lg">I'm your <?php echo $current['name']; ?> specialist. Fill out the form to generate assets, or ask me anything about optimizing this campaign!</p>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="flex space-x-3 bg-white p-3 border-2 border-dark-black rounded-[2.5rem] shadow-[4px_4px_0_#191a23]">
                        <input type="text" id="expert-query" class="flex-1 bg-transparent px-4 font-bold focus:outline-none" placeholder="Ask about targeting, pixels, budget...">
                        <button id="ask-expert-btn" class="bg-dark-black text-white p-4 rounded-[2rem] hover:bg-lime-green hover:text-dark-black transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="card-positivus dark text-white">
                    <h3 class="text-2xl font-bold mb-4">Market Insight 💡</h3>
                    <p class="text-gray-300 text-lg leading-relaxed" id="platform-tip">
                        For <?php echo $current['name']; ?>, focusing on high-quality UGC typically increases CTR by 40%.
                    </p>
                </div>
            </div>
        </div>
    </main>

    <script src="assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            renderSidebar('marketing');
            await checkAuth();

            const adType = '<?php echo $type; ?>';
            const platformName = '<?php echo $current['name']; ?>';
            const chatContainer = document.getElementById('expert-chat');
            const expertInput = document.getElementById('expert-query');
            const askBtn = document.getElementById('ask-expert-btn');
            const platformTip = document.getElementById('platform-tip');

            // Fetch Market Insight
            const fetchInsight = async () => {
                try {
                    platformTip.innerHTML = '<span class="animate-pulse">🧞‍♂️ Genie is analyzing market trends...</span>';
                    const res = await fetch(`api/market_insight.php?platform=${encodeURIComponent(platformName)}`);
                    const data = await res.json();
                    if (data.status === 'success') {
                        platformTip.textContent = data.insight;
                    } else {
                        platformTip.textContent = `Focus on high-quality content to increase engagement on ${platformName}.`;
                    }
                } catch (e) {
                    platformTip.textContent = "Data-driven insights available for premium users.";
                }
            };
            fetchInsight();

            const addMessage = (role, text, isDark = false) => {
                const div = document.createElement('div');
                div.className = `p-5 border-2 border-dark-black rounded-3xl shadow-[4px_4px_0_#191a23] ${isDark ? 'bg-[#191a23] text-white' : 'bg-white text-dark-black'}`;
                div.innerHTML = `<p class="font-bold mb-1">${role}:</p><p class="text-lg leading-relaxed">${text}</p>`;
                chatContainer.appendChild(div);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            };

            const getExpertResponse = (query) => {
                const q = query.toLowerCase();
                
                const responses = {
                    meta_fb: {
                        pixel: "To set up the Meta Pixel, go to Events Manager, create a Data Source, and paste the JS snippet in your website header. This tracks conversions and builds Lookalike Audiences.",
                        budget: "For FB, start with CBO (Campaign Budget Optimization) if you have 3+ ad sets. Minimum recommended test budget is ₹500/day per ad set.",
                        audience: "Start with a 'Broad' audience first to let the algorithm find buyers, then layer 1% Lookalikes of your 'Purchase' events."
                    },
                    google: {
                        keywords: "Focus on 'Buying Intent' keywords. Use 'Exact Match' for high-converting terms and 'Phrase Match' for discovery. Avoid 'Broad Match' initially as it wastes budget.",
                        quality: "Your Quality Score depends on Ad Relevance, Landing Page Experience, and Expected CTR. Keep your headline matching your search term exactly."
                    },
                    flyers: {
                        paper: "For premium brands, use 170gsm silk finish. For local deals, 130gsm gloss is most cost-effective.",
                        qr: "Always include a QR code with a UTM parameter so you can track how many offline customers actually visited your site."
                    }
                };

                const platformResponses = responses[adType] || {};
                
                if (q.includes('pixel')) return platformResponses.pixel || "Pixels track user behavior. For this platform, make sure your event tracking is validated.";
                if (q.includes('budget') || q.includes('cost')) return platformResponses.budget || "Start small, test 3 variations, and scale the winner after 48 hours of stable data.";
                if (q.includes('audience') || q.includes('target')) return platformResponses.audience || "Niche targeting works best. Define your ideal customer profile (ICP) before spending.";
                
                return `That's a great question about ${adType.replace('_', ' ')}. To optimize this, you should focus on A/B testing your creative hooks and ensuring your landing page loads in under 3 seconds. Want me to generate some specific hooks for your product?`;
            };

            askBtn.addEventListener('click', () => {
                const query = expertInput.value.trim();
                if (!query) return;

                addMessage('You', query, true);
                expertInput.value = '';

                setTimeout(() => {
                    const response = getExpertResponse(query);
                    addMessage('Genie Expert', response);
                }, 1000);
            });

            expertInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') askBtn.click();
            });

            // Handle UGC File Upload Feedback
            const fileUpload = document.getElementById('file-upload');
            const fileList = document.getElementById('file-list');

            fileUpload.addEventListener('change', (e) => {
                const files = e.target.files;
                fileList.innerHTML = '';
                
                if (files.length > 0) {
                    Array.from(files).forEach(file => {
                        const badge = document.createElement('div');
                        badge.className = 'bg-lime-green text-dark-black border-2 border-dark-black px-4 py-2 rounded-xl text-sm font-black shadow-[2px_2px_0_#191a23] flex items-center space-x-2';
                        
                        // Check if it's an image or video to show an icon
                        const icon = file.type.startsWith('image/') ? '🖼️' : '🎥';
                        badge.innerHTML = `<span>${icon}</span> <span class="truncate max-w-[150px]">${file.name}</span>`;
                        fileList.appendChild(badge);
                    });
                }
            });

            document.getElementById('campaign-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const prod = document.getElementById('prod_title').value;
                
                addMessage('System', `Generating advanced strategy for ${prod}...`, false);

                setTimeout(() => {
                    addMessage('Genie Expert', `Based on your target audience, here is your high-conversion strategy for ${prod}:<br><br>
                        <b>🚀 Hook #1:</b> "Stop scrolling! If you care about efficiency, ${prod} is the only tool you need in India."<br><br>
                        <b>📊 Strategy:</b> Run this with a 'Retargeting' campaign for users who visited your site but didn't buy. Use a 20% discount code 'GENIE20'.`);
                }, 1500);
            });
        });
    </script>
</body>
</html>
