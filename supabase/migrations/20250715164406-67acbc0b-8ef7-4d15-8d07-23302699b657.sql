-- Update has_garage column based on parking features in the features jsonb column
UPDATE new_resales 
SET has_garage = CASE 
  WHEN features::text ILIKE '%parking%' 
    OR features::text ILIKE '%garage%' 
    OR features::text ILIKE '%underground%' 
  THEN true 
  ELSE false 
END
WHERE features IS NOT NULL;