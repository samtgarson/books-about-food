drop view if exists search_results;

create view search_results as (
  select distinct (books.id),
    title as name,
    to_jsonb(images) as image,
    'book'::"SearchResultType" as type,
    authors.names as "description",
    books.slug as slug,
    books.updated_at as updated_at
  from books
  left outer join images on images.cover_for_id = books.id
  left outer join lateral (
    select string_agg(profiles.name, ' • ') as names
    from profiles
      inner join _authored_books on _authored_books."B" = profiles.id and _authored_books."A" = books.id
  ) authors on TRUE
  where books.status = 'published'

union

  (
    select distinct (profiles.id),
      name,
      to_jsonb(images) as image,
      case
        when _authored_books."B" is null
          then 'contributor'::"SearchResultType"
        else 'author'::"SearchResultType"
        end as type,
      profiles.job_title as "description",
      profiles.slug as slug,
      profiles.updated_at as updated_at
    from profiles
    left outer join images on images.profile_id = profiles.id
    left outer join _authored_books on _authored_books."B" = profiles.id
    left outer join books ab on _authored_books."A" = ab.id and ab.status = 'published'
    left outer join contributions on contributions.profile_id = profiles.id
    left outer join books cb on contributions.book_id = cb.id and cb.status = 'published'
    where (ab.id is not null or cb.id is not null)
    )

union

  (
    select distinct (publishers.id),
      name,
      to_jsonb(images) as image,
      'publisher'::"SearchResultType" as type,
      null as "description",
      publishers.slug as slug,
      publishers.updated_at as updated_at
    from publishers
    left outer join images on images.publisher_id = publishers.id
    left outer join books on books.publisher_id = publishers.id and books.status = 'published'
    where books.id is not null
    )

union

  (
    select
      tags.id,
      tags.name,
      null as image,
      'bookTag'::"SearchResultType" as type,
      null as "description",
      tags.slug,
      tags.updated_at as updated_at
     from tags
  )

  union

  (
    select
      collections.id,
      collections.title as name,
      null as image,
      'collection'::"SearchResultType" as type,
      collections.description,
      collections.slug,
      collections.updated_at as updated_at
     from collections
  )
);


