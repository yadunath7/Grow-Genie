import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const campaignDetails = {
  meta_fb: { name: 'Meta Facebook Ads', icon: '📘', tip: 'For Meta Facebook Ads, focusing on high-quality UGC typically increases CTR by 40%.' },
  instagram: { name: 'Instagram Ads', icon: '📸', tip: 'Instagram Stories and Reels perform best with 9:16 vertical videos and direct CTA overlays.' },
  google: { name: 'Google Search Ads', icon: '🔍', tip: 'On Google, placing target keywords in headlines can boost quality score and reduce CPC by 15%.' },
  flyers: { name: 'Physical Flyers', icon: '📄', tip: 'Always include a tracking QR code with custom UTM parameters on printed flyers.' },
  billboards: { name: 'Billboard Ads', icon: '🏙️', tip: 'Keep billboard designs under 7 words. Use high-contrast color choices for highway readability.' },
  events: { name: 'Event Stalls', icon: '🎪', tip: 'Interactive demo kiosks or small live contests can double attendee engagement at trade shows.' }
};

const AdCampaign = () => {
  const { type } = useParams();
  const current = campaignDetails[type] || campaignDetails.meta_fb;

  const [prodTitle, setProdTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Genie Expert Chat States
  const [chatMessages, setChatMessages] = useState([]);
  const [expertQuery, setExpertQuery] = useState('');
  const [insight, setInsight] = useState('');
  const [fetchingInsight, setFetchingInsight] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Reset page states on platform type change
    setProdTitle('');
    setTargetAudience('');
    setUploadedFiles([]);
    setChatMessages([
      {
        role: 'Genie Expert',
        text: `I'm your ${current.name} specialist. Fill out the form to generate assets, or ask me anything about optimizing this campaign!`
      }
    ]);
    fetchMarketInsight();
  }, [type]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchMarketInsight = async () => {
    setFetchingInsight(true);
    try {
      const res = await api.get(`/market-insights?platform=${encodeURIComponent(current.name)}`);
      if (res.data.status === 'success' && res.data.insight) {
        setInsight(res.data.insight);
      } else {
        setInsight(current.tip);
      }
    } catch (err) {
      setInsight(current.tip);
    } finally {
      setFetchingInsight(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleAskExpert = async (e) => {
    e.preventDefault();
    if (!expertQuery.trim()) return;

    const userMsg = expertQuery.trim();
    setChatMessages((prev) => [...prev, { role: 'You', text: userMsg, isUser: true }]);
    setExpertQuery('');
    setSendingChat(true);

    try {
      // Query the general Genie FAQ chatbot (which maps to /api/faq/chat)
      // Pass the query question
      const res = await api.post('/faq/chat', { question: `Regarding ${current.name}: ${userMsg}` });
      if (res.data.status === 'success') {
        setChatMessages((prev) => [...prev, { role: 'Genie Expert', text: res.data.answer }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'Genie Expert', text: "Genie is offline. Please check connection." }]);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'Genie Expert', text: "Sorry, I couldn't connect to my AI server. Please try again." }]);
    } finally {
      setSendingChat(false);
    }
  };

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    if (!prodTitle) return;

    setChatMessages((prev) => [...prev, { role: 'System', text: `Generating advanced strategy for ${prodTitle}...` }]);

    setTimeout(() => {
      setChatMessages((prev) => [...prev, {
        role: 'Genie Expert',
        text: `Based on your target audience, here is your high-conversion strategy for <b>${prodTitle}</b> on ${current.name}:<br/><br/>
               <b>🚀 Creative Hook:</b> "Stop scrolling! If you care about business efficiency, ${prodTitle} is the only tool you need."<br/><br/>
               <b>📊 Ad Strategy:</b> Run targeting to location <b>"${targetAudience || 'Broad Audience'}"</b>. Start with a test budget of ₹500/day. Run 3 creatives split test for 48 hours to find the winner.`
      }]);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 min-h-screen relative overflow-x-hidden">
        <header className="flex items-center mb-12">
          <Link to="/marketing" className="mr-6 p-4 bg-white border-2 border-[#191a23] rounded-2xl hover:bg-[#f3f3f3] transition-all shadow-[4px_4px_0_#191a23] active:translate-x-1 active:translate-y-1 active:shadow-none">
            ← Back
          </Link>
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-4xl">{current.icon}</span>
              <h2 className="text-4xl font-black uppercase tracking-tight text-[#191a23]">{current.name}</h2>
            </div>
            <p className="text-xl text-gray-600 font-medium italic">Configure your high-converting marketing campaign</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Config Form Section */}
          <div className="card-positivus bg-[#f3f3f3]">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Campaign Configuration</h3>
            
            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <div>
                <label className="block font-black mb-2 uppercase text-sm">What are you promoting?</label>
                <input 
                  type="text" 
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  required 
                  className="input-positivus w-full"
                  placeholder="e.g. Aura Bottle v2" 
                />
              </div>

              <div>
                <label className="block font-black mb-2 uppercase text-sm">Target Audience / Geolocation</label>
                <input 
                  type="text" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="input-positivus w-full"
                  placeholder="e.g. Delhi, Mumbai, or specific demographics" 
                />
              </div>

              {/* UGC Upload Section */}
              <div className="pt-4">
                <label className="block font-black mb-4 uppercase text-sm">UGC Content (Videos/Posters)</label>
                <div 
                  className="border-2 border-dashed border-[#191a23] rounded-3xl p-8 bg-white hover:bg-[#b9ff66]/10 transition-all text-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                    multiple 
                    accept="image/*,video/*" 
                  />
                  <div className="w-14 h-14 bg-[#f3f3f3] border-2 border-[#191a23] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_#191a23] group-hover:bg-[#b9ff66] transition-all">
                    +
                  </div>
                  <p className="font-bold text-lg mb-1">Click to upload assets</p>
                  <p className="text-xs text-gray-400">MP4, MOV, JPG, or PNG (Max 50MB)</p>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {uploadedFiles.map((file, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#b9ff66] text-black border-2 border-black px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0_#191a23] flex items-center space-x-1"
                        >
                          <span>{file.type.startsWith('image/') ? '🖼️' : '🎥'}</span>
                          <span className="truncate max-w-[120px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="w-full btn-positivus bg-[#b9ff66] text-[#191a23] hover:bg-black hover:text-white py-5 text-xl font-bold shadow-[4px_4px_0_#191a23] active:translate-y-1 active:shadow-none transition-all">
                Create Campaign Plan
              </button>
            </form>
          </div>

          {/* Expert Bot Chat Panel */}
          <div className="space-y-8">
            <div className="card-positivus bg-[#b9ff66] flex flex-col h-[550px] shadow-[8px_8px_0_#191a23]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Genie Marketing Expert</h3>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black uppercase text-dark-black">Expert Online</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar bg-white rounded-3xl p-6 border-2 border-dark-black">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 border-2 border-dark-black rounded-2xl shadow-[2px_2px_0_#191a23] max-w-[90%] ${
                      msg.isUser 
                        ? 'bg-black text-white ml-auto' 
                        : msg.role === 'System'
                        ? 'bg-gray-100 text-gray-500 mx-auto text-center'
                        : 'bg-[#f3f3f3] text-black'
                    }`}
                  >
                    <p className="text-xs font-black uppercase opacity-60 mb-1">{msg.role}</p>
                    <p className="text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                  </div>
                ))}
                {sendingChat && (
                  <div className="bg-[#f3f3f3] border-2 border-dark-black rounded-2xl p-4 shadow-[2px_2px_0_#191a23] max-w-[90%]">
                    <p className="text-xs font-black uppercase opacity-60 mb-1">Genie Expert</p>
                    <span className="animate-pulse">Thinking... 🧞‍♂️</span>
                  </div>
                )}
                <div ref={chatEndRef}></div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskExpert} className="flex space-x-3 bg-white p-2 border-2 border-dark-black rounded-[2.5rem] shadow-[4px_4px_0_#191a23]">
                <input 
                  type="text" 
                  value={expertQuery}
                  onChange={(e) => setExpertQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 font-bold focus:outline-none text-sm" 
                  placeholder="Ask about targeting, pixel, budgets..."
                />
                <button 
                  type="submit" 
                  className="bg-black text-white p-3 rounded-full hover:bg-black/80 transition-all flex items-center justify-center w-10 h-10"
                >
                  ⚡
                </button>
              </form>
            </div>

            {/* Platform tip Card */}
            <div className="card-positivus bg-black text-white p-8">
              <h3 className="text-xl font-black uppercase text-[#b9ff66] mb-2 tracking-tighter">Market Insight 💡</h3>
              <p className="text-gray-300 font-medium text-sm leading-relaxed">
                {fetchingInsight ? (
                  <span className="animate-pulse">Genie is analyzing market trends...</span>
                ) : (
                  insight
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdCampaign;
