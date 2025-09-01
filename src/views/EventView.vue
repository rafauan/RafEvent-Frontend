<template>
  <MainLayout>
    <div>
      <h1 class="text-2xl font-bold tracking-widest text-black uppercase">
        {{ currentEvent?.name }}
      </h1>
      <div>
        <img
          :src="currentEvent?.image"
          class="w-full h-64 object-cover mt-4 rounded-lg shadow-lg"
        />
        <div class="pt-8">
          <span class="flex items-center gap-2 mb-1">
            <Calendar :size="20" />
            <span class="font-semibold">Start date:</span>
            <span class="text-gray-700">{{ formattedStartDate }}</span>
          </span>
          <span class="flex items-center gap-2 mb-1">
            <Clock :size="20" />
            <span class="font-semibold">Duration:</span>
            <span class="text-gray-700">{{ currentEvent?.duration }} minutes</span>
          </span>
          <span class="flex items-center gap-2 mb-1">
            <Users :size="20" />
            <span class="font-semibold">Capacity:</span>
            <span class="text-gray-700">{{ currentEvent?.capacity }}</span>
          </span>
          <span class="flex items-center gap-2">
            <MapPin :size="20" />
            <span class="font-semibold">Location:</span>
            <span class="text-gray-700">{{ currentEvent?.location }}</span>
          </span>
        </div>
        <div
          class="mt-8 prose prose-lg max-w-none wysiwyg-content"
          v-html="currentEvent?.description"
        ></div>
      </div>
    </div>
  </MainLayout>

  <!-- Registration Form -->
  <div class="bg-gray-100 w-full">
    <div class="container mx-auto max-w-7xl py-8 px-6">
      <form class="space-y-4" @submit.prevent="signUp">
        <!-- <div
          v-if="form.errors.capacity || errors.capacity"
          class="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded"
        >
          {{ form.errors.capacity || errors.capacity }}
        </div> -->

        <h2 class="text-2xl font-bold tracking-widest text-black uppercase">
          Register for this event
        </h2>

        <div v-if="success" class="mb-6">
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <BadgeCheck class="h-8 w-8 text-green-400" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-green-800 tracking-wide">
                  Registration Successful!
                </h3>
                <p class="text-green-700 mt-1">
                  Thank you for registering! You will receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Full name"
            class="p-2 border-2 w-full bg-white focus:outline-none focus:-translate-x-1 focus:-translate-y-1 transition-transform duration-300"
          />
          <div v-if="registrationErrors.name" class="text-red-500 text-sm mt-1">
            {{ registrationErrors.name[0] }}
          </div>
        </div>
        <div>
          <input
            v-model="formData.email"
            type="email"
            placeholder="E-mail"
            class="p-2 border-2 w-full bg-white focus:outline-none focus:-translate-x-1 focus:-translate-y-1 transition-transform duration-300"
          />
          <div v-if="registrationErrors.email" class="text-red-500 text-sm mt-1">
            {{ Array.isArray(registrationErrors.email) ? registrationErrors.email[0] : registrationErrors.email }}
          </div>
        </div>
        <div>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="Phone number"
            class="p-2 border-2 w-full bg-white focus:outline-none focus:-translate-x-1 focus:-translate-y-1 transition-transform duration-300"
          />
        </div>

        <div>
          <label class="inline-flex items-center gap-3">
            <input v-model="formData.agree" type="checkbox" class="size-8 rounded" />
            <span class="font-medium text-gray-700">
              I agree to the processing of my personal data (name, email, phone number) by RafEvent
              for the purpose of event registration, communication regarding the event, and
              providing event-related services. I understand that I can withdraw my consent at any
              time by contacting us at
              <a href="mailto:info@rafevent.com" class="text-blue-500">info@rafevent.com</a>.</span
            >
          </label>
          <div v-if="registrationErrors.agree" class="text-red-500 text-sm mt-1">
            {{ registrationErrors.agree[0] }}
          </div>
        </div>

        <div>
          <MainButton label="Register" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '@/composables/useEvents.js'
import { useRegistrations } from '@/composables/useRegistrations.js'
import { Calendar, Clock, Users, MapPin, BadgeCheck } from 'lucide-vue-next'
import { format } from 'date-fns'
import MainButton from '@/components/MainButton.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const route = useRoute()
const eventId = computed(() => route.params.id)

const { currentEvent, fetchEvent } = useEvents()
const {
  registerForEvent,
  errors: registrationErrors,
} = useRegistrations()
const success = ref(false)

const formData = reactive({
  event_id: eventId.value,
  name: '',
  email: '',
  phone: '',
  agree: false,
})

onMounted(async () => {
  if (eventId.value) {
    try {
      await fetchEvent(eventId.value)
    } catch (error) {
      console.error('Error fetching event:', error)
    }
  }
})

const formattedStartDate = computed(() => {
  if (!currentEvent.value?.start_datetime) return ''
  return format(new Date(currentEvent.value.start_datetime), 'MMMM dd, yyyy HH:mm')
})

const signUp = async () => {
  try {
    await registerForEvent(formData)

    // Success
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.agree = false
    success.value = true
  } catch (errors) {
    console.error('Registration failed:', errors)
  }
}
</script>

<style>
.wysiwyg-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.wysiwyg-content h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: #7bf1a7;
  margin-top: 0.5rem;
}

.wysiwyg-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.wysiwyg-content h3::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background-color: #7bf1a7;
  margin-top: 0.5rem;
}

.wysiwyg-content p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.wysiwyg-content ul {
  margin-bottom: 0.5rem;
}

.wysiwyg-content li::before {
  content: '•';
  font-weight: 800;
  color: #7bf1a7;
  margin-right: 0.5rem;
}

.wysiwyg-content blockquote {
  border-left: 3px solid #7bf1a7;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.wysiwyg-content em {
  font-style: italic;
}

.wysiwyg-content figure a {
  color: #aaa;
  text-decoration: underline;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
