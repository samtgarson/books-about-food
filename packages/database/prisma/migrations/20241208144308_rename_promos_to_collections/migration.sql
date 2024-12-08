/*
  Warnings:

  - You are about to drop the column `team_id` on the `publishers` table. All the data in the column will be lost.
  - You are about to drop the `promo_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promos` table. If the table is not empty, all the data it contains will be lost.

*/
-- Remove team_id from publisher, leftover from previous migration
ALTER TABLE "publishers" DROP COLUMN "team_id";

-- Make collections#publisher_id nullable
ALTER TABLE "promos" ALTER COLUMN "publisher_id" DROP NOT NULL;

-- Rename foreign key constraints
ALTER TABLE "promo_items" RENAME CONSTRAINT "promo_items_book_id_fkey" TO "collection_items_book_id_fkey";
ALTER TABLE "promo_items" RENAME CONSTRAINT "promo_items_promo_id_fkey" TO "collection_items_collection_id_fkey";
ALTER TABLE "promos" RENAME CONSTRAINT "promos_publisher_id_fkey" TO "collections_publisher_id_fkey";
ALTER TABLE "promos" RENAME CONSTRAINT "promos_pkey" TO "collections_pkey";
ALTER TABLE "promo_items" RENAME CONSTRAINT "promo_items_pkey" TO "collection_items_pkey";

-- Rename foreign key columns
ALTER TABLE "promo_items" RENAME COLUMN "promo_id" TO "collection_id";

-- Add description column to collections
ALTER TABLE "promos" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "promo_items" RENAME TO "collection_items";

-- AlterTable
ALTER TABLE "promos" RENAME TO "collections";
