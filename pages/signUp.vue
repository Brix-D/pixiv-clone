<template>
    <div>
        <form action="#" @submit.prevent="onSubmit">
            <label>
                email
            </label>
            <input type="email" name="email" v-model="email" />
            <label>
                name
            </label>
            <input type="name" name="name" v-model="name" />
            <label>
                password
            </label>
            <input type="password" name="password" v-model="password" />
            <button type="submit"> signUp </button>
            <nuxt-link :to="{ name: 'signIn' }">signIn</nuxt-link>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    },
});

const name = ref('') as Ref<string>;
const email = ref('') as Ref<string>;
const password = ref('') as Ref<string>;

const onSubmit = async (event: Event) => {
    await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
            name: name.value,
            email: email.value,
            password: password.value,
        },
    });
}
</script>

<style module lang="scss">

</style>