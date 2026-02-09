import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE SCHEMA IF NOT EXISTS "payload";
   CREATE TYPE "payload"."enum_books_contributions_tag" AS ENUM('Assistant');
  CREATE TYPE "payload"."enum_books_links_site" AS ENUM('Amazon', 'Edelweiss+', 'Bookshop.org', 'Worldcat', 'AbeBooks', 'Other');
  CREATE TYPE "payload"."enum_books_status" AS ENUM('draft', 'inReview', 'published');
  CREATE TYPE "payload"."enum_books_source" AS ENUM('admin', 'import', 'submitted', 'edelweiss');
  CREATE TYPE "payload"."enum_claims_state" AS ENUM('pending', 'approved', 'cancelled');
  CREATE TYPE "payload"."enum_collections_status" AS ENUM('draft', 'inReview', 'published');
  CREATE TYPE "payload"."enum_memberships_role" AS ENUM('admin', 'member');
  CREATE TYPE "payload"."enum_publisher_invitations_role" AS ENUM('admin', 'member');
  CREATE TYPE "payload"."enum_search_results_type" AS ENUM('book', 'profile', 'publisher', 'bookTag', 'collection');
  CREATE TYPE "payload"."enum_users_role" AS ENUM('user', 'admin', 'waitlist');
  CREATE TABLE "payload"."book_votes" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"book_id" uuid NOT NULL,
  	"user_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."books_palette" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" jsonb
  );

  CREATE TABLE "payload"."books_contributions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"profile_id" uuid NOT NULL,
  	"title" varchar,
  	"job_id" uuid NOT NULL,
  	"tag" "payload"."enum_books_contributions_tag",
  	"hidden" boolean DEFAULT false
  );

  CREATE TABLE "payload"."books_preview_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid NOT NULL
  );

  CREATE TABLE "payload"."books_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"site" "payload"."enum_books_links_site" NOT NULL,
  	"site_other" varchar
  );

  CREATE TABLE "payload"."books" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"slug" varchar NOT NULL,
  	"search_text" varchar,
  	"status" "payload"."enum_books_status" DEFAULT 'draft',
  	"release_date" timestamp(3) with time zone,
  	"pages" numeric,
  	"blurb" varchar,
  	"design_commentary" varchar,
  	"source" "payload"."enum_books_source" DEFAULT 'admin',
  	"background_color" jsonb,
  	"google_books_id" varchar,
  	"publisher_id" uuid,
  	"submitter_id" varchar,
  	"cover_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."books_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"profiles_id" uuid,
  	"tags_id" uuid
  );

  CREATE TABLE "payload"."claims" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"profile_id" uuid NOT NULL,
  	"user_id" varchar NOT NULL,
  	"secret" varchar NOT NULL,
  	"approved_at" timestamp(3) with time zone,
  	"cancelled_at" timestamp(3) with time zone,
  	"state" "payload"."enum_claims_state" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."collections" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"status" "payload"."enum_collections_status" DEFAULT 'draft',
  	"publisher_id" uuid,
  	"bookshop_dot_org_url" varchar,
  	"publisher_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."collections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"books_id" uuid
  );

  CREATE TABLE "payload"."faqs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_order" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."favourites" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"profile_id" uuid NOT NULL,
  	"user_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."featured_profiles" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_order" varchar,
  	"profile_id" uuid NOT NULL,
  	"until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."features" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_order" varchar,
  	"book_id" uuid NOT NULL,
  	"tag_line" varchar,
  	"until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."images" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"placeholder_url" varchar,
  	"prefix" varchar DEFAULT 'payload',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_blur_placeholder_url" varchar,
  	"sizes_blur_placeholder_width" numeric,
  	"sizes_blur_placeholder_height" numeric,
  	"sizes_blur_placeholder_mime_type" varchar,
  	"sizes_blur_placeholder_filesize" numeric,
  	"sizes_blur_placeholder_filename" varchar
  );

  CREATE TABLE "payload"."jobs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."locations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"place_id" varchar NOT NULL,
  	"display_text" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"country" varchar,
  	"region" varchar,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."memberships" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"publisher_id" uuid NOT NULL,
  	"user_id" varchar NOT NULL,
  	"role" "payload"."enum_memberships_role" DEFAULT 'member' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."pitches" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"author_id" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"view_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."profiles" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"avatar_id" uuid,
  	"description" varchar,
  	"job_title" varchar,
  	"location" varchar,
  	"website" varchar,
  	"instagram" varchar,
  	"most_recently_published_on" timestamp(3) with time zone,
  	"user_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."profiles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"locations_id" uuid,
  	"profiles_id" uuid
  );

  CREATE TABLE "payload"."publisher_invitations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"email" varchar NOT NULL,
  	"publisher_id" uuid NOT NULL,
  	"invited_by_id" varchar NOT NULL,
  	"role" "payload"."enum_publisher_invitations_role" DEFAULT 'member' NOT NULL,
  	"accepted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."publishers" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" uuid,
  	"description" varchar,
  	"website" varchar,
  	"instagram" varchar,
  	"generic_contact" varchar,
  	"direct_contact" varchar,
  	"house_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."publishers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"books_id" uuid
  );

  CREATE TABLE "payload"."search_results" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "payload"."enum_search_results_type" NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."search_results_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"books_id" uuid,
  	"profiles_id" uuid,
  	"publishers_id" uuid,
  	"tags_id" uuid,
  	"collections_id" uuid
  );

  CREATE TABLE "payload"."tag_groups" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"admin_only" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"group_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."users_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" varchar NOT NULL,
  	"provider_account_id" varchar NOT NULL,
  	"type" varchar NOT NULL
  );

  CREATE TABLE "payload"."users_verification_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"token" varchar NOT NULL,
  	"expires" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "payload"."users" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"email_verified" timestamp(3) with time zone,
  	"name" varchar,
  	"image" varchar,
  	"role" "payload"."enum_users_role" DEFAULT 'user',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );

  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"book_votes_id" uuid,
  	"books_id" uuid,
  	"claims_id" uuid,
  	"collections_id" uuid,
  	"faqs_id" uuid,
  	"favourites_id" uuid,
  	"featured_profiles_id" uuid,
  	"features_id" uuid,
  	"images_id" uuid,
  	"jobs_id" uuid,
  	"locations_id" uuid,
  	"memberships_id" uuid,
  	"pitches_id" uuid,
  	"profiles_id" uuid,
  	"publisher_invitations_id" uuid,
  	"publishers_id" uuid,
  	"search_results_id" uuid,
  	"tag_groups_id" uuid,
  	"tags_id" uuid,
  	"users_id" varchar
  );

  CREATE TABLE "payload"."payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar
  );

  CREATE TABLE "payload"."payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload"."book_votes" ADD CONSTRAINT "book_votes_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "payload"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."book_votes" ADD CONSTRAINT "book_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books_palette" ADD CONSTRAINT "books_palette_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books_contributions" ADD CONSTRAINT "books_contributions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "payload"."profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books_contributions" ADD CONSTRAINT "books_contributions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "payload"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books_contributions" ADD CONSTRAINT "books_contributions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books_preview_images" ADD CONSTRAINT "books_preview_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books_preview_images" ADD CONSTRAINT "books_preview_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books_links" ADD CONSTRAINT "books_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books" ADD CONSTRAINT "books_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books" ADD CONSTRAINT "books_submitter_id_users_id_fk" FOREIGN KEY ("submitter_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books" ADD CONSTRAINT "books_cover_image_id_images_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."books_rels" ADD CONSTRAINT "books_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books_rels" ADD CONSTRAINT "books_rels_profiles_fk" FOREIGN KEY ("profiles_id") REFERENCES "payload"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."books_rels" ADD CONSTRAINT "books_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."claims" ADD CONSTRAINT "claims_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "payload"."profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."claims" ADD CONSTRAINT "claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."collections" ADD CONSTRAINT "collections_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."collections_rels" ADD CONSTRAINT "collections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."collections_rels" ADD CONSTRAINT "collections_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."favourites" ADD CONSTRAINT "favourites_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "payload"."profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."favourites" ADD CONSTRAINT "favourites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."featured_profiles" ADD CONSTRAINT "featured_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "payload"."profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."features" ADD CONSTRAINT "features_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "payload"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."memberships" ADD CONSTRAINT "memberships_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pitches" ADD CONSTRAINT "pitches_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."profiles" ADD CONSTRAINT "profiles_avatar_id_images_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "payload"."images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."profiles_rels" ADD CONSTRAINT "profiles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."profiles_rels" ADD CONSTRAINT "profiles_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "payload"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."profiles_rels" ADD CONSTRAINT "profiles_rels_profiles_fk" FOREIGN KEY ("profiles_id") REFERENCES "payload"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."publisher_invitations" ADD CONSTRAINT "publisher_invitations_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publisher_invitations" ADD CONSTRAINT "publisher_invitations_invited_by_id_users_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publishers" ADD CONSTRAINT "publishers_logo_id_images_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publishers" ADD CONSTRAINT "publishers_house_id_publishers_id_fk" FOREIGN KEY ("house_id") REFERENCES "payload"."publishers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."publishers_rels" ADD CONSTRAINT "publishers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."publishers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."publishers_rels" ADD CONSTRAINT "publishers_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results" ADD CONSTRAINT "search_results_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."images"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."search_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_profiles_fk" FOREIGN KEY ("profiles_id") REFERENCES "payload"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_publishers_fk" FOREIGN KEY ("publishers_id") REFERENCES "payload"."publishers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."search_results_rels" ADD CONSTRAINT "search_results_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "payload"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."tags" ADD CONSTRAINT "tags_group_id_tag_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "payload"."tag_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."users_accounts" ADD CONSTRAINT "users_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_verification_tokens" ADD CONSTRAINT "users_verification_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_book_votes_fk" FOREIGN KEY ("book_votes_id") REFERENCES "payload"."book_votes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "payload"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_claims_fk" FOREIGN KEY ("claims_id") REFERENCES "payload"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "payload"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "payload"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_favourites_fk" FOREIGN KEY ("favourites_id") REFERENCES "payload"."favourites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_featured_profiles_fk" FOREIGN KEY ("featured_profiles_id") REFERENCES "payload"."featured_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "payload"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_images_fk" FOREIGN KEY ("images_id") REFERENCES "payload"."images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "payload"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "payload"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_memberships_fk" FOREIGN KEY ("memberships_id") REFERENCES "payload"."memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pitches_fk" FOREIGN KEY ("pitches_id") REFERENCES "payload"."pitches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profiles_fk" FOREIGN KEY ("profiles_id") REFERENCES "payload"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publisher_invitations_fk" FOREIGN KEY ("publisher_invitations_id") REFERENCES "payload"."publisher_invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publishers_fk" FOREIGN KEY ("publishers_id") REFERENCES "payload"."publishers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_results_fk" FOREIGN KEY ("search_results_id") REFERENCES "payload"."search_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tag_groups_fk" FOREIGN KEY ("tag_groups_id") REFERENCES "payload"."tag_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "book_votes_book_idx" ON "payload"."book_votes" USING btree ("book_id");
  CREATE INDEX "book_votes_user_idx" ON "payload"."book_votes" USING btree ("user_id");
  CREATE INDEX "book_votes_updated_at_idx" ON "payload"."book_votes" USING btree ("updated_at");
  CREATE INDEX "book_votes_created_at_idx" ON "payload"."book_votes" USING btree ("created_at");
  CREATE INDEX "books_palette_order_idx" ON "payload"."books_palette" USING btree ("_order");
  CREATE INDEX "books_palette_parent_id_idx" ON "payload"."books_palette" USING btree ("_parent_id");
  CREATE INDEX "books_contributions_order_idx" ON "payload"."books_contributions" USING btree ("_order");
  CREATE INDEX "books_contributions_parent_id_idx" ON "payload"."books_contributions" USING btree ("_parent_id");
  CREATE INDEX "books_contributions_profile_idx" ON "payload"."books_contributions" USING btree ("profile_id");
  CREATE INDEX "books_contributions_job_idx" ON "payload"."books_contributions" USING btree ("job_id");
  CREATE INDEX "books_preview_images_order_idx" ON "payload"."books_preview_images" USING btree ("_order");
  CREATE INDEX "books_preview_images_parent_id_idx" ON "payload"."books_preview_images" USING btree ("_parent_id");
  CREATE INDEX "books_preview_images_image_idx" ON "payload"."books_preview_images" USING btree ("image_id");
  CREATE INDEX "books_links_order_idx" ON "payload"."books_links" USING btree ("_order");
  CREATE INDEX "books_links_parent_id_idx" ON "payload"."books_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "books_slug_idx" ON "payload"."books" USING btree ("slug");
  CREATE INDEX "books_search_text_idx" ON "payload"."books" USING btree ("search_text");
  CREATE INDEX "books_publisher_idx" ON "payload"."books" USING btree ("publisher_id");
  CREATE INDEX "books_submitter_idx" ON "payload"."books" USING btree ("submitter_id");
  CREATE INDEX "books_cover_image_idx" ON "payload"."books" USING btree ("cover_image_id");
  CREATE INDEX "books_updated_at_idx" ON "payload"."books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "payload"."books" USING btree ("created_at");
  CREATE INDEX "books_rels_order_idx" ON "payload"."books_rels" USING btree ("order");
  CREATE INDEX "books_rels_parent_idx" ON "payload"."books_rels" USING btree ("parent_id");
  CREATE INDEX "books_rels_path_idx" ON "payload"."books_rels" USING btree ("path");
  CREATE INDEX "books_rels_profiles_id_idx" ON "payload"."books_rels" USING btree ("profiles_id");
  CREATE INDEX "books_rels_tags_id_idx" ON "payload"."books_rels" USING btree ("tags_id");
  CREATE INDEX "claims_profile_idx" ON "payload"."claims" USING btree ("profile_id");
  CREATE INDEX "claims_user_idx" ON "payload"."claims" USING btree ("user_id");
  CREATE INDEX "claims_updated_at_idx" ON "payload"."claims" USING btree ("updated_at");
  CREATE INDEX "claims_created_at_idx" ON "payload"."claims" USING btree ("created_at");
  CREATE UNIQUE INDEX "collections_slug_idx" ON "payload"."collections" USING btree ("slug");
  CREATE INDEX "collections_publisher_idx" ON "payload"."collections" USING btree ("publisher_id");
  CREATE INDEX "collections_updated_at_idx" ON "payload"."collections" USING btree ("updated_at");
  CREATE INDEX "collections_created_at_idx" ON "payload"."collections" USING btree ("created_at");
  CREATE INDEX "collections_rels_order_idx" ON "payload"."collections_rels" USING btree ("order");
  CREATE INDEX "collections_rels_parent_idx" ON "payload"."collections_rels" USING btree ("parent_id");
  CREATE INDEX "collections_rels_path_idx" ON "payload"."collections_rels" USING btree ("path");
  CREATE INDEX "collections_rels_books_id_idx" ON "payload"."collections_rels" USING btree ("books_id");
  CREATE INDEX "faqs__order_idx" ON "payload"."faqs" USING btree ("_order");
  CREATE UNIQUE INDEX "faqs_question_idx" ON "payload"."faqs" USING btree ("question");
  CREATE INDEX "faqs_updated_at_idx" ON "payload"."faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "payload"."faqs" USING btree ("created_at");
  CREATE INDEX "favourites_profile_idx" ON "payload"."favourites" USING btree ("profile_id");
  CREATE INDEX "favourites_user_idx" ON "payload"."favourites" USING btree ("user_id");
  CREATE INDEX "favourites_updated_at_idx" ON "payload"."favourites" USING btree ("updated_at");
  CREATE INDEX "favourites_created_at_idx" ON "payload"."favourites" USING btree ("created_at");
  CREATE INDEX "featured_profiles__order_idx" ON "payload"."featured_profiles" USING btree ("_order");
  CREATE INDEX "featured_profiles_profile_idx" ON "payload"."featured_profiles" USING btree ("profile_id");
  CREATE INDEX "featured_profiles_updated_at_idx" ON "payload"."featured_profiles" USING btree ("updated_at");
  CREATE INDEX "featured_profiles_created_at_idx" ON "payload"."featured_profiles" USING btree ("created_at");
  CREATE INDEX "features__order_idx" ON "payload"."features" USING btree ("_order");
  CREATE INDEX "features_book_idx" ON "payload"."features" USING btree ("book_id");
  CREATE INDEX "features_updated_at_idx" ON "payload"."features" USING btree ("updated_at");
  CREATE INDEX "features_created_at_idx" ON "payload"."features" USING btree ("created_at");
  CREATE INDEX "images_updated_at_idx" ON "payload"."images" USING btree ("updated_at");
  CREATE INDEX "images_created_at_idx" ON "payload"."images" USING btree ("created_at");
  CREATE UNIQUE INDEX "images_filename_idx" ON "payload"."images" USING btree ("filename");
  CREATE INDEX "images_sizes_blur_placeholder_sizes_blur_placeholder_fil_idx" ON "payload"."images" USING btree ("sizes_blur_placeholder_filename");
  CREATE UNIQUE INDEX "jobs_name_idx" ON "payload"."jobs" USING btree ("name");
  CREATE INDEX "jobs_updated_at_idx" ON "payload"."jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "payload"."jobs" USING btree ("created_at");
  CREATE UNIQUE INDEX "locations_place_id_idx" ON "payload"."locations" USING btree ("place_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "payload"."locations" USING btree ("slug");
  CREATE INDEX "locations_updated_at_idx" ON "payload"."locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "payload"."locations" USING btree ("created_at");
  CREATE INDEX "memberships_publisher_idx" ON "payload"."memberships" USING btree ("publisher_id");
  CREATE INDEX "memberships_user_idx" ON "payload"."memberships" USING btree ("user_id");
  CREATE INDEX "memberships_updated_at_idx" ON "payload"."memberships" USING btree ("updated_at");
  CREATE INDEX "memberships_created_at_idx" ON "payload"."memberships" USING btree ("created_at");
  CREATE INDEX "pitches_author_idx" ON "payload"."pitches" USING btree ("author_id");
  CREATE INDEX "pitches_updated_at_idx" ON "payload"."pitches" USING btree ("updated_at");
  CREATE INDEX "pitches_created_at_idx" ON "payload"."pitches" USING btree ("created_at");
  CREATE UNIQUE INDEX "profiles_slug_idx" ON "payload"."profiles" USING btree ("slug");
  CREATE INDEX "profiles_avatar_idx" ON "payload"."profiles" USING btree ("avatar_id");
  CREATE INDEX "profiles_user_idx" ON "payload"."profiles" USING btree ("user_id");
  CREATE INDEX "profiles_updated_at_idx" ON "payload"."profiles" USING btree ("updated_at");
  CREATE INDEX "profiles_created_at_idx" ON "payload"."profiles" USING btree ("created_at");
  CREATE INDEX "profiles_rels_order_idx" ON "payload"."profiles_rels" USING btree ("order");
  CREATE INDEX "profiles_rels_parent_idx" ON "payload"."profiles_rels" USING btree ("parent_id");
  CREATE INDEX "profiles_rels_path_idx" ON "payload"."profiles_rels" USING btree ("path");
  CREATE INDEX "profiles_rels_locations_id_idx" ON "payload"."profiles_rels" USING btree ("locations_id");
  CREATE INDEX "profiles_rels_profiles_id_idx" ON "payload"."profiles_rels" USING btree ("profiles_id");
  CREATE INDEX "publisher_invitations_publisher_idx" ON "payload"."publisher_invitations" USING btree ("publisher_id");
  CREATE INDEX "publisher_invitations_invited_by_idx" ON "payload"."publisher_invitations" USING btree ("invited_by_id");
  CREATE INDEX "publisher_invitations_updated_at_idx" ON "payload"."publisher_invitations" USING btree ("updated_at");
  CREATE INDEX "publisher_invitations_created_at_idx" ON "payload"."publisher_invitations" USING btree ("created_at");
  CREATE UNIQUE INDEX "publishers_name_idx" ON "payload"."publishers" USING btree ("name");
  CREATE UNIQUE INDEX "publishers_slug_idx" ON "payload"."publishers" USING btree ("slug");
  CREATE INDEX "publishers_logo_idx" ON "payload"."publishers" USING btree ("logo_id");
  CREATE INDEX "publishers_house_idx" ON "payload"."publishers" USING btree ("house_id");
  CREATE INDEX "publishers_updated_at_idx" ON "payload"."publishers" USING btree ("updated_at");
  CREATE INDEX "publishers_created_at_idx" ON "payload"."publishers" USING btree ("created_at");
  CREATE INDEX "publishers_rels_order_idx" ON "payload"."publishers_rels" USING btree ("order");
  CREATE INDEX "publishers_rels_parent_idx" ON "payload"."publishers_rels" USING btree ("parent_id");
  CREATE INDEX "publishers_rels_path_idx" ON "payload"."publishers_rels" USING btree ("path");
  CREATE INDEX "publishers_rels_books_id_idx" ON "payload"."publishers_rels" USING btree ("books_id");
  CREATE INDEX "search_results_name_idx" ON "payload"."search_results" USING btree ("name");
  CREATE INDEX "search_results_type_idx" ON "payload"."search_results" USING btree ("type");
  CREATE INDEX "search_results_slug_idx" ON "payload"."search_results" USING btree ("slug");
  CREATE INDEX "search_results_image_idx" ON "payload"."search_results" USING btree ("image_id");
  CREATE INDEX "search_results_updated_at_idx" ON "payload"."search_results" USING btree ("updated_at");
  CREATE INDEX "search_results_created_at_idx" ON "payload"."search_results" USING btree ("created_at");
  CREATE INDEX "search_results_rels_order_idx" ON "payload"."search_results_rels" USING btree ("order");
  CREATE INDEX "search_results_rels_parent_idx" ON "payload"."search_results_rels" USING btree ("parent_id");
  CREATE INDEX "search_results_rels_path_idx" ON "payload"."search_results_rels" USING btree ("path");
  CREATE INDEX "search_results_rels_books_id_idx" ON "payload"."search_results_rels" USING btree ("books_id");
  CREATE INDEX "search_results_rels_profiles_id_idx" ON "payload"."search_results_rels" USING btree ("profiles_id");
  CREATE INDEX "search_results_rels_publishers_id_idx" ON "payload"."search_results_rels" USING btree ("publishers_id");
  CREATE INDEX "search_results_rels_tags_id_idx" ON "payload"."search_results_rels" USING btree ("tags_id");
  CREATE INDEX "search_results_rels_collections_id_idx" ON "payload"."search_results_rels" USING btree ("collections_id");
  CREATE UNIQUE INDEX "tag_groups_name_idx" ON "payload"."tag_groups" USING btree ("name");
  CREATE UNIQUE INDEX "tag_groups_slug_idx" ON "payload"."tag_groups" USING btree ("slug");
  CREATE INDEX "tag_groups_updated_at_idx" ON "payload"."tag_groups" USING btree ("updated_at");
  CREATE INDEX "tag_groups_created_at_idx" ON "payload"."tag_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_name_idx" ON "payload"."tags" USING btree ("name");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "payload"."tags" USING btree ("slug");
  CREATE INDEX "tags_group_idx" ON "payload"."tags" USING btree ("group_id");
  CREATE INDEX "tags_updated_at_idx" ON "payload"."tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "payload"."tags" USING btree ("created_at");
  CREATE INDEX "users_accounts_order_idx" ON "payload"."users_accounts" USING btree ("_order");
  CREATE INDEX "users_accounts_parent_id_idx" ON "payload"."users_accounts" USING btree ("_parent_id");
  CREATE INDEX "users_accounts_provider_account_id_idx" ON "payload"."users_accounts" USING btree ("provider_account_id");
  CREATE INDEX "users_verification_tokens_order_idx" ON "payload"."users_verification_tokens" USING btree ("_order");
  CREATE INDEX "users_verification_tokens_parent_id_idx" ON "payload"."users_verification_tokens" USING btree ("_parent_id");
  CREATE INDEX "users_verification_tokens_token_idx" ON "payload"."users_verification_tokens" USING btree ("token");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_book_votes_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("book_votes_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("books_id");
  CREATE INDEX "payload_locked_documents_rels_claims_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("claims_id");
  CREATE INDEX "payload_locked_documents_rels_collections_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("collections_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_favourites_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("favourites_id");
  CREATE INDEX "payload_locked_documents_rels_featured_profiles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("featured_profiles_id");
  CREATE INDEX "payload_locked_documents_rels_features_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("features_id");
  CREATE INDEX "payload_locked_documents_rels_images_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("images_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_memberships_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("memberships_id");
  CREATE INDEX "payload_locked_documents_rels_pitches_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pitches_id");
  CREATE INDEX "payload_locked_documents_rels_profiles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("profiles_id");
  CREATE INDEX "payload_locked_documents_rels_publisher_invitations_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("publisher_invitations_id");
  CREATE INDEX "payload_locked_documents_rels_publishers_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("publishers_id");
  CREATE INDEX "payload_locked_documents_rels_search_results_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("search_results_id");
  CREATE INDEX "payload_locked_documents_rels_tag_groups_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("tag_groups_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`)
}

export async function down({
  db,
  payload,
  req
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."book_votes" CASCADE;
  DROP TABLE "payload"."books_palette" CASCADE;
  DROP TABLE "payload"."books_contributions" CASCADE;
  DROP TABLE "payload"."books_preview_images" CASCADE;
  DROP TABLE "payload"."books_links" CASCADE;
  DROP TABLE "payload"."books" CASCADE;
  DROP TABLE "payload"."books_rels" CASCADE;
  DROP TABLE "payload"."claims" CASCADE;
  DROP TABLE "payload"."collections" CASCADE;
  DROP TABLE "payload"."collections_rels" CASCADE;
  DROP TABLE "payload"."faqs" CASCADE;
  DROP TABLE "payload"."favourites" CASCADE;
  DROP TABLE "payload"."featured_profiles" CASCADE;
  DROP TABLE "payload"."features" CASCADE;
  DROP TABLE "payload"."images" CASCADE;
  DROP TABLE "payload"."jobs" CASCADE;
  DROP TABLE "payload"."locations" CASCADE;
  DROP TABLE "payload"."memberships" CASCADE;
  DROP TABLE "payload"."pitches" CASCADE;
  DROP TABLE "payload"."profiles" CASCADE;
  DROP TABLE "payload"."profiles_rels" CASCADE;
  DROP TABLE "payload"."publisher_invitations" CASCADE;
  DROP TABLE "payload"."publishers" CASCADE;
  DROP TABLE "payload"."publishers_rels" CASCADE;
  DROP TABLE "payload"."search_results" CASCADE;
  DROP TABLE "payload"."search_results_rels" CASCADE;
  DROP TABLE "payload"."tag_groups" CASCADE;
  DROP TABLE "payload"."tags" CASCADE;
  DROP TABLE "payload"."users_accounts" CASCADE;
  DROP TABLE "payload"."users_verification_tokens" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TYPE "payload"."enum_books_contributions_tag";
  DROP TYPE "payload"."enum_books_links_site";
  DROP TYPE "payload"."enum_books_status";
  DROP TYPE "payload"."enum_books_source";
  DROP TYPE "payload"."enum_claims_state";
  DROP TYPE "payload"."enum_collections_status";
  DROP TYPE "payload"."enum_memberships_role";
  DROP TYPE "payload"."enum_publisher_invitations_role";
  DROP TYPE "payload"."enum_search_results_type";
  DROP TYPE "payload"."enum_users_role";`)
}
