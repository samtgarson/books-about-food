-- AlterTable
ALTER TABLE "publishers" ADD COLUMN     "hidden_books" TEXT[] DEFAULT ARRAY[]::TEXT[];
