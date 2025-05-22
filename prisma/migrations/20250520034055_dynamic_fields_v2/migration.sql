/*
  Warnings:

  - You are about to drop the column `selectSource` on the `CustomField` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomFieldSourceType" AS ENUM ('PROJECT_MEMBERS', 'PROJECT_TASKS', 'PROJECTS');

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "selectSource",
ADD COLUMN     "sourceType" "CustomFieldSourceType";

-- DropEnum
DROP TYPE "SelectSourceType";
