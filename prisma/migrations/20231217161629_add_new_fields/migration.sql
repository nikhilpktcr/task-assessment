/*
  Warnings:

  - Added the required column `activation_code` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "activation_code" BIGINT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
