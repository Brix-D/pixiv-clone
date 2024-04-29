import { useRequestEvent } from 'nuxt/app';
import { NuxtAuthHandler } from '#auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const runtimeConfig = useRuntimeConfig();

const prisma = new PrismaClient();

const COOKIES_LIFE_TIME = 24 * 60 * 60;
const COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Secure-' : '';

export default NuxtAuthHandler({
    adapter: PrismaAdapter(prisma),
    secret: runtimeConfig.authSecret,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
         GoogleProvider.default({
            clientId: runtimeConfig.public.googleAuthClientID,
            clientSecret: runtimeConfig.googleAuthSecret,
            // authorization: {
            //     params: {
            //       prompt: "consent",
            //       access_type: "offline",
            //       response_type: "code"
            //     }
            //   },
            //   checks: ['none'],
            authorization: {
                params: {
                    scope: 'openid email profile',
                },
            },
            checks: ['none'],
         }),
         // ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        //  CredentialsProvider.default({
        //     name: 'credentials',
        //     credentials: {
        //         token: {
        //             label: 'token',
        //             type: 'text',
        //         },
        //     },
        //     async authorize(credentials: any, req: typeof useRequestEvent) {
        //         const { token: _token } = credentials;
        //         const decodedToken = Buffer.from(_token, 'base64url').toString();
        //         const parts = decodedToken.split('.');
        //         const payload = parts[1];
        //         console.log('payload', payload);
        //         const user = prisma.user.findFirst(
        //             {
        //                 where: { id: 'clvkrmglb0000xdlb08du5v6e' },
        //             }
        //         );
        //         return user;
        //     },
        //  }),
    ],
    // cookies: {
    //     sessionToken: {
    //         name: `${COOKIE_PREFIX}next-auth.session-token`,
    //         options: {
    //           httpOnly: true,
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //         },
    //       },
    //       callbackUrl: {
    //         name: `${COOKIE_PREFIX}next-auth.callback-url`,
    //         options: {
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //         },
    //       },
    //     csrfToken: {
    //         name: `${COOKIE_PREFIX}next-auth.csrf-token`,
    //         options: {
    //           httpOnly: true,
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //         },
    //       },
    //       pkceCodeVerifier: {
    //         name: `${COOKIE_PREFIX}next-auth.pkce.code_verifier`,
    //         options: {
    //           httpOnly: true,
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //           maxAge: COOKIES_LIFE_TIME,
    //         },
    //       },
    //       state: {
    //         name: `${COOKIE_PREFIX}next-auth.state`,
    //         options: {
    //           httpOnly: true,
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //           maxAge: COOKIES_LIFE_TIME,
    //         },
    //       },
    //       nonce: {
    //         name: `${COOKIE_PREFIX}next-auth.nonce`,
    //         options: {
    //           httpOnly: true,
    //           sameSite: 'lax',
    //           path: '/',
    //           secure: true,
    //         },
    //       },
    // },
    // // debug: true,
    // logger: {
    //     debug(code, ...message) {
    //         console.debug(code, message)
    //     }
    // }, 
    callbacks: {

    },
});
