/*
  Warnings:

  - You are about to drop the column `optionSource` on the `CustomField` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SelectSourceType" AS ENUM ('PROJECT_MEMBERS', 'PROJECT_TASKS', 'PROJECTS');

-- CreateEnum
CREATE TYPE "CustomFieldEntity" AS ENUM ('USER', 'PROJECT', 'TASK');

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "optionSource",
ADD COLUMN     "selectSource" "SelectSourceType",
ALTER COLUMN "options" DROP DEFAULT;

-- DropEnum
DROP TYPE "OptionSource";
