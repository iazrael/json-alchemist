import { OpenAIConfig } from '../types';

export const fixJsonWithOpenAI = async (input: string, config: OpenAIConfig): Promise<string> => {
  if (!config.apiKey) throw new Error("API Key is required for Custom AI provider");
  if (!config.baseUrl) throw new Error("Base URL is required for Custom AI provider");

  // Ensure baseUrl doesn't end with slash
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const endpoint = `${baseUrl}/chat/completions`;

  const systemPrompt = `You are a strict JSON converter and repair engine.
Input: A potentially malformed JSON string, JSON5 string, or a Golang struct/map dump.

Task:
1. If the input is Golang (structs, maps, slices):
   - Convert it to valid JSON.
   - Convert "map[string]interface{}" syntax to JSON objects "{}".
   - Convert "StructName{}" syntax to JSON objects "{}".
   - Quote all object keys.
   - If a value is a variable reference or function call, convert it to a string.
2. If the input is malformed JSON/JSON5:
   - Fix syntax errors.
   - Remove comments.
3. If the input looks like LLM conversation history (array of objects with role/content fields), treat it as regular JSON:
   - Fix any syntax errors
   - Ensure output is valid standard JSON format
4. If the input looks like natural language instructions rather than JSON data:
   - Try to convert it to valid JSON if possible
   - For example, extract JSON-like structures or convert the intent into JSON format
5. Return ONLY the valid, minified JSON string.
6. Do not wrap the output in markdown code blocks.
7. Do not include any explanation.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        temperature: 0,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content received from AI provider");

    // Clean up potential markdown
    let cleanText = content.trim();
    if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
    }

    return cleanText.trim();
  } catch (error: any) {
    console.error("OpenAI Fix Error:", error);
    throw new Error(error.message);
  }
};