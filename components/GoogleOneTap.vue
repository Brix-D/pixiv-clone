<template>
        <teleport to="body">
            <div id="g_id_onload"
                data-skip_prompt_cookie="next-auth.session-token"
            >
            </div>
        </teleport>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const { status, signIn } = useAuth();

const handleToken = async (token: {credential: string}) => {
    try {    
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