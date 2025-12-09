-- Create view for location filter autocomplete options
CREATE VIEW location_filter_options AS
WITH all_values AS (
  SELECT DISTINCT country as value, 'country' as type, NULL::uuid as location_id, 0 as profile_count
  FROM locations WHERE country IS NOT NULL
  UNION
  SELECT DISTINCT region as value, 'region' as type, NULL::uuid as location_id, 0 as profile_count
  FROM locations WHERE region IS NOT NULL
  UNION
  SELECT display_text as value, 'location' as type, id as location_id, count(pl."B") as profile_count
  FROM locations l
  LEFT JOIN _profiles_locations pl on pl."A" = l.id
  GROUP BY l.display_text, l.id
)
SELECT DISTINCT ON (value)
  value,
  type,
  location_id,
  profile_count
FROM all_values a
ORDER BY value,
  CASE type
    WHEN 'country' THEN 1
    WHEN 'region' THEN 2
    WHEN 'location' THEN 3
  END;
