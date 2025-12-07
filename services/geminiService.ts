import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePaletteWithAI(
  prompt: string,
  count: number,
  baseColor?: string
): Promise<string[]> {
  try {
    const context = baseColor 
      ? `Base the palette around the central color: ${baseColor}. ` 
      : '';
    
    const finalPrompt = `Create a cohesive color palette of exactly ${count} colors. 
    ${context}
    The user description is: "${prompt}".
    Ensure the colors work well together harmoniously.
    Return ONLY a JSON array of Hex color codes strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const colors = JSON.parse(text);
    
    if (Array.isArray(colors)) {
      // Ensure we have correct hex format
      return colors.slice(0, count).map(c => c.startsWith('#') ? c : `#${c}`);
    }
    
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
