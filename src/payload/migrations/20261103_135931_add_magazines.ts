import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_books_type" AS ENUM('cookbook', 'magazineIssue');
  CREATE TYPE "payload"."enum_magazines_links_site" AS ENUM('Amazon', 'Edelweiss+', 'Bookshop.org', 'Worldcat', 'AbeBooks', 'Other');
  CREATE TYPE "payload"."enum_magazines_status" AS ENUM('draft', 'inReview', 'published');
  CREATE TYPE "payload"."enum_magazines_frequency" AS ENUM('weekly', 'monthly', 'bimonthly', 'quarterly', 'biannual', 'annual', 'irregular');
  CREATE TABLE "payload"."magazines_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"profile_id" uuid NOT NULL,
  	"title" varchar,
  	"job_id" uuid NOT NULL,
  	"from_year" numeric,
  	"to_year" numeric
  );
  
  CREATE TABLE "payload"."magazines_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"site" "payload"."enum_magazines_links_site" NOT NULL,
  	"site_other" varchar
  );
  
  CREATE TABLE "payload"."magazines" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_magazines_status" DEFAULT 'draft',
  	"publisher_id" uuid,
  	"description" varchar,
  	"frequency" "payload"."enum_magazines_frequency",
  	"start_year" numeric,
  	"end_year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."books" ADD COLUMN "type" "payload"."enum_books_type" DEFAULT 'cookbook' NOT NULL;
  ALTER TABLE "payload"."books" ADD COLUMN "magazine_id" uuid;
  ALTER TABLE "payload"."books" ADD COLUMN "issue_number" numeric;
  ALTER TABLE "payload"."books" ADD COLUMN "issue_label" varchar;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "magazines_id" uuid;
  ALTER TABLE "payload"."magazines_team" ADD CONSTRAINT "magazines_team_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "payload"."profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."magazines_team" ADD CONSTRAINT "magazines_team_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "payload"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."magazines_team" ADD CONSTRAINT "magazines_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."magazines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."magazines_links" ADD CONSTRAINT "magazines_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."magazines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."magazines" ADD CONSTRAINT "magazines_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "magazines_team_order_idx" ON "payload"."magazines_team" USING btree ("_order");
  CREATE INDEX "magazines_team_parent_id_idx" ON "payload"."magazines_team" USING btree ("_parent_id");
  CREATE INDEX "magazines_team_profile_idx" ON "payload"."magazines_team" USING btree ("profile_id");
  CREATE INDEX "magazines_team_job_idx" ON "payload"."magazines_team" USING btree ("job_id");
  CREATE INDEX "magazines_links_order_idx" ON "payload"."magazines_links" USING btree ("_order");
  CREATE INDEX "magazines_links_parent_id_idx" ON "payload"."magazines_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "magazines_slug_idx" ON "payload"."magazines" USING btree ("slug");
  CREATE INDEX "magazines_publisher_idx" ON "payload"."magazines" USING btree ("publisher_id");
  CREATE INDEX "magazines_updated_at_idx" ON "payload"."magazines" USING btree ("updated_at");
  CREATE INDEX "magazines_created_at_idx" ON "payload"."magazines" USING btree ("created_at");
  ALTER TABLE "payload"."books" ADD CONSTRAINT "books_magazine_id_magazines_id_fk" FOREIGN KEY ("magazine_id") REFERENCES "payload"."magazines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_magazines_fk" FOREIGN KEY ("magazines_id") REFERENCES "payload"."magazines"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "books_type_idx" ON "payload"."books" USING btree ("type");
  CREATE INDEX "books_magazine_idx" ON "payload"."books" USING btree ("magazine_id");
  CREATE INDEX "payload_locked_documents_rels_magazines_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("magazines_id");`)
}

export async function down({
  db,
  payload,
  req
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."magazines_team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."magazines_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."magazines" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."magazines_team" CASCADE;
  DROP TABLE "payload"."magazines_links" CASCADE;
  DROP TABLE "payload"."magazines" CASCADE;
  ALTER TABLE "payload"."books" DROP CONSTRAINT "books_magazine_id_magazines_id_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_magazines_fk";
  
  DROP INDEX "payload"."books_type_idx";
  DROP INDEX "payload"."books_magazine_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_magazines_id_idx";
  ALTER TABLE "payload"."books" DROP COLUMN "type";
  ALTER TABLE "payload"."books" DROP COLUMN "magazine_id";
  ALTER TABLE "payload"."books" DROP COLUMN "issue_number";
  ALTER TABLE "payload"."books" DROP COLUMN "issue_label";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "magazines_id";
  DROP TYPE "payload"."enum_books_type";
  DROP TYPE "payload"."enum_magazines_links_site";
  DROP TYPE "payload"."enum_magazines_status";
  DROP TYPE "payload"."enum_magazines_frequency";`)
}
