/*
  Warnings:

  - The values [ASSIGNEE] on the enum `FieldType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CustomFieldEntity" AS ENUM ('USER', 'PROJECT', 'TASK');

-- AlterEnum
BEGIN;
CREATE TYPE "FieldType_new" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT', 'DYNAMIC_SELECT');
ALTER TABLE "CustomField" ALTER COLUMN "type" TYPE "FieldType_new" USING ("type"::text::"FieldType_new");
ALTER TYPE "FieldType" RENAME TO "FieldType_old";
ALTER TYPE "FieldType_new" RENAME TO "FieldType";
DROP TYPE "FieldType_old";
COMMIT;

-- AlterTable
ALTER TABLE "CustomField" ADD COLUMN     "entity" "CustomFieldEntity",
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false;
