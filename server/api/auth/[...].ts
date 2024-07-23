import { hash, compare } from 'bcrypt';
import { type H3Event } from 'h3';
import { NuxtAuthHandler } from '#auth';
import { DefaultSession, DefaultUser, Session, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { usePrismaClient } from '@/composables/usePrsimaClient';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module "next-auth" {
    interface User extends DefaultUser {
        password?: string;
        id?: string;
    }

    interface Session extends DefaultSession {
        user: User & {
            id?: string;
        },
    }
}


const runtimeConfig = useRuntimeConfig();

const prisma = usePrismaClient();

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
    ],
    callbacks: {
        session({ session, user, token }) {
            const _session = {
                ...session,
            };

            _session['user'] = { ..._session['user'], id: token.sub, } as User;
            return _session;
        },
    },
    session: {
        strategy: 'jwt',
    },
});
