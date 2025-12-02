import React, { useState, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { AudioWaveform, Play, Pause, Loader2, Volume2, Mic } from 'lucide-react';

const TTSDemo: React.FC = () => {
  const [text, setText] = useState('Welcome to DeskAI. How can I assist you today?');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

  // Decode helper for PCM data
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleGenerateAndPlay = async () => {
    if (!text) return;
    
    // Stop any current playback
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) { /* ignore if already stopped */ }
      sourceRef.current = null;
    }

    setLoading(true);
    setIsPlaying(false);

    try {
      const base64Audio = await generateSpeech(text, voice);
      
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } else if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const pcmData = decode(base64Audio);
      
      // Convert raw PCM to AudioBuffer
      // 16-bit signed integer PCM to Float32 [-1.0, 1.0]
      const int16Data = new Int16Array(pcmData.buffer);
      const buffer = ctx.createBuffer(1, int16Data.length, 24000);
      const channelData = buffer.getChannelData(0);
      
      for (let i = 0; i < int16Data.length; i++) {
        channelData[i] = int16Data[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      
      sourceRef.current = source;
      source.start();
      setIsPlaying(true);

    } catch (error) {
      console.error(error);
      alert("Failed to generate speech. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <section id="tts-demo" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-4">
            <AudioWaveform className="w-3 h-3" />
            <span>Gemini 2.5 TTS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Human-Quality <span className="text-rose-500">Voice Synthesis</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Turn any customer script into natural-sounding speech instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Controls */}
          <div className="glass-card rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Mic className="w-5 h-5 text-rose-400" />
              Speech Configuration
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Script
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all placeholder:text-slate-600"
                placeholder="Type what you want the AI to say..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Voice Model
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {voices.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoice(v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      voice === v
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={isPlaying ? handleStop : handleGenerateAndPlay}
              disabled={loading || !text}
              className={`w-full font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                 isPlaying 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Synthesizing...
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  Stop Audio
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Generate Speech
                </>
              )}
            </button>
          </div>

          {/* Visualization Placeholder */}
          <div className="h-full flex flex-col justify-center items-center relative min-h-[300px] glass-card rounded-2xl border border-slate-700 bg-black/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent"></div>
            
            {loading ? (
               <div className="flex flex-col items-center gap-4 z-10">
                 <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
                 <p className="text-rose-400 animate-pulse">Encoding audio stream...</p>
               </div>
            ) : isPlaying ? (
              <div className="flex items-center justify-center gap-1 h-24 z-10">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 bg-rose-500 rounded-full animate-blob"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDuration: `${0.5 + Math.random()}s`,
                      opacity: 0.8
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="text-center z-10 p-8">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                    <Volume2 className="w-8 h-8 text-rose-400" />
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2">Ready to Speak</h4>
                 <p className="text-slate-500 max-w-xs mx-auto">
                   Select a voice and click generate to hear the output.
                 </p>
              </div>
            )}
            
            {/* Visual background noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-rose-500 rounded-full blur-3xl mix-blend-screen"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TTSDemo;