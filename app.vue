<template>
  <div>
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </div>
  <google-one-tap />
</template>

<script setup lang="ts">
import GoogleOneTap from '@/components/GoogleOneTap.vue';
</script>