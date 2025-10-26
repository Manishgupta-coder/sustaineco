-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  gradient_start TEXT DEFAULT '#0073E6',
  gradient_end TEXT DEFAULT '#2EB82E',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read
CREATE POLICY "Public read access for hero images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-images');

-- Create storage policy for authenticated upload
CREATE POLICY "Authenticated upload for hero images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-images');

-- Create storage policy for authenticated delete
CREATE POLICY "Authenticated delete for hero images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-images');

-- Enable Row Level Security
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON hero_slides
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON hero_slides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON hero_slides
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON hero_slides
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default hero slides
INSERT INTO hero_slides (title, description, gradient_start, gradient_end, order_index) VALUES
  ('Driving Sustainable Urban Futures', 'Transforming cities through innovative environmental solutions and strategic planning', '#0073E6', '#2EB82E', 0),
  ('Innovating for Environmental Resilience', 'Building climate-resilient communities with data-driven strategies', '#2EB82E', '#0073E6', 1),
  ('Integrating Data with Sustainability', 'Leveraging technology for measurable environmental impact', '#0A1A2F', '#0073E6', 2);
