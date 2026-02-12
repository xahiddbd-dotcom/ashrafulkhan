
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

export const generateBio = async (role: string, lang: Language): Promise<{ title: string; desc: string }> => {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Rewrite a professional portfolio hero section for a person with the role: "${role}".
    Language: ${lang === 'en' ? 'English' : 'Bengali'}.
    "title" should be a short, punchy headline (5-8 words).
    "desc" should be a professional description (20-30 words).
    Keep it modern, high-tech, and inspiring.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Recommended approach: define responseSchema for structured JSON output.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
            },
            desc: {
              type: Type.STRING,
            },
          },
          required: ["title", "desc"],
        },
      }
    });

    // Directly access the .text property from GenerateContentResponse.
    const result = JSON.parse(response.text || '{"title": "", "desc": ""}');
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
