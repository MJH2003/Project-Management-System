/*
  Warnings:

  - The values [DYNAMIC_SELECT] on the enum `FieldType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dynamicSourceId` on the `CustomField` table. All the data in the column will be lost.
  - You are about to drop the `DynamicDataSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DynamicDataSourceType" AS ENUM ('PROJECT_MEMBERS', 'PROJECT_TASKS');

-- AlterEnum
BEGIN;
CREATE TYPE "FieldType_new" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT');
ALTER TABLE "CustomField" ALTER COLUMN "type" TYPE "FieldType_new" USING ("type"::text::"FieldType_new");
ALTER TYPE "FieldType" RENAME TO "FieldType_old";
ALTER TYPE "FieldType_new" RENAME TO "FieldType";
DROP TYPE "FieldType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CustomField" DROP CONSTRAINT "CustomField_dynamicSourceId_fkey";

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "dynamicSourceId",
ADD COLUMN     "dynamicSource" "DynamicDataSourceType";

-- DropTable
DROP TABLE "DynamicDataSource";
