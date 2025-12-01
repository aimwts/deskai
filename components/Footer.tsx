import React from 'react';
import { Sparkles, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DeskAI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              The AI-native customer experience platform designed to automate, assist, and analyze at scale.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5"/></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5"/></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Omnichannel</a></li>
              <li><a href="#demo" className="hover:text-indigo-400 transition-colors">AI Agent Assist</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Analytics</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#customers" className="hover:text-indigo-400 transition-colors">Customers</a></li>
              <li><a href="#demo" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#customers" className="hover:text-indigo-400 transition-colors">Community</a></li>
              <li><a href="#demo" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} DeskAI Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;