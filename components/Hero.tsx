import React from 'react';
import { ArrowRight, Bot, ShieldCheck, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Gradients & Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-sm font-medium text-indigo-200">New: Gemini 2.5 Integration Live</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          <span className="block text-white mb-2">Customer Experience</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Reimagined by AI
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
          Stop managing tickets. Start solving problems. DeskAI unifies contact center operations with autonomous agents that resolve 80% of queries instantly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#demo" className="group flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            Try the Interactive Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg glass-card hover:bg-white/10 transition-all border border-white/10 text-white">
            View Documentation
          </a>
        </div>

        {/* Stats / Trust Badges */}
        <div className="mt-20 pt-10 border-t border-slate-800 grid grid-cols-2 gap-8 md:grid-cols-4 items-center opacity-70">
          <div className="flex flex-col items-center gap-2">
             <Bot className="w-8 h-8 text-indigo-400" />
             <span className="font-semibold text-lg">24/7 Autonomy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <Zap className="w-8 h-8 text-yellow-400" />
             <span className="font-semibold text-lg">50ms Latency</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <ShieldCheck className="w-8 h-8 text-emerald-400" />
             <span className="font-semibold text-lg">Enterprise Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <span className="text-2xl font-bold text-white">98%</span>
             <span className="font-semibold text-lg">CSAT Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;