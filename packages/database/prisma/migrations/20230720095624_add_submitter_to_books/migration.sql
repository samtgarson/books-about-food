-- AlterTable
ALTER TABLE "books" ADD COLUMN     "submitter_id" UUID;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
