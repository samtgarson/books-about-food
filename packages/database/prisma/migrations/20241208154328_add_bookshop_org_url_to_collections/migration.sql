/*
  Warnings:

  - You are about to drop the column `order` on the `collection_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collection_items" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "bookshop_dot_org_url" TEXT;

-- RenameIndex
ALTER INDEX "promo_items_promo_id_book_id_key" RENAME TO "collection_items_collection_id_book_id_key";
