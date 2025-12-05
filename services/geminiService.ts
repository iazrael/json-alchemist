import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fixJsonWithGemini = async (malformedJson: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a strict JSON converter and repair engine.
      
      Input: A potentially malformed JSON string, JSON5 string, or a Golang struct/map dump.
      
      Task:
      1. If the input is Golang (structs, maps, slices):
         - Convert it to valid JSON.
         - Convert "map[string]interface{}" syntax to JSON objects "{}".
         - Convert "StructName{}" syntax to JSON objects "{}".
         - Quote all object keys.
         - If a value is a variable reference (e.g. config.Value) or function call (e.g. Call(x)) that cannot be resolved to a literal, convert the expression into a string.
      2. If the input is malformed JSON/JSON5:
         - Fix syntax errors (missing quotes, trailing commas, incorrect brackets).
         - Remove comments.
      3. If the input looks like LLM conversation history (array of objects with role/content fields), treat it as regular JSON:
         - Fix any syntax errors
         - Ensure output is valid standard JSON format
      4. Return ONLY the valid, minified JSON string.
      5. Do not wrap the output in markdown code blocks.
      6. Do not include any explanation.

      Input:
      ${malformedJson}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thought for syntax fixing
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential markdown if the model disobeys
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
    }
    
    return cleanText.trim();
  } catch (error: any) {
    console.error("AI Fix Error:", error);
    throw new Error("Failed to process with AI. " + (error.message || ""));
  }
};