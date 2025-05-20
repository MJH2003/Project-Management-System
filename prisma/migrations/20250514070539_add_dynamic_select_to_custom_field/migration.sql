/*
  Warnings:

  - You are about to drop the column `dynamicSource` on the `CustomField` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "FieldType" ADD VALUE 'DYNAMIC_SELECT';

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "dynamicSource",
ADD COLUMN     "dynamicSourceId" TEXT;

-- CreateTable
CREATE TABLE "DynamicDataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DynamicDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DynamicDataSource_sourceType_key" ON "DynamicDataSource"("sourceType");

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_dynamicSourceId_fkey" FOREIGN KEY ("dynamicSourceId") REFERENCES "DynamicDataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
