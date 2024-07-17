

import { resolve } from 'path';

const isDev = process.env.NODE_ENV !== 'production';

const port = isDev ? +(process.env.DEV_PORT ?? 8080): +(process.env.PROD_PORT ?? 3000);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: isDev },
  ssr: true,
  app: {
      head: {
          script: [
            {
                src: 'https://accounts.google.com/gsi/client',
                async: true,
            }
        ],
        meta: [{
          name: 'referrer',
          content: 'no-referrer-when-downgrade',
      }],
      },
  },

  modules: ['@sidebase/nuxt-auth'],

  auth: {
      provider: {
          type: 'authjs',
      },
      baseURL: process.env.AUTH_ORIGIN,
      session: {
        enableRefreshOnWindowFocus: false,
        enableRefreshPeriodically: false,
      },
  },
  // s3: {
  //   driver: 's3',
  //   bucket: 'pinterest',
  //   endpoint: 'https://storage.yandexcloud.net/',
  //   region: 'ru-central1',
  //   accessKeyId: process.env.NUXT_STORAGE_S3_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.NUXT_STORAGE_S3_ACCESS_KEY_SECRET,
  //   accept: '^image/(png|jpeg|png|gif)',
  //   maxSizeMb: 10,
  //   server: false,
  // },

  devServer: {
    port,
  },

  runtimeConfig: {
    googleAuthSecret: process.env.NUXT_GOOGLE_AUTH_SECRET,
    authSecret: process.env.NUXT_AUTH_SECRET,

    // storage
    storageDriverDefault: process.env.NUXT_STORAGE_DRIVER_DEFAULT,
    storageS3AccessKey: process.env.NUXT_STORAGE_S3_ACCESS_KEY_ID,
    storageS3AccessSecret: process.env.NUXT_STORAGE_S3_ACCESS_KEY_SECRET,
    storageS3Endpoint: process.env.NUXT_STORAGE_S3_ENDPOINT,
    storageS3Bucket: process.env.NUXT_STORAGE_S3_BUCKET,
    storageS3Region: process.env.NUXT_STORAGE_S3_REGION,
    
    public: {
      googleAuthClientID: process.env.NUXT_GOOGLE_AUTH_CLIENT_ID,
      appBaseUrl: process.env.APP_BASE_URL,
      nuxtBackendUrl: process.env.NUXT_BACKEND_URL,
    },
  },

  nitro: {
    storage: {
      uploads: {
        driver: 'fs',
        base: './.data/files',
      },
    },

    // publicAssets: [
    //   {
    //     baseURL: 'uploads',
    //     dir: './.data/files',
    //     maxAge: 60,
    //     // fallthrough: true,
    //   },
    // ],
    // compressPublicAssets: {
    //   brotli: true,
    //   gzip: true,
    // },

    // routeRules: {
    //   "/uploads/**": {
    //     // headers: { 'cache-control': `public,max-age=${60},s-maxage=${60}` }
    //     cache: {
    //       maxAge: 60,
    //     },
    //   },
    //   "/_nuxt/**": {
    //     // headers: { 'cache-control': `public,max-age=${60},s-maxage=${60}` }
    //     cache: {
    //       maxAge: 60,
    //     },
    //   },
    // }
  },
})
