/*
  Warnings:

  - Changed the type of `activation_code` on the `customers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "activation_code",
ADD COLUMN     "activation_code" BIGINT NOT NULL;
