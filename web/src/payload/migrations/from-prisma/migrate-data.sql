-- Data Migration: public schema → payload schema
-- Run this AFTER the Payload schema migration has been applied
-- Execute with: psql $DATABASE_URL -f migrate-data.sql
begin;

-- ============================================================================
-- PHASE 1: Core entities (no foreign key dependencies)
-- ============================================================================
-- Users
insert into
  payload.users (id, email, name, role, created_at, updated_at)
select
  id::text,
  email,
  name,
  role::text::payload.enum_users_role,
  created_at,
  updated_at
from
  public.users;

-- Accounts (NextAuth, now embedded as array in users table via payload-authjs)
-- Simplified structure: only provider, provider_account_id, type
insert into
  payload.users_accounts (
    _order,
    _parent_id,
    id,
    provider,
    provider_account_id,
    type
  )
select
  row_number() over (
    partition by
      a.user_id
    order by
      a.created_at
  ) as _order,
  a.user_id::text as _parent_id,
  gen_random_uuid()::text as id,
  a.provider,
  a.provider_account_id,
  a.type
from
  public.accounts a
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = a.user_id
  );

-- Verification Tokens (NextAuth, now embedded as array in users table via payload-authjs)
-- Match identifier (email) to user.email to find parent
insert into
  payload.users_verification_tokens (_order, _parent_id, id, token, expires)
select
  row_number() over (
    partition by
      u.id
    order by
      vt.expires
  ) as _order,
  u.id as _parent_id,
  gen_random_uuid()::text as id,
  vt.token,
  vt.expires
from
  public.verification_tokens vt
  join payload.users u on u.email = vt.identifier;

-- Jobs
insert into
  payload.jobs (id, name, featured, created_at, updated_at)
select
  id,
  name,
  featured,
  created_at,
  updated_at
from
  public.jobs;

-- Tag Groups
insert into
  payload.tag_groups (
    id,
    name,
    slug,
    admin_only,
    created_at,
    updated_at
  )
select
  id,
  name,
  slug,
  admin_only,
  created_at,
  updated_at
from
  public.tag_groups;

-- Locations
insert into
  payload.locations (
    id,
    place_id,
    display_text,
    slug,
    country,
    region,
    latitude,
    longitude,
    created_at,
    updated_at
  )
select
  id,
  place_id,
  display_text,
  slug,
  country,
  region,
  latitude,
  longitude,
  created_at,
  updated_at
from
  public.locations;

-- FAQs (answer is HTML, needs separate conversion to Lexical format)
-- Run convert-faq-answers.ts after this migration to convert HTML → Lexical
insert into
  payload.faqs (id, question, created_at, updated_at)
select
  id,
  question,
  created_at,
  updated_at
from
  public.frequently_asked_questions;

-- ============================================================================
-- PHASE 2: Images (needed before entities that reference them)
-- ============================================================================
-- Images - map path to filename, set prefix
insert into
  payload.images (
    id,
    filename,
    width,
    height,
    placeholder_url,
    prefix,
    created_at,
    updated_at
  )
select
  id,
  path,
  width,
  height,
  placeholder_url,
  '',
  created_at,
  updated_at
from
  public.images;

-- ============================================================================
-- PHASE 3: Entities with image relationships
-- ============================================================================
-- Tags (depends on tag_groups)
insert into
  payload.tags (id, name, slug, group_id, created_at, updated_at)
select
  id,
  name,
  slug,
  group_id,
  created_at,
  updated_at
from
  public.tags;

-- Publishers (with logo from images)
insert into
  payload.publishers (
    id,
    name,
    slug,
    logo_id,
    description,
    website,
    instagram,
    generic_contact,
    direct_contact,
    house_id,
    created_at,
    updated_at
  )
select
  p.id,
  p.name,
  p.slug,
  i.id as logo_id,
  p.description,
  p.website,
  p.instagram,
  p.generic_contact,
  p.direct_contact,
  p.imprint_id as house_id,
  p.created_at,
  p.updated_at
from
  public.publishers p
  left join public.images i on i.publisher_id = p.id;

-- Profiles (with avatar from images)
-- Note: Only set user_id if the user exists in payload.users (handles partial data dumps)
insert into
  payload.profiles (
    id,
    name,
    slug,
    avatar_id,
    description,
    job_title,
    location,
    website,
    instagram,
    most_recently_published_on,
    user_id,
    created_at,
    updated_at
  )
select
  p.id,
  p.name,
  p.slug,
  i.id as avatar_id,
  p.description,
  p.job_title,
  p.location,
  p.website,
  p.instagram,
  p.most_recently_published_on,
  case
    when u.id is not null then p.user_id::text
    else null
  end as user_id,
  p.created_at,
  p.updated_at
