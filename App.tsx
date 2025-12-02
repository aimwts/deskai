import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Customers from './components/Customers';
import Pricing from './components/Pricing';
import AIDemo from './components/AIDemo';
import VideoGenerator from './components/VideoGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import TTSDemo from './components/TTSDemo';
import SearchGroundingDemo from './components/SearchGroundingDemo';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Customers />
        <Features />
        <AIDemo />
        <ImageAnalyzer />
        <TTSDemo />
        <VideoGenerator />
        <SearchGroundingDemo />
        <Pricing />
        
        {/* Simple CTA Section before Footer */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your CX?</h2>
             <p className="text-slate-300 text-lg mb-8">Join 20,000+ companies delivering exceptional support with DeskAI.</p>
             <a href="#demo" className="inline-block bg-white text-indigo-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
               Start Free Trial
             </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default App;