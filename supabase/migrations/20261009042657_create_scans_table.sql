/*
# Create scans table for recycling history

1. New Tables
- `scans`
  - `id` (uuid, primary key)
  - `item_name` (text, name of the waste item analyzed)
  - `category` (text, waste category: plastic, paper, cardboard, glass, metal, e-waste, organic, etc.)
  - `recyclability` (text: "recyclable", "non-recyclable", "depends-on-local-rules")
  - `disposal_instructions` (text, step-by-step disposal guide)
  - `reuse_ideas` (text, upcycling suggestions)
  - `environmental_advice` (text, sustainability tips)
  - `estimated_co2_saved_kg` (numeric, estimated CO2 saved in kg — transparent assumption)
  - `estimated_waste_diverted_kg` (numeric, estimated waste diverted from landfill in kg)
  - `analysis_mode` (text: "ai" or "fallback" — indicates whether AI or rule-based engine was used)
  - `image_filename` (text, nullable — filename if image was uploaded)
  - `location` (text, nullable — user-selected location for local rules)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `scans`.
- This is a single-tenant demo app (no sign-in), so allow anon + authenticated CRUD.
- All data is intentionally public/shared for the hackathon demo.
*/