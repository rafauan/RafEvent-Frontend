<template>
  <nav class="mx-auto flex tems-center justify-between px-6 py-4 dark:bg-gray-800">
    <h1 class="text-3xl font-bold tracking-wider cursor-pointer dark:text-white" @click="goHome">RafEvent</h1>

    <!-- <div class="flex items-center gap-6">
      <MainButton label="Register" />
      <MainButton label="Login" />
    </div> -->
    
  </nav>
  <div class="dark:bg-gray-800 min-h-screen">
    <div class="container mx-auto max-w-7xl px-6 py-8 dark:bg-gray-800">
      <slot />
    </div>
  </div>
</template>

<script setup>
// import MainButton from '@/components/MainButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}
</script>
