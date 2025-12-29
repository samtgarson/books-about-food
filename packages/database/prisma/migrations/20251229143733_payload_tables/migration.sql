create table "payload_kv" (
  "id" serial primary key not null,
  "key" varchar not null,
  "data" jsonb not null
);

create table "payload_locked_documents" (
  "id" serial primary key not null,
  "global_slug" varchar,
  "updated_at" timestamp(3) with time zone default now() not null,
  "created_at" timestamp(3) with time zone default now() not null
);

create table "payload_locked_documents_rels" (
  "id" serial primary key not null,
  "order" integer,
  "parent_id" integer not null,
  "path" varchar not null,
  "users_id" uuid
);

create table "payload_preferences" (
  "id" serial primary key not null,
  "key" varchar,
  "value" jsonb,
  "updated_at" timestamp(3) with time zone default now() not null,
  "created_at" timestamp(3) with time zone default now() not null
);

create table "payload_preferences_rels" (
  "id" serial primary key not null,
  "order" integer,
  "parent_id" integer not null,
  "path" varchar not null,
  "users_id" uuid
);

create table "payload_migrations" (
  "id" serial primary key not null,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp(3) with time zone default now() not null,
  "created_at" timestamp(3) with time zone default now() not null
);

alter table "payload_locked_documents_rels"
add constraint "payload_locked_documents_rels_parent_fk" foreign KEY ("parent_id") references "public"."payload_locked_documents" ("id") on delete cascade on update no action;

alter table "payload_locked_documents_rels"
add constraint "payload_locked_documents_rels_users_fk" foreign KEY ("users_id") references "public"."users" ("id") on delete cascade on update no action;

alter table "payload_preferences_rels"
add constraint "payload_preferences_rels_parent_fk" foreign KEY ("parent_id") references "public"."payload_preferences" ("id") on delete cascade on update no action;

alter table "payload_preferences_rels"
add constraint "payload_preferences_rels_users_fk" foreign KEY ("users_id") references "public"."users" ("id") on delete cascade on update no action;

create unique index "users_email_idx" on "users" using btree ("email");

create unique index "payload_kv_key_idx" on "payload_kv" using btree ("key");

create index "payload_locked_documents_global_slug_idx" on "payload_locked_documents" using btree ("global_slug");

create index "payload_locked_documents_updated_at_idx" on "payload_locked_documents" using btree ("updated_at");

create index "payload_locked_documents_created_at_idx" on "payload_locked_documents" using btree ("created_at");

create index "payload_locked_documents_rels_order_idx" on "payload_locked_documents_rels" using btree ("order");

create index "payload_locked_documents_rels_parent_idx" on "payload_locked_documents_rels" using btree ("parent_id");

create index "payload_locked_documents_rels_path_idx" on "payload_locked_documents_rels" using btree ("path");

create index "payload_locked_documents_rels_users_id_idx" on "payload_locked_documents_rels" using btree ("users_id");

create index "payload_preferences_key_idx" on "payload_preferences" using btree ("key");

create index "payload_preferences_updated_at_idx" on "payload_preferences" using btree ("updated_at");

create index "payload_preferences_created_at_idx" on "payload_preferences" using btree ("created_at");

create index "payload_preferences_rels_order_idx" on "payload_preferences_rels" using btree ("order");

create index "payload_preferences_rels_parent_idx" on "payload_preferences_rels" using btree ("parent_id");

create index "payload_preferences_rels_path_idx" on "payload_preferences_rels" using btree ("path");

create index "payload_preferences_rels_users_id_idx" on "payload_preferences_rels" using btree ("users_id");

create index "payload_migrations_updated_at_idx" on "payload_migrations" using btree ("updated_at");

create index "payload_migrations_created_at_idx" on "payload_migrations" using btree ("created_at");
