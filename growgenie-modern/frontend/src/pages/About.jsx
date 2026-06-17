import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white text-dark-black font-['Space_Grotesk'] overflow-hidden selection:bg-[#b9ff66] selection:text-black min-h-screen flex flex-col">
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
                        <Link to="/about" className="text-[#b9ff66] transition inline-block">About us</Link>
                        <Link to="/#services" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Services</Link>
                        <Link to="/#process" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Process</Link>
                        <Link to="/login" className="hover:text-lime-green transition hover:-translate-y-1 inline-block">Login</Link>
                        <Link to="/register" className="btn-positivus btn-outline">Request a quote</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-[85rem] mx-auto px-6 md:px-10 pt-12 flex-1 w-full">
                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center justify-between py-16 mb-12 bg-[#f3f3f3] rounded-[45px] p-12 border-2 border-dark-black shadow-[8px_8px_0_#191a23]">
                    <div className="lg:w-1/2 pr-0 lg:pr-12">
                        <span className="bg-[#b9ff66] text-dark-black text-xl font-black mb-6 px-4 py-1 inline-block uppercase rounded-[10px] border-2 border-dark-black">Our Story</span>
                        <h1 className="text-6xl font-black leading-[1.05] mb-8 text-dark-black tracking-tight uppercase">
                            We are the architects of startup success
                        </h1>
                        <p className="text-2xl text-gray-700 leading-relaxed font-medium">
                            GrowGenie was founded on a simple belief: every great idea deserves the right tools to succeed. We bridge the gap between innovation and execution.
                        </p>
                    </div>
                    <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0">
                        <svg className="w-full max-w-md text-dark-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                    </div>
                </section>

                {/* Stats / Experience Section */}
                <section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="card-positivus text-center p-8 border-2 border-dark-black rounded-[30px] bg-white shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] hover:-translate-y-2 transition-all">
                            <p className="text-6xl font-black text-[#b9ff66] drop-shadow-[2px_2px_0_#191a23]">10+</p>
                            <p className="text-xl font-bold mt-4 uppercase">Years Experience</p>
                        </div>
                        <div className="card-positivus text-center p-8 border-2 border-dark-black rounded-[30px] bg-dark-black text-white shadow-[6px_6px_0_#b9ff66] hover:shadow-[10px_10px_0_#b9ff66] hover:-translate-y-2 transition-all">
                            <p className="text-6xl font-black text-[#b9ff66] drop-shadow-[2px_2px_0_#ffffff]">500+</p>
                            <p className="text-xl font-bold mt-4 uppercase">Startups Launched</p>
                        </div>
                        <div className="card-positivus text-center p-8 border-2 border-dark-black rounded-[30px] bg-white shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] hover:-translate-y-2 transition-all">
                            <p className="text-6xl font-black text-[#b9ff66] drop-shadow-[2px_2px_0_#191a23]">₹50M+</p>
                            <p className="text-xl font-bold mt-4 uppercase">Funding Raised</p>
                        </div>
                        <div className="card-positivus text-center p-8 border-2 border-dark-black rounded-[30px] bg-[#b9ff66] shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] hover:-translate-y-2 transition-all">
                            <p className="text-6xl font-black text-dark-black drop-shadow-[2px_2px_0_#ffffff]">24/7</p>
                            <p className="text-xl font-bold mt-4 uppercase">Expert Support</p>
                        </div>
                    </div>
                </section>

                {/* Our Work Section */}
                <section className="mb-32">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Our Work</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">Real results from real startups. See how we've helped founders turn their vision into reality.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Case Study 1 */}
                        <div className="card-positivus bg-dark-black text-white p-10 group cursor-pointer border-2 border-dark-black hover:border-[#b9ff66] rounded-[45px] shadow-[8px_8px_0_#b9ff66] transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-black mb-2 uppercase">FinTech Innovators</h3>
                                    <p className="text-[#b9ff66] font-bold">Digital Banking App</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white text-dark-black flex items-center justify-center group-hover:bg-[#b9ff66] transition transform group-hover:rotate-45">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                </div>
                            </div>
                            <p className="text-gray-300 text-lg mb-8 line-clamp-3 font-medium">Using our Genie Roadmap generator, FinTech Innovators successfully planned their MVP launch within 3 months, securing seed funding and acquiring their first 10,000 users.</p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 border-2 border-gray-600 rounded-full text-sm font-bold text-white uppercase">Genie Roadmap</span>
                                <span className="px-4 py-2 border-2 border-gray-600 rounded-full text-sm font-bold text-white uppercase">Growth Marketing</span>
                            </div>
                        </div>

                        {/* Case Study 2 */}
                        <div className="card-positivus bg-[#f3f3f3] text-dark-black p-10 group cursor-pointer border-2 border-dark-black rounded-[45px] shadow-[8px_8px_0_#191a23] hover:shadow-[12px_12px_0_#191a23] hover:-translate-y-1 transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-black mb-2 uppercase">EcoBite Delivery</h3>
                                    <p className="text-dark-black font-bold px-3 py-1 bg-[#b9ff66] inline-block rounded-md mt-2 border-2 border-dark-black">Sustainable Food</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-dark-black text-[#b9ff66] flex items-center justify-center group-hover:scale-110 transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                </div>
                            </div>
                            <p className="text-gray-700 text-lg mb-8 line-clamp-3 font-medium">We implemented an aggressive hyperlocal marketing strategy that reduced their Customer Acquisition Cost (CAC) by 40% and increased repeat orders.</p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 border-2 border-dark-black rounded-full text-sm font-bold text-dark-black bg-white uppercase">Local SEO</span>
                                <span className="px-4 py-2 border-2 border-dark-black rounded-full text-sm font-bold text-dark-black bg-white uppercase">Social Media Ads</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-32">
                    <div className="section-heading mb-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <span className="heading-tag bg-[#b9ff66] text-4xl font-black px-4 py-2 border-2 border-dark-black shadow-[4px_4px_0_#191a23] uppercase">Leadership</span>
                        <p className="heading-desc text-xl font-medium max-w-2xl">Meet the skilled and experienced team behind our successful digital marketing strategies</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Team Member 1 */}
                        <div className="card-positivus border-2 border-dark-black rounded-[35px] p-8 shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] transition-all bg-white group hover:-translate-y-2">
                            <div className="flex items-center mb-6 border-b-2 border-dark-black pb-6">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-[#b9ff66] transform rotate-6 rounded-3xl group-hover:rotate-12 transition-transform"></div>
                                    <img src="https://i.pravatar.cc/150?img=11" alt="John Smith" className="relative z-10 w-24 h-24 object-cover rounded-3xl border-2 border-dark-black" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black uppercase">John Smith</h4>
                                    <p className="text-lg font-bold text-gray-600">CEO and Founder</p>
                                </div>
                            </div>
                            <p className="text-lg font-medium">10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy.</p>
                        </div>

                        {/* Team Member 2 */}
                        <div className="card-positivus border-2 border-dark-black rounded-[35px] p-8 shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] transition-all bg-white group hover:-translate-y-2">
                            <div className="flex items-center mb-6 border-b-2 border-dark-black pb-6">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-[#b9ff66] transform rotate-6 rounded-3xl group-hover:rotate-12 transition-transform"></div>
                                    <img src="https://i.pravatar.cc/150?img=47" alt="Jane Doe" className="relative z-10 w-24 h-24 object-cover rounded-3xl border-2 border-dark-black" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black uppercase">Jane Doe</h4>
                                    <p className="text-lg font-bold text-gray-600">Director of Operations</p>
                                </div>
                            </div>
                            <p className="text-lg font-medium">7+ years of experience in project management and team leadership. Strong organizational skills.</p>
                        </div>

                        {/* Team Member 3 */}
                        <div className="card-positivus border-2 border-dark-black rounded-[35px] p-8 shadow-[6px_6px_0_#191a23] hover:shadow-[10px_10px_0_#191a23] transition-all bg-white group hover:-translate-y-2">
                            <div className="flex items-center mb-6 border-b-2 border-dark-black pb-6">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-[#b9ff66] transform rotate-6 rounded-3xl group-hover:rotate-12 transition-transform"></div>
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Michael Brown" className="relative z-10 w-24 h-24 object-cover rounded-3xl border-2 border-dark-black" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black uppercase">Michael Brown</h4>
                                    <p className="text-lg font-bold text-gray-600">SEO Specialist</p>
                                </div>
                            </div>
                            <p className="text-lg font-medium">5+ years of experience in SEO and content creation. Proficient in keyword research.</p>
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
                            <Link to="/about" className="text-[#b9ff66] transition">About us</Link>
                            <Link to="/#services" className="hover:text-[#b9ff66] transition">Services</Link>
                            <Link to="/#process" className="hover:text-[#b9ff66] transition">Use Cases</Link>
                            <Link to="/register" className="hover:text-[#b9ff66] transition">Pricing</Link>
                            <Link to="/#contact" className="hover:text-[#b9ff66] transition">Contact Us</Link>
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

export default About;
