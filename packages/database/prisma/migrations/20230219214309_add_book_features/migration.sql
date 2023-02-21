-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "book_id" UUID NOT NULL,
    "tag_line" TEXT,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
