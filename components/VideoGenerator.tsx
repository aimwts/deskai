import React, { useState, useEffect } from 'react';
import { generateMarketingVideo } from '../services/geminiService';
import { Video, Sparkles, Loader2, Play, AlertCircle, ExternalLink, Download } from 'lucide-react';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasKey, setHasKey] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback if not running in the specific environment, assume env var is set
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success after dialog closes (race condition mitigation)
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setVideoUrl(null);
    setStatusMessage('Initializing Veo creative engine...');

    const messages = [
      "Conceptualizing scene dynamics...",
      "Rendering physics and lighting...",
      "Applying texture details...",
      "Finalizing video output..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      setStatusMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 4000);

    try {
      const url = await generateMarketingVideo(prompt, aspectRatio);
      setVideoUrl(url);
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("Requested entity was not found")) {
        alert("API Key issue detected. Please select your paid API key again.");
        setHasKey(false);
      } else {
        alert("Failed to generate video. Please try a different prompt.");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <section id="video-demo" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Veo 3</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Instant <span className="text-purple-500">Video Content</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Create high-quality support tutorials or marketing assets from text descriptions in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Controls */}
          <div className="glass-card rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Video className="w-5 h-5 text-purple-400" />
              Prompt to Video
            </h3>

            {!hasKey ? (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Paid API Key Required</h4>
                <p className="text-slate-400 text-sm mb-4">
                  Veo video generation requires a paid Google Cloud project. Please select your API key to continue.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSelectKey}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Select API Key
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
                  >
                    View Billing Docs <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Describe your video
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all placeholder:text-slate-600"
                    placeholder="e.g., A futuristic customer support drone navigating a neon city..."
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Aspect Ratio
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                        aspectRatio === '16:9'
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-8 h-4 border-2 border-current rounded-sm mx-auto mb-1 opacity-80"></div>
                      <span className="text-xs font-medium block text-center">Landscape (16:9)</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                        aspectRatio === '9:16'
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-4 h-8 border-2 border-current rounded-sm mx-auto mb-1 opacity-80"></div>
                      <span className="text-xs font-medium block text-center">Portrait (9:16)</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Generate Video
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Preview Side */}
          <div className="relative h-full min-h-[400px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
            <div className="relative glass-card rounded-2xl border border-slate-700 h-full flex flex-col overflow-hidden">
              
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                {videoUrl && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                    GENERATED
                  </span>
                )}
              </div>

              <div className="flex-1 bg-black flex items-center justify-center relative p-4">
                {!videoUrl && !loading && (
                  <div className="text-center text-slate-600">
                    <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-800">
                      <Video className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Enter a prompt to start generating</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center z-10 p-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/30 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Creating your video</h4>
                    <p className="text-purple-300 animate-pulse">{statusMessage}</p>
                    <p className="text-slate-500 text-xs mt-4 max-w-xs mx-auto">
                      This process uses complex diffusion models and may take 1-2 minutes.
                    </p>
                  </div>
                )}

                {videoUrl && !loading && (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <video 
                      controls 
                      autoPlay 
                      loop 
                      className={`max-h-[500px] rounded-lg shadow-2xl ${
                        aspectRatio === '9:16' ? 'w-auto h-full' : 'w-full h-auto'
                      }`}
                      src={videoUrl}
                    />
                    <a 
                      href={videoUrl} 
                      download="gemini-veo-video.mp4"
                      className="absolute bottom-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-white/20 hover:scale-105"
                      title="Download Video"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGenerator;