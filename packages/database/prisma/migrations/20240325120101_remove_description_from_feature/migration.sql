/*
  Warnings:

  - You are about to drop the column `description` on the `features` table. All the data in the column will be lost.

*/

update books
set design_commentary = features.description
from features
where features.book_id = books.id;

-- AlterTable
ALTER TABLE "features" DROP COLUMN "description";
