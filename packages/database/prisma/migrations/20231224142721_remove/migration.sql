-- DropIndex
DROP INDEX "books_google_books_id_key";

-- CreateIndex
CREATE INDEX "google_books_id" ON "books"("google_books_id");
