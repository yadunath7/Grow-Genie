<?php
session_start();
include 'api/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grow Genie Planner | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-white min-h-screen flex">

    <div id="sidebar-container"></div>

    <main class="flex-1 ml-64 p-8 md:p-12 min-h-screen relative">
        <header class="flex items-start mb-16">
            <button onclick="toggleSidebar()" class="sidebar-toggle">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <div>
                <h2 class="text-5xl font-bold mb-4" data-i18n="ai_planner">Grow Genie Planner</h2>
                <p class="text-xl text-gray-600 font-medium" data-i18n="ai_roadmap_gen_desc">Generate a step-by-step business plan for your startup.</p>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Left Section: Form & Navigation -->
            <div class="flex flex-col space-y-8">
                <!-- Tabs (Now on Left Side) -->
                <div id="results-tabs" class="hidden flex flex-wrap items-center gap-3">
                    <button onclick="switchTab('roadmap')" id="tab-roadmap" class="flex items-center space-x-2 px-6 py-3 bg-[#b9ff66] text-[#191a23] font-black rounded-2xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] transition-all">
                        <span>🗺️</span> <span>Roadmap</span>
                    </button>
                    <button onclick="switchTab('strategy')" id="tab-strategy" class="flex items-center space-x-2 px-6 py-3 bg-white text-[#191a23] font-bold rounded-2xl border-2 border-[#191a23] hover:bg-[#f3f3f3] transition-all">
                        <span>📊</span> <span>Market Strategy</span>
                    </button>
                    <button onclick="switchTab('ad_copy')" id="tab-ad_copy" class="flex items-center space-x-2 px-6 py-3 bg-white text-[#191a23] font-bold rounded-2xl border-2 border-[#191a23] hover:bg-[#f3f3f3] transition-all">
                        <span>📢</span> <span>Ad Copy</span>
                    </button>
                    <button onclick="switchTab('product_desc')" id="tab-product_desc" class="flex items-center space-x-2 px-6 py-3 bg-white text-[#191a23] font-bold rounded-2xl border-2 border-[#191a23] hover:bg-[#f3f3f3] transition-all">
                        <span>📝</span> <span>Product Desc</span>
                    </button>
                    <button onclick="switchTab('history')" id="tab-history" class="flex items-center space-x-2 px-6 py-3 bg-white text-[#191a23] font-bold rounded-2xl border-2 border-[#191a23] hover:bg-[#f3f3f3] transition-all">
                        <span>🕐</span> <span>History</span>
                    </button>
                </div>

                <!-- Form Section -->
                <div class="card-positivus bg-light-gray premium-feature">
                <h3 class="text-3xl font-bold mb-10" data-i18n="startup_details">Startup Details</h3>
                <div id="msg-container" class="hidden p-4 rounded-2xl mb-8 font-bold text-center border-2 border-dark-black"></div>
                
                <form id="idea-form" class="space-y-8">
                    <div>
                        <label class="block text-xl font-bold mb-3" data-i18n="startup_name">Startup Name</label>
                        <input type="text" id="idea_name" required class="input-positivus text-lg" placeholder="e.g. Aura Bottles" data-i18n-placeholder="startup_name_placeholder">
                    </div>
                    <div>
                        <label class="block text-xl font-bold mb-3" data-i18n="startup_idea">Startup Idea</label>
                        <textarea id="startup_idea" required class="input-positivus text-lg h-32 py-4" placeholder="Describe what your business does..." data-i18n-placeholder="startup_idea_placeholder"></textarea>
                    </div>
                    <div>
                        <label class="block text-xl font-bold mb-3" data-i18n="category">Category</label>
                        <select id="category" required class="input-positivus text-lg appearance-none bg-white">
                            <option value="Tech">Technology & SaaS</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Food">Food & Beverage</option>
                            <option value="Clothing">Clothing & Apparel</option>
                            <option value="Services">Services</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xl font-bold mb-3" data-i18n="budget_range">Budget Range (INR)</label>
                        <select id="budget" required class="input-positivus text-lg appearance-none bg-white">
                            <option value="Under ₹50,000">Under ₹50,000 (Bootstrapped)</option>
                            <option value="₹50,000 - ₹5 Lakhs">₹50,000 - ₹5 Lakhs</option>
                            <option value="₹5 Lakhs - ₹20 Lakhs">₹5 Lakhs - ₹20 Lakhs</option>
                            <option value="Above ₹20 Lakhs">Above ₹20 Lakhs</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xl font-bold mb-3" data-i18n="output_language">Output Language</label>
                        <select id="output_lang" required class="input-positivus text-lg appearance-none bg-white border-2 border-dark-black shadow-[4px_4px_0_#b9ff66]">
                            <option value="English">English 🇺🇸</option>
                            <option value="Hindi">Hindi (हिन्दी) 🇮🇳</option>
                            <option value="Tamil">Tamil (தமிழ்) 🇮🇳</option>
                            <option value="Bengali">Bengali (বাংলা) 🇮🇳</option>
                            <option value="Marathi">Marathi (मराठी) 🇮🇳</option>
                        </select>
                    </div>
                    <button type="submit" id="generate-btn" class="w-full btn-positivus text-2xl py-6 mt-4">
                        <svg class="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span data-i18n="generate_roadmap">Generate Roadmap</span>
                    </button>
                </form>
            </div>
            </div> <!-- End Left Column -->

            <!-- Right Section: Results -->
            <div class="card-positivus lime flex flex-col premium-feature relative overflow-hidden" id="results-card">
                
                <div id="roadmap-result" class="flex-1 flex items-center justify-center border-2 border-dashed border-dark-black rounded-[45px] bg-white/30 p-4">
                    <div class="text-center text-dark-black p-10">
                        <svg class="w-24 h-24 mx-auto mb-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p class="text-xl font-bold" data-i18n="roadmap_placeholder">Generate a customized step-by-step roadmap for your startup.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            renderSidebar('ideas');
            const user = await checkAuth();
            if(!user) return;
            
            if(user.subscription_status === 'expired') return;

            document.getElementById('idea-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('generate-btn');
                const origText = btn.innerHTML;
                btn.innerHTML = 'GENERATING...';
                btn.disabled = true;

                const idea_name = document.getElementById('idea_name').value;
                const startup_idea = document.getElementById('startup_idea').value;
                const category = document.getElementById('category').value;
                const budget = document.getElementById('budget').value;
                const output_lang = document.getElementById('output_lang').value;
                const msgContainer = document.getElementById('msg-container');

                const formData = new URLSearchParams();
                formData.append('action', 'generate');
                formData.append('idea_name', idea_name);
                formData.append('startup_idea', startup_idea);
                formData.append('category', category);
                formData.append('budget', budget);
                formData.append('language', output_lang);

                try {
                    const res = await fetch(`${API_BASE}/ideas.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: formData
                    });
                    const data = await res.json();

                    if (data.status === 'success') {
                        msgContainer.textContent = "Your Business Plan is ready!";
                        msgContainer.className = 'p-4 rounded-2xl mb-8 font-bold text-center border-2 border-dark-black bg-lime-green text-dark-black';
                        msgContainer.classList.remove('hidden');
                        
                        setTimeout(() => {
                            fetchIdeasAndRenderLatest();
                            btn.innerHTML = origText;
                            btn.disabled = false;
                        }, 1000);
                        
                    } else {
                        msgContainer.textContent = data.message || "Failed to generate.";
                        msgContainer.className = 'p-4 rounded-2xl mb-8 font-bold text-center border-2 border-dark-black bg-red-100 text-red-600';
                        msgContainer.classList.remove('hidden');
                        btn.innerHTML = origText;
                        btn.disabled = false;
                    }
                } catch (err) {
                    msgContainer.textContent = 'Network error. Try again later.';
                    msgContainer.classList.remove('hidden');
                    btn.innerHTML = origText;
                    btn.disabled = false;
                }
            });

            let currentRoadmapData = null;
            let currentTab = 'roadmap';
            let allPastIdeas = [];

            window.loadPastIdea = function(index) {
                const idea = allPastIdeas[index];
                let parsedData = {};
                try {
                    parsedData = JSON.parse(idea.roadmap);
                } catch(e) {}

                currentRoadmapData = {
                    idea_name: idea.idea_name,
                    category: idea.category,
                    budget: idea.budget,
                    roadmap: parsedData.roadmap || parsedData,
                    market_strategy: parsedData.market_strategy || "Strategy data not available for this older generation.",
                    ad_copy: parsedData.ad_copy || { "Facebook": "Not available", "Instagram": "Not available", "Google": "Not available" },
                    product_desc: parsedData.product_desc || "Product description not available."
                };
                
                switchTab('roadmap');
            };

            async function fetchIdeasAndRenderLatest() {
                try {
                    const res = await fetch(`${API_BASE}/ideas.php?action=fetch`);
                    const data = await res.json();
                    
                    if (data.status === 'success' && data.data.length > 0) {
                        allPastIdeas = data.data;
                        loadPastIdea(0); // Load latest
                        document.getElementById('results-tabs').classList.remove('hidden');
                    }
                } catch (e) {
                    console.error("Failed to fetch roadmap", e);
                }
            }

            window.switchTab = function(tabName) {
                currentTab = tabName;
                const tabs = ['roadmap', 'strategy', 'ad_copy', 'product_desc', 'history'];
                
                tabs.forEach(t => {
                    const el = document.getElementById(`tab-${t}`);
                    if (!el) return;
                    if (t === tabName) {
                        el.className = 'flex items-center space-x-2 px-6 py-3 bg-[#b9ff66] text-[#191a23] font-black rounded-2xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] transition-all';
                    } else {
                        el.className = 'flex items-center space-x-2 px-6 py-3 bg-white text-[#191a23] font-bold rounded-2xl border-2 border-[#191a23] hover:bg-[#f3f3f3] transition-all';
                    }
                });

                renderCurrentTab();
            };

            window.renderCurrentTab = function() {
                if (currentTab === 'history') {
                    const resultContainer = document.getElementById('roadmap-result');
                    resultContainer.className = 'flex-1 pr-4 custom-scrollbar bg-white rounded-[30px] border-2 border-dark-black min-h-[600px] p-8';
                    
                    let html = `<h4 class="text-3xl font-black text-dark-black mb-6 uppercase tracking-tight">Generation History</h4><div class="grid grid-cols-1 gap-4">`;
                    
                    if (allPastIdeas.length === 0) {
                        html += `<p class="text-gray-500 font-bold">No history available yet.</p>`;
                    } else {
                        allPastIdeas.forEach((idea, index) => {
                            html += `
                                <div class="card-positivus bg-light-gray border-2 border-dark-black p-5 rounded-xl hover:bg-white hover:shadow-[4px_4px_0_#191a23] transition-all cursor-pointer flex justify-between items-center" onclick="loadPastIdea(${index})">
                                    <div>
                                        <h5 class="text-xl font-black uppercase text-dark-black mb-1">${idea.idea_name}</h5>
                                        <div class="flex space-x-2">
                                            <span class="text-xs font-bold bg-white px-2 py-0.5 rounded border border-dark-black">${idea.category}</span>
                                            <span class="text-xs font-bold bg-white px-2 py-0.5 rounded border border-dark-black">${idea.budget}</span>
                                        </div>
                                    </div>
                                    <div class="text-sm font-bold text-gray-500">${new Date(idea.created_at).toLocaleDateString()}</div>
                                </div>
                            `;
                        });
                    }
                    html += `</div>`;
                    resultContainer.innerHTML = html;
                    return;
                }
                if (!currentRoadmapData) return;

                const resultContainer = document.getElementById('roadmap-result');
                resultContainer.className = 'flex-1 pr-4 custom-scrollbar bg-white rounded-[30px] border-2 border-dark-black min-h-[600px]';
                
                let headerHtml = `
                    <div class="sticky top-0 bg-white z-20 p-6 border-b-2 border-dark-black mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-3xl font-black text-dark-black uppercase tracking-tighter">${currentRoadmapData.idea_name}</h4>
                            <div class="flex space-x-3">
                                <span class="badge-lime text-xs font-bold uppercase border border-dark-black">${currentRoadmapData.category}</span>
                                <span class="badge-lime text-xs font-bold uppercase border border-dark-black">${currentRoadmapData.budget}</span>
                            </div>
                        </div>
                `;

                if (currentTab === 'roadmap') {
                    headerHtml += `
                        <div class="flex flex-wrap gap-2 mt-4">
                            <button onclick="renderRoadmapFilter('all')" id="filter-all" class="px-4 py-2 border-2 border-dark-black rounded-xl font-bold text-sm transition bg-lime-green shadow-[4px_4px_0_#191a23]">ALL MONTHS</button>
                            ${[1,2,3,4,5,6].map(m => `
                                <button onclick="renderRoadmapFilter(${m})" id="filter-${m}" class="px-4 py-2 border-2 border-dark-black rounded-xl font-bold text-sm transition bg-white hover:bg-gray-50">MONTH ${m}</button>
                            `).join('')}
                        </div>
                    `;
                }

                headerHtml += `</div><div class="p-8 space-y-10" id="tab-content">`;
                
                let contentHtml = '';

                if (currentTab === 'roadmap') {
                    let stepNum = 1;
                    const roadmapEntries = Object.entries(currentRoadmapData.roadmap);
                    
                    roadmapEntries.forEach(([phase, description], index) => {
                        let displayContent = description;
                        if (typeof description === 'object' && description !== null) {
                            displayContent = Object.entries(description).map(([k, v]) => `<b>${k}:</b> ${v}`).join('<br>');
                        }

                        contentHtml += `
                            <div class="roadmap-item flex items-start group" data-phase="${phase.toLowerCase()}">
                                <div class="mr-8 flex flex-col items-center">
                                    <div class="w-14 h-14 rounded-full bg-dark-black flex items-center justify-center text-lime-green font-black text-2xl border-2 border-dark-black shadow-[4px_4px_0_#b9ff66] group-hover:scale-110 transition-transform">${index + 1}</div>
                                    ${index !== roadmapEntries.length - 1 ? '<div class="w-1 h-24 bg-dark-black mt-2"></div>' : ''}
                                </div>
                                <div class="pb-12 pt-2 flex-1">
                                    <h4 class="text-2xl font-black text-dark-black mb-3 uppercase tracking-tight">${phase}</h4>
                                    <div class="card-positivus bg-light-gray/50 border-2 border-dark-black p-6 rounded-[25px] shadow-[6px_6px_0_#191a23]">
                                        <p class="text-lg text-gray-800 leading-relaxed font-bold">${displayContent}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                } else if (currentTab === 'strategy') {
                    contentHtml += `
                        <div class="card-positivus bg-white border-2 border-dark-black p-8 rounded-[25px] shadow-[6px_6px_0_#191a23]">
                            <h4 class="text-2xl font-black text-dark-black mb-6 uppercase tracking-tight">Market Strategy & Positioning</h4>
                            <p class="text-lg text-gray-800 leading-relaxed font-medium whitespace-pre-line">${currentRoadmapData.market_strategy}</p>
                        </div>
                    `;
                } else if (currentTab === 'ad_copy') {
                    const ads = currentRoadmapData.ad_copy;
                    for (const [platform, copy] of Object.entries(ads)) {
                        let icon = '📢';
                        if (platform.toLowerCase().includes('facebook')) icon = '📘';
                        if (platform.toLowerCase().includes('instagram')) icon = '📸';
                        if (platform.toLowerCase().includes('google')) icon = '🔍';

                        contentHtml += `
                            <div class="card-positivus bg-white border-2 border-dark-black p-6 rounded-[25px] shadow-[4px_4px_0_#191a23] mb-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="w-10 h-10 bg-light-gray border-2 border-dark-black rounded-full flex items-center justify-center text-xl">${icon}</div>
                                    <h4 class="text-xl font-black text-dark-black uppercase tracking-tight">${platform} Ad</h4>
                                </div>
                                <div class="bg-light-gray/50 p-4 rounded-xl border border-dashed border-dark-black/30">
                                    <p class="text-lg text-gray-800 leading-relaxed font-bold whitespace-pre-line">${copy}</p>
                                </div>
                                <button onclick="navigator.clipboard.writeText(\`${copy.replace(/`/g, '\\`')}\`); alert('Copied!');" class="mt-4 px-4 py-2 bg-dark-black text-white rounded-lg font-bold text-sm hover:bg-lime-green hover:text-dark-black transition-colors">Copy to Clipboard</button>
                            </div>
                        `;
                    }
                } else if (currentTab === 'product_desc') {
                    contentHtml += `
                        <div class="card-positivus bg-white border-2 border-dark-black p-8 rounded-[25px] shadow-[6px_6px_0_#191a23]">
                            <h4 class="text-2xl font-black text-dark-black mb-6 uppercase tracking-tight">SEO Product/Service Description</h4>
                            <div class="bg-light-gray p-6 rounded-xl border-2 border-dark-black">
                                <p class="text-lg text-gray-800 leading-relaxed font-medium whitespace-pre-line">${currentRoadmapData.product_desc}</p>
                            </div>
                            <button onclick="navigator.clipboard.writeText(\`${currentRoadmapData.product_desc.replace(/`/g, '\\`')}\`); alert('Copied!');" class="mt-6 px-6 py-3 bg-lime-green border-2 border-dark-black text-dark-black rounded-xl font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_#191a23] transition-all">Copy Description</button>
                        </div>
                    `;
                }

                resultContainer.innerHTML = headerHtml + contentHtml + `</div>`;
            };

            window.renderRoadmapFilter = function(filter) {
                // Update button styles
                ['all', 1, 2, 3, 4, 5, 6].forEach(m => {
                    const btn = document.getElementById(`filter-${m}`);
                    if (!btn) return;
                    if (m === filter) {
                        btn.className = 'px-4 py-2 border-2 border-dark-black rounded-xl font-bold text-sm transition bg-lime-green shadow-[4px_4px_0_#191a23]';
                    } else {
                        btn.className = 'px-4 py-2 border-2 border-dark-black rounded-xl font-bold text-sm transition bg-white hover:bg-gray-50';
                    }
                });

                // Filter items
                document.querySelectorAll('.roadmap-item').forEach(item => {
                    const phase = item.getAttribute('data-phase');
                    if (filter === 'all' || phase.includes(`month ${filter}`) || phase.includes(`महीना ${filter}`) || phase.includes(`மாதம் ${filter}`)) {
                        item.classList.remove('hidden');
                        item.classList.add('flex');
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('flex');
                    }
                });
            };

            fetchIdeasAndRenderLatest();
        });
    </script>
</body>
</html>
