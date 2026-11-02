import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."oauth_applications" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"icon" varchar,
  	"metadata" varchar,
  	"client_id" varchar,
  	"client_secret" varchar,
  	"redirect_urls" varchar,
  	"type" varchar,
  	"disabled" boolean DEFAULT false,
  	"user_id" uuid,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."oauth_access_tokens" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"client_id" uuid,
  	"user_id" uuid,
  	"scopes" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."oauth_consents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"client_id" uuid,
  	"user_id" uuid,
  	"scopes" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"consent_given" boolean DEFAULT false
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "oauth_applications_id" uuid;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "oauth_access_tokens_id" uuid;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "oauth_consents_id" uuid;
  ALTER TABLE "payload"."oauth_applications" ADD CONSTRAINT "oauth_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_client_id_oauth_applications_id_fk" FOREIGN KEY ("client_id") REFERENCES "payload"."oauth_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."oauth_consents" ADD CONSTRAINT "oauth_consents_client_id_oauth_applications_id_fk" FOREIGN KEY ("client_id") REFERENCES "payload"."oauth_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."oauth_consents" ADD CONSTRAINT "oauth_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "oauth_applications_name_idx" ON "payload"."oauth_applications" USING btree ("name");
  CREATE UNIQUE INDEX "oauth_applications_client_id_idx" ON "payload"."oauth_applications" USING btree ("client_id");
  CREATE INDEX "oauth_applications_user_idx" ON "payload"."oauth_applications" USING btree ("user_id");
  CREATE INDEX "oauth_applications_created_at_idx" ON "payload"."oauth_applications" USING btree ("created_at");
  CREATE INDEX "oauth_applications_updated_at_idx" ON "payload"."oauth_applications" USING btree ("updated_at");
  CREATE UNIQUE INDEX "oauth_access_tokens_access_token_idx" ON "payload"."oauth_access_tokens" USING btree ("access_token");
  CREATE UNIQUE INDEX "oauth_access_tokens_refresh_token_idx" ON "payload"."oauth_access_tokens" USING btree ("refresh_token");
  CREATE INDEX "oauth_access_tokens_client_idx" ON "payload"."oauth_access_tokens" USING btree ("client_id");
  CREATE INDEX "oauth_access_tokens_user_idx" ON "payload"."oauth_access_tokens" USING btree ("user_id");
  CREATE INDEX "oauth_access_tokens_created_at_idx" ON "payload"."oauth_access_tokens" USING btree ("created_at");
  CREATE INDEX "oauth_access_tokens_updated_at_idx" ON "payload"."oauth_access_tokens" USING btree ("updated_at");
  CREATE INDEX "oauth_consents_client_idx" ON "payload"."oauth_consents" USING btree ("client_id");
  CREATE INDEX "oauth_consents_user_idx" ON "payload"."oauth_consents" USING btree ("user_id");
  CREATE INDEX "oauth_consents_created_at_idx" ON "payload"."oauth_consents" USING btree ("created_at");
  CREATE INDEX "oauth_consents_updated_at_idx" ON "payload"."oauth_consents" USING btree ("updated_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_oauth_applications_fk" FOREIGN KEY ("oauth_applications_id") REFERENCES "payload"."oauth_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_oauth_access_tokens_fk" FOREIGN KEY ("oauth_access_tokens_id") REFERENCES "payload"."oauth_access_tokens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_oauth_consents_fk" FOREIGN KEY ("oauth_consents_id") REFERENCES "payload"."oauth_consents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_oauth_applications_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("oauth_applications_id");
  CREATE INDEX "payload_locked_documents_rels_oauth_access_tokens_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("oauth_access_tokens_id");
  CREATE INDEX "payload_locked_documents_rels_oauth_consents_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("oauth_consents_id");`)
}

export async function down({
  db,
  payload,
  req
}: MigrateDownArgs): Promise<void> {
  // Drop the locked-documents references first: dropping the tables with
  // CASCADE also removes these constraints, so they can't be dropped after.
  await db.execute(sql`
   ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_oauth_applications_fk";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_oauth_access_tokens_fk";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_oauth_consents_fk";
  DROP INDEX "payload"."payload_locked_documents_rels_oauth_applications_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_oauth_access_tokens_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_oauth_consents_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "oauth_applications_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "oauth_access_tokens_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "oauth_consents_id";
  ALTER TABLE "payload"."oauth_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."oauth_access_tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."oauth_consents" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."oauth_access_tokens" CASCADE;
  DROP TABLE "payload"."oauth_consents" CASCADE;
  DROP TABLE "payload"."oauth_applications" CASCADE;`)
}
