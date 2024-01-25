-- CreateTable
CREATE TABLE "Promo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "until" DATE,
    "publisher_id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "book_id" UUID NOT NULL,
    "promo_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PromoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoItem" ADD CONSTRAINT "PromoItem_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "Promo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoItem" ADD CONSTRAINT "PromoItem_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
