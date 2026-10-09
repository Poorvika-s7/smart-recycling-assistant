CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  category text NOT NULL DEFAULT 'unknown',
  recyclability text NOT NULL DEFAULT 'unknown',
  disposal_instructions text NOT NULL DEFAULT '',
  reuse_ideas text NOT NULL DEFAULT '',
  environmental_advice text NOT NULL DEFAULT '',
  estimated_co2_saved_kg numeric NOT NULL DEFAULT 0,
  estimated_waste_diverted_kg numeric NOT NULL DEFAULT 0,
  analysis_mode text NOT NULL DEFAULT 'fallback',
  image_filename text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scans" ON scans;
CREATE POLICY "anon_select_scans" ON scans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scans" ON scans;
CREATE POLICY "anon_insert_scans" ON scans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scans" ON scans;
CREATE POLICY "anon_update_scans" ON scans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scans" ON scans;
CREATE POLICY "anon_delete_scans" ON scans FOR DELETE
  TO anon, authenticated USING (true);