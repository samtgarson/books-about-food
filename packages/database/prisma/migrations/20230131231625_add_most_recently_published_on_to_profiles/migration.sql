-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "most_recently_published_on" DATE;

-- Populate the most_recently_published_on column with the most recent release_date of the books which the profile has contributions for
update "profiles"
set "most_recently_published_on" = (
  select max("release_date") from "books" where "books"."id" in (
    select "book_id" from "contributions" where "contributions"."profile_id" = "profiles"."id"
  )
);

