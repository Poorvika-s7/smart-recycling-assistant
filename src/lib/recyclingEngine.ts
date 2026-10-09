import type { AnalysisResult, Recyclability } from './supabase';

interface WasteCategory {
  category: string;
  recyclability: Recyclability;
  disposalInstructions: string;
  reuseIdeas: string;
  environmentalAdvice: string;
  safetyPrecautions: string;
  co2SavedKg: number;
  wasteDivertedKg: number;
  keywords: string[];
}

const CATEGORIES: WasteCategory[] = [
  {
    category: 'Plastic',
    recyclability: 'depends-on-local-rules',
    disposalInstructions: [
      '1. Check the recycling number on the bottom of the item (1-7).',
      '2. Rinse out any food or liquid residue.',
      '3. Remove caps and labels if your local program requires it.',
      '4. Types 1 (PET) and 2 (HDPE) are widely accepted — place in recycling bin.',
      '5. Types 3-7 may not be accepted — check your local recycling guidelines.',
      '6. Plastic bags and film require separate drop-off at grocery store collection points.',
    ].join('\n'),
    reuseIdeas: [
      'Cut plastic bottles into self-watering planters for herbs.',
      'Use plastic containers for organizing small hardware or craft supplies.',
      'Turn bottle caps into mosaic art pieces.',
    ].join('\n'),
    environmentalAdvice:
      'Plastic takes 400+ years to decompose. Recycling one plastic bottle saves enough energy to power a 60W bulb for 3 hours. Reducing single-use plastic has the biggest impact.',
    safetyPrecautions: 'Rinse containers thoroughly to avoid contamination. Do not recycle plastic with food residue. Sharp plastic edges can cause cuts — handle carefully.',
    co2SavedKg: 0.05,
    wasteDivertedKg: 0.02,
    keywords: ['plastic', 'bottle', 'PET', 'HDPE', 'container', 'wrapper', 'bag', 'plastic bottle', 'jug', 'tupperware', 'packaging', 'cling film', 'plastic cup', 'plastic container', 'yogurt cup'],
  },
  {
    category: 'Paper',
    recyclability: 'recyclable',
    disposalInstructions: [
      '1. Ensure paper is clean and dry — no grease or food stains.',
      '2. Flatten and stack neatly to save space in the recycling bin.',
      '3. Remove any plastic windows from envelopes if possible.',
      '4. Place in the paper recycling bin or take to a paper collection point.',
      '5. Shredded paper should be bagged separately — many programs do not accept loose shredding.',
    ].join('\n'),
    reuseIdeas: [
      'Use old paper for scratch notes, lists, or sketching.',
      'Create papier-mâché bowls or decorative items.',
      'Shred for compost or garden mulch (avoid glossy/colored paper).',
    ].join('\n'),
    environmentalAdvice:
      'Recycling one ton of paper saves approximately 17 trees, 7,000 gallons of water, and 4,000 kWh of electricity. Paper can be recycled 5-7 times before fibers become too short.',
    safetyPrecautions: 'No special safety precautions needed. Avoid paper with chemical contamination or hazardous substance residue.',
    co2SavedKg: 0.5,
    wasteDivertedKg: 0.1,
    keywords: ['paper', 'newspaper', 'magazine', 'book', 'notebook', 'envelope', 'letter', 'printer paper', 'flyer', 'leaflet', 'receipt', 'cardstock', 'wrapping paper'],
  },
  {
    category: 'Cardboard',
    recyclability: 'recyclable',
    disposalInstructions: [
      '1. Remove all tape, labels, and staples from the cardboard.',
      '2. Flatten boxes completely to save space.',
      '3. Ensure cardboard is dry — wet cardboard cannot be recycled.',
      '4. Place in the cardboard recycling bin or take to a collection point.',
      '5. Pizza boxes with grease stains should have the clean part recycled and the greasy part composted or trashed.',
    ].join('\n'),
    reuseIdeas: [
      'Cut and fold into drawer organizers or storage dividers.',
      'Use as weed barriers in garden beds.',
      'Build play forts or cat houses for pets.',
    ].join('\n'),
    environmentalAdvice:
      'Recycling one ton of cardboard saves about 9 cubic yards of landfill space and 46 gallons of oil. Cardboard is one of the most recyclable materials and can be recycled up to 7 times.',
    safetyPrecautions: 'Remove staples and tape to avoid injury. Be cautious of sharp edges from cut cardboard.',
    co2SavedKg: 0.3,
    wasteDivertedKg: 0.25,
    keywords: ['cardboard', 'box', 'carton', 'corrugated', 'shipping box', 'moving box', 'pizza box', 'cardboard box', 'packing box', 'delivery box', 'cardboard tube'],
  },
  {
    category: 'Glass',
    recyclability: 'recyclable',
    disposalInstructions: [
      '1. Rinse the glass container thoroughly.',
      '2. Remove metal or plastic lids (recycle separately).',
      '3. Do NOT recycle broken glass, light bulbs, or window glass with containers — they have different melting points.',
      '4. Sort by color if your local program requires it (clear, green, brown).',
      '5. Place in the glass recycling bin or take to a bottle bank.',
    ].join('\n'),
    reuseIdeas: [
      'Glass jars make excellent storage containers for dry goods.',
      'Turn wine bottles into candle holders or vases.',
      'Use jars for propagating plant cuttings.',
    ].join('\n'),
    environmentalAdvice:
      'Glass is 100% recyclable and can be recycled endlessly without quality loss. Recycling one glass bottle saves enough energy to power a computer for 30 minutes. Glass takes over 1 million years to decompose in a landfill.',
    safetyPrecautions: 'Broken glass can cause serious cuts — wrap in newspaper before disposal. Do not recycle light bulbs, window glass, or mirrors with containers as they have different melting points.',
    co2SavedKg: 0.15,
    wasteDivertedKg: 0.3,
    keywords: ['glass', 'jar', 'bottle', 'glass bottle', 'glass jar', 'wine bottle', 'beer bottle', 'glass container', 'glassware', 'tumbler', 'vase'],
  },
  {
    category: 'Metal',
    recyclability: 'recyclable',
    disposalInstructions: [
      '1. Rinse out food cans and beverage containers.',
      '2. Remove paper labels if possible.',
      '3. Aluminum cans and steel cans can both be recycled.',
      '4. Crush cans to save space (check local guidelines — some programs prefer uncrushed).',
      '5. Place in the metal recycling bin or take to a scrap metal facility for larger items.',
      '6. Foil and trays: clean thoroughly and ball up before recycling.',
    ].join('\n'),
    reuseIdeas: [
      'Punch holes in cans to create lanterns or pencil holders.',
      'Use aluminum foil to sharpen scissors by cutting through it multiple times.',
      'Steel cans make good plant pots with drainage holes added.',
    ].join('\n'),
    environmentalAdvice:
      'Aluminum can be recycled infinitely without quality loss. Recycling one aluminum can saves enough energy to run a TV for 3 hours. Mining bauxite for new aluminum is extremely energy-intensive — recycled aluminum uses 95% less energy.',
    safetyPrecautions: 'Be careful of sharp edges on cut metal or crushed cans. Wear gloves when handling scrap metal.',
    co2SavedKg: 0.4,
    wasteDivertedKg: 0.03,
    keywords: ['metal', 'aluminum', 'can', 'tin can', 'steel', 'iron', 'copper', 'foil', 'aluminum foil', 'soda can', 'beer can', 'food can', 'tin', 'metal can', 'scrap metal', 'wire', 'bottle cap'],
  },
  {
    category: 'Electronic Waste',
    recyclability: 'depends-on-local-rules',
    disposalInstructions: [
      '1. Do NOT put e-waste in regular trash or recycling bins.',
      '2. Remove batteries if possible — they require separate recycling.',
      '3. Wipe personal data from devices (factory reset phones, wipe hard drives).',
      '4. Take to a designated e-waste collection point or electronics retailer take-back program.',
      '5. Many manufacturers offer free recycling programs for their products.',
      '6. Check if the device still works — consider donation first.',
    ].join('\n'),
    reuseIdeas: [
      'Repurpose old phone cases as small tool organizers.',
      'Use old electronics for DIY projects (Arduino sensors, art pieces).',
      'Turn old laptop hard drives into external storage with an enclosure.',
    ].join('\n'),
    environmentalAdvice:
      'E-waste contains valuable metals like gold, silver, and copper, plus hazardous materials like lead and mercury. One million cell phones contain about 35,000 lbs of copper, 772 lbs of silver, and 75 lbs of gold. Never burn e-waste — it releases toxic fumes.',
    safetyPrecautions: 'CAUTION: E-waste contains hazardous materials like lead, mercury, and cadmium. Never burn or dismantle electronics. Remove batteries before disposal. Wipe all personal data from devices. Wear gloves when handling old electronics.',
    co2SavedKg: 2.0,
    wasteDivertedKg: 0.5,
    keywords: ['electronic', 'phone', 'laptop', 'computer', 'tablet', 'charger', 'cable', 'headphones', 'earbuds', 'electronic waste', 'e-waste', 'ewaste', 'circuit board', 'keyboard', 'mouse', 'monitor', 'camera', 'remote', 'toaster', 'microwave', 'appliance', 'electronic device', 'USB', 'power bank', 'speaker'],
  },
  {
    category: 'Organic Waste',
    recyclability: 'recyclable',
    disposalInstructions: [
      '1. Remove any non-organic packaging (plastic, stickers).',
      '2. Place in a compost bin or municipal organic waste collection.',
      '3. For home composting: balance "green" (food scraps) with "brown" (dry leaves, paper) material.',
      '4. Avoid composting meat, dairy, and oils in home systems — they attract pests.',
      '5. If no composting is available, check for community composting programs.',
    ].join('\n'),
    reuseIdeas: [
      'Vegetable scraps make excellent homemade vegetable broth.',
      'Coffee grounds are a great fertilizer and natural pest deterrent.',
      'Eggshells provide calcium for garden soil — crush and sprinkle around plants.',
    ].join('\n'),
    environmentalAdvice:
      'Organic waste in landfills produces methane, a greenhouse gas 25x more potent than CO2. Composting diverts this waste and creates nutrient-rich soil. About 30% of household waste is compostable organic material.',
    safetyPrecautions: 'Avoid composting meat, dairy, and oils in home systems as they attract pests and create odors. Wash hands after handling food waste.',
    co2SavedKg: 0.08,
    wasteDivertedKg: 0.15,
    keywords: ['food', 'organic', 'fruit', 'vegetable', 'peel', 'banana peel', 'apple', 'coffee grounds', 'tea bag', 'eggshell', 'food waste', 'compost', 'leftover', 'bread', 'rice', 'meat', 'bone', 'shell', 'biodegradable', 'garden waste', 'leaves', 'grass cutting'],
  },
  {
    category: 'Textile',
    recyclability: 'depends-on-local-rules',
    disposalInstructions: [
      '1. If the item is in good condition, donate to a charity shop or shelter.',
      '2. If worn out, check for textile recycling bins in your area.',
      '3. Some retailers (H&M, Zara) offer in-store textile collection.',
      '4. Clean and dry items before donation or recycling.',
      '5. Shoes should be paired and tied together.',
    ].join('\n'),
    reuseIdeas: [
      'Turn old t-shirts into cleaning rags or reusable grocery bags.',
      'Cut fabric into patches for visible mending on other clothes.',
      'Stuff pillows or pet beds with shredded old textiles.',
    ].join('\n'),
    environmentalAdvice:
      'The fashion industry produces 10% of global carbon emissions. Recycling textiles saves about 2,700 liters of water per garment (the water used to grow cotton for a single t-shirt). Only 15% of textiles are currently recycled.',
    safetyPrecautions: 'Wash items before donation. Check for mold or contamination if items were stored damp.',
    co2SavedKg: 1.5,
    wasteDivertedKg: 0.4,
    keywords: ['clothes', 'clothing', 'shirt', 'pants', 'jeans', 'dress', 'fabric', 'textile', 'shoe', 'shoes', 'sneaker', 'jacket', 'sweater', 'sock', 't-shirt', 'textile waste', 'old clothes', 'fabric scrap'],
  },
  {
    category: 'Hazardous Waste',
    recyclability: 'non-recyclable',
    disposalInstructions: [
      '1. Do NOT put hazardous waste in regular trash or recycling.',
      '2. Take to a household hazardous waste collection facility.',
      '3. Keep in original containers with labels intact.',
      '4. Never mix different hazardous materials together.',
      '5. Check your local government website for collection dates and locations.',
    ].join('\n'),
    reuseIdeas: [
      'Empty paint cans can be cleaned and used as storage containers.',
      'Use up products completely before disposing of the container.',
    ].join('\n'),
    environmentalAdvice:
      'Hazardous waste can contaminate soil and groundwater for decades. One gallon of improperly disposed motor oil can contaminate one million gallons of water. Always use designated disposal channels.',
    safetyPrecautions: 'CAUTION: Hazardous waste can be toxic, flammable, or corrosive. Keep in original containers with labels intact. Never mix different hazardous materials. Wear gloves and avoid inhalation. Store away from children and pets.',
    co2SavedKg: 0,
    wasteDivertedKg: 0,
    keywords: ['paint', 'oil', 'chemical', 'pesticide', 'motor oil', 'paint can', 'solvent', 'cleaning product', 'bleach', 'asbestos', 'nail polish', 'mercury', 'fluorescent bulb'],
  },
  {
    category: 'Batteries',
    recyclability: 'non-recyclable',
    disposalInstructions: [
      '1. Do NOT put batteries in regular trash or recycling bins — they require specialized recycling.',
      '2. Identify battery type: lithium-ion, alkaline, button cell, lead-acid, or NiMH.',
      '3. Tape the terminals of lithium-ion batteries with non-conductive tape to prevent fires.',
      '4. Take to a designated battery collection point, electronics store, or recycling center.',
      '5. Many retailers (hardware stores, electronics shops) have battery drop-off bins.',
      '6. For damaged or swollen batteries, contact your local hazardous waste facility immediately.',
    ].join('\n'),
    reuseIdeas: [
      'Rechargeable batteries can be reused hundreds of times — switch to rechargeables to reduce waste.',
      'Old car batteries can be traded in at auto parts stores for credit.',
    ].join('\n'),
    environmentalAdvice:
      'Batteries contain heavy metals like lead, mercury, cadmium, and lithium that can leach into soil and water. One AA battery can contaminate up to 20,000 liters of water. Recycling recovers valuable metals and prevents environmental contamination.',
    safetyPrecautions: 'DANGER: Batteries can leak toxic chemicals, cause fires, or explode if damaged. Never puncture, crush, or incinerate batteries. Tape terminals of lithium batteries. Store in a cool, dry place away from metal objects. Keep away from children.',
    co2SavedKg: 0.3,
    wasteDivertedKg: 0.1,
    keywords: ['battery', 'batteries', 'lithium battery', 'aa battery', 'aaa battery', 'button battery', 'coin cell', 'car battery', 'lithium-ion', 'nimh', 'lead acid battery', 'rechargeable battery', 'power bank battery', 'laptop battery', 'phone battery'],
  },
  {
    category: 'Medical Waste',
    recyclability: 'non-recyclable',
    disposalInstructions: [
      '1. Do NOT put medical waste in regular trash or recycling.',
      '2. Sharps (needles, lancets, syringes): place in a puncture-proof container (hard plastic bottle or sharps container).',
      '3. Seal the container and label it "SHARPS — DO NOT RECYCLE".',
      '4. Take to a designated medical waste collection point, hospital, or pharmacy take-back program.',
      '5. Expired medicines: do not flush or throw in trash — take to a pharmacy take-back program.',
      '6. Contact your local health department for medical waste disposal guidelines.',
    ].join('\n'),
    reuseIdeas: [
      'Medical waste cannot be reused safely. Focus on proper disposal to protect public health and the environment.',
    ].join('\n'),
    environmentalAdvice:
      'Medical waste can spread infections and contaminate water supplies. Improper disposal of pharmaceuticals can lead to antibiotics in water systems, contributing to antimicrobial resistance. Always use designated disposal channels.',
    safetyPrecautions: 'BIOHAZARD: Medical waste may carry infectious agents. Always wear gloves when handling. Never recap used needles. Place sharps in puncture-proof containers immediately after use. Keep all medical waste away from children and pets. Wash hands thoroughly after handling.',
    co2SavedKg: 0,
    wasteDivertedKg: 0,
    keywords: ['medical waste', 'syringe', 'needle', 'medicine', 'expired medicine', 'pharmaceutical', 'drug', 'pill', 'tablet', 'bandage', 'gauze', 'insulin', 'injection', 'lancet', 'sharps', 'biomedical'],
  },
];

