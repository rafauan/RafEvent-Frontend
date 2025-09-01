import { ref, readonly } from 'vue'
import api from '@/services/api'

export function useRegistrations() {
  const loading = ref(false)
  const errors = ref({})
  const registrations = ref([])

  const registerForEvent = async (data) => {
    loading.value = true
    errors.value = {}

    try {
      const response = await api.post('/api/events/register', data)

      return response.data
    } catch (err) {
      errors.value = err.response?.data?.errors || 'Error registering for event'
      throw err
    } finally {
      loading.value = false
    }
  }

  const confirmRegistration = async (data) => {
    loading.value = true
    errors.value = {}

    try {
      const response = await api.post('/api/events/confirm', data)

      return response.data
    } catch (err) {
      errors.value = err.response?.data?.errors || 'Error confirming registration'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    errors: readonly(errors),
    registrations: readonly(registrations),
    registerForEvent,
    confirmRegistration,
  }
}
