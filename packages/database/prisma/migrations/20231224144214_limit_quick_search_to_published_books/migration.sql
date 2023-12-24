DROP VIEW IF EXISTS search_results;

CREATE OR REPLACE VIEW search_results AS (
  SELECT
    DISTINCT (books.id),
    title AS name,
    to_jsonb(images) AS IMAGE,
    'book' AS type,
    authors.NAMES AS "description"
  FROM
    books
    LEFT OUTER JOIN images ON images.cover_for_id = books.id
    LEFT OUTER JOIN LATERAL(
      SELECT
        string_agg(profiles.name, ' • ') AS NAMES
      FROM
        profiles
        INNER JOIN _authored_books ON _authored_books."B" = profiles.id
        AND _authored_books."A" = books.id
    ) authors ON TRUE
  WHERE
    books.status = 'published'
  UNION
    (
      SELECT
        DISTINCT (profiles.id),
        name,
        to_jsonb(images) AS IMAGE,
        CASE WHEN _authored_books."B" IS NULL THEN 'contributor' ELSE 'author' END AS type,
        profiles.job_title AS "description"
      FROM
        profiles
        LEFT OUTER JOIN images ON images.profile_id = profiles.id
        LEFT OUTER JOIN _authored_books ON _authored_books."B" = profiles.id
        LEFT OUTER JOIN books ab on _authored_books."A" = ab.id and ab.status = 'published'
        LEFT OUTER JOIN contributions on contributions.profile_id = profiles.id
        LEFT OUTER JOIN books cb on contributions.book_id = cb.id and cb.status = 'published'
      where
        cb.id is not null
      or ab.id is not null
    )
  UNION
    (
      SELECT
        DISTINCT (publishers.id),
        name,
        to_jsonb(images) AS IMAGE,
        'publisher' AS type,
        NULL AS "description"
      FROM
        publishers
        LEFT OUTER JOIN images ON images.publisher_id = publishers.id
    )
);