from
  public.profiles p
  left join public.images i on i.profile_id = p.id
  left join payload.users u on u.id::uuid = p.user_id;

-- Books (with cover_image from images)
-- Note: background_color in Prisma is JSON like {"h":0,"s":0,"l":0}, keep as JSON string for querying/sorting
-- Note: Only set submitter_id if the user exists in payload.users (handles partial data dumps)
insert into
  payload.books (
    id,
    title,
    subtitle,
    slug,
    status,
    release_date,
    pages,
    blurb,
    design_commentary,
    source,
    background_color,
    google_books_id,
    publisher_id,
    submitter_id,
    cover_image_id,
    created_at,
    updated_at
  )
select
  b.id,
  b.title,
  b.subtitle,
  b.slug,
  b.status::text::payload.enum_books_status,
  b.release_date,
  b.pages,
  b.blurb,
  b.design_commentary,
  b.source::text::payload.enum_books_source,
  -- Keep HSL JSON as JSONB (e.g., {"h":27,"s":24,"l":19}) for querying/sorting
  b.background_color as background_color,
  b.google_books_id,
  b.publisher_id,
  case
    when u.id is not null then b.submitter_id::text
    else null
  end as submitter_id,
  i.id as cover_image_id,
  b.created_at,
  b.updated_at
from
  public.books b
  left join public.images i on i.cover_for_id = b.id
  left join payload.users u on u.id::uuid = b.submitter_id;

-- ============================================================================
-- PHASE 4: Entities depending on the above
-- ============================================================================
-- Claims (skip rows where user or profile doesn't exist)
insert into
  payload.claims (
    id,
    profile_id,
    user_id,
    secret,
    approved_at,
    cancelled_at,
    state,
    created_at,
    updated_at
  )
select
  c.id,
  c.profile_id,
  c.user_id::text,
  c.secret,
  c.approved_at,
  c.cancelled_at,
  case
    when c.cancelled_at is not null then 'cancelled'
    when c.approved_at is not null then 'approved'
    else 'pending'
  end::payload.enum_claims_state,
  c.created_at,
  c.updated_at
from
  public.claims c
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = c.user_id
  )
  and exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = c.profile_id
  );

-- Memberships (skip rows where user or publisher doesn't exist)
insert into
  payload.memberships (
    id,
    publisher_id,
    user_id,
    role,
    created_at,
    updated_at
  )
select
  m.id,
  m.publisher_id,
  m.user_id::text,
  m.role::text::payload.enum_memberships_role,
  m.created_at,
  m.updated_at
from
  public.memberships m
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = m.user_id
  )
  and exists (
    select
      1
    from
      payload.publishers pp
    where
      pp.id = m.publisher_id
  );

-- Publisher Invitations (skip rows where user or publisher doesn't exist)
insert into
  payload.publisher_invitations (
    id,
    email,
    publisher_id,
    invited_by_id,
    role,
    accepted_at,
    created_at,
    updated_at
  )
select
  pi.id,
  pi.email,
  pi.publisher_id,
  pi.invited_by_id::text,
  pi.role::text::payload.enum_publisher_invitations_role,
  pi.accepted_at,
  pi.created_at,
  pi.updated_at
from
  public.publisher_invitations pi
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = pi.invited_by_id
  )
  and exists (
    select
      1
    from
      payload.publishers pp
    where
      pp.id = pi.publisher_id
  );

-- Book Votes (skip rows where user or book doesn't exist)
insert into
  payload.book_votes (id, book_id, user_id, created_at, updated_at)
select
  bv.id,
  bv.book_id,
  bv.user_id::text,
  bv.created_at,
  bv.created_at
from
  public.book_votes bv
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = bv.user_id
  )
  and exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = bv.book_id
  );

-- Pitches (skip rows where author doesn't exist in partial dumps)
insert into
  payload.pitches (
    id,
    author_id,
    description,
    view_count,
    created_at,
    updated_at
  )
select
  p.id,
  p.author_id::text,
  p.description,
  p.view_count,
  p.created_at,
  p.created_at
from
  public.pitches p
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = p.author_id
  );

-- Favourites (skip rows where user or profile doesn't exist)
insert into
  payload.favourites (id, profile_id, user_id, created_at, updated_at)
select
  f.id,
  f.profile_id,
  f.user_id::text,
  f.created_at,
  f.updated_at
from
  public.favourites f
where
  exists (
    select
      1
    from
      payload.users u
    where
      u.id::uuid = f.user_id
  )
  and exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = f.profile_id
  );

