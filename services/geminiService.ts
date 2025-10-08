import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

// Fix: Adhere to Gemini API coding guidelines for API key handling.
// The API key must be sourced exclusively from `process.env.API_KEY`.
// This change also resolves the TypeScript error: "Property 'env' does not exist on type 'ImportMeta'".
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> => {
  if (!text.trim()) {
    return "";
  }
  
  // Fix: Removed explicit API key check. Per guidelines, we assume the API key
  // is pre-configured and valid. The try-catch block will handle any runtime
  // authentication errors if the key is missing or invalid.
  try {
    const systemInstruction = `You are an expert translator specializing in the Bodo language (written in Devanagari script) and English. Your task is to translate the given text accurately.
- When translating to Bodo, use the Devanagari script.
- Provide ONLY the translated text as a raw string.
- Do not include any extra explanations, commentary, formatting, or labels like "Translation:".
- If the input text is a single word or a short common phrase, provide the most natural and common translation.
- Preserve the original tone and intent as much as possible.`;

    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gem-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Lower temperature for more deterministic, accurate translations
      }
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error translating text:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "Error: The provided API key is not valid. Please check your configuration.";
    }
    return "Error: Could not get a translation. Please try again.";
  }
};
