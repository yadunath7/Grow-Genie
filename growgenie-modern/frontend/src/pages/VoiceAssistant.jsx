import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    { role: 'Genie', text: "Hello! I am Genie, your voice assistant. Click the microphone below and say something like 'How do I scale my business?' or 'How do I generate invoices?'." }
  ]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Configure Web Speech API Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setListening(true);
        setTranscript('Listening...');
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error", e);
        setListening(false);
        setTranscript('Error capturing voice. Try again.');
      };

      rec.onend = () => {
        setListening(false);
      };

      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        handleSendQuestion(text);
      };

      recognitionRef.current = rec;
    } else {
      setTranscript('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
        setSpeaking(false);
      }
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  const handleSendQuestion = async (questionText) => {
    if (!questionText || questionText.trim() === 'Listening...' || questionText.trim() === '') return;

    setMessages(prev => [...prev, { role: 'You', text: questionText, isUser: true }]);
    
    try {
      const res = await api.post('/faq/chat', { question: questionText });
      if (res.data.status === 'success') {
        const answer = res.data.answer;
        setMessages(prev => [...prev, { role: 'Genie', text: answer }]);
        speakAnswer(answer);
      } else {
        setMessages(prev => [...prev, { role: 'Genie', text: "Sorry, I had trouble processing that request." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'Genie', text: "Failed to connect to the backend server." }]);
    }
  };

  const speakAnswer = (text) => {
    if (!synthRef.current) return;
    
    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Pick a nicer system voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Google'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    synthRef.current.speak(utterance);
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 flex flex-col min-h-screen">
        <header className="mb-8">
          <h2 className="text-5xl font-black mb-2 uppercase tracking-tight text-[#191a23]">Voice Assistant</h2>
          <p className="text-xl text-gray-600 font-medium italic">Speak directly to Genie for real-time consulting advice</p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch mb-6">
          {/* Conversational logs */}
          <div className="lg:col-span-2 card-positivus bg-[#f3f3f3] flex flex-col h-[550px] shadow-[8px_8px_0_#191a23]">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Assistant Log</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar bg-white rounded-3xl p-6 border-2 border-dark-black">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border-2 border-dark-black rounded-2xl shadow-[2px_2px_0_#191a23] max-w-[85%] ${
                    m.isUser ? 'bg-black text-white ml-auto' : 'bg-[#f3f3f3] text-black'
                  }`}
                >
                  <p className="text-xs font-black uppercase opacity-60 mb-1">{m.role}</p>
                  <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>
          </div>

          {/* Voice Interface Controls */}
          <div className="card-positivus bg-black text-white flex flex-col justify-between items-center text-center p-10 h-[550px]">
            <div>
              <span className="inline-block bg-[#191a23] text-[#b9ff66] text-[10px] font-black px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-widest mb-6">
                VOICE CONTROL
              </span>
              <h3 className="text-3xl font-black uppercase text-[#b9ff66] tracking-tighter mb-4">Genie Voice</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                Press the mic button, speak, and let Genie solve your business obstacles out loud.
              </p>
            </div>

            {/* Glowing Microphone Visualizer */}
            <div className="relative my-8">
              {(listening || speaking) && (
                <div className="absolute inset-0 bg-[#b9ff66]/30 rounded-full scale-150 animate-ping"></div>
              )}
              <button 
                onClick={handleMicClick}
                className={`w-28 h-28 rounded-full border-4 border-white flex items-center justify-center text-5xl shadow-[0_6px_0_rgba(255,255,255,0.2)] active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                  listening ? 'bg-red-500' : speaking ? 'bg-[#b9ff66] text-black' : 'bg-[#191a23] text-white hover:bg-white/10'
                }`}
              >
                {listening ? '🎙️' : '🎤'}
              </button>
            </div>

            <div className="w-full">
              <p className="text-xs uppercase font-black tracking-widest text-[#b9ff66] mb-2">Speech Feed</p>
              <p className="text-sm font-bold text-gray-300 italic min-h-[40px] px-4">
                "{transcript || 'Waiting to start...'}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceAssistant;
