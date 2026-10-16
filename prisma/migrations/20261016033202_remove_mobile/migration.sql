/*
  Warnings:

  - You are about to drop the column `mobile` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `desktopThumbUrl` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `desktopUrl` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `mobileThumbUrl` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `mobileUrl` on the `Image` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "mobile",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "desktopThumbUrl",
DROP COLUMN "desktopUrl",
DROP COLUMN "mobileThumbUrl",
DROP COLUMN "mobileUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "thumbUrl" TEXT NOT NULL;
