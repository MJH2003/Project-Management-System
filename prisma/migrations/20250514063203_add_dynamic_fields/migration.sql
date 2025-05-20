/*
  Warnings:

  - You are about to drop the column `entity` on the `CustomField` table. All the data in the column will be lost.
  - You are about to drop the column `isDynamic` on the `CustomField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "entity",
DROP COLUMN "isDynamic",
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

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_dynamicSourceId_fkey" FOREIGN KEY ("dynamicSourceId") REFERENCES "DynamicDataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
