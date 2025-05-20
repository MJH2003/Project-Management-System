/*
  Warnings:

  - A unique constraint covering the columns `[sourceType]` on the table `DynamicDataSource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DynamicDataSource_sourceType_key" ON "DynamicDataSource"("sourceType");
