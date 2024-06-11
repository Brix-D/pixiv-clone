// import {  } from 'h3';

import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
    const { getItem, getMeta } = useStorage('s3');
    const config = useRuntimeConfig();

    const filename = 'MddQPfwiDMM.jpg';
    try {
        const me = await getItem(filename);
        if (!me) {
            throw new Error('not found me');
        }

        const mePath = `${config.storageS3Endpoint}/${config.storageS3Bucket}/${filename}`;
        return { image: mePath };
    } catch (error) {
        throw createError({ message: 'not found me', status: 404 });
    }
});