-- Featured Profiles (skip orphaned references)
insert into
  payload.featured_profiles (id, profile_id, until, created_at, updated_at)
select
  fp.id,
  fp.profile_id,
  fp.until,
  fp.created_at,
  fp.updated_at
from
  public.featured_profiles fp
where
  exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = fp.profile_id
  );

-- Features (skip orphaned references)
insert into
  payload.features (
    id,
    book_id,
    tag_line,
    until,
    created_at,
    updated_at
  )
select
  f.id,
  f.book_id,
  f.tag_line,
  f.until,
  f.created_at,
  f.updated_at
from
  public.features f
where
  exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = f.book_id
  );

-- Collections (skip orphaned publisher references)
insert into
  payload.collections (
    id,
    title,
    slug,
    description,
    status,
    publisher_id,
    bookshop_dot_org_url,
    publisher_featured,
    created_at,
    updated_at
  )
select
  c.id,
  c.title,
  c.slug,
  c.description,
  c.status::text::payload.enum_collections_status,
  case
    when exists (
      select
        1
      from
        payload.publishers pp
      where
        pp.id = c.publisher_id
    ) then c.publisher_id
    else null
  end,
  c.bookshop_dot_org_url,
  c.publisher_featured,
  c.created_at,
  c.updated_at
from
  public.collections c;

-- ============================================================================
-- PHASE 5: Relationship tables (_rels)
-- ============================================================================
-- Books → Tags (many-to-many, skip orphaned references)
insert into
  payload.books_rels (parent_id, path, tags_id, "order")
select
  b."A" as parent_id,
  'tags' as path,
  b."B" as tags_id,
  row_number() over (
    partition by
      b."A"
    order by
      b."B"
  ) as "order"
from
  public."_books_tags" b
where
  exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = b."A"
  )
  and exists (
    select
      1
    from
      payload.tags pt
    where
      pt.id = b."B"
  );

-- Books → Authors (many-to-many via _authored_books, skip orphaned references)
-- In Prisma implicit M2M: A/B are alphabetical by model name, so A = Book, B = Profile
insert into
  payload.books_rels (parent_id, path, profiles_id, "order")
select
  ab."A" as parent_id,
  'authors' as path,
  ab."B" as profiles_id,
  row_number() over (
    partition by
      ab."A"
    order by
      ab."B"
  ) as "order"
from
  public."_authored_books" ab
where
  exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = ab."A"
  )
  and exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = ab."B"
  );

-- Profiles → Locations (many-to-many, skip orphaned references)
-- In Prisma implicit M2M: A/B are alphabetical by model name, so A = Location, B = Profile
insert into
  payload.profiles_rels (parent_id, path, locations_id, "order")
select
  pl."B" as parent_id,
  'locations' as path,
  pl."A" as locations_id,
  row_number() over (
    partition by
      pl."B"
    order by
      pl."A"
  ) as "order"
from
  public."_profiles_locations" pl
where
  exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = pl."B"
  )
  and exists (
    select
      1
    from
      payload.locations pl2
    where
      pl2.id = pl."A"
  );

-- Collections → Books (from collection_items, skip orphaned references)
insert into
  payload.collections_rels (parent_id, path, books_id, "order")
select
  ci.collection_id as parent_id,
  'books' as path,
  ci.book_id as books_id,
  row_number() over (
    partition by
      ci.collection_id
    order by
      ci.created_at
  ) as "order"
from
  public.collection_items ci
where
  exists (
    select
      1
    from
      payload.collections pc
    where
      pc.id = ci.collection_id
  )
  and exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = ci.book_id
  );

-- ============================================================================
-- PHASE 6: Array fields (embedded in parent tables)
-- ============================================================================
-- Books palette (from JSON array to separate table, skip if book doesn't exist)
-- Prisma palette is JSON array of HSL objects like [{"h":27,"s":24,"l":19}, ...]
-- Keep HSL as JSONB for querying/sorting
insert into
  payload.books_palette (_parent_id, _order, id, color)
select
  b.id as _parent_id,
  (elem.ordinality) as _order,
  gen_random_uuid()::text as id,
  elem.value as color
from
  public.books b
  cross join lateral jsonb_array_elements(b.palette) with ordinality as elem (value, ordinality)
where
  b.palette is not null
  and jsonb_typeof(b.palette) = 'array'
  and exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = b.id
  );

-- Books preview images (from images table where preview_for_id is set, skip orphaned)
insert into
  payload.books_preview_images (_parent_id, _order, id, image_id)
