import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await AuthService.register(name, email, password);
      // Automatically log the user in after successful registration
      await AuthService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime-green rounded-full opacity-20 filter blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gray-200 rounded-full opacity-30 filter blur-3xl"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
              <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
              <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500">Start your 5-day free premium trial</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-dark-black text-dark-black p-4 rounded-2xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <div className="card-positivus bg-light-gray">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="input-positivus" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="input-positivus" 
                placeholder="Name@company.com" 
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="input-positivus" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full btn-positivus text-xl py-5"
            >
              Start Free Trial
            </button>
          </form>

          <p className="mt-8 text-center text-lg">
            Already have an account? <Link to="/login" className="badge-lime font-bold hover:bg-dark-black hover:text-white transition cursor-pointer">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
