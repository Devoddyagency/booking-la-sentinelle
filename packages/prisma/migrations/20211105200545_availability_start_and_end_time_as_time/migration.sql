-- This is an empty migration.

ALTER TABLE "Availability" RENAME COLUMN "startTime" to "old_startTime";
ALTER TABLE "Availability" RENAME COLUMN "endTime" to "old_endTime";
ALTER TABLE "Availability" ADD COLUMN "startTime" TIMESTAMPTZ;
ALTER TABLE "Availability" ADD COLUMN "endTime" TIMESTAMPTZ;

UPDATE "Availability" SET "startTime" = to_timestamp(0) + (CAST("old_startTime" AS text) || ' minutes')::interval;
UPDATE "Availability" SET "endTime" = to_timestamp(0) + (CAST("old_endTime" AS text) || ' minutes')::interval;

ALTER TABLE "Availability" DROP COLUMN "old_startTime";
ALTER TABLE "Availability" DROP COLUMN "old_endTime";
ALTER TABLE "Availability" ALTER COLUMN "startTime" SET NOT NULL;
ALTER TABLE "Availability" ALTER COLUMN "endTime" SET NOT NULL;