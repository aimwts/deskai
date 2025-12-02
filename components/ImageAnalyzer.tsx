import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, Image as ImageIcon, Loader2, ScanEye, X } from 'lucide-react';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove data:image/png;base64, prefix)
      const base64Data = result.split(',')[1];
      setSelectedImage(result); // Keep full string for preview
      setMimeType(file.type);
      setAnalysis(''); // Clear previous analysis
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setAnalysis('');
    
    try {
      // Pass the raw base64 data without the header
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzeImage(base64Data, mimeType, prompt);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis('');
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="image-analysis" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-4">
            <ScanEye className="w-3 h-3" />
            <span>Gemini 3 Pro Vision</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Visual <span className="text-blue-500">Intelligence</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload screenshots, product photos, or documents. Gemini will analyze them for context, text, and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Upload Area */}
          <div className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] transition-all ${
                selectedImage 
                  ? 'border-slate-700 bg-slate-900/50' 
                  : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-900 cursor-pointer'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !selectedImage && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />

              {selectedImage ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="max-h-[350px] w-auto rounded-lg shadow-xl object-contain"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload an Image</h3>
                  <p className="text-slate-400 mb-6">Drag and drop or click to browse</p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls & Output */}
          <div className="flex flex-col h-full">
            <div className="glass-card rounded-2xl p-8 border border-slate-700 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                Analysis Parameters
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  What should we look for?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Extract the error code from this screenshot, or describe the condition of this returned item..."
                  className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !selectedImage}
                className="w-full mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <ScanEye className="w-5 h-5" />
                    Analyze with Gemini 3 Pro
                  </>
                )}
              </button>

              {/* Result Area */}
              <div className="flex-1 min-h-[200px] bg-slate-950/50 rounded-xl border border-slate-800 p-6 overflow-y-auto">
                {!analysis && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                    <ScanEye className="w-12 h-12 opacity-20 mb-3" />
                    <p>Upload an image and run analysis to see insights here.</p>
                  </div>
                )}
                
                {loading && (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-blue-400 font-mono text-sm animate-pulse">Processing visual data...</p>
                  </div>
                )}

                {analysis && !loading && (
                  <div className="prose prose-invert prose-sm max-w-none">
                     <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                       {analysis}
                     </p>
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

export default ImageAnalyzer;