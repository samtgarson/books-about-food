-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_cover_for_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_preview_for_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_publisher_id_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_cover_for_id_fkey" FOREIGN KEY ("cover_for_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_preview_for_id_fkey" FOREIGN KEY ("preview_for_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
