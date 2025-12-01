import React, { useState } from 'react';
import { analyzeCustomerMessage } from '../services/geminiService';
import { AIAnalysisResult } from '../types';
import { Send, Loader2, MessageSquare, BrainCircuit, Sparkles, Terminal } from 'lucide-react';

const AIDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeCustomerMessage(input);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze. Please try again or check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const predefinedQueries = [
    "I've been waiting for my refund for 2 weeks! This is unacceptable.",
    "Can you help me upgrade to the enterprise plan?",
    "The app keeps crashing when I try to export PDF.",
  ];

  return (
    <section id="demo" className="py-24 relative bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Experience the <span className="text-indigo-500">Neural Engine</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            See how DeskAI instantly analyzes customer intent, sentiment, and drafts responses in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Input Side */}
          <div className="glass-card rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Incoming Customer Ticket
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Simulate a customer query
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-slate-600"
                placeholder="Type a message here (e.g., 'My order arrived damaged...')"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {predefinedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
                >
                  "{q.substring(0, 30)}..."
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !input}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with Gemini 2.5
                </>
              )}
            </button>
          </div>

          {/* Output Side */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur opacity-20"></div>
            <div className="relative glass-card rounded-2xl p-8 border border-slate-700 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                  <BrainCircuit className="w-5 h-5 text-pink-500" />
                  Live Agent Assist
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ONLINE
                </span>
              </div>

              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <Terminal className="w-16 h-16 opacity-20" />
                  <p>Waiting for input data stream...</p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-indigo-400 font-mono text-sm animate-pulse">Analyzing semantic patterns...</p>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sentiment</p>
                      <div className={`text-lg font-bold flex items-center gap-2 ${
                        result.sentiment === 'Positive' ? 'text-emerald-400' : 
                        result.sentiment === 'Negative' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {result.sentiment}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Detected Intent</p>
                      <p className="text-lg font-bold text-white">{result.intent}</p>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Key Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keyTopics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Response */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-indigo-400 font-bold uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Drafted Reply
                      </p>
                      <button className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition-colors" onClick={() => navigator.clipboard.writeText(result.suggestedResponse)}>
                        Copy
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      "{result.suggestedResponse}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
