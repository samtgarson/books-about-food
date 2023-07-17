-- CreateTable
CREATE TABLE "pitches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" UUID NOT NULL,

    CONSTRAINT "pitches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pitches" ADD CONSTRAINT "pitches_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
