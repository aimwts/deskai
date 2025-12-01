import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// Note: In a real production app, you might proxy this through a backend to hide the key,
// but for this frontend demo as per instructions, we use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey });

export const analyzeCustomerMessage = async (message: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    // Fallback mock if no API key is present for demo purposes, 
    // although the instructions say to assume it's valid.
    // This is just a safety net for the UI to not crash if the env var is missing in some previews.
    console.warn("No API_KEY found. Returning mock data.");
    return {
      sentiment: 'Negative',
      intent: 'Technical Support',
      suggestedResponse: "I apologize for the inconvenience you're experiencing. Let's look into your issue immediately.",
      keyTopics: ['Connection', 'Outage', 'Frustration']
    };
  }

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

export const generateMarketingVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  // Create a new instance to ensure we use the latest key if it was just selected by the user
  const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
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
