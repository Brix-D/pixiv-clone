import { usePrismaClient } from '@/composables/usePrsimaClient';
import { useFileAssets } from '@/server/utils/useFileAssets';
import { getCurrentUser } from '@/server/utils/getCurrentUser';
import { FileAssetsItemResponse } from '@/types/fileAssets';

export default defineEventHandler(async (event) => {
    const query = getQuery<{ skip: string }>(event);

    const skip = parseInt(query?.skip ?? 0);

    const prisma = usePrismaClient();

    const currentUser = await getCurrentUser(event);

    const imagesCount = await prisma.image.count({
        where: {
            userId: currentUser.id,
            isPrivate: false,
        },
    });

    const images = await prisma.image.findMany({
        where: {
            userId: currentUser.id,
            isPrivate: false,
        },
        take: 10,
        skip: skip,
        include: { fileAssets: true, tags: true },    
    });

    type ImageDatabase = typeof images[number];

    type ImageWithLink = Omit<ImageDatabase, 'fileAssets'> & { fileAssets: FileAssetsItemResponse[] };

    const imagesWithLinks: ImageWithLink[] = [];
    for (const image of images) {
        const { getAll } = await useFileAssets(image);
        
        const fileAssets = await getAll();

        imagesWithLinks.push({
            ...image,
            fileAssets: fileAssets,
        });
    }

    return { count: imagesCount, images: imagesWithLinks };
});