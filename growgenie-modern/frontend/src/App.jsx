import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import FaqBot from './pages/FaqBot';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Marketing from './pages/Marketing';
import AdCampaign from './pages/AdCampaign';
import Progress from './pages/Progress';
import VoiceAssistant from './pages/VoiceAssistant';
import Landing from './pages/Landing';
import About from './pages/About';

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/planner" element={isAuthenticated() ? <Planner /> : <Navigate to="/login" />} />
        <Route path="/invoices" element={isAuthenticated() ? <Invoices /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated() ? <Products /> : <Navigate to="/login" />} />
        <Route path="/faq" element={isAuthenticated() ? <FaqBot /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/marketing" element={isAuthenticated() ? <Marketing /> : <Navigate to="/login" />} />
        <Route path="/marketing/campaign/:type" element={isAuthenticated() ? <AdCampaign /> : <Navigate to="/login" />} />
        <Route path="/progress" element={isAuthenticated() ? <Progress /> : <Navigate to="/login" />} />
        <Route path="/voice-assistant" element={isAuthenticated() ? <VoiceAssistant /> : <Navigate to="/login" />} />

        {/* Catch all to redirect to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
