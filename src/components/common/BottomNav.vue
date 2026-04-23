<template>
  <div class="lg:hidden fixed bottom-0 inset-x-0 z-50 pb-safe">
    <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-lg rounded-t-2xl">
      <div class="flex justify-around items-center px-1 sm:px-2 py-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all duration-200 group touch-manipulation"
          :class="[
            isActive(item.path)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300'
          ]"
        >
          <div class="relative">
            <!-- Dashboard -->
            <svg v-if="item.icon === 'dashboard'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <!-- Students / Children / Users -->
            <svg v-else-if="item.icon === 'students' || item.icon === 'children' || item.icon === 'users'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Attendance -->
            <svg v-else-if="item.icon === 'attendance'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Payments -->
            <svg v-else-if="item.icon === 'payments'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Classes / Schools -->
            <svg v-else-if="item.icon === 'classes' || item.icon === 'schools'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            </svg>
            <!-- Grades -->
            <svg v-else-if="item.icon === 'grades'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <!-- Reports -->
            <svg v-else-if="item.icon === 'reports'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <!-- CRM -->
            <svg v-else-if="item.icon === 'crm'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <!-- Parents -->
            <svg v-else-if="item.icon === 'parents'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- Profile -->
            <svg v-else-if="item.icon === 'profile'" class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <!-- Fallback -->
            <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>

            <!-- Active indicator bar (horizontal line below icon) -->
            <div v-if="isActive(item.path)" class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
          </div>
          <span class="text-[11px] sm:text-xs mt-1 font-medium truncate max-w-[60px] sm:max-w-none">{{ languageStore.t(item.label) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const navItems = computed(() => {
  const role = authStore.role
  const commonStructure = {
    super_admin: [
      { path: '/super-admin', label: 'dashboard', icon: 'dashboard' },
      { path: '/super-admin/schools', label: 'schools', icon: 'schools' },
      { path: '/super-admin/users', label: 'userManagement', icon: 'users' },
      { path: '/super-admin/profile', label: 'myProfile', icon: 'profile' }
    ],
    admin: [
      { path: '/admin', label: 'dashboard', icon: 'dashboard' },
      { path: '/admin/students', label: 'students', icon: 'students' },
      { path: '/admin/attendance', label: 'attendance', icon: 'attendance' },
      { path: '/admin/payments', label: 'payments', icon: 'payments' },
      { path: '/admin/profile', label: 'myProfile', icon: 'profile' }
    ],
    teacher: [
      { path: '/teacher', label: 'dashboard', icon: 'dashboard' },
      { path: '/teacher/classes', label: 'myClasses', icon: 'classes' },
      { path: '/teacher/attendance', label: 'attendance', icon: 'attendance' },
      { path: '/teacher/grades', label: 'grades', icon: 'grades' },
      { path: '/teacher/profile', label: 'myProfile', icon: 'profile' }
    ],
    accountant: [
      { path: '/accountant', label: 'dashboard', icon: 'dashboard' },
      { path: '/accountant/payments', label: 'payments', icon: 'payments' },
      { path: '/accountant/reports', label: 'reports', icon: 'reports' },
      { path: '/accountant/profile', label: 'myProfile', icon: 'profile' }
    ],
    parent: [
      { path: '/parent', label: 'dashboard', icon: 'dashboard' },
      { path: '/parent/children', label: 'myChildren', icon: 'children' },
      { path: '/parent/attendance', label: 'attendance', icon: 'attendance' },
      { path: '/parent/grades', label: 'grades', icon: 'grades' },
      { path: '/parent/payments', label: 'payments', icon: 'payments' },
      { path: '/parent/profile', label: 'myProfile', icon: 'profile' }
    ],
    student: [
      { path: '/student', label: 'dashboard', icon: 'dashboard' },
      { path: '/student/attendance', label: 'attendance', icon: 'attendance' },
      { path: '/student/grades', label: 'grades', icon: 'grades' },
      { path: '/student/payments', label: 'payments', icon: 'payments' },
      { path: '/student/profile', label: 'myProfile', icon: 'profile' }
    ]
  }
  return commonStructure[role] || []
})

const isActive = (path) => {
  // Exact match for dashboard roots
  if (path === '/admin' && route.path === '/admin') return true
  if (path === '/teacher' && route.path === '/teacher') return true
  if (path === '/parent' && route.path === '/parent') return true
  if (path === '/student' && route.path === '/student') return true
  if (path === '/super-admin' && route.path === '/super-admin') return true
  if (path === '/accountant' && route.path === '/accountant') return true
  // For nested routes, check if route starts with path (except for root paths to avoid false positives)
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}
</script>

<style scoped>
/* Safe area inset for bottom notches (iPhone etc.) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
/* Improve touch response on mobile */
.touch-manipulation {
  touch-action: manipulation;
}
</style>