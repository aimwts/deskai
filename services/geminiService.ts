import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AIAnalysisResult } from "../types";

const getApiKey = (): string => {
  return (import.meta.env.VITE_API_KEY as string) || (window as any).__APP_CONFIG__?.VITE_API_KEY || "";
};

export const analyzeCustomerMessage = async (message: string): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API key found. Returning mock data.");
    return {
      sentiment: 'Negative',
      intent: 'Technical Support',
      suggestedResponse: "I apologize for the inconvenience you're experiencing. Let's look into your issue immediately.",
      keyTopics: ['Connection', 'Outage', 'Frustration']
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an advanced Customer Experience AI Agent. Analyze the following customer message.
      
      Message: "${message}"
      
      Return a JSON object with:
      1. sentiment: One of "Positive", "Neutral", "Negative".
      2. intent: The likely goal of the customer (e.g., "Refund Request", "Technical Support", "Sales Inquiry").
      3. suggestedResponse: A professional, empathetic, and short response (max 2 sentences).
      4. keyTopics: An array of strings representing key topics detected.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
            intent: { type: Type.STRING },
            suggestedResponse: { type: Type.STRING },
            keyTopics: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["sentiment", "intent", "suggestedResponse", "keyTopics"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze message.");
  }
};

export const rewriteResponse = async (originalText: string, tone: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return originalText;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following customer service response to be more ${tone}. Keep the core meaning but change the style.
      
      Original: "${originalText}"`,
    });

    return response.text || originalText;
  } catch (error) {
    console.error("Gemini Rewrite Error:", error);
    return originalText;
  }
};

export const generateMarketingVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key required");

  // Create a new instance to ensure we use the latest key if it was just selected by the user
  const currentAi = new GoogleGenAI({ apiKey });
  
  try {
    let operation = await currentAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await currentAi.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Video generation failed or returned no URI.");
    }

    // Fetch the actual video content using the API key
    const response = await fetch(`${videoUri}&key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo API Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key required");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt || "Analyze this image in detail. Describe what is happening, identify key objects or text, and provide insights relevant to customer support or visual inspection."
          }
        ]
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const analyzeWithSearch = async (query: string): Promise<{ text: string; chunks: any[] }> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key required");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "No response generated.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw new Error("Failed to perform search grounded analysis.");
  }
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key required");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
        throw new Error("No audio data generated");
    }
    return audioData;

  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};