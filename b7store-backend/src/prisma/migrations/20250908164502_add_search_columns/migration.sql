/*
  Warnings:

  - Added the required column `labelSearch` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "descriptionSearch" TEXT,
ADD COLUMN     "labelSearch" TEXT NOT NULL;
