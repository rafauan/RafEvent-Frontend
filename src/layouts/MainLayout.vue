<template>
  <nav class="mx-auto flex tems-center justify-between px-6 py-4">
    <h1 class="text-3xl font-bold tracking-wider">RafEvent</h1>

    <div class="flex items-center gap-6">
      <MainButton label="Register" />
      <MainButton label="Login" />
    </div>
  </nav>
  <div class="container mx-auto max-w-7xl px-6 py-8">
    <slot />
  </div>
</template>

<script setup>
import MainButton from '@/components/MainButton.vue'
</script>
