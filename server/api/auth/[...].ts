import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';

const runtimeConfig = useRuntimeConfig();

export default NuxtAuthHandler({
    secret: runtimeConfig.authSecret,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
         GoogleProvider.default({
            clientId: runtimeConfig.googleAuthClientID,
            clientSecret: runtimeConfig.googleAuthSecret,
         }),
    ],
    callbacks: {
        async signIn(params: any) {
            console.log('user', params.user, 'account', params.account, 'profile', params.profile, 'email', params.email, 'credentials', params.credentials);
            return true;
        },
    },
});
