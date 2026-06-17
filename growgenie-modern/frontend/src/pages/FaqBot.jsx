import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const FaqBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Genie assistant. You can ask me anything about startup growth, marketing, or business planning!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  const GROWGENIE_FAQS = [
    { q: "What is GrowGenie?", answer: "GrowGenie is a startup assistant platform that helps users turn ideas into real businesses." },
    { q: "How does it help startups?", answer: "It provides roadmap generation, marketing strategies, and business setup guidance." },
    { q: "Is it free or paid?", answer: "GrowGenie offers a 5-day free trial, after which users can upgrade to premium." },
    { q: "Can I generate invoices?", answer: "Absolutely! You can generate GST-compliant PDF invoices with your own company branding." }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { text: query, isUser: true }]);
    setInput('');
    setIsTyping(true);

    // Check local FAQs first
    const local = GROWGENIE_FAQS.find(f => query.toLowerCase().includes(f.q.toLowerCase().split(' ').slice(-1)[0]));
    
    try {
      let answer;
      if (local) {
        answer = local.answer;
      } else {
        const res = await api.post('/faq/chat', { question: query });
        answer = res.data.answer;
      }
      
      setMessages(prev => [...prev, { text: answer, isUser: false }]);
      speak(answer);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Genie is momentarily unavailable. Please try again!", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => handleSend(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12">
           <h2 className="text-5xl font-black mb-2 uppercase tracking-tight">Genie FAQ Bot</h2>
           <p className="text-xl text-gray-600 font-medium italic">Your 24/7 AI-powered business assistant</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Knowledge Base Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white border-2 border-[#191a23] rounded-[45px] p-8 shadow-[8px_8px_0_#191a23]">
                <h3 className="text-2xl font-black uppercase mb-6 tracking-tight">Common Questions</h3>
                <div className="space-y-4">
                  {GROWGENIE_FAQS.map((faq, i) => (
                    <button key={i} onClick={() => handleSend(faq.q)} className="w-full text-left bg-[#f3f3f3] border-2 border-[#191a23] p-4 rounded-2xl font-bold text-sm hover:bg-[#b9ff66] transition-all">
                      {faq.q}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-[#191a23] rounded-[45px] p-8 h-[700px] flex flex-col shadow-[12px_12px_0_#191a23]">
              <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[30px] font-bold border-2 border-[#191a23] shadow-[6px_6px_0_#191a23] ${msg.isUser ? 'bg-[#b9ff66] rounded-tr-none' : 'bg-white rounded-tl-none shadow-[6px_6px_0_#b9ff66]'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                   <div className="flex justify-start">
                     <div className="bg-white border-2 border-[#191a23] rounded-[30px] rounded-tl-none p-4 text-gray-400 italic font-bold animate-pulse">
                        Genie is thinking...
                     </div>
                   </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-4 items-center">
                 <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-white border-2 border-[#191a23] rounded-3xl px-8 py-5 text-xl font-bold focus:shadow-[6px_6px_0_#b9ff66] outline-none transition-all" 
                  placeholder="Type your question..." 
                 />
                 <button type="button" onClick={startListening} className={`p-5 rounded-3xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white'}`}>
                   <span className="text-2xl">{isListening ? '🔴' : '🎤'}</span>
                 </button>
                 <button type="submit" className="bg-[#b9ff66] border-2 border-[#191a23] p-5 px-8 rounded-3xl shadow-[6px_6px_0_#191a23] hover:translate-y-[-2px] transition-all">
                   <span className="text-2xl">➔</span>
                 </button>
              </form>
              {isListening && <p className="text-center mt-2 text-red-500 font-bold animate-pulse">Listening...</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqBot;