select
  i.preview_for_id as _parent_id,
  i."order" as _order,
  gen_random_uuid()::text as id,
  i.id as image_id
from
  public.images i
where
  i.preview_for_id is not null
  and exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = i.preview_for_id
  )
  and exists (
    select
      1
    from
      payload.images pi
    where
      pi.id = i.id
  )
order by
  i.preview_for_id,
  i."order";

-- Books links (from links table, skip orphaned)
-- Map site values to enum, use site as label
insert into
  payload.books_links (
    _parent_id,
    _order,
    id,
    label,
    url,
    site,
    site_other
  )
select
  l.book_id as _parent_id,
  row_number() over (
    partition by
      l.book_id
    order by
      l.created_at
  ) as _order,
  gen_random_uuid()::text as id,
  l.site as label,
  l.url,
  case l.site
    when 'Amazon' then 'Amazon'
    when 'Edelweiss+' then 'Edelweiss+'
    when 'Bookshop.org' then 'Bookshop.org'
    when 'Worldcat' then 'Worldcat'
    when 'AbeBooks' then 'AbeBooks'
    else 'Other'
  end::payload.enum_books_links_site as site,
  case
    when l.site not in (
      'Amazon',
      'Edelweiss+',
      'Bookshop.org',
      'Worldcat',
      'AbeBooks'
    ) then l.site
    else null
  end as site_other
from
  public.links l
where
  exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = l.book_id
  );

-- ============================================================================
-- PHASE 7: Books contributions (embedded array)
-- This duplicates data from contributions table into embedded array format
-- ============================================================================
insert into
  payload.books_contributions (
    _parent_id,
    _order,
    id,
    profile_id,
    job_id,
    title,
    tag
  )
select
  c.book_id as _parent_id,
  row_number() over (
    partition by
      c.profile_id
    order by
      c.created_at
  ) as _order,
  gen_random_uuid()::text as id,
  c.profile_id,
  c.job_id,
  p.name || ' (' || j.name || ')' as title,
  case
    when c.tag = 'Assistant' then 'Assistant'::payload.enum_books_contributions_tag
    else null
  end
from
  public.contributions c
  join public.profiles p on p.id = c.profile_id
  join public.jobs j on j.id = c.job_id
  join public.books b on b.id = c.book_id
where
  exists (
    select
      1
    from
      payload.books pb
    where
      pb.id = c.book_id
  )
  and exists (
    select
      1
    from
      payload.profiles pp
    where
      pp.id = c.profile_id
  )
  and exists (
    select
      1
    from
      payload.jobs pj
    where
      pj.id = c.job_id
  );

-- ============================================================================
-- PHASE 8: Populate computed fields
-- ============================================================================
-- Populate search_text field for all books
-- Combines: title, subtitle, publisher name, tag names, author names, contributor names
-- Uses ' | ' separator to prevent false matches across field boundaries
update payload.books
set
  search_text = (
    select
      string_agg(distinct search_part, ' | ')
    from
      (
        -- Book title
        select
          b.title as search_part
        from
          payload.books b
        where
          b.id = payload.books.id
          and b.title is not null
        union all
        -- Book subtitle
        select
          b.subtitle
        from
          payload.books b
        where
          b.id = payload.books.id
          and b.subtitle is not null
        union all
        -- Publisher name
        select
          p.name
        from
          payload.books b
          join payload.publishers p on p.id = b.publisher_id
        where
          b.id = payload.books.id
          and p.name is not null
        union all
        -- Tag names
        select
          t.name
        from
          payload.books_rels br
          join payload.tags t on t.id = br.tags_id
        where
          br.parent_id = payload.books.id
          and br.path = 'tags'
          and t.name is not null
        union all
        -- Author names
        select
          p.name
        from
          payload.books_rels br
          join payload.profiles p on p.id = br.profiles_id
        where
          br.parent_id = payload.books.id
          and br.path = 'authors'
          and p.name is not null
        union all
        -- Contributor names
        select
          p.name
        from
          payload.books_contributions bc
          join payload.profiles p on p.id = bc.profile_id
        where
          bc._parent_id = payload.books.id
          and p.name is not null
      ) parts
  );

-- ============================================================================
-- PHASE 9: Populate computed fields
-- ============================================================================
-- Populate publishedBooksCount for all publishers
update payload.publishers
set
  published_books_count = (
    select
      count(*)
    from
      payload.books
    where
      books.publisher_id = publishers.id
      and books.status = 'published'
  );

