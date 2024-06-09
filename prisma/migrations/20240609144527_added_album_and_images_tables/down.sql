-- DropForeignKey
ALTER TABLE `Album` DROP FOREIGN KEY `Album_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_albumId_fkey`;

-- DropForeignKey
ALTER TABLE `FileAsset` DROP FOREIGN KEY `image_modelId`;

-- DropForeignKey
ALTER TABLE `_ImageToTag` DROP FOREIGN KEY `_ImageToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ImageToTag` DROP FOREIGN KEY `_ImageToTag_B_fkey`;

-- DropTable
DROP TABLE `Album`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `FileAsset`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `_ImageToTag`;

