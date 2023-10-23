CREATE OR REPLACE VIEW search_results AS (
  SELECT DISTINCT
    (books.id),
    title AS name,
    to_jsonb (images) AS image,
    'book' AS type,
    authors.names AS "description",
    books.slug as slug
  FROM
    books
  LEFT OUTER JOIN images ON images.cover_for_id = books.id
  LEFT OUTER JOIN LATERAL (
    SELECT
      string_agg(profiles.name, ' • ') AS names
    FROM
      profiles
      INNER JOIN _authored_books ON _authored_books."B" = profiles.id
        AND _authored_books."A" = books.id
  ) authors ON TRUE


  UNION (
    SELECT DISTINCT
      (profiles.id),
      name,
      to_jsonb (images) AS image,
      CASE WHEN _authored_books."B" IS NULL THEN
        'contributor'
      ELSE
        'author'
      END AS type,
      profiles.job_title AS "description",
        profiles.slug as slug
    FROM
      profiles
    LEFT OUTER JOIN images ON images.profile_id = profiles.id
    LEFT OUTER JOIN _authored_books ON _authored_books."B" = profiles.id
    LEFT OUTER JOIN LATERAL (
      select count(contributions.id) AS book_count
      from contributions
      inner join books on books.id = contributions.book_id
      where contributions.profile_id = profiles.id
      and books.status = 'published'
    ) contributions on true
    WHERE (
      _authored_books."B" is not null
        OR contributions.book_count > 0
    )
  )


  UNION (
    SELECT DISTINCT
      (publishers.id),
      name,
      to_jsonb (images) AS image,
      'publisher' AS type,
      NULL AS "description",
    publishers.slug as slug
    FROM
      publishers
    LEFT OUTER JOIN images ON images.publisher_id = publishers.id
  )
);
