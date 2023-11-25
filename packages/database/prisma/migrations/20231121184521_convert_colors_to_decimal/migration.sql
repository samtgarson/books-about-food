/*
  Warnings:

  - You are about to drop the column `primary_color` on the `books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "primary_color",
ALTER COLUMN "palette" SET DATA TYPE DECIMAL(65,30)[],
ALTER COLUMN "background_color" SET DATA TYPE DECIMAL(65,30)[];
