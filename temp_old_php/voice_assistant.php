<?php
session_start();
include 'api/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Assistant | GrowGenie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }
        @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(185,255,102,0.6); }
            70% { box-shadow: 0 0 0 20px rgba(185,255,102,0); }
            100% { box-shadow: 0 0 0 0 rgba(185,255,102,0); }
        }
        .mic-active { animation: pulseRing 1.2s ease-out infinite; }
        @keyframes wave { 0%,100%{height:8px} 50%{height:24px} }
        .wave-bar { width: 4px; border-radius: 4px; background: #b9ff66; animation: wave 0.6s ease-in-out infinite; }
        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.15s; }
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
                    <h2 class="text-5xl font-bold mb-2" data-i18n="voice_assistant">Genie Voice Assistant</h2>
                    <p class="text-xl text-gray-600 font-medium" data-i18n="voice_assistant_desc">Talk to Genie — ask anything about your business</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div id="voice-status-badge" class="flex items-center gap-2 border-2 border-dark-black rounded-full px-5 py-2 shadow-[4px_4px_0_#191a23] bg-white">
                    <span id="status-dot" class="w-2.5 h-2.5 rounded-full bg-gray-300 border border-dark-black inline-block"></span>
                    <span id="status-text" class="text-sm font-black uppercase tracking-wider">Ready</span>
                </div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Left: Chat Area -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Chat Area -->
                <div class="card-positivus flex flex-col bg-white" style="height: 600px;">
                    <div class="flex items-center justify-between mb-6 border-b-2 border-dark-black/10 pb-4">
                        <h3 class="text-2xl font-black uppercase tracking-tight" data-i18n="conversation">Conversation</h3>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-lime-green border border-dark-black"></span>
                            <span class="text-xs font-bold text-gray-400 uppercase">Groq AI</span>
                        </div>
                    </div>

                    <div id="chat-box" class="flex-1 bg-light-gray border-2 border-dark-black rounded-[40px] p-6 mb-4 overflow-y-auto space-y-4">
                        <!-- Welcome message -->
                        <div class="bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-5 text-dark-black font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66]">
                            Hey! 👋 I'm Genie, your AI voice assistant. Click the microphone or type a question to get started!
                        </div>
                    </div>

                    <!-- Input Bar -->
                    <form id="chat-form" class="flex items-center gap-3">
                        <input type="text" id="chat-input"
                            class="flex-1 bg-white border-2 border-dark-black rounded-3xl px-6 py-4 text-lg font-bold focus:shadow-[6px_6px_0_#b9ff66] focus:outline-none transition-all"
                            placeholder="Type or speak your question…" data-i18n-placeholder="voice_input_placeholder">

                        <!-- Send -->
                        <button type="submit" class="bg-lime-green border-2 border-dark-black px-6 py-4 rounded-3xl shadow-[4px_4px_0_#191a23] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <svg class="w-7 h-7 text-dark-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Mic + Voice Tips -->
            <div class="lg:col-span-1 space-y-8">
                <!-- Big Mic Button Area -->
                <div class="card-positivus bg-white flex flex-col items-center justify-center py-12">
                    <button id="mic-btn" type="button"
                        class="w-32 h-32 bg-dark-black border-4 border-dark-black rounded-full flex items-center justify-center text-5xl shadow-[8px_8px_0_#b9ff66] hover:bg-lime-green hover:text-dark-black transition-all duration-200 cursor-pointer select-none">
                        <span id="mic-icon">🎤</span>
                    </button>

                    <!-- Listening visual -->
                    <div id="listening-indicator" class="hidden mt-6 flex flex-col items-center gap-3">
                        <div class="flex items-end gap-1.5 h-10">
                            <div class="wave-bar w-1.5"></div>
                            <div class="wave-bar w-1.5"></div>
                            <div class="wave-bar w-1.5"></div>
                            <div class="wave-bar w-1.5"></div>
                            <div class="wave-bar w-1.5"></div>
                        </div>
                        <span class="text-sm font-bold text-gray-500">Listening… speak now</span>
                    </div>
                    <p id="mic-hint" class="mt-4 text-base font-bold text-gray-400">Tap to start talking</p>
                </div>

                <!-- Voice Tips -->
                <div class="card-positivus bg-light-gray">
                    <h4 class="text-xl font-black uppercase mb-4" data-i18n="voice_tips">Voice Tips</h4>
                    <ul class="space-y-4 text-base font-medium text-gray-600">
                        <li class="flex items-start gap-3"><span class="text-lime-green font-bold text-xl">•</span> Speak clearly in English or Hindi</li>
                        <li class="flex items-start gap-3"><span class="text-lime-green font-bold text-xl">•</span> Ask one question at a time</li>
                        <li class="flex items-start gap-3"><span class="text-lime-green font-bold text-xl">•</span> Genie will reply in text & voice</li>
                        <li class="flex items-start gap-3"><span class="text-lime-green font-bold text-xl">•</span> Click mic again to stop listening</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <script src="assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            renderSidebar('voice');
            const user = await checkAuth();
            if (!user) return;

            const chatBox   = document.getElementById('chat-box');
            const chatForm  = document.getElementById('chat-form');
            const chatInput = document.getElementById('chat-input');
            const micBtn    = document.getElementById('mic-btn');
            const micIcon   = document.getElementById('mic-icon');
            const micHint   = document.getElementById('mic-hint');
            const listenInd = document.getElementById('listening-indicator');
            const statusDot = document.getElementById('status-dot');
            const statusTxt = document.getElementById('status-text');

            // ── Chat Helpers ─────────────────────────────────────────────────
            function addMessage(text, isUser = false) {
                const msg = document.createElement('div');
                msg.className = isUser
                    ? "bg-lime-green text-dark-black border-2 border-dark-black rounded-[30px] rounded-tr-none p-5 font-bold max-w-[85%] ml-auto shadow-[6px_6px_0_#191a23] transform scale-95 animate-[popIn_0.3s_ease_forwards]"
                    : "bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-5 text-dark-black font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66] transform scale-95 animate-[popIn_0.3s_ease_forwards]";
                msg.textContent = text;
                chatBox.appendChild(msg);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            function showTyping() {
                const typing = document.createElement('div');
                typing.id = 'typing-ind';
                typing.className = "bg-white border-2 border-dark-black rounded-[30px] rounded-tl-none p-5 text-gray-400 italic font-bold max-w-[85%] shadow-[6px_6px_0_#b9ff66] animate-pulse";
                typing.textContent = "Genie is thinking…";
                chatBox.appendChild(typing);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            function hideTyping() {
                document.getElementById('typing-ind')?.remove();
            }

            function setStatus(state) {
                if (state === 'listening') {
                    statusDot.className = 'w-2.5 h-2.5 rounded-full bg-red-500 border border-dark-black inline-block animate-pulse';
                    statusTxt.textContent = 'Listening';
                } else if (state === 'thinking') {
                    statusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 border border-dark-black inline-block animate-pulse';
                    statusTxt.textContent = 'Thinking';
                } else if (state === 'speaking') {
                    statusDot.className = 'w-2.5 h-2.5 rounded-full bg-blue-500 border border-dark-black inline-block animate-pulse';
                    statusTxt.textContent = 'Speaking';
                } else {
                    statusDot.className = 'w-2.5 h-2.5 rounded-full bg-lime-green border border-dark-black inline-block';
                    statusTxt.textContent = 'Ready';
                }
            }

            // ── Groq AI ──────────────────────────────────────────────────────
            async function askGroq(question) {
                const fd = new URLSearchParams();
                fd.append('question', question);
                try {
                    const res  = await fetch('api/ai_chat.php', { method: 'POST', body: fd });
                    const data = await res.json();
                    return data.status === 'success' ? data.answer
                         : "Genie is momentarily unavailable. Please try again!";
                } catch {
                    return "Network error. Check your connection and try again.";
                }
            }

            async function sendMessage(question) {
                if (!question.trim()) return;
                addMessage(question, true);
                chatInput.value = '';
                showTyping();
                setStatus('thinking');

                const answer = await askGroq(question);

                hideTyping();
                addMessage(answer, false);
                setStatus('speaking');
                speakResponse(answer, () => setStatus('ready'));
            }

            chatForm.addEventListener('submit', e => {
                e.preventDefault();
                sendMessage(chatInput.value);
            });

            // ── Text-to-Speech ───────────────────────────────────────────────
            function speakResponse(text, onEnd) {
                if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
                window.speechSynthesis.cancel();
                const utt  = new SpeechSynthesisUtterance(text);
                utt.rate   = 1;
                utt.pitch  = 1;
                utt.volume = 1;
                const voices = window.speechSynthesis.getVoices();
                const pref = voices.find(v => v.lang.startsWith('en') && v.localService);
                if (pref) utt.voice = pref;
                utt.onend = () => { if (onEnd) onEnd(); };
                window.speechSynthesis.speak(utt);
            }

            // ── Speech-to-Text ───────────────────────────────────────────────
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SR) {
                const recognition = new SR();
                recognition.lang = 'en-IN';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                let isListening = false;

                micBtn.addEventListener('click', () => {
                    if (isListening) { recognition.stop(); return; }
                    window.speechSynthesis.cancel(); // stop any ongoing speech
                    recognition.start();
                });

                recognition.onstart = () => {
                    isListening = true;
                    micIcon.textContent = '🔴';
                    micBtn.classList.add('mic-active', 'bg-lime-green');
                    micBtn.classList.remove('bg-dark-black');
                    listenInd.classList.remove('hidden');
                    listenInd.classList.add('flex');
                    micHint.textContent = 'Tap to stop';
                    setStatus('listening');
                };

                recognition.onend = () => {
                    isListening = false;
                    micIcon.textContent = '🎤';
                    micBtn.classList.remove('mic-active', 'bg-lime-green');
                    micBtn.classList.add('bg-dark-black');
                    listenInd.classList.add('hidden');
                    listenInd.classList.remove('flex');
                    micHint.textContent = 'Tap to start talking';
                    setStatus('ready');
                };

                recognition.onresult = e => {
                    const transcript = e.results[0][0].transcript;
                    chatInput.value = transcript;
                    sendMessage(transcript);
                };

                recognition.onerror = e => {
                    recognition.stop();
                    if (e.error === 'not-allowed') {
                        alert('Microphone permission denied. Please allow mic access in your browser settings.');
                    } else if (e.error === 'no-speech') {
                        addMessage("I didn't hear anything — please try again! 🎤", false);
                    } else {
                        addMessage("Voice error: " + e.error, false);
                    }
                };
            } else {
                micBtn.title = 'Voice input not supported in this browser';
                micBtn.disabled = true;
                micBtn.classList.add('opacity-40', 'cursor-not-allowed');
                micHint.textContent = 'Voice not supported';
            }
        });
    </script>
</body>
</html>
