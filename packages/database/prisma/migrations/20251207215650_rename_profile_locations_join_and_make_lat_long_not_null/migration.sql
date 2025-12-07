-- DropForeignKey
ALTER TABLE "_LocationToProfile" DROP CONSTRAINT "_LocationToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToProfile" DROP CONSTRAINT "_LocationToProfile_B_fkey";

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- RenameTable
ALTER TABLE "_LocationToProfile" RENAME TO "_profiles_locations";

-- RenameIndex
ALTER INDEX "_LocationToProfile_B_index" RENAME TO "_profiles_locations_B_index";

-- RenamePrimaryKey
ALTER TABLE "_profiles_locations" RENAME CONSTRAINT "_LocationToProfile_AB_pkey" TO "_profiles_locations_AB_pkey";

-- AddForeignKey
ALTER TABLE "_profiles_locations" ADD CONSTRAINT "_profiles_locations_A_fkey" FOREIGN KEY ("A") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_locations" ADD CONSTRAINT "_profiles_locations_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
