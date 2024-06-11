// import fsLiteDriver from "unstorage/drivers/fs-lite";
// import { createError } from "h3";
// // @ts-ignore
// import s3Driver from "@bg-dev/nuxt-s3/dist/runtime/utils/s3Driver.mjs";
// import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
// import { useStorage } from '../node_modules/nitropack/dist/runtime';

// export default defineNuxtPlugin(() => {
//   const privateConfig = useRuntimeConfig().s3;
//   if (privateConfig.driver === "fs") {
//     useStorage().mount("s3", fsLiteDriver({
//       base: privateConfig.fsBase
//     }));
//   } else if (privateConfig.driver === "s3") {
//     useStorage().mount("s3", s3Driver({
//       accessKeyId: privateConfig.accessKeyId,
//       secretAccessKey: privateConfig.secretAccessKey,
//       endpoint: privateConfig.endpoint,
//       region: privateConfig.region,
//       bucket: privateConfig.bucket
//     }));
//   } else {
//     throw createError("[nuxt-s3] Invalid driver");
//   }

//   return {
//     provide: {
//         useStorage,
//     },
//   }
// });
import { useStorage } from '#imports';

import s3Driver from '@/storage/core/s3Driver';

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();
    // const storage = createStorage({
    //     driver: s3Driver({
    //         bucket: 'pinterest',
    //         endpoint: 'https://storage.yandexcloud.net/',
    //         region: 'ru-central1',
    //         accessKeyId: config.storageS3AccessKey,
    //         secretAccessKey: config.storageS3AccessSecret,
    //     }),
    // });

    useStorage().mount('s3',
        s3Driver({
            bucket: config.storageS3Bucket,
            endpoint: config.storageS3Endpoint,
            region: config.storageS3Region,
            accessKeyId: config.storageS3AccessKey,
            secretAccessKey: config.storageS3AccessSecret,
        })
    );
});
