import React, { useState } from 'react';
import { Menu, X, Sparkles, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated hrefs to point to actual sections
  const navItems = [
    { label: 'Platform', href: '#features' },
    { label: 'Solutions', href: '#features' }, 
    { label: 'Customers', href: '#customers' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      alert("Search functionality is currently in demo mode. Try exploring the AI features below!");
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Logo & Desktop Nav */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                DeskAI
              </span>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Search & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                className="bg-slate-800/50 border border-slate-700 text-slate-300 text-sm rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-48 pl-10 p-2.5 transition-all focus:w-64 placeholder:text-slate-500" 
                placeholder="Search docs..." 
                onKeyDown={handleSearch}
              />
            </div>

            {/* CTA Button */}
            <a
              href="#demo"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            >
              Get a Demo
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-4 pt-4 pb-2">
             {/* Mobile Search */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input 
                    type="text" 
                    className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full pl-10 p-2.5 placeholder:text-slate-500" 
                    placeholder="Search docs or features..." 
                    onKeyDown={handleSearch}
                />
            </div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#demo"
              className="w-full text-center mt-4 bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Get a Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;