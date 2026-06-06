/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "imageUrls" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "depositAmount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
