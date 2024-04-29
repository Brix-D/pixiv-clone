

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
                // defer: true,
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
      // baseURL: `${process.env.APP_BASE_URL}:${port}/api/auth`,
      baseURL: process.env.AUTH_ORIGIN,
  },

  devServer: {
    port,
  },

  runtimeConfig: {
    googleAuthSecret: process.env.NUXT_GOOGLE_AUTH_SECRET,
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      googleAuthClientID: process.env.NUXT_GOOGLE_AUTH_CLIENT_ID,
      appBaseUrl: process.env.APP_BASE_URL,
      nuxtBackendUrl: process.env.NUXT_BACKEND_URL,
    },
  },
})