const UNCATEGORIZED_RESULT: Omit<WasteCategory, 'keywords'> = {
  category: 'Unknown',
  recyclability: 'depends-on-local-rules',
  disposalInstructions: [
    'I was unable to confidently identify this item. Here are general steps:',
    '1. Check the item for recycling symbols or numbers.',
    '2. Look up your local recycling guidelines online.',
    '3. When in doubt, keep it out of the recycling bin — wish-cycling contaminates good recyclables.',
    '4. Consider if the item could be reused or repurposed instead.',
  ].join('\n'),
  reuseIdeas: 'Before disposing, consider if the item could be used for a different purpose, donated, or given to someone who needs it.',
  environmentalAdvice:
    'Every item kept out of a landfill makes a difference. When unsure about recyclability, the best choice is to check local guidelines or contact your waste management provider.',
  safetyPrecautions: 'When unsure about an item, treat it with caution. Wear gloves when handling unknown waste and do not open sealed containers.',
  co2SavedKg: 0,
  wasteDivertedKg: 0,
};

export function analyzeItem(itemName: string, location?: string): AnalysisResult {
  const lowerName = itemName.toLowerCase().trim();

  let bestMatch: WasteCategory | null = null;

  for (const cat of CATEGORIES) {
    for (const keyword of cat.keywords) {
      if (lowerName.includes(keyword)) {
        bestMatch = cat;
        break;
      }
    }
    if (bestMatch) break;
  }

  const data = bestMatch ?? ({ ...UNCATEGORIZED_RESULT, keywords: [] } as WasteCategory);

  return {
    item_name: itemName.trim(),
    category: data.category,
    recyclability: data.recyclability,
    disposal_instructions: data.disposalInstructions,
    reuse_ideas: data.reuseIdeas,
    environmental_advice: data.environmentalAdvice,
    safety_precautions: data.safetyPrecautions,
    estimated_co2_saved_kg: data.co2SavedKg,
    estimated_waste_diverted_kg: data.wasteDivertedKg,
    confidence: bestMatch ? 'high' : 'low',
    source: 'fallback',
  };
}

