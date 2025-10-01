
import express from 'express';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

dotenv.config();

const router = express.Router();

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check route
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Gemini AI!' });
});

// Image generation route
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-preview-image-generation'
    });

    // Generate content with image modality
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    });

    const response = await result.response;

    // Extract image data from response
    let imageBase64 = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      throw new Error('No image data received from Gemini');
    }

    res.status(200).json({ photo: imageBase64 });
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: error?.message || 'Something went wrong'
    });
  }
});

export default router;