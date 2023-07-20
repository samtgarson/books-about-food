-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('draft', 'inReview', 'published');

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'draft';
