import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/events/:id',
      name: 'Event',
      component: () => import('../views/EventView.vue'),
    },
    {
      path: '/confirm/:token',
      name: 'Confirm',
      component: () => import('../views/ConfirmView.vue'),
    },
  ],
})

export default router
