/*
  Warnings:

  - Added the required column `monthlyBudget` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "monthlyBudget" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tags" VARCHAR(255)[];
