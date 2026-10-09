import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  item_name: string;
  location?: string;
  image_base64?: string;
}

interface AnalysisResponse {
  item_name: string;
  category: string;
  recyclability: "recyclable" | "non-recyclable" | "depends-on-local-rules";
  disposal_instructions: string;
  reuse_ideas: string;
  environmental_advice: string;
  estimated_co2_saved_kg: number;
  estimated_waste_diverted_kg: number;
  confidence: "high" | "medium" | "low";
  source: "ai" | "fallback";
  chat_response?: string;
}

function fallbackAnalysis(itemName: string): AnalysisResponse {
  const lower = itemName.toLowerCase().trim();

  const categoryMap: Record<string, Omit<AnalysisResponse, "item_name" | "source">> = {
    plastic: {
      category: "Plastic",
      recyclability: "depends-on-local-rules",
      disposal_instructions: "1. Check the recycling number (1-7) on the item.\n2. Rinse out residue.\n3. Types 1 (PET) and 2 (HDPE) are widely accepted.\n4. Check local guidelines for other types.\n5. Plastic bags need separate drop-off.",
      reuse_ideas: "Self-watering planters, storage containers, mosaic art from caps.",
      environmental_advice: "Plastic takes 400+ years to decompose. Recycling one bottle saves enough energy to power a 60W bulb for 3 hours.",
      estimated_co2_saved_kg: 0.05,
      estimated_waste_diverted_kg: 0.02,
      confidence: "medium",
    },
    paper: {
      category: "Paper",
      recyclability: "recyclable",
      disposal_instructions: "1. Ensure paper is clean and dry.\n2. Flatten and stack.\n3. Remove plastic windows from envelopes.\n4. Place in paper recycling bin.\n5. Bag shredded paper separately.",
      reuse_ideas: "Scratch notes, papier-mâché crafts, compost mulch.",
      environmental_advice: "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
      estimated_co2_saved_kg: 0.5,
      estimated_waste_diverted_kg: 0.1,
      confidence: "medium",
    },
    cardboard: {
      category: "Cardboard",
      recyclability: "recyclable",
      disposal_instructions: "1. Remove tape and staples.\n2. Flatten boxes completely.\n3. Keep dry.\n4. Place in cardboard recycling.\n5. Separate greasy parts of pizza boxes.",
      reuse_ideas: "Drawer organizers, garden weed barriers, pet play structures.",
      environmental_advice: "Recycling one ton of cardboard saves 9 cubic yards of landfill space.",
      estimated_co2_saved_kg: 0.3,
      estimated_waste_diverted_kg: 0.25,
      confidence: "medium",
    },
    glass: {
      category: "Glass",
      recyclability: "recyclable",
      disposal_instructions: "1. Rinse thoroughly.\n2. Remove lids (recycle separately).\n3. Don't include broken glass, light bulbs, or window glass.\n4. Sort by color if required.\n5. Place in glass recycling bin.",
      reuse_ideas: "Storage jars, candle holders, plant propagation vessels.",
      environmental_advice: "Glass is 100% recyclable and can be recycled endlessly without quality loss.",
      estimated_co2_saved_kg: 0.15,
      estimated_waste_diverted_kg: 0.3,
      confidence: "medium",
    },
    metal: {
      category: "Metal",
      recyclability: "recyclable",
      disposal_instructions: "1. Rinse cans and containers.\n2. Remove paper labels.\n3. Crush to save space if local program allows.\n4. Place in metal recycling bin.\n5. Clean foil and ball up before recycling.",
      reuse_ideas: "Lanterns from punched cans, pencil holders, plant pots.",
      environmental_advice: "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
      estimated_co2_saved_kg: 0.4,
      estimated_waste_diverted_kg: 0.03,
      confidence: "medium",
    },
    electronic: {
      category: "Electronic Waste",
      recyclability: "depends-on-local-rules",
      disposal_instructions: "1. Do NOT put in regular trash.\n2. Remove batteries.\n3. Wipe personal data.\n4. Take to e-waste collection point.\n5. Consider donation if device works.",
      reuse_ideas: "DIY electronics projects, external storage from old drives, component recovery.",
      environmental_advice: "One million cell phones contain 35,000 lbs of copper and 75 lbs of gold.",
      estimated_co2_saved_kg: 2.0,
      estimated_waste_diverted_kg: 0.5,
      confidence: "medium",
    },
    food: {
      category: "Organic Waste",
      recyclability: "recyclable",
      disposal_instructions: "1. Remove non-organic packaging.\n2. Place in compost bin.\n3. Balance green and brown materials.\n4. Avoid meat/dairy in home compost.\n5. Check for community composting.",
      reuse_ideas: "Vegetable broth from scraps, coffee ground fertilizer, eggshell calcium for soil.",
      environmental_advice: "Organic waste in landfills produces methane, 25x more potent than CO2.",
      estimated_co2_saved_kg: 0.08,
      estimated_waste_diverted_kg: 0.15,
      confidence: "medium",
    },
  };

  const keywordMap: Record<string, string> = {
    plastic: "plastic", bottle: "plastic", pet: "plastic", container: "plastic", wrapper: "plastic", bag: "plastic",
    paper: "paper", newspaper: "paper", magazine: "paper", book: "paper", notebook: "paper", envelope: "paper",
    cardboard: "cardboard", box: "cardboard", carton: "cardboard",
    glass: "glass", jar: "glass",
    metal: "metal", aluminum: "metal", can: "metal", tin: "metal", steel: "metal", foil: "metal",
    electronic: "electronic", phone: "electronic", laptop: "electronic", computer: "electronic", charger: "electronic", battery: "electronic", cable: "electronic",
    food: "food", organic: "food", fruit: "food", vegetable: "food", peel: "food", compost: "food",
  };

  for (const [keyword, catKey] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      const cat = categoryMap[catKey];
      return { item_name: itemName.trim(), source: "fallback", ...cat };
    }
  }

  return {
    item_name: itemName.trim(),
    category: "Unknown",
    recyclability: "depends-on-local-rules",
    disposal_instructions: "1. Check for recycling symbols.\n2. Look up local recycling guidelines.\n3. When in doubt, keep it out of recycling.\n4. Consider reuse or donation.",
    reuse_ideas: "Consider if the item could be repurposed, donated, or given to someone who needs it.",
    environmental_advice: "Every item kept out of landfill makes a difference. Check local guidelines when unsure.",
    estimated_co2_saved_kg: 0,
    estimated_waste_diverted_kg: 0,
    confidence: "low",
    source: "fallback",
  };
}

