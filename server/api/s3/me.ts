import { useImages } from '@/server/utils/useImages';

export default defineEventHandler(async (event) => {
    const { getItemPath, getItem } = useImages();

    const config = useRuntimeConfig();

    // s3 image
    const filename = 'MddQPfwiDMM.jpg';
    const filePath =`${config.storageS3Bucket}:${filename}`;
    try {
        const servePath = await getItemPath(filePath);
        if (!servePath) {
            throw new Error('not found me');
        }

        return { image: servePath };
    } catch (error) {
        throw createError({ message: 'not found me', status: 404 });
    }
});