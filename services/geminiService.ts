
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Difficulty, GameTopic } from "../types";
import { FALLBACK_TOPICS } from "../constants";

export const generateTopic = async (
  language: Language,
  difficulty: Difficulty
): Promise<GameTopic> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-flash-preview';

  const langNames = {
    [Language.ENGLISH]: 'English',
    [Language.FINNISH]: 'Finnish',
    [Language.VIETNAMESE]: 'Vietnamese'
  };

  const prompt = `Generate a ${difficulty}-difficulty word guessing topic in ${langNames[language]} language.
  The secret word should be a common, family-friendly object, animal, or profession.
  Provide:
  1. The secret word or phrase (max 3 words).
  2. A category hint.
  3. A list of 5 forbidden words related to the secret word that cannot be used in descriptions.
  
  The response must be in JSON format matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            secret: { type: Type.STRING },
            category: { type: Type.STRING },
            forbidden: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["secret", "category", "forbidden"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      secret: data.secret || 'Unknown',
      category: data.category || 'Miscellaneous',
      forbidden: data.forbidden || []
    };
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    const fallbackList = FALLBACK_TOPICS[language];
    return fallbackList[Math.floor(Math.random() * fallbackList.length)];
  }
};

export const generateImageClue = async (
  topic: GameTopic,
  aspectRatio: string = "1:1",
  imageSize: string = "1K"
): Promise<string | null> => {
  // Image generation requires paid key check handled by App.tsx
  // This service assumes API_KEY is set or available.
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const model = 'gemini-3-pro-image-preview';

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: `A vibrant, clear 3D illustration of a ${topic.secret} in its natural environment, stylized for a board game visual aid. No text.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image API Error:", error);
    return null;
  }
};
