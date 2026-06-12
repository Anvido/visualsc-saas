-- VISUALSC V2 - restaurant design settings
-- Adds forward-compatible branding fields while keeping legacy color columns.

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7) DEFAULT '#1F3F70',
  ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#F0B233',
  ADD COLUMN IF NOT EXISTS font_family VARCHAR(80) DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS display_mode VARCHAR(20) DEFAULT 'traditional'
    CHECK (display_mode IN ('traditional', 'lsc'));

UPDATE public.restaurants
SET
  primary_color = COALESCE(primary_color, color_primary, '#1F3F70'),
  secondary_color = COALESCE(secondary_color, color_accent, '#F0B233'),
  font_family = COALESCE(font_family, 'Inter'),
  display_mode = COALESCE(display_mode, 'traditional');
