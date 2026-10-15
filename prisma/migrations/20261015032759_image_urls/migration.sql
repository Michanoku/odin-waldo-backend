/*
  Warnings:

  - You are about to drop the column `author` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desktopUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Image_email_key";

-- DropIndex
DROP INDEX "Image_username_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "author",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "hash",
DROP COLUMN "username",
ADD COLUMN     "desktopUrl" TEXT NOT NULL,
ADD COLUMN     "mobileUrl" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Game";
