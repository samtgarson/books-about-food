-- CreateEnum
CREATE TYPE "SearchResultType" AS ENUM ('book', 'author', 'contributor', 'publisher');

CREATE OR REPLACE VIEW search_results AS SELECT DISTINCT
	(books.id),
	title AS name,
	to_jsonb (images) AS image,
	'book' AS type
FROM
	books
	LEFT OUTER JOIN images ON images.cover_for_id = books.id
UNION ( SELECT DISTINCT
		(profiles.id),
		name,
		to_jsonb (images) AS image,
		CASE WHEN _authored_books."B" IS NULL THEN
			'contributor'
		ELSE
			'author'
		END AS type
	FROM
		profiles
	LEFT OUTER JOIN images ON images.profile_id = profiles.id
	LEFT OUTER JOIN _authored_books ON _authored_books."B" = profiles.id)
UNION ( SELECT DISTINCT
		(publishers.id),
		name,
		to_jsonb (images) AS image,
		'publisher' AS type
	FROM
		publishers
	LEFT OUTER JOIN images ON images.publisher_id = publishers.id);

