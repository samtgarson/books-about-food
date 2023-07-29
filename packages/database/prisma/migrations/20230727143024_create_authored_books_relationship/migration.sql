/*
  Warnings:

  - A unique constraint covering the columns `[profile_id,book_id,job_id]` on the table `contributions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "_authored_books" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_authored_books_AB_unique" ON "_authored_books"("A", "B");

-- CreateIndex
CREATE INDEX "_authored_books_B_index" ON "_authored_books"("B");

-- CreateIndex
CREATE UNIQUE INDEX "contributions_profile_id_book_id_job_id_key" ON "contributions"("profile_id", "book_id", "job_id");

-- AddForeignKey
ALTER TABLE "_authored_books" ADD CONSTRAINT "_authored_books_A_fkey" FOREIGN KEY ("A") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authored_books" ADD CONSTRAINT "_authored_books_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
