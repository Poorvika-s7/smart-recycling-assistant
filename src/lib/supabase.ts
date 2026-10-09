import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recyclability = 'recyclable' | 'non-recyclable' | 'depends-on-local-rules';

export type AnalysisMode = 'ai' | 'fallback';

export interface Scan {
  id: string;
  item_name: string;
  category: string;
  recyclability: Recyclability;
  disposal_instructions: string;
  reuse_ideas: string;
  environmental_advice: string;
  safety_precautions: string | null;
  estimated_co2_saved_kg: number;
  estimated_waste_diverted_kg: number;
  analysis_mode: AnalysisMode;
  image_filename: string | null;
  location: string | null;
  created_at: string;
}

export interface AnalysisResult {
  item_name: string;
  category: string;
  recyclability: Recyclability;
  disposal_instructions: string;
  reuse_ideas: string;
  environmental_advice: string;
  safety_precautions: string;
  estimated_co2_saved_kg: number;
  estimated_waste_diverted_kg: number;
  confidence: 'high' | 'medium' | 'low';
  source: AnalysisMode;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: AnalysisMode;
}

export interface NewScanInput {
  item_name: string;
  category: string;
  recyclability: Recyclability;
  disposal_instructions: string;
  reuse_ideas: string;
  environmental_advice: string;
  safety_precautions: string | null;
  estimated_co2_saved_kg: number;
  estimated_waste_diverted_kg: number;
  analysis_mode: AnalysisMode;
  image_filename: string | null;
  location: string | null;
}
