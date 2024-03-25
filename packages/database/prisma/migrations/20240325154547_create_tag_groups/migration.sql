/*
  Warnings:

  - Added the required column `group_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "group_id" UUID;

-- CreateTable
CREATE TABLE "tag_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tag_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_groups_name_key" ON "tag_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_groups_slug_key" ON "tag_groups"("slug");

-- Create group for existing tags
insert into "tag_groups" ("name", "slug") values ('Cuisine', 'cuisine');

-- Set all existing tags to the new group
update "tags" set "group_id" = (select "id" from "tag_groups" where "slug" = 'cuisine');

-- Alter group_id to not be nullable
alter table "tags" alter column "group_id" set not null;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tag_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

