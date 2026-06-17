import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const Progress = () => {
  const [sales, setSales] = useState({ current: 0, goal: 100000, percent: 0 });
  const [learning, setLearning] = useState({ current: 0, goal: 20, percent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/user-progress');
      if (res.data.status === 'success') {
        setSales(res.data.sales);
        setLearning(res.data.learning);
      }
    } catch (err) {
      console.error("Failed to load progress data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />

      <main className="flex-1 ml-64 p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black mb-2 uppercase tracking-tight text-[#191a23]">Startup Progress</h2>
          <p className="text-xl text-gray-600 font-medium italic">Track your business execution progress and educational achievements</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-[#b9ff66] border-t-black rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-black uppercase text-gray-500 animate-pulse">Loading execution stats...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Sales Goal Card */}
              <div className="card-positivus bg-[#f3f3f3] flex flex-col justify-between h-[400px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="badge-lime mb-2">Revenue Milestones</span>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Sales Progress</h3>
                    </div>
                    <span className="text-5xl">💰</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                    Track invoices sent and paid. Reach the first landmark milestone of <b>₹1,00,000</b> in business volume.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-black text-xl">
                    <span>₹{parseFloat(sales.current).toLocaleString('en-IN')} / ₹{sales.goal.toLocaleString('en-IN')}</span>
                    <span className="text-[#191a23]">{sales.percent}%</span>
                  </div>
                  <div className="w-full bg-white h-6 rounded-full overflow-hidden border-2 border-dark-black shadow-[2px_2px_0_#191a23]">
                    <div 
                      className="bg-[#b9ff66] h-full border-r-2 border-dark-black transition-all duration-500" 
                      style={{ width: `${sales.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Learning / Roadmap Queries Card */}
              <div className="card-positivus bg-[#b9ff66] text-[#191a23] flex flex-col justify-between h-[400px] shadow-[8px_8px_0_#191a23]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="bg-black text-[#b9ff66] text-[10px] font-black px-3 py-1 rounded-md mb-2 uppercase inline-block">
                        AI CONSULTING
                      </span>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Roadmap Generations</h3>
                    </div>
                    <span className="text-5xl">🗺️</span>
                  </div>
                  <p className="font-bold opacity-80 mb-8 leading-relaxed">
                    Generate and customize execution roadmaps with the GrowGenie AI Planner. Aim for a target of <b>20 generated models</b> to lock in product market fit.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-black text-xl">
                    <span>{sales.current ? learning.current : 0} / {learning.goal} Queries</span>
                    <span>{learning.percent}%</span>
                  </div>
                  <div className="w-full bg-white h-6 rounded-full overflow-hidden border-2 border-dark-black shadow-[2px_2px_0_#191a23]">
                    <div 
                      className="bg-black h-full border-r-2 border-dark-black transition-all duration-500" 
                      style={{ width: `${learning.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Strategy / Execution Board */}
            <div className="card-positivus bg-[#191a23] text-white p-10">
              <h3 className="text-3xl font-black uppercase text-[#b9ff66] mb-4 tracking-tighter">Genie Milestones Guide</h3>
              <p className="text-gray-400 font-medium mb-8">Follow this systematic execution flow to scale your startup business model.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <MilestoneStep num="1" title="Generate Roadmap" desc="Brainstorm details and generate step-by-step roadmap." completed={learning.current > 0} />
                <MilestoneStep num="2" title="Catalog Platform" desc="Create products and platform items under marketplace." completed={learning.current > 2} />
                <MilestoneStep num="3" title="Send First Invoice" desc="Bill your clients and generate PDF invoices." completed={sales.current > 0} />
                <MilestoneStep num="4" title="Reach Goal" desc="Generate ₹1,00,000 in total sales revenue." completed={sales.percent >= 100} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MilestoneStep = ({ num, title, desc, completed }) => (
  <div className={`p-6 rounded-3xl border-2 shadow-[4px_4px_0_rgba(255,255,255,0.1)] transition-all ${
    completed ? 'bg-white text-black border-[#b9ff66]' : 'bg-transparent text-white border-white/20'
  }`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 ${
      completed ? 'bg-[#b9ff66] text-black' : 'bg-white/10 text-white'
    }`}>
      {completed ? '✓' : num}
    </div>
    <h4 className="text-xl font-black uppercase tracking-tighter mb-2">{title}</h4>
    <p className={`text-sm leading-relaxed ${completed ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
  </div>
);

export default Progress;
