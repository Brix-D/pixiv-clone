<template>
        <teleport to="body">
            <div id="g_id_onload"
                data-skip_prompt_cookie="next-auth.session-token"
         
               
           
            >

            <!--        :data-client_id="googleAuthClientID"
                :data-login_uri="googleLoginUrl" -->
            <!-- 
                     data-use_fedcm_for_prompt="true"
                
                   data-auto_select="true"
                 data-ux_mode="redirect"
                :data-allowed_parent_origin="config.public.appBaseUrl" data-callback="handleToken"
               -->
            <!--   -->
            </div>
        </teleport>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const googleAuthClientID = config.public.googleAuthClientID;

// const googleLoginUrl = `${config.public.nuxtBackendUrl}/api/auth/callback/google`;

const { getSession, data, status, signIn, getCsrfToken } = useAuth();
// const { user: } = await getSession();
// const sessionID = useCookie('SID');

// console.log('sessionID', sessionID);



const handleToken = async (token: {credential: string}) => {
    try {
        // await signIn('google', {
        // });
        // const csrfToken = await getCsrfToken();
        // console.log('csrf', csrfToken);


        // console.log('client', process.client);
        // const response = await $fetch('/api/auth/callback/google', {
        //     method: 'POST',
        //     body: {
        //         credential: token.credential,
        //         // callbackUrl: route.fullPath,
        //         csrfToken,
        //         // json: true,
        //     },
        //     headers: {
        //         'Content-Type': 'Application/json',
        //     },
        //     credentials: 'include',
        // });
        

        const response = await signIn('google', {
            callbackUrl: '/',
        });
        console.log('response', response);

    } catch (error: unknown) {
        console.log('sign in error', error);
        throw createError({
            statusCode: 401,
            message: 'Ошибка при входе',
        });
    }
}

// window.handleToken = handleToken;
onMounted(() => {
    (window as any).google.accounts.id.initialize({
      client_id: config.public.googleAuthClientID,
      callback: handleToken,
    });
    if (status.value !== 'authenticated') {
        (window as any).google.accounts.id.prompt();
    }
});
</script>

<style module lang="scss">

</style>