/*
  # Create site settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique)
      - `setting_value` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Disable RLS on `site_settings` table for admin operations
  3. Initial Data
    - Insert default background image setting
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disable RLS to allow public access for admin operations
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Insert default background image
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('hero_background_image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')
ON CONFLICT (setting_key) DO NOTHING;