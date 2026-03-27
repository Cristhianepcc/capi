-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Auth upload event images" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images'
    AND auth.uid() IS NOT NULL
  );

-- Allow public read
CREATE POLICY "Public read event images" ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Auth update event images" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-images'
    AND auth.uid() IS NOT NULL
  );

-- Allow authenticated users to delete their uploads
CREATE POLICY "Auth delete event images" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images'
    AND auth.uid() IS NOT NULL
  );
