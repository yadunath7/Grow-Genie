import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import html2pdf from 'html2pdf.js';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [profile, setProfile] = useState({ company_name: '', address: '', contact_details: '', logo_path: '', stamp_path: '' });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client_name: '', recipient_email: '', product: '', amount: '', gst_number: '', date: new Date().toISOString().split('T')[0], status: 'pending', output_lang: 'en' });

  useEffect(() => {
    fetchInvoices();
    fetchProfile();
  }, []);

  const fetchInvoices = async () => {
    const res = await api.get('/invoices/history');
    setInvoices(res.data.data);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/business-profile/fetch');
      if (res.data.data) setProfile(res.data.data);
    } catch (e) { console.error("Profile fetch failed"); }
  };

  const calculateTotal = () => {
    const amt = parseFloat(formData.amount) || 0;
    return (amt * 1.18).toFixed(2);
  };

  const generatePDF = async (e) => {
    e.preventDefault();
    const total = calculateTotal();
    
    // Create hidden template for PDF generation
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; border: 4px solid #191a23; border-radius: 40px; font-family: sans-serif; background: white;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <h1 style="font-size: 48px; font-weight: 900;">INVOICE</h1>
          ${profile.logo_path ? `<img src="${profile.logo_path}" style="height: 60px;">` : `<div style="background: #b9ff66; padding: 10px 20px; border: 3px solid #191a23; border-radius: 15px; font-weight: 900;">GrowGenie</div>`}
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <p style="font-weight: 900; color: #666;">FROM</p>
            <p style="font-weight: 900;">${profile.company_name || 'My Business'}</p>
            <p>${profile.address || ''}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-weight: 900; color: #666;">BILL TO</p>
            <p style="font-weight: 900;">${formData.client_name}</p>
            <p>${formData.recipient_email}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <tr style="background: #191a23; color: #b9ff66;">
            <th style="padding: 15px; text-align: left;">DESCRIPTION</th>
            <th style="padding: 15px; text-align: right;">AMOUNT</th>
          </tr>
          <tr>
            <td style="padding: 20px; border-bottom: 2px solid #eee;">${formData.product}</td>
            <td style="padding: 20px; border-bottom: 2px solid #eee; text-align: right;">₹${parseFloat(formData.amount).toLocaleString('en-IN')}</td>
          </tr>
        </table>
        <div style="text-align: right;">
          <div style="display: inline-block; background: #f3f3f3; padding: 20px; border: 2px solid #191a23; border-radius: 20px;">
            <p style="font-weight: 900; font-size: 12px; color: #666;">TOTAL PAYABLE</p>
            <p style="font-size: 32px; font-weight: 900;">₹${total}</p>
            <p style="font-size: 10px; color: #888;">INCLUDES 18% GST</p>
          </div>
        </div>
      </div>
    `;

    const opt = { margin: 10, filename: `Invoice_${formData.client_name}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
    await html2pdf().set(opt).from(element).save();

    // Save to DB
    await api.post('/invoices/create', { ...formData, amount: total });
    setShowModal(false);
    fetchInvoices();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    await api.patch(`/invoices/${id}/status`, { status: newStatus });
    fetchInvoices();
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-black mb-2 uppercase tracking-tight">Invoice Generator</h2>
            <p className="text-xl text-gray-600 font-medium italic">GST-compliant PDF invoices for your business.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-[#b9ff66] text-[#191a23] font-bold px-8 py-4 rounded-2xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            + New Invoice
          </button>
        </header>

        {/* Business Profile Summary */}
        <div className="card-positivus bg-white border-2 border-[#191a23] rounded-[45px] p-8 mb-12 shadow-[8px_8px_0_#191a23]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tight">Business Profile</h3>
            <button className="text-sm font-bold bg-[#191a23] text-white px-4 py-2 rounded-xl">Edit Profile</button>
          </div>
          <div className="flex items-center space-x-6">
             <div className="w-20 h-20 bg-[#f3f3f3] border-2 border-[#191a23] rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
                {profile.logo_path ? <img src={profile.logo_path} className="w-full h-full object-contain" /> : '🖼️'}
             </div>
             <div>
                <p className="text-xl font-bold">{profile.company_name || 'Business Name Not Set'}</p>
                <p className="text-gray-500 font-medium">{profile.address || 'Address Not Set'}</p>
             </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="space-y-6">
          <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-[#b9ff66] inline-block mb-4">Recent Invoices</h3>
          {invoices.length === 0 ? (
            <div className="text-center py-20 bg-[#f3f3f3] rounded-[45px] border-2 border-dashed border-[#191a23]">
              <span className="text-6xl mb-4 block">🧾</span>
              <p className="text-xl font-bold text-gray-500">No invoices yet. Generate your first one above!</p>
            </div>
          ) : (
            invoices.map(inv => (
              <div key={inv.id} className="p-8 bg-white border-2 border-[#191a23] rounded-[35px] flex justify-between items-center shadow-[4px_4px_0_#191a23] hover:translate-y-[-2px] transition-all">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-2xl font-bold">{inv.clientName}</h4>
                    <button 
                      onClick={() => handleStatusToggle(inv.id, inv.status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 border-[#191a23] ${inv.status === 'paid' ? 'bg-[#b9ff66]' : 'bg-red-100'}`}
                    >
                      {inv.status} {inv.status === 'paid' ? '✅' : '⏳'}
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{new Date(inv.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="bg-[#b9ff66] text-xl font-bold px-6 py-2 rounded-2xl border-2 border-[#191a23]">₹{inv.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Invoice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border-4 border-[#191a23] w-full max-w-2xl rounded-[45px] p-10 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-3xl font-bold">×</button>
              <h3 className="text-3xl font-black mb-8 uppercase tracking-tight">New GST Invoice</h3>
              
              <form onSubmit={generatePDF} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Customer Name" value={formData.client_name} onChange={v => setFormData({...formData, client_name: v})} placeholder="John Doe" />
                  <Input label="Customer Email" type="email" value={formData.recipient_email} onChange={v => setFormData({...formData, recipient_email: v})} placeholder="john@example.com" />
                </div>
                <Input label="Product / Service" value={formData.product} onChange={v => setFormData({...formData, product: v})} placeholder="E.g. Consultation" />
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Base Amount (₹)" type="number" value={formData.amount} onChange={v => setFormData({...formData, amount: v})} placeholder="0.00" />
                  <Input label="GST Number" value={formData.gst_number} onChange={v => setFormData({...formData, gst_number: v})} placeholder="Optional" />
                </div>
                
                <div className="bg-[#f3f3f3] p-6 rounded-3xl border-2 border-[#191a23]">
                  <div className="flex justify-between font-bold mb-2"><span>Subtotal</span><span>₹{formData.amount || '0.00'}</span></div>
                  <div className="flex justify-between font-bold text-orange-500 mb-2"><span>GST (18%)</span><span>₹{(parseFloat(formData.amount || 0) * 0.18).toFixed(2)}</span></div>
                  <div className="border-t-2 border-[#191a23] my-2 pt-2 flex justify-between text-3xl font-black">
                    <span>Total</span><span>₹{calculateTotal()}</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#b9ff66] text-[#191a23] font-bold py-5 rounded-2xl border-2 border-[#191a23] shadow-[6px_6px_0_#191a23] text-xl">
                  Generate & Save Invoice 📄
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-black uppercase mb-2 text-[#191a23]">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white border-2 border-[#191a23] p-4 rounded-2xl focus:outline-none" placeholder={placeholder} />
  </div>
);

export default Invoices;
