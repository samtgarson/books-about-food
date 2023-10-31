/*
  Warnings:

  - The `background_color` column on the `books` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `palette` column on the `books` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "background_color",
ADD COLUMN     "background_color" INTEGER,
DROP COLUMN "palette",
ADD COLUMN     "palette" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
