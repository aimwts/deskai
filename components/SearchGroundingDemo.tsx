import React, { useState } from 'react';
import { analyzeWithSearch } from '../services/geminiService';
import { Search, Globe, Loader2, ExternalLink, Sparkles } from 'lucide-react';

const SearchGroundingDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; chunks: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeWithSearch(query);
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ 
        text: "Sorry, I couldn't connect to Google Search at the moment. Please check your API key and try again.", 
        chunks: [] 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="search-demo" className="py-24 bg-slate-900 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
            <Globe className="w-3 h-3" />
            <span>Google Search Grounding</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Real-Time <span className="text-emerald-500">World Knowledge</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Ask questions about current events or trending topics. Gemini connects to Google Search to provide up-to-date, grounded answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="relative mb-12 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-lg"
              placeholder="Ask about recent news, stock prices, or events (e.g., 'Who won the 2024 Super Bowl?')"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query}
              className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Results Area */}
          {(result || loading) && (
            <div className="glass-card rounded-2xl p-8 border border-slate-700 animate-fade-in">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">AI Response</h3>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result?.text}
                    </p>
                  </div>

                  {/* Sources / Citations */}
                  {result?.chunks && result.chunks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-800">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Sources & Citations
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {result.chunks.map((chunk, idx) => {
                          if (chunk.web) {
                            return (
                              <a
                                key={idx}
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all group"
                              >
                                <div className="mt-1 min-w-[16px]">
                                  <Globe className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-300 group-hover:text-emerald-300 truncate">
                                    {chunk.web.title}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    {chunk.web.uri}
                                  </p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchGroundingDemo;