-- CreateEnum
CREATE TYPE "BookSource" AS ENUM ('admin', 'import', 'submitted');

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "source" "BookSource" NOT NULL DEFAULT 'admin';
