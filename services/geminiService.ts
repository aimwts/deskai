import { AIAnalysisResult } from "../types";

const apiBase = import.meta.env.VITE_API_BASE_URL || "";

const apiPost = async <T = any>(path: string, body: any): Promise<T> => {
  const response = await fetch(`${apiBase}/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json();
};

const base64ToBlobUrl = (base64: string, mimeType: string) => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
};

export const analyzeCustomerMessage = async (message: string): Promise<AIAnalysisResult> => {
  return apiPost<AIAnalysisResult>('analyze-message', { message });
};

export const rewriteResponse = async (originalText: string, tone: string): Promise<string> => {
  const response = await apiPost<{ text: string }>('rewrite-response', { originalText, tone });
  return response.text;
};

export const generateMarketingVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  const response = await apiPost<{ base64: string; mimeType: string }>('generate-video', {
    prompt,
    aspectRatio,
  });
  return base64ToBlobUrl(response.base64, response.mimeType || 'video/mp4');
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const response = await apiPost<{ text: string }>('analyze-image', { base64Data, mimeType, prompt });
  return response.text;
};

export const analyzeWithSearch = async (query: string): Promise<{ text: string; chunks: any[] }> => {
  return apiPost<{ text: string; chunks: any[] }>('search', { query });
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  const response = await apiPost<{ base64: string }>('speech', { text, voiceName });
  return response.base64;
};