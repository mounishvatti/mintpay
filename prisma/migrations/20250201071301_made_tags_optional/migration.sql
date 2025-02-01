/*
  Warnings:

  - You are about to drop the column `tags` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "tags",
ALTER COLUMN "category" DROP NOT NULL;
