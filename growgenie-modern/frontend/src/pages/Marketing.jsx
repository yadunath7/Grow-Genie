import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const Marketing = () => {
  const [product, setProduct] = useState('');
  const [budget, setBudget] = useState('');
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!product || !budget) {
      alert("Please enter both product and budget.");
      return;
    }

    setLoading(true);
    setError('');
    setStrategy(null);

    try {
      const res = await api.post('/marketing/strategy', { product, budget });
      if (res.data.status === 'success') {
        setStrategy(res.data.data);
      } else {
        setError(res.data.message || 'Strategy generation failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI service.');
    } finally {
      setLoading(false);
    }
  };

  const getChannelEmoji = (channel) => {
    const c = channel.toLowerCase();
    if (c.includes('fb') || c.includes('facebook')) return '📘';
    if (c.includes('insta')) return '📸';
    if (c.includes('google')) return '🔍';
    if (c.includes('flyer')) return '📄';
    if (c.includes('billboard')) return '🏙️';
    if (c.includes('event')) return '🎪';
    return '📢';
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black mb-2 uppercase tracking-tight text-[#191a23]">Marketing Command Center</h2>
          <p className="text-xl text-gray-600 font-medium italic">Get a custom strategy or launch high-converting campaigns</p>
        </header>

        {/* AI Strategist Card */}
        <div className="card-positivus bg-[#b9ff66] text-[#191a23] mb-16 relative overflow-hidden shadow-[8px_8px_0_#191a23]">
          <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
            <span className="text-[12rem] leading-none">🧞‍♂️</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-white text-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0_#191a23]">
                🧞‍♂️
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase">Genie Marketing Strategist</h3>
                <p className="font-bold opacity-70 uppercase tracking-wide">Tell Genie your budget, get a marketing roadmap</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div>
                <label className="block font-black mb-3 text-dark-black uppercase text-sm">Your Product/Service</label>
                <input 
                  type="text" 
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full bg-white border-2 border-dark-black rounded-2xl p-4 text-dark-black font-bold focus:shadow-[4px_4px_0_#191a23] focus:outline-none transition-all" 
                  placeholder="e.g. Organic Tea" 
                />
              </div>
              <div>
                <label className="block font-black mb-3 text-dark-black uppercase text-sm">Monthly Budget (INR)</label>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white border-2 border-dark-black rounded-2xl p-4 text-dark-black font-bold focus:shadow-[4px_4px_0_#191a23] focus:outline-none transition-all" 
                  placeholder="e.g. 10000" 
                />
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-white hover:text-black py-5 text-xl font-bold border-2 border-black rounded-2xl shadow-[6px_6px_0_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Generate My Strategy
                </button>
              </div>
            </form>

            {loading && (
              <div className="mt-10 p-8 bg-white border-2 border-dark-black rounded-[40px] shadow-[4px_4px_0_#191a23] flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-[#b9ff66] border-t-black rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-black uppercase tracking-widest text-[#191a23] animate-pulse">🧞‍♂️ Genie is crafting your market domination plan...</p>
              </div>
            )}

            {error && (
              <div className="mt-10 p-8 bg-white border-2 border-dark-black rounded-[40px] shadow-[4px_4px_0_#191a23] text-center text-red-500 font-bold">
                {error}
              </div>
            )}

            {strategy && (
              <div className="mt-10 p-8 bg-white border-2 border-dark-black rounded-[40px] text-black shadow-[4px_4px_0_#191a23] space-y-12">
                <div className="border-b-4 border-dark-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h4 className="text-4xl font-black uppercase tracking-tighter text-dark-black leading-none mb-2">{strategy.plan_title || 'Strategy Blueprint'}</h4>
                    <p className="text-xl font-bold text-gray-400">Genie Analysis for <span className="text-dark-black">{product}</span> | ₹{parseFloat(budget).toLocaleString()}/mo</p>
                  </div>
                  <div className="badge-lime px-6 py-2 border-2 border-dark-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0_#000]">High Potential ROI</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#191a23]">
                  {/* Column 1: Core Strategy & Budget Allocation */}
                  <div className="space-y-10">
                    <div>
                      <h5 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Core Approach</h5>
                      <div className="space-y-6">
                        <div>
                          <h6 className="font-black uppercase mb-1 flex items-center"><span className="mr-2">🌐</span> Online Strategy</h6>
                          <p className="text-gray-700 font-medium text-sm leading-relaxed">{strategy.online_strategy}</p>
                        </div>
                        <div>
                          <h6 className="font-black uppercase mb-1 flex items-center"><span className="mr-2">🏛️</span> Offline Strategy</h6>
                          <p className="text-gray-700 font-medium text-sm leading-relaxed">{strategy.offline_strategy}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Budget Split</h5>
                      <div className="space-y-4">
                        {strategy.allocation && Object.entries(strategy.allocation).map(([platform, percent]) => (
                          <div key={platform} className="space-y-1">
                            <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-gray-500">
                              <span>{platform}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-[#f3f3f3] h-2 rounded-full overflow-hidden border border-dark-black">
                              <div className="bg-[#b9ff66] h-full" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Campaigns */}
                  <div>
                    <h5 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-6">High-Impact Campaigns</h5>
                    <div className="space-y-4">
                      {strategy.top_campaigns && strategy.top_campaigns.map((c, i) => (
                        <div key={i} className="bg-white border-2 border-dark-black p-5 rounded-2xl shadow-[4px_4px_0_#191a23]">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase bg-dark-black text-white px-2 py-1 rounded-md">{c.channel}</span>
                            <div className="w-2 h-2 rounded-full bg-[#b9ff66]"></div>
                          </div>
                          <h6 className="font-black text-lg uppercase leading-tight mb-2">{c.name}</h6>
                          <p className="text-sm font-bold text-gray-600 italic">"{c.hook}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Step-by-Step Execution */}
                  <div>
                    <div className="card-positivus bg-[#191a23] text-white p-8 rounded-[40px] shadow-[8px_8px_0_#b9ff66] h-full">
                      <h5 className="text-2xl font-black uppercase mb-8 text-[#b9ff66] tracking-tighter border-b border-white/20 pb-4">Genie's Execution</h5>
                      <div className="space-y-6">
                        {strategy.step_by_step && strategy.step_by_step.map((step, i) => (
                          <div key={i} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-dark-black flex items-center justify-center font-black text-sm border-2 border-[#b9ff66]">
                              {i + 1}
                            </div>
                            <p className="flex-1 text-gray-300 font-bold leading-tight text-sm pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Marketing Channels */}
        <div className="mb-12">
          <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-[#b9ff66] inline-block mb-8">Launch Ad Channels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChannelLink type="meta_fb" name="Meta Facebook Ads" desc="Target billions with precise demographic and behavioral ads" icon="📘" />
            <ChannelLink type="instagram" name="Instagram Ads" desc="Visual storytelling and video UGC for younger audiences" icon="📸" />
            <ChannelLink type="google" name="Google Search Ads" desc="Appear instantly when people search keywords for your product" icon="🔍" />
            <ChannelLink type="flyers" name="Physical Flyers" desc="Cost-effective local physical distribution in high-traffic areas" icon="📄" />
            <ChannelLink type="billboards" name="Billboard Advertising" desc="High-impact traditional brand awareness in prime city locations" icon="🏙️" />
            <ChannelLink type="events" name="Event Stalls" desc="Direct hands-on consumer interaction at exhibitions and trade fairs" icon="🎪" />
          </div>
        </div>

        {/* WhatsApp Contact */}
        <div className="card-positivus bg-[#191a23] text-white mt-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-25 transform group-hover:scale-110 transition-transform hidden md:block">
            <span className="text-9xl">💬</span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Expert Managed Marketing</h3>
              <p className="text-lg text-gray-300 font-medium">Want our team to handle everything? From full-scale Meta campaigns to bulk billboard bookings—we've got you covered.</p>
            </div>
            
            <a 
              href="https://wa.me/918292586501?text=Hi%20I%20need%20help%20with%20GrowGenie" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-positivus bg-white text-black font-black px-10 py-5 text-xl border-none shadow-[6px_6px_0_#b9ff66] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Contact Marketing Team
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

const ChannelLink = ({ type, name, desc, icon }) => (
  <Link to={`/marketing/campaign/${type}`} className="card-positivus bg-[#f3f3f3] hover:bg-white hover:shadow-[8px_8px_0_#191a23] transition-all group flex justify-between items-center cursor-pointer">
    <div className="flex items-center space-x-6">
      <div className="w-16 h-16 bg-white border-2 border-dark-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0_#191a23]">
        {icon}
      </div>
      <div>
        <h4 className="text-2xl font-black">{name}</h4>
        <p className="text-gray-600 font-medium text-sm mt-1">{desc}</p>
      </div>
    </div>
    <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
  </Link>
);

export default Marketing;
