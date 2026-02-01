import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-border pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Bio */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter">
              <img src='./logo.png' className='w-40' ></img>
            </h2>
            <p className="text-textDim max-w-xs text-sm leading-relaxed">
              Transforming parking management through intelligent POS solutions. 
              We build spaces that define efficiency, comfort, and trust.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-7">Quick Links</h3>
            <ul className="space-y-4 text-sm text-textDim">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#projects" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">WHY US</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-7">Contact Us</h3>
            <ul className="space-y-4 text-sm text-textDim">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 mt-0.5" />
                <span>ParkEase Headquaters,<br />Noida, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary w-5 h-5" />
                <span>+91 99XXXXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary w-5 h-5" />
                <span>info@ParkEase.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-7">Stay Updated</h3>
            <p className="text-textDim text-sm mb-6">Subscribe to get updates on new parking locations and features.</p>
            <div className="flex flex-col space-y-2">
              <div className="flex bg-background border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border border-blue-500 px-4 py-2.5 text-sm outline-none w-full text-white"
                />
                <button className="bg-primary text-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex gap-4 pt-10">
              <Facebook className="text-textDim hover:text-primary cursor-pointer w-5 h-5 transition-colors" />
              <Instagram className="text-textDim hover:text-primary cursor-pointer w-5 h-5 transition-colors" />
              <Linkedin className="text-textDim hover:text-primary cursor-pointer w-5 h-5 transition-colors" />
              <Youtube className="text-textDim hover:text-primary cursor-pointer w-5 h-5 transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-textDim text-xs">
            © 2026 <span className="text-primary font-medium">ParkEase</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
             <p className="text-textDim text-xs">
              Designed & Developed by <span className="text-blue-600 text-xl hover:text-primary cursor-pointer transition-colors"><a href="https://vaughv.netlify.app">Vaibhav</a></span>
            </p>
            <button 
              onClick={scrollToTop}
              className="bg-blue-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg shadow-primary/20"
            >
              <ArrowUp className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;