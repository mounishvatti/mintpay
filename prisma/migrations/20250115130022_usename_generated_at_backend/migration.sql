/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userbankdetails" DROP CONSTRAINT "userbankdetails_username_fkey";

-- AlterTable
ALTER TABLE "userbankdetails" ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "first_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(50) NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "userbankdetails" ADD CONSTRAINT "userbankdetails_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
