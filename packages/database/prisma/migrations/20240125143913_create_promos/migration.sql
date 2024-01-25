/*
  Warnings:

  - You are about to drop the `Promo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromoItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_publisher_id_fkey";

-- DropForeignKey
ALTER TABLE "PromoItem" DROP CONSTRAINT "PromoItem_book_id_fkey";

-- DropForeignKey
ALTER TABLE "PromoItem" DROP CONSTRAINT "PromoItem_promo_id_fkey";

-- DropTable
DROP TABLE "Promo";

-- DropTable
DROP TABLE "PromoItem";

-- CreateTable
CREATE TABLE "promos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "until" DATE,
    "publisher_id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "promos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "book_id" UUID NOT NULL,
    "promo_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "promo_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_items_promo_id_book_id_key" ON "promo_items"("promo_id", "book_id");

-- AddForeignKey
ALTER TABLE "promos" ADD CONSTRAINT "promos_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_items" ADD CONSTRAINT "promo_items_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_items" ADD CONSTRAINT "promo_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
