import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const createAi = () => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

const base64FromArrayBuffer = (buffer) => Buffer.from(buffer).toString('base64');

app.get('/api/key-check', (req, res) => {
  if (!apiKey) {
    return res.status(403).json({ ok: false, error: 'GEMINI_API_KEY not configured' });
  }
  return res.json({ ok: true });
});

app.post('/api/analyze-message', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const ai = createAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an advanced Customer Experience AI Agent. Analyze the following customer message.

      Message: "${message}"

      Return a JSON object with:
      1. sentiment: One of "Positive", "Neutral", "Negative".
      2. intent: The likely goal of the customer (e.g., "Refund Request", "Technical Support", "Sales Inquiry").
      3. suggestedResponse: A professional, empathetic, and short response (max 2 sentences).
      4. keyTopics: An array of strings representing key topics detected.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
            intent: { type: Type.STRING },
            suggestedResponse: { type: Type.STRING },
            keyTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['sentiment', 'intent', 'suggestedResponse', 'keyTopics']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('Empty AI response');
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Analyze Message Error:', error);
    return res.status(500).json({ error: 'Failed to analyze message' });
  }
});

app.post('/api/rewrite-response', async (req, res) => {
  const { originalText, tone } = req.body;
  if (!originalText || !tone) return res.status(400).json({ error: 'originalText and tone are required' });

  try {
    const ai = createAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following customer service response to be more ${tone}. Keep the core meaning but change the style.\n\nOriginal: "${originalText}"`,
    });

    return res.json({ text: response.text || originalText });
  } catch (error) {
    console.error('Rewrite Error:', error);
    return res.status(500).json({ error: 'Failed to rewrite response' });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  const { base64Data, mimeType, prompt } = req.body;
  if (!base64Data || !mimeType) return res.status(400).json({ error: 'base64Data and mimeType are required' });

  try {
    const ai = createAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          {
            text: prompt || 'Analyze this image in detail. Describe what is happening, identify key objects or text, and provide insights relevant to customer support or visual inspection.'
          }
        ]
      }
    });

    return res.json({ text: response.text || 'No analysis generated.' });
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    const ai = createAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return res.json({
      text: response.text || 'No response generated.',
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({ error: 'Failed to perform search grounded analysis' });
  }
});

app.post('/api/speech', async (req, res) => {
  const { text, voiceName } = req.body;
  if (!text || !voiceName) return res.status(400).json({ error: 'text and voiceName are required' });

  try {
    const ai = createAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error('No audio data generated');
    return res.json({ base64: audioData });
  } catch (error) {
    console.error('Speech Error:', error);
    return res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.post('/api/generate-video', async (req, res) => {
  const { prompt, aspectRatio } = req.body;
  if (!prompt || !aspectRatio) return res.status(400).json({ error: 'prompt and aspectRatio are required' });

  try {
    const ai = createAi();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error('Video generation failed or returned no URI.');

    const fileResponse = await fetch(`${videoUri}&key=${apiKey}`);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download video: ${fileResponse.statusText}`);
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const base64 = base64FromArrayBuffer(arrayBuffer);
    return res.json({ base64, mimeType: 'video/mp4' });
  } catch (error) {
    console.error('Video Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate video' });
  }
});

const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`DeskAI backend proxy listening on http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`DeskAI backend proxy listening on http://localhost:${port}`);
});
