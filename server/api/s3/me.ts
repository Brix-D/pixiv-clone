import { getItemUrl }  from '@/server/utils/getItemUrl';

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig();

    // s3 image
    const filename = 'MddQPfwiDMM.jpg';
    const filePath =`${config.storageS3Bucket}:${filename}`;
    const servePath = await getItemUrl(filePath);
    return { image: servePath };
});