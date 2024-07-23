-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_albumId_fkey`;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `albumId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
