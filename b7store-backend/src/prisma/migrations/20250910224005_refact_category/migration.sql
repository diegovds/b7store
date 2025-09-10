-- DropForeignKey
ALTER TABLE "public"."CategoryMetadata" DROP CONSTRAINT "CategoryMetadata_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."CategoryMetadata" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CategoryMetadata" ADD CONSTRAINT "CategoryMetadata_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
