<template>
  <MainLayout>
    <div class="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full space-y-8 text-center">
        
        <!-- Loading state -->
        <div v-if="loading" class="space-y-6">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <h2 class="text-3xl font-bold tracking-wider text-gray-900 dark:text-white">Confirming Registration...</h2>
          <p class="text-gray-600 dark:text-gray-400">Please wait while we verify your token.</p>
        </div>

        <!-- Success state -->
        <div v-else-if="confirmed" class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle class="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div class="space-y-2">
            <h2 class="text-4xl font-bold tracking-wider text-gray-900 dark:text-white">Registration Confirmed!</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">Your event participation has been successfully confirmed.</p>
          </div>
          <div class="pt-4">
            <MainButton 
              label="Back to Home"
              @click="goHome"
            />
          </div>
        </div>

        <!-- Error state -->
        <div v-else class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900">
            <XCircle class="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <div class="space-y-2">
            <h2 class="text-4xl font-bold tracking-wider text-gray-900 dark:text-white">Confirmation Failed</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">{{ errorMessage || 'An error occurred while confirming your registration.' }}</p>
          </div>
          <div class="pt-4">
              <MainButton
                label="Back to Home"
                @click="goHome"
              />
          </div>
        </div>

      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRegistrations } from '@/composables/useRegistrations.js'
import { CheckCircle, XCircle } from 'lucide-vue-next'

import MainLayout from '@/layouts/MainLayout.vue'
import MainButton from '@/components/MainButton.vue'

const route = useRoute()
const router = useRouter()
const { confirmRegistration, loading, errors } = useRegistrations()

const token = ref(route.params.token)
const confirmed = ref(false)
const errorMessage = ref('')

const confirmToken = async () => {
  try {
    await confirmRegistration({ token: token.value })
    confirmed.value = true
    errorMessage.value = ''
  } catch (error) {
    confirmed.value = false

    // Handle specific error cases
    if (error.response?.status === 404) {
      errorMessage.value = 'Registration not found. The token may be invalid or expired.'
    } else if (error.response?.status === 409) {
      errorMessage.value = 'This registration has already been confirmed.'
    } else if (error.response?.status === 400) {
      errorMessage.value = 'Invalid token format. Please check your confirmation link.'
    } else {
      errorMessage.value = errors.value || 'Failed to confirm registration. Please try again later.'
    }
  }
}

const goHome = () => {
  router.push({ name: 'Home' })
}




onMounted(() => {
  if (token.value) {
    confirmToken()
  } else {
    errorMessage.value = 'No confirmation token provided.'
  }
})

</script>