async function callOpenAI(
  apiKey: string,
  itemName: string,
  location: string | undefined,
  imageBase64: string | undefined,
  isChat: boolean,
  chatHistory: Array<{ role: string; content: string }> | undefined,
): Promise<AnalysisResponse | { chat_response: string; source: string }> {
  const systemPrompt = `You are an expert recycling and waste management assistant. Analyze the waste item and provide a structured response.

Rules:
- Identify the waste category from: Plastic, Paper, Cardboard, Glass, Metal, Electronic Waste, Organic Waste, Textile, Hazardous Waste, or Unknown.
- State recyclability as: "recyclable", "non-recyclable", or "depends-on-local-rules".
- NEVER invent specific recycling regulations or nearby facilities. If local rules matter, advise the user to check local guidelines.
- Provide practical, step-by-step disposal instructions.
- Suggest at least 2 creative reuse or upcycling ideas.
- Give honest environmental advice with widely-known facts only.
- Express uncertainty when information is insufficient.
- Estimated CO2 saved and waste diverted should be conservative estimates based on typical item weight. Use 0 if truly unknown.
- If a location is provided, acknowledge it but do not invent location-specific rules.

${imageBase64 ? "An image has been provided. Use it to help identify the item. If you cannot confidently identify it from the image, say so." : "No image was provided — analyze based on the item name only."}

Respond ONLY with valid JSON in this exact format:
{
  "item_name": "the item name",
  "category": "the waste category",
  "recyclability": "recyclable | non-recyclable | depends-on-local-rules",
  "disposal_instructions": "step-by-step instructions separated by \\n",
  "reuse_ideas": "reuse ideas separated by \\n",
  "environmental_advice": "environmental advice",
  "estimated_co2_saved_kg": 0.0,
  "estimated_waste_diverted_kg": 0.0,
  "confidence": "high | medium | low"
}`;

  if (isChat && chatHistory) {
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const chatResponse = data.choices?.[0]?.message?.content ?? "I could not generate a response.";
    return { chat_response: chatResponse, source: "ai" };
  }

  const userContent = imageBase64
    ? [
        { type: "text", text: `Analyze this waste item: "${itemName}".${location ? ` Location: ${location}.` : ""}` },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
      ]
    : `Analyze this waste item: "${itemName}".${location ? ` Location: ${location}.` : ""}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent as object },
      ],
      max_tokens: 600,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error("Empty response from AI");

  let parsed: Record<string, unknown>;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  return {
    item_name: (parsed.item_name as string) || itemName,
    category: (parsed.category as string) || "Unknown",
    recyclability: (parsed.recyclability as AnalysisResponse["recyclability"]) || "depends-on-local-rules",
    disposal_instructions: (parsed.disposal_instructions as string) || "",
    reuse_ideas: (parsed.reuse_ideas as string) || "",
    environmental_advice: (parsed.environmental_advice as string) || "",
    estimated_co2_saved_kg: Number(parsed.estimated_co2_saved_kg) || 0,
    estimated_waste_diverted_kg: Number(parsed.estimated_waste_diverted_kg) || 0,
    confidence: (parsed.confidence as AnalysisResponse["confidence"]) || "medium",
    source: "ai",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { item_name, location, image_base64, is_chat, chat_history, save_to_db } = body as {
      item_name?: string;
      location?: string;
      image_base64?: string;
      is_chat?: boolean;
      chat_history?: Array<{ role: string; content: string }>;
      save_to_db?: boolean;
    };

    if (!item_name || !item_name.trim()) {
      return new Response(
        JSON.stringify({ error: "Item name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (image_base64 && image_base64.length > 10_000_000) {
      return new Response(
        JSON.stringify({ error: "Image too large (max 10MB)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      if (is_chat) {
        const fallbackResponse = generateFallbackChat(item_name, chat_history);
        return new Response(
          JSON.stringify({ chat_response: fallbackResponse, source: "fallback" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const fallback = fallbackAnalysis(item_name);
      if (location) fallback.recyclability_note = `Local rules may apply in ${location}. Check your local recycling guidelines.`;

      if (save_to_db !== false) {
        await saveScan(fallback);
      }

      return new Response(
        JSON.stringify(fallback),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    try {
      const result = await callOpenAI(openaiKey, item_name, location, image_base64, !!is_chat, chat_history);

      if (!is_chat && save_to_db !== false) {
        await saveScan(result as AnalysisResponse);
      }

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (aiError) {
      const fallback = fallbackAnalysis(item_name);
      fallback.environmental_advice = `[AI was unavailable — using built-in knowledge base]\n${fallback.environmental_advice}`;

      if (save_to_db !== false) {
        await saveScan(fallback);
      }

      return new Response(
        JSON.stringify({ ...fallback, ai_error: (aiError as Error).message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

async function saveScan(result: AnalysisResponse): Promise<void> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) return;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    await supabase.from("scans").insert({
      item_name: result.item_name,
      category: result.category,
      recyclability: result.recyclability,
      disposal_instructions: result.disposal_instructions,
      reuse_ideas: result.reuse_ideas,
      environmental_advice: result.environmental_advice,
      estimated_co2_saved_kg: result.estimated_co2_saved_kg,
      estimated_waste_diverted_kg: result.estimated_waste_diverted_kg,
      analysis_mode: result.source,
    });
  } catch {
    // Non-critical — don't fail the request if DB save fails
  }
}

function generateFallbackChat(
  message: string,
  history: Array<{ role: string; content: string }> | undefined,
): string {
  const lower = message.toLowerCase().trim();
  const lastUserMessages = (history ?? []).filter((m) => m.role === "user");
  const contextItem = lastUserMessages.length > 0 ? lastUserMessages[lastUserMessages.length - 1].content : undefined;

  const greetings = ["hello", "hi", "hey", "good morning"];
  if (greetings.some((g) => lower.includes(g))) {
    return "Hello! I am the Smart Recycling Assistant (running in offline mode). I can help you identify waste items and give recycling advice. Type an item name like 'plastic bottle' or ask a recycling question!";
  }

  if (lower.includes("thank")) {
    return "You're welcome! Every recycling action makes a difference. Anything else you'd like to know?";
  }

  const fallback = fallbackAnalysis(message);
  if (fallback.category !== "Unknown") {
    return `Here is what I found for "${fallback.item_name}":\n\nCategory: ${fallback.category}\nRecyclability: ${fallback.recyclability.replace(/-/g, " ")}\n\nDisposal:\n${fallback.disposal_instructions}\n\nReuse ideas:\n${fallback.reuse_ideas}`;
  }

  if (contextItem) {
    const ctx = fallbackAnalysis(contextItem);
    if (lower.includes("recycl") || lower.includes("dispose") || lower.includes("bin")) {
      return `For ${ctx.item_name}: ${ctx.recyclability === "recyclable" ? "This is recyclable." : ctx.recyclability === "non-recyclable" ? "This is not recyclable through standard programs." : "Recyclability depends on local rules."}\n\n${ctx.disposal_instructions}`;
    }
  }

  return "I'm running in offline mode (no AI API key configured), but I can still help with common items like plastic bottles, paper, cardboard, glass, metal, electronics, and food waste. Try typing one of those, or ask a general recycling question!";
}
