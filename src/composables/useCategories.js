import { ref, readonly } from 'vue'
import api from '@/services/api'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/categories', { params })
      categories.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching categories'
      throw err
    }
  }

  return {
    // State
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    fetchCategories,
  }
}
