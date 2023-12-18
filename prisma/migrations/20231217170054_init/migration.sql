/*
  Warnings:

  - You are about to alter the column `activation_code` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "activation_code" SET DATA TYPE INTEGER;
