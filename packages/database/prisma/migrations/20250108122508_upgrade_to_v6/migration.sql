-- AlterTable
ALTER TABLE "_authored_books" ADD CONSTRAINT "_authored_books_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_authored_books_AB_unique";

-- AlterTable
ALTER TABLE "_books_tags" ADD CONSTRAINT "_books_tags_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_books_tags_AB_unique";
