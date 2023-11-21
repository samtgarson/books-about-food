-- AlterTable
ALTER TABLE "books" ADD COLUMN     "primary_color" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

CREATE OR REPLACE FUNCTION unnest_1d(a ANYARRAY, OUT a_1d ANYARRAY)
  RETURNS SETOF ANYARRAY
  LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE STRICT AS
$func$
BEGIN
   FOREACH a_1d SLICE 1 IN ARRAY a LOOP
      RETURN NEXT;
   END LOOP;
END
$func$;

with data as (
	select books.id, p.color, palette from books
	left outer join lateral (
	  select b.id, unnest_1d(b.palette) as color from books b
	  where b.id = books.id
	  limit 1
	) p on true
	where array_length(palette, 1) > 0
)
update books set primary_color = data.color
from data
where books.id = data.id;
