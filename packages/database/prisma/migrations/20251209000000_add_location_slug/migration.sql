-- Add slug column to locations table
alter table "locations"
add column "slug" text;

-- Generate slugs for existing locations based on display_text
-- Uses lowercase with hyphens replacing spaces, plus a 6-char random suffix
update "locations"
set
  "slug" = lower(
    regexp_replace(
      regexp_replace("display_text", '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+',
      '-',
      'g'
    )
  ) || '-' || substring(
    md5(random()::text)
    from
      1 for 6
  );

-- Make slug non-null and unique after populating
alter table "locations"
alter column "slug"
set not null;

create unique index "locations_slug_key" on "locations" ("slug");

-- Drop and recreate the location_filter_options view with slug
drop view if exists "location_filter_options";

create or replace view "location_filter_options" as
with
  all_options as (
    select
      country as option_value,
      'country' as option_type,
      'country:' || country as id,
      0 as profile_count
    from
      locations
    where
      country is not null
    union
    select
      region || ', ' || country as option_value,
      'region' as option_type,
      'region:' || region as id,
      0 as profile_count
    from
      locations
    where
      region is not null
    union
    select
      l.display_text as option_value,
      'location' as option_type,
      l.slug as id,
      count(pl."B") as profile_count
    from
      locations as l
      left join _profiles_locations as pl on l.id = pl."A"
    group by
      l.display_text,
      l.slug
  )
select distinct
  on (option_value) id,
  option_value,
  option_type,
  profile_count
from
  all_options
order by
  option_value,
  case option_type
    when 'country' then 1
    when 'region' then 2
    when 'location' then 3
  end;
