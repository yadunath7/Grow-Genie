import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Landing = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [activeProcess, setActiveProcess] = useState(1);

    useEffect(() => {
        // Fetch testimonials
        api.get('/public/testimonials')
            .then(res => {
                if (res.data && res.data.status === 'success') {
                    setTestimonials(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching testimonials", err));

        // Fetch team members
        api.get('/public/team-members')
            .then(res => {
                if (res.data && res.data.status === 'success') {
                    setTeamMembers(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching team members", err));
    }, []);

    const toggleProcess = (step) => {
        setActiveProcess(activeProcess === step ? null : step);
    };

    return (
        <div className="bg-white text-dark-black font-['Space_Grotesk'] overflow-hidden selection:bg-[#b9ff66] selection:text-black">
            <nav className="sticky-nav py-6 sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-dark-black shadow-[0_2px_0_#191a23]">
                <div className="max-w-[85rem] mx-auto px-6 md:px-10 flex justify-between items-center w-full">
                    <Link to="/" className="flex items-center">
                        <svg className="w-8 h-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
                            <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
                        </svg>
                        <span className="text-3xl font-black tracking-tight">GrowGenie</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-10 text-xl font-bold">
                        <Link to="/about" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">About us</Link>
                        <a href="#services" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Services</a>
                        <a href="#process" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Process</a>
                        <Link to="/login" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Login</Link>
                        <Link to="/register" className="btn-positivus btn-outline">Request a quote</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-[85rem] mx-auto px-6 md:px-10">
                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center justify-between pb-16 pt-8 lg:pb-24 lg:pt-12">
                    <div className="lg:w-1/2 mb-16 lg:mb-0 pr-0 lg:pr-12">
                        <h1 className="text-6xl lg:text-[76px] font-black leading-[1.05] mb-8 fade-in text-dark-black tracking-tight uppercase">
                            Navigating the startup landscape for success
                        </h1>
                        <p className="text-2xl text-gray-700 mb-12 max-w-2xl leading-relaxed fade-in font-medium" style={{animationDelay: '0.2s'}}>
                            Our startup assistant helps founders grow and succeed through a range of tools including Genie roadmaps, marketing strategies, and invoice creation.
                        </p>
                        <Link to="/register" className="btn-positivus text-2xl px-12 py-6 fade-in shadow-[6px_6px_0_#b9ff66] hover:shadow-[10px_10px_0_#b9ff66] transition-all" style={{animationDelay: '0.4s'}}>
                            Book a consultation
                        </Link>
                    </div>
                    <div className="lg:w-1/2 flex justify-center lg:justify-end fade-in" style={{animationDelay: '0.6s'}}>
                        <img src="/assets/img/hero_illustration.png" alt="Startup Growth Illustration" className="w-full max-w-[600px] object-contain hover:scale-105 transition-transform duration-500" />
                    </div>
                </section>

                {/* Marquee / Ticker */}
                <div className="marquee-container my-12 border-y-2 border-dark-black py-4 bg-[#f3f3f3] transform -rotate-1 scale-105 overflow-hidden">
                    <div className="marquee-content font-black text-3xl uppercase tracking-tighter">
                        &nbsp;&nbsp;*&nbsp;&nbsp; DIGITAL MARKETING AGENCY &nbsp;&nbsp;*&nbsp;&nbsp; STARTUP ROADMAPS &nbsp;&nbsp;*&nbsp;&nbsp; SEO EXPERTS &nbsp;&nbsp;*&nbsp;&nbsp; INVOICE GENERATOR &nbsp;&nbsp;*&nbsp;&nbsp; GROWTH HACKING &nbsp;&nbsp;*&nbsp;&nbsp; DIGITAL MARKETING AGENCY &nbsp;&nbsp;*&nbsp;&nbsp; STARTUP ROADMAPS &nbsp;&nbsp;*&nbsp;&nbsp; SEO EXPERTS &nbsp;&nbsp;*&nbsp;&nbsp; INVOICE GENERATOR &nbsp;&nbsp;*&nbsp;&nbsp; GROWTH HACKING
                    </div>
                </div>

                {/* Services Section */}
                <section id="services" className="mb-32 pt-20">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Services</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">At our agency, we offer a range of services to help founders achieve their business goals. These services include:</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="card-positivus bg-[#b9ff66] flex justify-between p-10 h-80 hover:shadow-[12px_12px_0_#191a23] transition-all">
                            <div className="flex flex-col justify-between">
                                <span className="bg-white text-dark-black border-2 border-dark-black text-2xl font-black px-4 py-1 inline-block uppercase w-max rounded-[10px]">Roadmap Generator</span>
                                <div className="mt-20">
                                    <Link to="/register" className="flex items-center group">
                                        <div className="w-10 h-10 rounded-full bg-dark-black text-[#b9ff66] flex items-center justify-center mr-4 group-hover:scale-125 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </div>
                                        <span className="text-xl font-bold uppercase">Learn more</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card-positivus flex justify-between bg-dark-black text-white p-10 h-80 hover:shadow-[12px_12px_0_#b9ff66] transition-all">
                            <div className="flex flex-col justify-between">
                                <span className="bg-white text-dark-black border-2 border-dark-black text-2xl font-black px-4 py-1 inline-block uppercase w-max rounded-[10px]">Marketing Strategy</span>
                                <div className="mt-20">
                                    <Link to="/register" className="flex items-center group">
                                        <div className="w-10 h-10 rounded-full bg-white text-dark-black flex items-center justify-center mr-4 group-hover:scale-125 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </div>
                                        <span className="text-xl font-bold uppercase text-white">Learn more</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Working Process Section */}
                <section id="process" className="mb-32 pt-20">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Our Working Process</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">A Step-by-Step Guide to Achieving Your Business Goals</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { step: 1, title: 'Consultation', content: 'During the initial consultation, we will discuss your startup goals and objectives, target audience, and current challenges. This allows us to understand your needs and tailor our guidance accordingly.' },
                            { step: 2, title: 'Research and Strategy Deployment', content: 'We dive deep into your market to build a data-driven strategy. Using our Genie roadmap generator, we outline the exact steps you need to take to reach your target audience effectively.' },
                            { step: 3, title: 'Implementation', content: 'Our team helps you execute the strategy. From setting up marketing campaigns to organizing your invoices, we provide the tools needed for seamless operation.' }
                        ].map(item => (
                            <div key={item.step} className={`process-step border-2 border-dark-black rounded-[30px] overflow-hidden transition-all duration-300 ${activeProcess === item.step ? 'bg-[#b9ff66] shadow-[6px_6px_0_#191a23]' : 'bg-[#f3f3f3] shadow-[4px_4px_0_#191a23]'}`}>
                                <div className="process-header flex items-center p-8 cursor-pointer select-none" onClick={() => toggleProcess(item.step)}>
                                    <span className="text-5xl font-black mr-6">0{item.step}</span>
                                    <span className="text-3xl font-bold">{item.title}</span>
                                    <div className={`ml-auto w-12 h-12 rounded-full border-2 border-dark-black flex items-center justify-center bg-white transform transition-transform duration-300 ${activeProcess === item.step ? 'rotate-180' : ''}`}>
                                        {activeProcess === item.step ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                                        )}
                                    </div>
                                </div>
                                {activeProcess === item.step && (
                                    <div className="process-content p-8 pt-0 border-t-2 border-dark-black mt-4 bg-[#b9ff66]">
                                        <p className="text-xl font-medium">{item.content}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-32 pt-10">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Testimonials</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">Hear from Some of Our Satisfied Clients About Our Digital Marketing Strategies</p>
                    </div>
                    
                    <div className="bg-[#191a23] rounded-[45px] p-12 overflow-hidden relative text-white border-2 border-[#191a23] shadow-[12px_12px_0_#b9ff66]">
                        <div className="flex gap-6 overflow-x-auto snap-x pb-12 hide-scrollbar">
                            {testimonials.length > 0 ? testimonials.map(t => (
                                <div key={t.id} className="w-full md:w-1/2 flex-shrink-0 snap-center">
                                    <div className="border border-[#b9ff66] rounded-3xl p-8 mb-6 relative z-10 text-xl text-white font-medium">
                                        "{t.content}"
                                        {/* Speech bubble tail */}
                                        <div className="absolute -bottom-[20px] left-12 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-[#b9ff66] border-r-[20px] border-r-transparent"></div>
                                        <div className="absolute -bottom-[18px] left-[49px] w-0 h-0 border-l-[18px] border-l-transparent border-t-[18px] border-t-[#191a23] border-r-[18px] border-r-transparent"></div>
                                    </div>
                                    <div className="pl-16">
                                        <p className="text-[#b9ff66] font-black text-xl uppercase">{t.name}</p>
                                        <p className="text-gray-400 font-bold">{t.role}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full text-center text-gray-400 italic py-8 text-xl">No testimonials yet.</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-32 pt-10">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">The Team</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">Meet the skilled and experienced team behind our successful digital marketing strategies</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.length > 0 ? teamMembers.map(m => (
                            <div key={m.id} className="card-positivus border-2 border-dark-black rounded-[35px] p-8 shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] transition-all bg-white group hover:-translate-y-2">
                                <div className="flex items-center mb-6 border-b-2 border-dark-black pb-6">
                                    <div className="relative mr-4">
                                        <div className="absolute inset-0 bg-[#b9ff66] transform rotate-6 rounded-3xl group-hover:rotate-12 transition-transform"></div>
                                        <img src={m.imageUrl || `https://i.pravatar.cc/150?u=${m.id}`} alt={m.name} className="relative z-10 w-24 h-24 object-cover rounded-3xl border-2 border-dark-black" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black uppercase">{m.name}</h4>
                                        <p className="text-lg font-bold text-gray-600">{m.position}</p>
                                    </div>
                                </div>
                                <p className="text-lg font-medium">{m.description}</p>
                            </div>
                        )) : (
                            <div className="col-span-3 text-center text-gray-500 italic py-8 text-xl font-bold">No team members added yet.</div>
                        )}
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact" className="mb-32 pt-10">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Contact Us</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">Connect with us: Let's Discuss Your Digital Marketing Needs</p>
                    </div>
                    
                    <div className="bg-[#f3f3f3] border-2 border-dark-black rounded-[45px] relative overflow-hidden flex flex-col md:flex-row p-16 pb-0 shadow-[8px_8px_0_#191a23]">
                        <div className="md:w-1/2 relative z-10 pb-16">
                            <div className="flex space-x-6 mb-10">
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="contact_type" className="w-6 h-6 text-lime-green bg-white border-2 border-dark-black focus:ring-lime-green focus:ring-2 accent-lime-green" defaultChecked />
                                    <span className="ml-3 text-xl font-bold">Say Hi</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="contact_type" className="w-6 h-6 text-lime-green bg-white border-2 border-dark-black focus:ring-lime-green focus:ring-2 accent-lime-green" />
                                    <span className="ml-3 text-xl font-bold">Get a Quote</span>
                                </label>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
                                <div>
                                    <label className="block mb-2 font-bold text-lg">Name</label>
                                    <input type="text" className="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#b9ff66] shadow-[4px_4px_0_#191a23]" placeholder="Name" />
                                </div>
                                <div>
                                    <label className="block mb-2 font-bold text-lg">Email *</label>
                                    <input type="email" className="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#b9ff66] shadow-[4px_4px_0_#191a23]" placeholder="Email" required />
                                </div>
                                <div>
                                    <label className="block mb-2 font-bold text-lg">Message *</label>
                                    <textarea className="w-full bg-white border-2 border-dark-black rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#b9ff66] shadow-[4px_4px_0_#191a23] h-32 resize-none" placeholder="Message" required></textarea>
                                </div>
                                <button type="submit" className="w-full bg-dark-black text-white text-2xl font-black py-5 mt-4 rounded-[14px] hover:bg-[#b9ff66] hover:text-dark-black transition-colors uppercase border-2 border-transparent hover:border-dark-black">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-dark-black text-white py-16 mt-20 border-t-4 border-[#b9ff66]">
                <div className="max-w-[85rem] mx-auto px-6 md:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-12 mb-12">
                        <div className="mb-10 md:mb-0 max-w-sm">
                            <div className="flex items-center mb-6">
                                <svg className="w-8 h-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
                                    <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
                                </svg>
                                <span className="text-3xl font-black tracking-tight uppercase">GrowGenie</span>
                            </div>
                            <div className="space-y-2 text-gray-300 font-medium text-lg">
                                <p className="font-bold text-[#b9ff66] mb-4 text-xl">Contact us:</p>
                                <p>Email: info@growgenie.com</p>
                                <p>Phone: +91 98765 43210</p>
                                <p>Address: 404 Innovation Park, Startup Hub, Bengaluru, Karnataka 560001, India</p>
                            </div>
                        </div>

                        <div className="mb-10 md:mb-0 flex flex-col space-y-4 text-lg font-bold">
                            <Link to="/about" className="hover:text-[#b9ff66] transition">About us</Link>
                            <a href="#services" className="hover:text-[#b9ff66] transition">Services</a>
                            <a href="#process" className="hover:text-[#b9ff66] transition">Use Cases</a>
                            <Link to="/register" className="hover:text-[#b9ff66] transition">Pricing</Link>
                            <a href="#contact" className="hover:text-[#b9ff66] transition">Contact Us</a>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-bold">
                        <p>© 2026 GrowGenie. All Rights Reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
