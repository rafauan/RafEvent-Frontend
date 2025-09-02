<template>
  <MainLayout>
    <div>
      <h2 class="text-2xl font-bold tracking-wider dark:text-white">Welcome to RafEvent</h2>
      <p class="dark:text-white">Your one-stop solution for event management</p>
    </div>

    <div class="flex justify-between gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
        class="mt-4 p-2 border-2 w-full dark:border-gray-600 dark:text-white dark:bg-gray-800 dark:placeholder-gray-400 focus:outline-none focus:-translate-x-1 focus:-translate-y-1 transition-transform duration-300"
      />
      <select
        v-model="selectedCategory"
        class="mt-4 p-2 border-2 w-full dark:border-gray-600 dark:text-white dark:bg-gray-800 focus:outline-none focus:-translate-x-1 focus:-translate-y-1 transition-transform duration-300"
      >
        <option value="" class="dark:bg-gray-800 dark:text-white">Select Category</option>
        <option v-for="category in categories" :key="category.id" :value="category.name" class="dark:bg-gray-800 dark:text-white">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      v-if="filteredEvents.length > 0"
    >
      <div v-for="event in filteredEvents" :key="event.id">
        <EventCard :item="event" @click="goToEvent(event.id)" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-center max-w-md">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <CalendarX2 class="w-full h-full" color="#DDD" :stroke-width="1.25" />
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-1">No events found</h3>
        <p class="text-gray-400">Try adjusting your search or filter settings</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useEvents } from '@/composables/useEvents.js'
import { useCategories } from '@/composables/useCategories.js'
import { useRouter } from 'vue-router'
import { CalendarX2 } from 'lucide-vue-next'

import MainLayout from '@/layouts/MainLayout.vue'
import EventCard from '@/components/EventCard.vue'
import MainButton from '@/components/MainButton.vue'

const router = useRouter()
const { events, loading, error, fetchEvents } = useEvents()
const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  fetchCategories,
} = useCategories()

onMounted(async () => {
  try {
    await fetchEvents()
  } catch (err) {
    console.error('Failed to fetch events:', err)
  }

  try {
    await fetchCategories()
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
})

const selectedCategory = ref('')
const searchQuery = ref('')

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value
      ? event.category === selectedCategory.value
      : true
    return matchesSearch && matchesCategory
  })
})

const goToEvent = (id) => {
  // Navigate to the event details page
  router.push({ name: 'Event', params: { id } })
}
</script>
