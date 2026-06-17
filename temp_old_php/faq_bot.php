<?php
session_start();
include 'api/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ Bot | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        @keyframes popIn {
            to { opacity: 1; transform: scale(1); }
        }
    </style>
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
                    <h2 class="text-5xl font-bold mb-2" data-i18n="faq_bot">Genie FAQ Bot</h2>
                    <p class="text-xl text-gray-600 font-medium" data-i18n="train_assistant">Train your support assistant</p>
                </div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Knowledge Base Section -->
            <div class="lg:col-span-1 space-y-8">
                <div class="card-positivus bg-white">
                    <h3 class="text-3xl font-black mb-8 uppercase tracking-tight" data-i18n="knowledge_base">Knowledge Base</h3>
                    <div id="faq-list" class="space-y-4">
                        <!-- FAQs will be injected here -->
                    </div>
                </div>
            </div>

            <!-- Chat Section -->
            <div class="lg:col-span-2 space-y-10">
                <div class="card-positivus flex flex-col h-[700px] bg-white">
                    <div class="flex items-center justify-between mb-8 border-b-2 border-dark-black/10 pb-4">
                        <h3 class="text-3xl font-black uppercase tracking-tight" data-i18n="ask_questions">Ask Questions About GrowGenie</h3>
                        <div class="flex space-x-2">
                            <span class="w-3 h-3 rounded-full bg-lime-green border border-dark-black"></span>
                            <span class="w-2 h-2 rounded-full bg-dark-black/20"></span>
                        </div>
                    </div>
                    <div id="chat-box" class="flex-1 bg-light-gray border-2 border-dark-black rounded-[40px] p-8 mb-6 overflow-y-auto space-y-6">
                        <div class="bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-6 text-dark-black font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66]" data-i18n="chat_welcome">
                            Hello! I'm your Genie assistant. You can click on the questions to the left or type your own question below!
                        </div>
                    </div>
                    <form id="chat-form" class="flex space-x-4 items-center">
                        <input type="text" id="chat-input" class="flex-1 bg-white border-2 border-dark-black rounded-3xl px-8 py-5 text-xl font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all" placeholder="Type your question here..." data-i18n-placeholder="chat_placeholder">

                        <!-- Mic Button -->
                        <button type="button" id="mic-btn" title="Speak your question"
                            class="bg-white border-2 border-dark-black px-5 py-5 rounded-3xl shadow-[4px_4px_0_#191a23] hover:bg-lime-green hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center">
                            <span id="mic-icon" class="text-2xl">🎤</span>
                        </button>

                        <!-- Send Button -->
                        <button type="submit" class="bg-lime-green border-2 border-dark-black px-8 rounded-3xl shadow-[6px_6px_0_#191a23] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <svg class="w-8 h-8 text-dark-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </form>

                    <!-- Listening indicator (hidden by default) -->
                    <div id="listening-indicator" class="hidden mt-3 flex items-center space-x-2 text-gray-500 font-bold text-sm">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
                        <span>Listening… speak now</span>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script src="assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            renderSidebar('faq');
            await checkAuth();

            const chatBox    = document.getElementById('chat-box');
            const chatForm   = document.getElementById('chat-form');
            const chatInput  = document.getElementById('chat-input');
            const faqList    = document.getElementById('faq-list');
            const micBtn     = document.getElementById('mic-btn');
            const micIcon    = document.getElementById('mic-icon');
            const listening  = document.getElementById('listening-indicator');

            // ── FAQ Dataset ──────────────────────────────────────────────────
            const GROWGENIE_FAQS = [
                { q: "What is GrowGenie?",                   keywords: ['what','growgenie','is','who'],             answer: "GrowGenie is a startup assistant platform that helps users turn ideas into real businesses." },
                { q: "How does GrowGenie help startups?",    keywords: ['how','help','startups','benefit'],        answer: "It provides roadmap generation, marketing strategies, and business setup guidance." },
                { q: "What features do you provide?",        keywords: ['features','provide','list','tools'],      answer: "Features include roadmap generator, invoice generator, marketing planner, and FAQ assistant." },
                { q: "Is GrowGenie free or paid?",           keywords: ['free','paid','price','cost','trial'],     answer: "GrowGenie offers a 5-day free trial, after which users can upgrade to premium." },
                { q: "What happens after the 5-day trial?", keywords: ['after','trial','expire','end'],           answer: "After the trial, premium modules are restricted. Upgrade to a paid plan to continue." },
                { q: "Does GrowGenie provide marketing strategies?", keywords: ['marketing','strategy','ads','advertise'], answer: "Yes! Our Marketing Command Center provides budget-specific advice and localized advertising strategies." },
                { q: "Can I generate invoices using GrowGenie?",     keywords: ['invoice','gst','pdf','bill'],       answer: "Absolutely! You can generate GST-compliant PDF invoices with your own company branding." },
                { q: "How can I start my business?",         keywords: ['start','business','roadmap','steps'],    answer: "Use our Genie Roadmap Generator to get a step-by-step plan for your startup." }
            ];

            function renderFAQs() {
                faqList.innerHTML = '';
                GROWGENIE_FAQS.forEach(faq => {
                    const item = document.createElement('div');
                    item.className = "bg-light-gray border-2 border-dark-black p-4 rounded-2xl cursor-pointer hover:bg-lime-green hover:shadow-[4px_4px_0_#191a23] transition-all font-bold text-sm";
                    item.textContent = faq.q;
                    item.onclick = () => handleQuestionClick(faq);
                    faqList.appendChild(item);
                });
            }

            function addMessage(text, isUser = false) {
                const msg = document.createElement('div');
                msg.className = isUser
                    ? "bg-lime-green text-dark-black border-2 border-dark-black rounded-[30px] rounded-tr-none p-6 font-bold max-w-[85%] ml-auto shadow-[6px_6px_0_#191a23] transform transition-all duration-300 scale-95 animate-[popIn_0.3s_ease_forwards]"
                    : "bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-6 text-dark-black font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66] transform transition-all duration-300 scale-95 animate-[popIn_0.3s_ease_forwards]";
                msg.textContent = text;
                chatBox.appendChild(msg);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            function showTypingIndicator(callback) {
                const typing = document.createElement('div');
                typing.className = "bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-6 text-gray-400 italic font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66] animate-pulse";
                typing.textContent = "Genie is typing…";
                chatBox.appendChild(typing);
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(() => { typing.remove(); callback(); }, 800);
            }

            function handleQuestionClick(faq) {
                addMessage(faq.q, true);
                showTypingIndicator(() => {
                    addMessage(faq.answer, false);
                    speakResponse(faq.answer);
                });
            }

            // ── Groq AI Chat ─────────────────────────────────────────────────
            async function askGroq(question) {
                const formData = new URLSearchParams();
                formData.append('question', question);
                try {
                    const res  = await fetch('api/ai_chat.php', { method: 'POST', body: formData });
                    const data = await res.json();
                    return data.status === 'success' ? data.answer
                         : "Genie is momentarily unavailable. Please try again!";
                } catch {
                    return "Network error. Please check your connection and try again.";
                }
            }

            async function sendMessage(question) {
                if (!question.trim()) return;
                addMessage(question, true);
                chatInput.value = '';

                // Check local FAQs first for instant response
                const lower = question.toLowerCase();
                const local = GROWGENIE_FAQS.find(f => f.keywords.some(k => lower.includes(k)));

                showTypingIndicator(async () => {
                    const answer = local ? local.answer : await askGroq(question);
                    addMessage(answer, false);
                    speakResponse(answer);
                });
            }

            chatForm.addEventListener('submit', e => {
                e.preventDefault();
                sendMessage(chatInput.value);
            });

            // ── Text-to-Speech ───────────────────────────────────────────────
            function speakResponse(text) {
                if (!('speechSynthesis' in window)) return;
                window.speechSynthesis.cancel(); // stop any ongoing speech
                const utt  = new SpeechSynthesisUtterance(text);
                utt.rate   = 1;
                utt.pitch  = 1;
                utt.volume = 1;
                // Prefer a natural English voice if available
                const voices = window.speechSynthesis.getVoices();
                const preferred = voices.find(v => v.lang.startsWith('en') && v.localService);
                if (preferred) utt.voice = preferred;
                window.speechSynthesis.speak(utt);
            }

            // ── Speech-to-Text (Mic) ─────────────────────────────────────────
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-IN';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                let isListening = false;

                micBtn.addEventListener('click', () => {
                    if (isListening) {
                        recognition.stop();
                        return;
                    }
                    recognition.start();
                });

                recognition.onstart = () => {
                    isListening = true;
                    micIcon.textContent = '🔴';
                    micBtn.classList.add('bg-lime-green');
                    listening.classList.remove('hidden');
                    listening.classList.add('flex');
                };

                recognition.onend = () => {
                    isListening = false;
                    micIcon.textContent = '🎤';
                    micBtn.classList.remove('bg-lime-green');
                    listening.classList.add('hidden');
                    listening.classList.remove('flex');
                };

                recognition.onresult = e => {
                    const transcript = e.results[0][0].transcript;
                    chatInput.value  = transcript;
                    sendMessage(transcript);
                };

                recognition.onerror = e => {
                    recognition.stop();
                    if (e.error === 'not-allowed') {
                        alert('Microphone permission denied. Please allow mic access in your browser settings.');
                    } else if (e.error === 'no-speech') {
                        addMessage("I didn't hear anything — please try again! 🎤", false);
                    } else {
                        addMessage("Voice recognition error: " + e.error, false);
                    }
                };

            } else {
                // Browser doesn't support Speech Recognition
                micBtn.title = 'Voice input not supported in this browser';
                micBtn.disabled = true;
                micBtn.classList.add('opacity-40', 'cursor-not-allowed');
            }

            renderFAQs();
        });
    </script>
</body>
</html>