export function generateFallbackChatResponse(userMessage: string, contextItem?: string): string {
  const lower = userMessage.toLowerCase().trim();

  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some((g) => lower.includes(g))) {
    return 'Hello! I am the Smart Recycling Assistant. I can help you identify waste items, tell you if they are recyclable, explain disposal steps, and suggest reuse ideas. Type the name of an item (like "plastic bottle" or "old phone") or ask a recycling question!';
  }

  if (lower.includes('thank')) {
    return "You're welcome! Every small recycling action adds up to a big environmental impact. Is there anything else you'd like to know?";
  }

  if (lower.includes('how do you work') || lower.includes('what can you do') || lower.includes('help')) {
    return [
      'Here is what I can help with:',
      '\n- Tell you if an item is recyclable, non-recyclable, or depends on local rules',
      '- Give step-by-step disposal instructions',
      '- Suggest creative reuse and upcycling ideas',
      '- Share environmental facts and advice',
      '\nJust type an item name (like "glass jar" or "old laptop") or ask a recycling question.',
    ].join('\n');
  }

  if (contextItem) {
    const result = analyzeItem(contextItem);
    if (lower.includes('recycl') || lower.includes('dispose') || lower.includes('throw') || lower.includes('bin')) {
      return `For a ${result.item_name} (${result.category}): ${result.recyclability === 'recyclable' ? 'This item is recyclable.' : result.recyclability === 'non-recyclable' ? 'This item is not recyclable through standard programs.' : 'Recyclability depends on your local rules.'}\n\nDisposal steps:\n${result.disposal_instructions}`;
    }
    if (lower.includes('reuse') || lower.includes('upcycl') || lower.includes('repurpose')) {
      return `Here are reuse ideas for your ${result.item_name}:\n${result.reuse_ideas}`;
    }
    if (lower.includes('environment') || lower.includes('impact') || lower.includes('why')) {
      return `Environmental impact of recycling ${result.item_name}:\n${result.environmental_advice}`;
    }
  }

  for (const cat of CATEGORIES) {
    for (const keyword of cat.keywords) {
      if (lower.includes(keyword)) {
        const result = analyzeItem(userMessage);
        return [
          `Here is what I found for "${result.item_name}":`,
          `\nCategory: ${result.category}`,
          `Recyclability: ${result.recyclability.replace(/-/g, ' ')}`,
          `\nDisposal instructions:\n${result.disposal_instructions}`,
          `\nReuse ideas:\n${result.reuse_ideas}`,
          `\nEnvironmental advice:\n${result.environmental_advice}`,
        ].join('\n');
      }
    }
  }

  return [
    "I'm not sure about that specific item, but here are some general tips:",
    '\n- Check for recycling symbols (usually a triangle with a number 1-7).',
    '- When in doubt, keep it out of the recycling bin to avoid contamination.',
    '- Look up your local recycling guidelines online.',
    '\nYou can also try typing a specific item name like "plastic bottle", "glass jar", "cardboard box", or "old phone".',
  ].join('\n');
}

export const WASTE_CATEGORIES = CATEGORIES.map((c) => ({
  category: c.category,
  recyclability: c.recyclability,
  keywords: c.keywords,
}));
