<template>
  <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 h-16">
    <div class="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
      <!-- Left section -->
      <div class="flex items-center gap-3">
        <!-- Mobile menu button (for all layouts) -->
        <button 
          @click="emitToggleSidebar" 
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Toggle Menu"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Logo / School Name -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-gray-900 hidden sm:inline">{{ languageStore.t('schoolNameShort') }}</span>
        </div>
      </div>
      
      <!-- Right section -->
      <div class="flex items-center gap-3">
        <!-- Language Switcher -->
        <button 
          @click="toggleLanguage" 
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :title="languageStore.currentLocale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
        >
          <span class="text-sm font-medium text-gray-600">
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </span>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button 
            @click="toggleNotifications" 
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span 
              v-if="notificationCount > 0" 
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div 
            v-if="showNotifications" 
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div class="p-3 border-b border-gray-100 bg-gray-50">
              <h3 class="text-sm font-semibold text-gray-900">{{ languageStore.t('notifications') }}</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div v-for="notification in notifications" :key="notification.id" class="p-3 border-b border-gray-100 hover:bg-gray-50">
                <p class="text-sm text-gray-900">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(notification.created_at) }}</p>
              </div>
              <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-gray-400">
                {{ languageStore.t('noNotifications') }}
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button 
            @click="toggleUserMenu" 
            class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-sm font-medium text-primary-700">{{ userInitials }}</span>
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ userFullName }}</p>
              <p class="text-xs text-gray-500">{{ userRole }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Dropdown -->
          <div 
            v-if="showUserMenu" 
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 sm:hidden">
              <p class="text-sm font-medium text-gray-900">{{ userFullName }}</p>
              <p class="text-xs text-gray-500">{{ userRole }}</p>
            </div>
            <router-link 
              :to="profileRoute"
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              @click="showUserMenu = false"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ languageStore.t('myProfile') }}
            </router-link>
            <div class="border-t border-gray-100 my-1"></div>
            <button 
              @click="handleLogout" 
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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

const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

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