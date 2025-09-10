/*
  Warnings:

  - Made the column `categoryId` on table `CategoryMetadata` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."CategoryMetadata" DROP CONSTRAINT "CategoryMetadata_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."CategoryMetadata" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CategoryMetadata" ADD CONSTRAINT "CategoryMetadata_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
