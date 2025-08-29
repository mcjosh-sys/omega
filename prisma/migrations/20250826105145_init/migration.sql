-- AlterTable
ALTER TABLE "public"."AgencySidebarOption" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."SubAccountSidebarOption" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
