/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Image` table. All the data in the column will be lost.
  - Added the required column `desktopThumbUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileThumbUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "desktopThumbUrl" TEXT NOT NULL,
ADD COLUMN     "mobileThumbUrl" TEXT NOT NULL;
