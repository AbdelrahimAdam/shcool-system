<template>
  <div class="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
    <!-- Sidebar Header (Mobile only) -->
    <div class="flex items-center justify-between p-5 border-b border-gray-700 lg:hidden">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <span class="font-bold text-white text-lg">{{ languageStore.t('schoolNameShort') }}</span>
          <p class="text-xs text-gray-400 mt-0.5">{{ languageStore.t('parentPortal') }}</p>
        </div>
      </div>
      <button 
        @click="$emit('close-mobile-menu')" 
        class="p-2 rounded-xl hover:bg-gray-700 transition-all duration-200"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- User Profile Section (Desktop) -->
    <div class="hidden lg:block p-5 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border-2 border-yellow-500/30">
            <span class="text-base font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ languageStore.t('parent') }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6">
      <div class="px-4 space-y-1.5">
        <!-- Dashboard Link -->
        <router-link
          to="/parent"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute('/parent') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="flex-1">{{ languageStore.t('dashboard') }}</span>
          <div v-if="isActiveRoute('/parent')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- My Children Link -->
        <router-link
          to="/parent/children"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/children')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute('/parent/children') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('myChildren') }}</span>
          <div v-if="isActiveRoute('/parent/children')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Attendance Link -->
        <router-link
          to="/parent/attendance"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/attendance')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute('/parent/attendance') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('attendance') }}</span>
          <div v-if="isActiveRoute('/parent/attendance')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Grades Link -->
        <router-link
          to="/parent/grades"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/grades')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute('/parent/grades') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="flex-1">{{ languageStore.t('grades') }}</span>
          <div v-if="isActiveRoute('/parent/grades')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Payments Link -->
        <router-link
          to="/parent/payments"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/payments')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute('/parent/payments') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('payments') }}</span>
          <div v-if="isActiveRoute('/parent/payments')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
      </div>
    </nav>
    
    <!-- Sidebar Footer (User Info for Mobile) -->
    <div class="lg:hidden p-4 border-t border-gray-700 bg-gray-800/50">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
            <span class="text-sm font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ languageStore.t('parent') }}</p>
        </div>
        <button 
          @click="handleLogout" 
          class="p-2 rounded-xl hover:bg-gray-700 transition-all duration-200"
          :title="languageStore.t('logout')"
        >
          <svg class="w-5 h-5 text-gray-400 hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Desktop Logout Button -->
    <div class="hidden lg:block p-4 border-t border-gray-700">
      <button 
        @click="handleLogout" 
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
      >
        <svg class="w-5 h-5 transition-colors group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>{{ languageStore.t('logout') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const emit = defineEmits(['close-mobile-menu'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

// Computed properties
const userFullName = computed(() => authStore.profile?.full_name || 'User')
const userInitials = computed(() => {
  if (!userFullName.value) return 'U'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

// Check if route is active
const isActiveRoute = (path) => {
  if (path === '/parent') {
    return route.path === '/parent'
  }
  return route.path.startsWith(path)
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: #1f2937;
}

nav::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Active route indicator animation */
.router-link-active .w-1 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>