<template>
    <div>
        <p>
            {{ status }}
        </p>

        <pre>
            {{ authData }}
        </pre>
        <div :class="$style['button-box']">
        <button @click="onLoginWithGoogle"> login With Google </button>
        <button @click="onLoginWithCredentials"> login With Password </button>
        <button @click="onSignOut"> logout </button>

      
        </div>

        <img v-if="meImage" :src="meImage" alt="me">
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '#imports';

const { status, data: authData, signIn, signOut } = useAuth();

const onLoginWithGoogle = async () => {
    await signIn('google');
};

const onLoginWithCredentials = async () => {
    await navigateTo({ name: 'signIn' });
};

const onSignOut = async () => {
    await signOut();
};

const { data: { value: meImage }, error } = await useAsyncData('me', async () => {
    const me = await $fetch('/api/s3/me', {
        method: 'GET',
    });

    return me.image;
});

console.log('meImage', meImage);
console.log('error', error.value);

</script>

<style module>

.button-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
}


</style>