-- CreateTable
CREATE TABLE "featured_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "featured_profiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "featured_profiles" ADD CONSTRAINT "featured_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
