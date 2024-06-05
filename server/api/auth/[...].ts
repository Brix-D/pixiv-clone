import { hash, compare } from 'bcrypt';
import { type H3Event } from 'h3';
import { NuxtAuthHandler } from '#auth';
import { DefaultUser } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module "next-auth" {
    interface User extends DefaultUser {
        password?: string;
        id?: number;
    }
}


const runtimeConfig = useRuntimeConfig();

const prisma = new PrismaClient();

const COOKIES_LIFE_TIME = 24 * 60 * 60;
const COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Secure-' : '';

export default NuxtAuthHandler({
    adapter: PrismaAdapter(prisma),
    secret: runtimeConfig.authSecret,
    pages: {
        // newUser: '/sign-up',
        signIn: 'signIn',
    },
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
         // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
         CredentialsProvider.default({
            id: 'signin',
            name: 'signin',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },

            async authorize(credentials: any, event: H3Event) {
                const { email, password } = credentials;

                const user = await prisma.user.findFirst({
                    where: { email },
                });

                if (!user || !user?.password) {
                    return null;
                }

                const isPasswordsMatched = await compare(password, user.password);

                if (!isPasswordsMatched) {
                    return null;
                }

                return user;
            },
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
        // jwt({ token, user }) {
        //     if (user) { // User is available during sign-in
        //       token.id = user.id;
        //     }
        //     return token;
        // },
        session({ session, user, token }) {
            console.log('session', session);
            return {
                ...session,
                // user: {
                //     id: token.id,
                // },
            };
        },
    },
    session: {
        strategy: 'jwt',
    },
});
