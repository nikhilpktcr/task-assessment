-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "activation_code" DROP DEFAULT,
ALTER COLUMN "activation_code" SET DATA TYPE TEXT;
