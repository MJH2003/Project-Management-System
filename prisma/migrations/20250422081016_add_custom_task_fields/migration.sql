/*
  Warnings:

  - You are about to drop the column `fieldType` on the `CustomField` table. All the data in the column will be lost.
  - You are about to drop the column `customFieldValues` on the `Task` table. All the data in the column will be lost.
  - Added the required column `type` to the `CustomField` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT');

-- DropIndex
DROP INDEX "CustomField_projectId_name_key";

-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "fieldType",
ADD COLUMN     "type" "FieldType" NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "customFieldValues";

-- DropEnum
DROP TYPE "CustomFieldType";

-- CreateTable
CREATE TABLE "TaskFieldValue" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "TaskFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskFieldValue_taskId_fieldId_key" ON "TaskFieldValue"("taskId", "fieldId");

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
