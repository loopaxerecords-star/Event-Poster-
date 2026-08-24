import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy initialize Gemini AI client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Auto-Enhance Event & Design Wizard
app.post('/api/ai/enhance-event', async (req, res) => {
  try {
    const { prompt, location, date, category } = req.body;
    
    if (!prompt && !location) {
      return res.status(400).json({ error: 'Prompt or event details are required' });
    }

    const ai = getGenAIClient();
    
    const systemInstruction = `You are a world-class professional Graphic Designer, Creative Director, and Event Promoter. 
Your goal is to parse event details or a creative prompt and turn it into high-converting, striking, professional event flyer content.
Include stylized date formatting, punchy taglines, badge calls, venue layout suggestions, and a visual background art prompt.`;

    const userPrompt = `Parse and enhance this event request for a professional poster/flyer:
Prompt/Details: "${prompt || ''}"
Location: "${location || 'Downtown'}"
Date: "${date || 'Upcoming Weekend'}"
Category: "${category || 'General'}"

Return JSON matching the schema with polished typography text, ticket CTA, category badge, and a high-quality visual prompt for background art.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artist1: { type: Type.STRING, description: 'Main headlining artist or primary act' },
            artist2: { type: Type.STRING, description: 'Supporting artist 2' },
            artist3: { type: Type.STRING, description: 'Supporting artist 3' },
            artist4: { type: Type.STRING, description: 'Supporting artist 4' },
            venue: { type: Type.STRING, description: 'Venue name' },
            date: { type: Type.STRING, description: 'Event date, e.g. SATURDAY, OCT 24, 2026' },
            time: { type: Type.STRING, description: 'Event time, e.g. 9:00 PM - 3:00 AM' },
            title: { type: Type.STRING, description: 'Main event title or headline' },
            subtitle: { type: Type.STRING, description: 'Catchy subtitle or event slogan' },
            category: { type: Type.STRING, description: 'Event category, e.g., MUSIC, TECH, GALA, FESTIVAL' },
            displayDate: { type: Type.STRING, description: 'Formatted date string, e.g. SATURDAY, OCT 24' },
            address: { type: Type.STRING, description: 'Venue address or location city' },
            ticketPrice: { type: Type.STRING, description: 'Ticket pricing info, e.g. $20 EARLY BIRD / $30 DOOR' },
            organizer: { type: Type.STRING, description: 'Event host or promoter name' },
            callToAction: { type: Type.STRING, description: 'Clear action line, e.g. GET TICKETS @ EVENTBRITE.COM' },
            badgeText: { type: Type.STRING, description: 'Promotional badge text e.g., LIMITED VIP / SPECIAL GUEST' },
            recommendedStyleId: { type: Type.STRING, description: 'Style ID: cyberpunk-neon, modern-minimalist, retro-synthwave, elegant-luxury, vibrant-summer, bold-underground, corporate-tech, organic-nature' },
            weatherPrediction: { type: Type.STRING, description: 'Short forecast prediction for location and date e.g. Clear Sunset 24°C' },
            bgPrompt: { type: Type.STRING, description: 'Detailed visual prompt for generating poster background image' },
          },
          required: ['venue', 'date', 'time', 'bgPrompt']
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : '{}';
    const parsedData = JSON.parse(jsonText);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error enhancing event with AI:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate AI event details' });
  }
});

// AI Background Image Generation Endpoint
app.post('/api/ai/generate-background', async (req, res) => {
  const { prompt, aspectRatio = '1:1' } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for background generation' });
  }

  // Map aspectRatio to valid Gemini image aspect ratios ("1:1", "3:4", "4:3", "9:16", "16:9")
  let targetRatio = '1:1';
  if (aspectRatio === '9:16' || aspectRatio === '3:4' || aspectRatio === '4:3' || aspectRatio === '16:9') {
    targetRatio = aspectRatio;
  }

  // Try AI models in sequence: gemini-3.1-flash-lite-image -> gemini-3.1-flash-image
  const candidateModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];

  for (const modelName of candidateModels) {
    try {
      const ai = getGenAIClient();
      const imageResponse = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              text: `High resolution professional abstract poster backdrop, artistic wallpaper texture, event background art, no text on image: ${prompt}`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: targetRatio as any
          }
        }
      });

      if (imageResponse.candidates && imageResponse.candidates[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            return res.json({ success: true, imageUrl, modelUsed: modelName });
          }
        }
      }
    } catch (error: any) {
      console.warn(`Model ${modelName} failed or quota exceeded:`, error.message || error);
      // Continue to next candidate model or fallback
    }
  }

  // Graceful Fallback: Curated abstract wallpaper based on prompt seed
  const cleanSeed = encodeURIComponent(prompt.slice(0, 40).replace(/[^a-zA-Z0-9]/g, '-'));
  const fallbackImageUrl = `https://picsum.photos/seed/${cleanSeed}/1200/1600`;

  return res.json({
    success: true,
    imageUrl: fallbackImageUrl,
    isFallback: true,
    note: 'Used high-resolution stylized backdrop due to AI image model quota limits.'
  });
});

// Express Vite server startup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Event Poster Designer Server running on http://localhost:${PORT}`);
  });
}

startServer();
