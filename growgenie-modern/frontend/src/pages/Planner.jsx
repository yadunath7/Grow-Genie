import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [activeMonth, setActiveMonth] = useState('Month 1');
  const [formData, setFormData] = useState({ ideaName: '', startupIdea: '', category: 'Service', budget: '', language: 'English' });
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/planner/history');
      setHistory(res.data.data);
    } catch (err) { console.error("History fetch failed", err); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/planner/generate', formData);
      const generatedPlan = JSON.parse(res.data.data);
      setPlan(generatedPlan);
      setActiveTab('roadmap');
      fetchHistory();
    } catch (err) {
      alert("Generation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (h) => {
    setPlan(JSON.parse(h.roadmap));
    setActiveTab('roadmap');
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 flex flex-col space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <TabButton id="roadmap" label="🗺️ Roadmap" active={activeTab} onClick={setActiveTab} />
          <TabButton id="strategy" label="📊 Market Strategy" active={activeTab} onClick={setActiveTab} />
          <TabButton id="ad_copy" label="📢 Ad Copy" active={activeTab} onClick={setActiveTab} />
          <TabButton id="product_desc" label="📝 Product Desc" active={activeTab} onClick={setActiveTab} />
          <TabButton id="history" label="🕐 History" active={activeTab} onClick={setActiveTab} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Form */}
          <div className="card-positivus bg-white border-2 border-[#191a23] rounded-[45px] p-10 shadow-[8px_8px_0_#191a23]">
            <h3 className="text-3xl font-black uppercase mb-8">Startup Details</h3>
            <form onSubmit={handleGenerate} className="space-y-6">
              <Input label="Startup Name" value={formData.ideaName} onChange={v => setFormData({...formData, ideaName: v})} placeholder="e.g. Aura Bottles" />
              <Textarea label="Startup Idea" value={formData.startupIdea} onChange={v => setFormData({...formData, startupIdea: v})} placeholder="Describe what your business does..." />
              
              <div className="grid grid-cols-2 gap-6">
                <Select label="Category" value={formData.category} onChange={v => setFormData({...formData, category: v})} options={['Service', 'Product', 'SaaS', 'E-commerce', 'Food']} />
                <Input label="Budget (INR)" type="number" value={formData.budget} onChange={v => setFormData({...formData, budget: v})} placeholder="e.g. 50000" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#b9ff66] text-[#191a23] font-bold py-5 rounded-2xl border-2 border-[#191a23] shadow-[6px_6px_0_#191a23] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
                {loading ? 'Genie is thinking... 🧞' : 'Generate Roadmap 🚀'}
              </button>
            </form>
          </div>

          {/* Right: Results / History */}
          <div className="min-h-[600px]">
            {activeTab === 'history' ? (
              <div className="space-y-4">
                {history.map(h => (
                  <div key={h.id} onClick={() => loadFromHistory(h)} className="p-6 bg-white border-2 border-[#191a23] rounded-3xl cursor-pointer hover:bg-[#b9ff66] transition-all shadow-[4px_4px_0_#191a23]">
                    <h4 className="font-bold text-xl">{h.ideaName}</h4>
                    <p className="text-sm text-gray-500 uppercase font-black">{h.category} • {new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : plan ? (
              <div className="fade-in bg-[#b9ff66] p-1 rounded-[40px] shadow-[10px_10px_0_#191a23]">
                <div className="bg-white rounded-[38px] p-10 min-h-[600px] border-4 border-[#191a23]">
                  {activeTab === 'roadmap' && (
                    <>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {Object.keys(plan.roadmap).map(m => (
                          <button key={m} onClick={() => setActiveMonth(m)} className={`px-4 py-2 rounded-xl font-bold border-2 border-[#191a23] transition-all ${activeMonth === m ? 'bg-[#b9ff66] shadow-[4px_4px_0_#191a23]' : 'bg-white'}`}>
                            {m.split(':')[0]}
                          </button>
                        ))}
                      </div>
                      <div className="prose prose-lg max-w-none">
                        <h4 className="text-2xl font-black mb-4 uppercase">{activeMonth}</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{plan.roadmap[activeMonth]}</p>
                      </div>
                    </>
                  )}
                  {activeTab === 'strategy' && <ContentDisplay title="Market Strategy" content={plan.market_strategy} />}
                  {activeTab === 'ad_copy' && (
                    <div className="space-y-6">
                      <AdCopyBlock platform="Facebook" content={plan.ad_copy.facebook} />
                      <AdCopyBlock platform="Instagram" content={plan.ad_copy.instagram} />
                      <AdCopyBlock platform="Google" content={plan.ad_copy.google} />
                    </div>
                  )}
                  {activeTab === 'product_desc' && <ContentDisplay title="Product Description" content={plan.product_desc} />}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <div className="text-8xl mb-6">🧞</div>
                <p className="text-xl font-bold">Fill the form to generate your business engine</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ id, label, active, onClick }) => (
  <button onClick={() => onClick(id)} className={`px-6 py-3 rounded-2xl border-2 border-[#191a23] font-bold transition-all ${active === id ? 'bg-[#b9ff66] shadow-[4px_4px_0_#191a23]' : 'bg-white hover:bg-gray-50'}`}>
    {label}
  </button>
);

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-black uppercase mb-2 text-[#191a23]">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white border-2 border-[#191a23] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b9ff66]" placeholder={placeholder} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-black uppercase mb-2 text-[#191a23]">{label}</label>
    <textarea rows="4" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white border-2 border-[#191a23] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b9ff66]" placeholder={placeholder} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-black uppercase mb-2 text-[#191a23]">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white border-2 border-[#191a23] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b9ff66] appearance-none">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ContentDisplay = ({ title, content }) => (
  <div className="prose prose-lg max-w-none">
    <h4 className="text-2xl font-black mb-6 uppercase border-b-4 border-[#b9ff66] inline-block">{title}</h4>
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
  </div>
);

const AdCopyBlock = ({ platform, content }) => (
  <div className="p-6 border-2 border-[#191a23] rounded-3xl bg-gray-50 shadow-[4px_4px_0_#191a23]">
    <h5 className="font-black text-[#191a23] mb-2 uppercase tracking-widest text-xs">{platform} Ad Copy</h5>
    <p className="text-gray-700 font-medium whitespace-pre-line">{content}</p>
  </div>
);

export default Planner;
