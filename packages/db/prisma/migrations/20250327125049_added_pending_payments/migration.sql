-- AlterTable
ALTER TABLE "validators" ADD COLUMN     "lastPayment" TIMESTAMP(3),
ADD COLUMN     "pendingPayments" INTEGER NOT NULL DEFAULT 0;
