import type { AnalysisResult, ChatMessage } from './supabase';
import { analyzeItem, generateFallbackChatResponse } from './recyclingEngine';
import { LANGUAGE_INSTRUCTIONS } from './languages';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recycle-ai`;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function analyzeWasteItem(
  itemName: string,
  location?: string,
  imageBase64?: string,
): Promise<AnalysisResult> {
  if (!itemName.trim()) {
    throw new Error('Please enter an item name.');
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        item_name: itemName,
        location: location || undefined,
        image_base64: imageBase64 || undefined,
        is_chat: false,
        save_to_db: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      item_name: data.item_name,
      category: data.category,
      recyclability: data.recyclability,
      disposal_instructions: data.disposal_instructions,
      reuse_ideas: data.reuse_ideas,
      environmental_advice: data.environmental_advice,
      safety_precautions: data.safety_precautions || '',
      estimated_co2_saved_kg: data.estimated_co2_saved_kg,
      estimated_waste_diverted_kg: data.estimated_waste_diverted_kg,
      confidence: data.confidence || 'medium',
      source: data.source || 'fallback',
    };
  } catch (err) {
    const fallback = analyzeItem(itemName, location);
    if ((err as Error).message.includes('Failed to fetch')) {
      fallback.environmental_advice = `[Running in offline mode — using built-in knowledge base]\n${fallback.environmental_advice}`;
    }
    return fallback;
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  contextItem?: string,
  language?: string,
): Promise<{ content: string; source: 'ai' | 'fallback' }> {
  if (!message.trim()) {
    return { content: 'Please type a message.', source: 'fallback' };
  }

  const chatHistory = history.map((m) => ({ role: m.role, content: m.content }));
  const langInstruction = LANGUAGE_INSTRUCTIONS[language || 'en'] || LANGUAGE_INSTRUCTIONS.en;

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        item_name: message,
        is_chat: true,
        chat_history: chatHistory,
        save_to_db: false,
        language: language || 'en',
        language_instruction: langInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const content = data.chat_response;
    if (!content) {
      throw new Error('The assistant returned an empty response. Please try again.');
    }

    return {
      content,
      source: data.source || 'fallback',
    };
  } catch {
    return {
      content: generateFallbackChatResponse(message, contextItem),
      source: 'fallback',
    };
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return 'Please upload a JPG, PNG, WebP, or GIF image.';
  }
  if (file.size > 10_000_000) {
    return 'Image must be smaller than 10MB.';
  }
  return null;
}
