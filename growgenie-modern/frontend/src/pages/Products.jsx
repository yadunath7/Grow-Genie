import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('gg_cart') || '[]'));
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('gg_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data.data);
  };

  const getEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes('consult')) return '🧠';
    if (n.includes('road')) return '🗺️';
    if (n.includes('market')) return '📣';
    if (n.includes('invoice')) return '📄';
    return '🛠️';
  };

  const addToCart = (product) => {
    if (cart.find(item => item.id === product.id)) {
      alert("Already in cart!");
      return;
    }
    setCart([...cart, product]);
    setShowCart(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toLocaleString('en-IN');
  };

  return (
    <div className="bg-white min-h-screen flex font-['Space_Grotesk']">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 transition-all duration-300">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-black mb-2 uppercase tracking-tight">Marketplace</h2>
            <p className="text-xl text-gray-600 font-medium italic">Premium services to accelerate your startup</p>
          </div>
          <button onClick={() => setShowCart(true)} className="bg-[#b9ff66] text-[#191a23] font-bold px-8 py-4 rounded-2xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] flex items-center">
            🛒 Cart ({cart.length})
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(p => (
            <div key={p.id} className="bg-white border-2 border-[#191a23] rounded-[45px] p-8 flex flex-col justify-between shadow-[8px_8px_0_#191a23] hover:shadow-[12px_12px_0_#b9ff66] transition-all group">
              <div>
                <div className="w-full h-48 bg-[#191a23] rounded-[30px] mb-6 flex items-center justify-center text-6xl shadow-[4px_4px_0_#b9ff66] group-hover:scale-105 transition-transform">
                  {getEmoji(p.name)}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-2xl font-black leading-tight">{p.name}</h4>
                  <span className="bg-[#b9ff66] border border-[#191a23] text-[10px] font-black px-2 py-1 rounded-md uppercase">{p.rateType}</span>
                </div>
                <p className="text-4xl font-black mb-4">₹{p.price.toLocaleString()}</p>
                <p className="text-gray-600 font-medium mb-6 line-clamp-3">{p.description}</p>
              </div>
              <button onClick={() => addToCart(p)} className="w-full bg-[#b9ff66] text-[#191a23] font-bold py-4 rounded-xl border-2 border-[#191a23] shadow-[4px_4px_0_#191a23] hover:bg-[#191a23] hover:text-white transition-all">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[150]" onClick={() => setShowCart(false)}></div>
          <div className="fixed top-0 right-0 h-screen w-[450px] bg-white border-l-4 border-[#191a23] z-[200] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b-2 border-[#191a23] flex justify-between items-center bg-[#f3f3f3]">
              <h3 className="text-3xl font-black uppercase">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="text-3xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border-2 border-[#191a23] rounded-2xl bg-white shadow-[4px_4px_0_#191a23]">
                   <div className="w-16 h-16 bg-[#191a23] rounded-xl flex items-center justify-center text-2xl">{getEmoji(item.name)}</div>
                   <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="font-black text-[#b9ff66]">₹{item.price.toLocaleString()}</p>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold">Remove</button>
                </div>
              ))}
            </div>
            <div className="p-8 border-t-4 border-[#191a23] bg-[#f3f3f3] space-y-6">
               <div className="flex justify-between text-2xl font-black">
                 <span>Total</span>
                 <span>₹{calculateTotal()}</span>
               </div>
               <button className="w-full bg-[#b9ff66] text-[#191a23] font-bold py-5 rounded-2xl border-2 border-[#191a23] shadow-[8px_8px_0_#191a23] text-xl">
                 Proceed to Pay 💳
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
