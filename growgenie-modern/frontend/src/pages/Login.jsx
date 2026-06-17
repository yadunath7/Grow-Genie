import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await AuthService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      <div className="absolute top-8 right-8 z-[100]">
          <select className="bg-white border-2 border-dark-black rounded-xl p-3 font-bold text-sm shadow-[4px_4px_0_#b9ff66]">
              <option value="en">English 🇺🇸</option>
              <option value="hi">हिन्दी 🇮🇳</option>
              <option value="ta">தமிழ் 🇮🇳</option>
          </select>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-lime-green rounded-full opacity-20 filter blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gray-200 rounded-full opacity-30 filter blur-3xl"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
              <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
              <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your GrowGenie account</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-dark-black text-dark-black p-4 rounded-2xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <div className="card-positivus bg-light-gray">
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-xl font-medium mb-3">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="input-positivus text-lg" 
                placeholder="Name@company.com" 
              />
            </div>
            <div>
              <label className="block text-xl font-medium mb-3">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="input-positivus text-lg" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full btn-positivus text-xl py-5"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-lg">
            <span>Don't have an account?</span> <Link to="/register" className="badge-lime font-bold hover:bg-dark-black hover:text-white transition cursor-pointer">Start Free Trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
