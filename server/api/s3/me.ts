import { useStorage } from '#imports';
import { StorageDriver } from '@/types/enums/StorageDriver';

export default defineEventHandler(async (event) => {
    const { getItem } = useStorage(StorageDriver.S3);

    const config = useRuntimeConfig();

    // s3 image
    const filename = 'MddQPfwiDMM.jpg';
    // fs driver image
    // const filename = 'blins.jpg';
    const filePath =`${config.storageS3Bucket}:${filename}`;
    try {
        const servePath = await getItem(filePath);
        if (!servePath) {
            throw new Error('not found me');
        }


        // fs driver almost works path
        // const servePath = `/uploads/${filePath}`;
        // console.log('mePath', servePath);
       

        return { image: servePath };
    } catch (error) {
        throw createError({ message: 'not found me', status: 404 });
    }
});