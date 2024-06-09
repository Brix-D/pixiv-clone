<template>
    <div>
        <form action="#" @submit.prevent="onSubmit">
            <label>
                email
            </label>
            <input type="email" name="email" v-model="email" />
            <label>
                password
            </label>
            <input type="password" name="password" v-model="password" />
            <button type="submit"> signIn </button>

            <nuxt-link :to="{ name: 'signUp' }">signUp</nuxt-link>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    }
});

const name = ref('') as Ref<string>;
const email = ref('') as Ref<string>;
const password = ref('') as Ref<string>;

const { signIn } = useAuth();

const onSubmit = (event: Event) => {
    signIn('signin', { email: email.value, password: password.value, callbackUrl: '/', });
}


</script>

<style module lang="scss">

</style>