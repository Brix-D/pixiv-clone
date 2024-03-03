

const isDev = process.env.NODE_ENV !== 'production';

const port = isDev ? +(process.env.DEV_PORT ?? 8080): +(process.env.PROD_PORT ?? 3000);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: isDev },
  modules: ['@sidebase/nuxt-auth'],
  auth: {
      provider: {
          type: 'authjs',
      },
      baseURL: `${process.env.APP_BASE_URL}:${port}/api/auth`,
  },

  devServer: {
    port,
  },

  runtimeConfig: {
    googleAuthClientID: process.env.NUXT_GOOGLE_AUTH_CLIENT_ID,
    googleAuthSecret: process.env.NUXT_GOOGLE_AUTH_SECRET,
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      appBaseUrl: process.env.APP_BASE_URL,
    },
  },
})
