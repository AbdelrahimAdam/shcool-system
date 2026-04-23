<template>
  <header class="fixed top-0 left-0 right-0 bg-blue-150 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 h-16 transition-colors duration-200">
    <div class="flex items-center justify-between h-full px-3 sm:px-6 lg:px-8">
      <!-- Left section -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Mobile menu button -->
        <button 
          @click="emitToggleSidebar" 
          class="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Menu"
        >
          <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Logo / School Name -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">{{ languageStore.t('schoolNameShort') }}</span>
        </div>
      </div>
      
      <!-- Right section -->
      <div class="flex items-center gap-1 sm:gap-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="!isDark" class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <!-- Language Switcher -->
        <button 
          @click="toggleLanguage" 
          class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :title="languageStore.currentLocale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </span>
        </button>

        <!-- Notifications (hidden on very small screens) -->
        <div class="relative hidden xs:block">
          <button 
            @click="toggleNotifications" 
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
          >
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span 
              v-if="notificationCount > 0" 
              class="absolute top-1 end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

          <!-- Notifications Dropdown (RTL‑aware) -->
          <div 
            v-if="showNotifications" 
            class="absolute end-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div class="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ languageStore.t('notifications') }}</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div v-for="notification in notifications" :key="notification.id" class="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <p class="text-sm text-gray-900 dark:text-gray-200">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatRelativeTime(notification.created_at) }}</p>
              </div>
              <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
                {{ languageStore.t('noNotifications') }}
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu (avatar and name on tablet+, only avatar on mobile) -->
        <div class="relative">
          <button 
            @click="toggleUserMenu" 
            class="flex items-center gap-1 sm:gap-2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center">
              <span class="text-sm font-medium text-blue-700 dark:text-white">{{ userInitials }}</span>
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[120px]">{{ userFullName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userRole }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Dropdown (RTL‑aware) -->
          <div 
            v-if="showUserMenu" 
            class="absolute end-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sm:hidden">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userFullName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userRole }}</p>
            </div>
            <router-link 
              :to="profileRoute"
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="showUserMenu = false"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ languageStore.t('myProfile') }}
            </router-link>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button 
              @click="handleLogout" 
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {{ languageStore.t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()
const { isDark, toggleDarkMode } = useDarkMode()

const showUserMenu = ref(false)
const showNotifications = ref(false)
const notificationCount = ref(3)

const notifications = ref([
  { id: 1, message: 'New student registration pending approval', created_at: new Date().toISOString() },
  { id: 2, message: 'Payment of 5,000 SDG received', created_at: new Date(Date.now() - 3600000).toISOString() },
])

const userFullName = computed(() => authStore.profile?.full_name || 'User')
const userRole = computed(() => {
  const roleMap = {
    super_admin: 'Super Admin',
    admin: 'School Admin',
    teacher: 'Teacher',
    accountant: 'Accountant',
    parent: 'Parent',
    student: 'Student'
  }
  return roleMap[authStore.role] || authStore.role
})

const userInitials = computed(() => {
  if (!userFullName.value) return 'U'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const profileRoute = computed(() => {
  const role = authStore.role
  if (role === 'super_admin') return '/super-admin/profile'
  if (role === 'admin') return '/admin/profile'
  if (role === 'teacher') return '/teacher/profile'
  if (role === 'accountant') return '/accountant/profile'
  if (role === 'parent') return '/parent/profile'
  if (role === 'student') return '/student/profile'
  return '/profile'
})

const emit = defineEmits(['toggle-sidebar'])

const emitToggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showNotifications.value) showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showUserMenu.value) showUserMenu.value = false
}

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const formatRelativeTime = (date) => {
  const now = new Date()
  const then = new Date(date)
  const diffMinutes = Math.floor((now - then) / 60000)
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
  return `${Math.floor(diffMinutes / 1440)} days ago`
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>