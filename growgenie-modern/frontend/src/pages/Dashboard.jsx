import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalGenerations: 0, invoicesSent: 0, catalogItems: 0, faqEntries: 0 });
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);

    api.get('/dashboard/stats')
      .then(res => {
        if (res.data.status === 'success') {
          setStats(res.data.data);
        }
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, [navigate]);

  return (
    <div className={`bg-white text-dark-black min-h-screen flex ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      <Sidebar userName={user?.name} userObj={user} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 ml-0 lg:ml-[260px] p-8 md:p-12 min-h-screen relative overflow-x-hidden transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle mr-6 lg:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, <span>{user?.name || 'User'}</span> 👋</h2>
                    <p className="text-xl text-gray-600 font-medium">Your Genie business dashboard</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 border-2 border-dark-black rounded-full px-6 py-2 shadow-[4px_4px_0_#191a23] bg-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-green border border-dark-black inline-block"></span>
                    <span className="text-sm font-black uppercase tracking-wider text-dark-black">{user?.subscriptionStatus || 'FREE TRIAL'}</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="card-positivus relative group">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Products</p>
                <h3 className="text-4xl font-bold text-dark-black">{stats.catalogItems}</h3>
                <div className="mt-4 inline-block badge-lime font-bold text-xs px-2 py-1">Catalog items</div>
            </div>
            <div className="card-positivus relative group">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Genie Generations</p>
                <h3 className="text-4xl font-bold text-dark-black">{stats.totalGenerations}</h3>
                <div className="mt-4 inline-block badge-lime font-bold text-xs px-2 py-1">Total queries</div>
            </div>
            <div className="card-positivus relative group">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Invoices Sent</p>
                <h3 className="text-4xl font-bold text-dark-black">{stats.invoicesSent}</h3>
                <div className="mt-4 inline-block badge-lime font-bold text-xs px-2 py-1">GST-compliant</div>
            </div>
            <div className="card-positivus relative group">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">FAQ Entries</p>
                <h3 className="text-4xl font-bold text-dark-black">{stats.faqEntries}</h3>
                <div className="mt-4 inline-block badge-lime font-bold text-xs px-2 py-1">Knowledge base</div>
            </div>
        </div>

        <div className="section-heading flex-col md:flex-row items-start md:items-center">
            <span className="heading-tag">Genie Modules</span>
            <p className="heading-desc">Access your powerful business automation tools.</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {/* Genie Planner */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">🗺️</div>
                    <h4 className="text-2xl font-bold mb-3">Grow Genie Planner</h4>
                    <p className="text-gray-600 font-medium mb-8">Startup roadmap, strategy, ad copy & more</p>
                </div>
                <Link to="/planner" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>

            {/* Marketing */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">📣</div>
                    <h4 className="text-2xl font-bold mb-3">Marketing & Ads</h4>
                    <p className="text-gray-600 font-medium mb-8">Ad copy, descriptions & multilingual campaigns</p>
                </div>
                <Link to="/marketing" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>

            {/* Invoice */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">📄</div>
                    <h4 className="text-2xl font-bold mb-3">Invoice Generator</h4>
                    <p className="text-gray-600 font-medium mb-8">GST-compliant PDF invoices for your business.</p>
                </div>
                <Link to="/invoices" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>

            {/* Product Catalog */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">📦</div>
                    <h4 className="text-2xl font-bold mb-3">Product Catalog</h4>
                    <p className="text-gray-600 font-medium mb-8">Full CRUD — manage your products & services</p>
                </div>
                <Link to="/products" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>

            {/* FAQ Bot */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">💬</div>
                    <h4 className="text-2xl font-bold mb-3">FAQ Bot</h4>
                    <p className="text-gray-600 font-medium mb-8">Train your bot — Genie handles queries 24/7</p>
                </div>
                <Link to="/faq" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>

            {/* Voice Assistant */}
            <div className="card-positivus flex flex-col justify-between group">
                <div>
                    <div className="w-16 h-16 bg-dark-black border-2 border-dark-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0_#b9ff66] text-3xl">🎙️</div>
                    <h4 className="text-2xl font-bold mb-3">Voice Assistant</h4>
                    <p className="text-gray-600 font-medium mb-8">Voice-based queries and command support</p>
                </div>
                <Link to="/voice-assistant" className="btn-positivus w-full transition">
                    <span>Open Module</span> <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>
        </div>

        {/* Plan Section */}
        <div className="card-positivus flex flex-col md:flex-row justify-between items-center p-12 bg-white">
            <div>
                <h3 className="text-3xl font-bold mb-4">Your Subscription Plan</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <span className="badge-lime text-lg font-bold bg-white px-6 py-2 border-2 border-dark-black rounded-xl uppercase tracking-wider shadow-[4px_4px_0_#191a23]">{user?.subscriptionStatus || 'FREE TRIAL'}</span>
                    <p className="text-gray-600 font-bold text-lg">Valid until ...</p>
                </div>
            </div>
            <button className="mt-8 md:mt-0 btn-positivus text-xl px-12 py-5 shadow-[8px_8px_0_#b9ff66] border-2 border-dark-black hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                <span>Upgrade Now</span> <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
        </div>

      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-dark-black/50 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default Dashboard;
