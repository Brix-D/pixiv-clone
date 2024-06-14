import { useStorage } from '#imports';
import { resolve } from 'path';
import fsDriver from 'unstorage/drivers/fs';

import s3Driver from '@/storage/core/s3Driver';
// import { useNuxtApp } from 'nuxt/app';

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();


    // const dirname = new URL('./', import.meta.url).pathname;
    // console.log('dirname', dirname);
    // useStorage().mount('uploads', fsDriver({
    //     base: resolve('public', 'files'),
    //     // base: '/uploads',
    // }));

    useStorage().mount('s3',
        s3Driver({
            // bucket: config.storageS3Bucket,
            endpoint: config.storageS3Endpoint,
            region: config.storageS3Region,
            accessKeyId: config.storageS3AccessKey,
            secretAccessKey: config.storageS3AccessSecret,
        })
    );
});
