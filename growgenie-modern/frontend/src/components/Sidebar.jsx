import React from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/auth.service';

const Sidebar = ({ userName, userObj, isOpen, toggleSidebar }) => {
  const user = userName || authService.getCurrentUser()?.name || "User";

  return (
    <div className={`sidebar fixed top-0 left-0 h-screen flex flex-col p-6 ${isOpen ? '' : ''}`}>
      <div className="flex items-center mb-12">
        <div className="w-10 h-10 bg-lime-green border-2 border-dark-black flex items-center justify-center font-black rounded-lg shadow-[2px_2px_0_#191a23]">
          GG
        </div>
        <h1 className="ml-3 text-2xl font-black uppercase tracking-tighter">GrowGenie</h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-2">
        <NavItem to="/dashboard" label="Dashboard" icon="🏠" onClick={toggleSidebar} />
        <NavItem to="/planner" label="AI Planner" icon="🗺️" onClick={toggleSidebar} />
        <NavItem to="/marketing" label="Marketing & Ads" icon="📣" onClick={toggleSidebar} />
        <NavItem to="/invoices" label="Invoices" icon="📄" onClick={toggleSidebar} />
        <NavItem to="/products" label="Products" icon="📦" onClick={toggleSidebar} />
        <NavItem to="/faq" label="FAQ Bot" icon="💬" onClick={toggleSidebar} />
        <NavItem to="/voice-assistant" label="Voice Genie" icon="🎙️" onClick={toggleSidebar} />
        <NavItem to="/progress" label="Progress" icon="📊" onClick={toggleSidebar} />
        <NavItem to="/profile" label="Profile" icon="⚙️" onClick={toggleSidebar} />
        {authService.getCurrentUser()?.email === 'admin@growgenie.com' && (
          <NavItem to="/admin" label="Admin" icon="🛡️" onClick={toggleSidebar} />
        )}
      </nav>

      <div className="mt-auto border-t-2 border-dark-black pt-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-light-gray border-2 border-dark-black rounded-full flex items-center justify-center font-bold mr-3">
            {user[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{user}</p>
            <p className="text-[10px] uppercase font-black text-gray-400">{userObj?.subscriptionStatus || 'Genie Member'}</p>
          </div>
        </div>
        <button 
          onClick={authService.logout}
          className="w-full p-3 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left flex items-center"
        >
          Logout <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink 
    to={to} 
    onClick={() => {
        if(window.innerWidth < 1024) {
            onClick();
        }
    }}
    className={({ isActive }) => 
      `nav-item flex items-center p-4 font-bold text-lg ${isActive ? 'active' : ''}`
    }
  >
    <span className="mr-3 text-2xl">{icon}</span>
    {label}
  </NavLink>
);

export default Sidebar;
