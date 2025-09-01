import { ref, readonly } from 'vue'
import api from '@/services/api'

export function useEvents() {
  const events = ref([])
  const currentEvent = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchEvents = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/events', { params })
      events.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching events'
      throw err
    }
  }

  const fetchEvent = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/events/${id}`)
      currentEvent.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching event'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    events: readonly(events),
    currentEvent: readonly(currentEvent),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    fetchEvents,
    fetchEvent,
  }
}
