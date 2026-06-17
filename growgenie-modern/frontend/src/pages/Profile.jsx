import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const Profile = () => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [logo, setLogo] = useState(null);
  const [stamp, setStamp] = useState(null);

  const [logoPreview, setLogoPreview] = useState('');
  const [stampPreview, setStampPreview] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/business-profile');
      if (res.data.status === 'success' && res.data.data) {
        const d = res.data.data;
        setCompanyName(d.companyName || '');
        setAddress(d.address || '');
        setContactDetails(d.contactDetails || '');
        if (d.logoPath) {
          setLogoPreview(`http://localhost:8081/${d.logoPath}`);
        }
        if (d.stampPath) {
          setStampPreview(`http://localhost:8081/${d.stampPath}`);
        }
      }
    } catch (err) {
      console.error("Failed to load business profile", err);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleStampChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStamp(file);
      setStampPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('address', address);
    formData.append('contactDetails', contactDetails);
    if (logo) formData.append('logo', logo);
    if (stamp) formData.append('stamp', stamp);

    try {
      const res = await api.post('/business-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.status === 'success') {
        setMessage('Profile updated successfully!');
        if (res.data.data) {
          const d = res.data.data;
          if (d.logoPath) setLogoPreview(`http://localhost:8081/${d.logoPath}`);
          if (d.stampPath) setStampPreview(`http://localhost:8081/${d.stampPath}`);
        }
      } else {
        setError(res.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black mb-2 uppercase tracking-tight text-[#191a23]">Business Profile</h2>
          <p className="text-xl text-gray-600 font-medium italic">Configure company credentials for invoices and strategy branding</p>
        </header>

        {message && (
          <div className="bg-[#b9ff66] border-2 border-[#191a23] text-[#191a23] p-5 rounded-2xl mb-8 font-black uppercase text-center shadow-[4px_4px_0_#191a23]">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-[#191a23] text-red-700 p-5 rounded-2xl mb-8 font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 card-positivus bg-[#f3f3f3]">
            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Business Details</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-black mb-3 text-[#191a23] uppercase">Company Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required 
                  className="input-positivus w-full"
                  placeholder="e.g. Acme Corporation" 
                />
              </div>

              <div>
                <label className="block text-xl font-black mb-3 text-[#191a23] uppercase">Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="input-positivus w-full resize-none"
                  placeholder="e.g. 123 Main St, New Delhi, India"
                />
              </div>

              <div>
                <label className="block text-xl font-black mb-3 text-[#191a23] uppercase">Contact Details</label>
                <input 
                  type="text" 
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className="input-positivus w-full"
                  placeholder="e.g. +91 99999 99999 or info@acme.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-positivus w-full py-5 text-xl font-bold bg-[#191a23] text-white hover:bg-[#b9ff66] hover:text-black shadow-[6px_6px_0_#b9ff66] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mt-10"
            >
              {loading ? 'Saving Profile...' : 'Save Profile Details'}
            </button>
          </div>

          <div className="space-y-8">
            {/* Logo Upload Card */}
            <div className="card-positivus bg-white">
              <h4 className="text-xl font-black uppercase mb-4 tracking-tighter">Company Logo</h4>
              <div className="border-2 border-dashed border-[#191a23] rounded-3xl p-6 text-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden group">
                <input 
                  type="file" 
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {logoPreview ? (
                  <div className="space-y-4">
                    <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto object-contain" />
                    <p className="text-sm font-bold text-gray-500">Click to replace logo</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="w-12 h-12 bg-[#f3f3f3] border-2 border-[#191a23] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_#191a23] group-hover:bg-[#b9ff66] transition">
                      📷
                    </div>
                    <p className="font-bold text-[#191a23]">Upload Logo Image</p>
                    <p className="text-xs text-gray-400">JPG or PNG formats</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stamp Upload Card */}
            <div className="card-positivus bg-white">
              <h4 className="text-xl font-black uppercase mb-4 tracking-tighter">Company Stamp</h4>
              <div className="border-2 border-dashed border-[#191a23] rounded-3xl p-6 text-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden group">
                <input 
                  type="file" 
                  onChange={handleStampChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {stampPreview ? (
                  <div className="space-y-4">
                    <img src={stampPreview} alt="Stamp preview" className="max-h-32 mx-auto object-contain" />
                    <p className="text-sm font-bold text-gray-500">Click to replace stamp</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="w-12 h-12 bg-[#f3f3f3] border-2 border-[#191a23] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_#191a23] group-hover:bg-[#b9ff66] transition">
                      💮
                    </div>
                    <p className="font-bold text-[#191a23]">Upload Stamp Image</p>
                    <p className="text-xs text-gray-400">Used automatically on invoices</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
