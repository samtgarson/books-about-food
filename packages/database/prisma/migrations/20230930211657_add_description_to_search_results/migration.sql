-- This is an empty migration.
DROP VIEW IF EXISTS search_results;

CREATE OR REPLACE VIEW search_results AS (
	SELECT DISTINCT
		(books.id),
		title AS name,
		to_jsonb (images) AS image,
		'book' AS type,
		authors.names AS "description"
	FROM
		books
	LEFT OUTER JOIN images ON images.cover_for_id = books.id
	LEFT OUTER JOIN LATERAL (
		SELECT
			string_agg(profiles.name, ' • ') AS names
		FROM
			profiles
			INNER JOIN _authored_books ON _authored_books."B" = profiles.id
				AND _authored_books."A" = books.id) authors ON TRUE
		UNION ( SELECT DISTINCT
				(profiles.id),
				name,
				to_jsonb (images) AS image,
				CASE WHEN _authored_books."B" IS NULL THEN
					'contributor'
				ELSE
					'author'
				END AS type,
				profiles.job_title AS "description"
			FROM
				profiles
		LEFT OUTER JOIN images ON images.profile_id = profiles.id
	LEFT OUTER JOIN _authored_books ON _authored_books."B" = profiles.id)
UNION ( SELECT DISTINCT
		(publishers.id),
		name,
		to_jsonb (images) AS image,
		'publisher' AS type,
		NULL AS "description"
	FROM
		publishers
	LEFT OUTER JOIN images ON images.publisher_id = publishers.id)
);
