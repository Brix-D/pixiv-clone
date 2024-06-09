<template>
    <div>
        <p>
            {{ status }}
        </p>

        <pre>
            {{ data }}
        </pre>
        <div :class="$style['button-box']">
        <button @click="onLoginWithGoogle"> login With Google </button>
        <button @click="onLoginWithCredentials"> login With Password </button>
        <button @click="onSignOut"> logout </button>
    </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '#imports';
const { status, data, signIn, signOut } = useAuth();

const onLoginWithGoogle = async () => {
    await signIn('google');
};

const onLoginWithCredentials = async () => {
    await navigateTo({ name: 'signIn' });
};

const onSignOut = async () => {
    await signOut();
};
</script>

<style module>

.button-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
}


</style>