-- ============================================================================
-- VERIFICATION QUERIES (uncomment to check counts)
-- ============================================================================
-- SELECT 'users' as table_name, (SELECT count(*) FROM public.users) as public_count, (SELECT count(*) FROM payload.users) as payload_count;
-- SELECT 'jobs' as table_name, (SELECT count(*) FROM public.jobs) as public_count, (SELECT count(*) FROM payload.jobs) as payload_count;
-- SELECT 'tag_groups' as table_name, (SELECT count(*) FROM public.tag_groups) as public_count, (SELECT count(*) FROM payload.tag_groups) as payload_count;
-- SELECT 'tags' as table_name, (SELECT count(*) FROM public.tags) as public_count, (SELECT count(*) FROM payload.tags) as payload_count;
-- SELECT 'locations' as table_name, (SELECT count(*) FROM public.locations) as public_count, (SELECT count(*) FROM payload.locations) as payload_count;
-- SELECT 'faqs' as table_name, (SELECT count(*) FROM public.frequently_asked_questions) as public_count, (SELECT count(*) FROM payload.faqs) as payload_count;
-- SELECT 'images' as table_name, (SELECT count(*) FROM public.images) as public_count, (SELECT count(*) FROM payload.images) as payload_count;
-- SELECT 'publishers' as table_name, (SELECT count(*) FROM public.publishers) as public_count, (SELECT count(*) FROM payload.publishers) as payload_count;
-- SELECT 'profiles' as table_name, (SELECT count(*) FROM public.profiles) as public_count, (SELECT count(*) FROM payload.profiles) as payload_count;
-- SELECT 'books' as table_name, (SELECT count(*) FROM public.books) as public_count, (SELECT count(*) FROM payload.books) as payload_count;
-- SELECT 'claims' as table_name, (SELECT count(*) FROM public.claims) as public_count, (SELECT count(*) FROM payload.claims) as payload_count;
-- SELECT 'contributions' as table_name, (SELECT count(*) FROM public.contributions) as public_count, (SELECT count(*) FROM payload.contributions) as payload_count;
-- SELECT 'memberships' as table_name, (SELECT count(*) FROM public.memberships) as public_count, (SELECT count(*) FROM payload.memberships) as payload_count;
-- SELECT 'publisher_invitations' as table_name, (SELECT count(*) FROM public.publisher_invitations) as public_count, (SELECT count(*) FROM payload.publisher_invitations) as payload_count;
-- SELECT 'book_votes' as table_name, (SELECT count(*) FROM public.book_votes) as public_count, (SELECT count(*) FROM payload.book_votes) as payload_count;
-- SELECT 'pitches' as table_name, (SELECT count(*) FROM public.pitches) as public_count, (SELECT count(*) FROM payload.pitches) as payload_count;
-- SELECT 'favourites' as table_name, (SELECT count(*) FROM public.favourites) as public_count, (SELECT count(*) FROM payload.favourites) as payload_count;
-- SELECT 'featured_profiles' as table_name, (SELECT count(*) FROM public.featured_profiles) as public_count, (SELECT count(*) FROM payload.featured_profiles) as payload_count;
-- SELECT 'features' as table_name, (SELECT count(*) FROM public.features) as public_count, (SELECT count(*) FROM payload.features) as payload_count;
-- SELECT 'collections' as table_name, (SELECT count(*) FROM public.collections) as public_count, (SELECT count(*) FROM payload.collections) as payload_count;
-- SELECT 'books_tags' as table_name, (SELECT count(*) FROM public."_books_tags") as public_count, (SELECT count(*) FROM payload.books_rels WHERE path = 'tags') as payload_count;
-- SELECT 'authored_books' as table_name, (SELECT count(*) FROM public."_authored_books") as public_count, (SELECT count(*) FROM payload.books_rels WHERE path = 'authors') as payload_count;
-- SELECT 'profiles_locations' as table_name, (SELECT count(*) FROM public."_profiles_locations") as public_count, (SELECT count(*) FROM payload.profiles_rels WHERE path = 'locations') as payload_count;
-- SELECT 'collection_items' as table_name, (SELECT count(*) FROM public.collection_items) as public_count, (SELECT count(*) FROM payload.collections_rels WHERE path = 'books') as payload_count;
-- SELECT 'links' as table_name, (SELECT count(*) FROM public.links) as public_count, (SELECT count(*) FROM payload.books_links) as payload_count;
-- SELECT 'preview_images' as table_name, (SELECT count(*) FROM public.images WHERE preview_for_id IS NOT NULL) as public_count, (SELECT count(*) FROM payload.books_preview_images) as payload_count;
commit;

-- Success message
do $$ BEGIN RAISE NOTICE 'Data migration completed successfully!'; END $$;
