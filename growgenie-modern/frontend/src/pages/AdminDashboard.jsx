import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalIdeas: 0, premiumUsers: 0, totalProfit: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== 'admin@growgenie.com') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      console.error("Admin fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-bold">Loading Admin Center...</div>;

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      {/* Admin Sidebar */}
      <div className="w-64 h-screen fixed top-0 left-0 flex flex-col p-6 border-r-4 border-[#191a23] bg-white">
        <div className="flex items-center mb-12">
           <div className="w-10 h-10 bg-[#b9ff66] border-2 border-[#191a23] flex items-center justify-center font-black">GG</div>
           <h1 className="ml-3 text-2xl font-black uppercase tracking-tighter">Admin</h1>
        </div>
        <nav className="flex-1 space-y-4">
          <AdminNavItem label="Dashboard" active />
          <AdminNavItem label="Users" />
          <AdminNavItem label="Subscriptions" />
          <AdminNavItem label="Products" />
        </nav>
        <button onClick={() => navigate('/dashboard')} className="mt-auto p-4 font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all">
          Exit Admin
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tight">System Overview</h2>
            <p className="text-xl text-gray-600 font-medium italic">Manage GrowGenie platform performance.</p>
          </div>
          <div className="bg-white border-2 border-[#191a23] rounded-full px-6 py-2 shadow-[4px_4px_0_#191a23]">
             <span className="text-sm font-black uppercase tracking-wider">Session: {JSON.parse(localStorage.getItem('user'))?.name}</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <AdminStatCard label="Total Users" value={stats.totalUsers} tag="Registered" />
          <AdminStatCard label="Total Ideas" value={stats.totalIdeas} tag="AI Generated" />
          <AdminStatCard label="Premium Users" value={stats.premiumUsers} tag="Active Plans" />
          <AdminStatCard label="Platform Profit" value={`₹${stats.totalProfit}`} tag="Revenue" highlight />
        </div>

        {/* Users Table */}
        <div className="bg-white border-4 border-[#191a23] rounded-[45px] overflow-hidden shadow-[10px_10px_0_#191a23]">
          <div className="p-8 border-b-4 border-[#191a23] bg-[#f3f3f3]">
             <h3 className="text-2xl font-black uppercase tracking-tight">Registered Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#191a23] bg-white">
                  <th className="p-6 font-black uppercase text-xs">User</th>
                  <th className="p-6 font-black uppercase text-xs">Email</th>
                  <th className="p-6 font-black uppercase text-xs">Status</th>
                  <th className="p-6 font-black uppercase text-xs">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b-2 border-[#191a23] hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-bold">{u.name}</td>
                    <td className="p-6 text-gray-500 font-medium">{u.email}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 border-[#191a23] ${u.subscriptionStatus === 'active' ? 'bg-[#b9ff66]' : 'bg-white'}`}>
                        {u.subscriptionStatus}
                      </span>
                    </td>
                    <td className="p-6 font-medium text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminNavItem = ({ label, active }) => (
  <div className={`p-4 font-bold text-lg rounded-2xl border-2 border-transparent transition-all cursor-pointer ${active ? 'bg-[#b9ff66] border-[#191a23] shadow-[4px_4px_0_#191a23]' : 'hover:bg-gray-50'}`}>
    {label}
  </div>
);

const AdminStatCard = ({ label, value, tag, highlight }) => (
  <div className={`p-8 border-4 border-[#191a23] rounded-[35px] shadow-[6px_6px_0_#191a23] ${highlight ? 'bg-[#b9ff66]' : 'bg-white'}`}>
    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className="text-4xl font-black mb-4">{value}</p>
    <span className={`inline-block px-3 py-1 rounded-lg border-2 border-[#191a23] text-[10px] font-black uppercase ${highlight ? 'bg-[#191a23] text-[#b9ff66]' : 'bg-[#b9ff66]'}`}>{tag}</span>
  </div>
);

export default AdminDashboard;
