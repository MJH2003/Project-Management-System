/*
  Simplifying dynamic fields implementation:
  - Removing DynamicDataSource table
  - Using enum for sourceType
  - Simplifying SELECT field type
*/

-- Drop the DynamicDataSource table if it exists
DROP TABLE IF EXISTS "DynamicDataSource";

-- Update CustomField table to use enum for sourceType
ALTER TABLE "CustomField" 
  DROP COLUMN IF EXISTS "dynamicSourceId",
  ADD COLUMN IF NOT EXISTS "sourceType" "DataSourceType";

-- Update FieldType enum to remove DYNAMIC_SELECT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'FieldType'
  ) THEN
    ALTER TYPE "FieldType" RENAME TO "FieldType_old";
    CREATE TYPE "FieldType" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT');
    ALTER TABLE "CustomField" ALTER COLUMN "type" TYPE "FieldType" USING ("type"::text::"FieldType");
    DROP TYPE "FieldType_old";
  END IF;
END $$;
