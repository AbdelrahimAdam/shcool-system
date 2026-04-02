<template>
  <aside 
    class="fixed top-16 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-20 overflow-y-auto"
    :class="sidebarClass"
  >
    <!-- Sidebar Header -->
    <div class="p-5 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <span class="font-bold text-white text-lg">{{ languageStore.t('accountantPortal') }}</span>
          <p class="text-xs text-gray-400 mt-0.5">{{ languageStore.t('financialManagement') }}</p>
        </div>
      </div>
    </div>
    
    <!-- User Profile Section -->
    <div class="p-5 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border-2 border-yellow-500/30">
            <span class="text-base font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ languageStore.t('accountant') }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="py-6 pb-32">
      <div class="px-4 space-y-1.5">
        <!-- Dashboard Link -->
        <router-link 
          to="/accountant" 
          @click="closeSidebar"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/accountant')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/accountant') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="flex-1">{{ languageStore.t('dashboard') }}</span>
          <div v-if="isActiveRoute('/accountant')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
        
        <!-- Payments Link -->
        <router-link 
          to="/accountant/payments" 
          @click="closeSidebar"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/accountant/payments')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/accountant/payments') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('payments') }}</span>
          <div v-if="isActiveRoute('/accountant/payments')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
        
        <!-- Reports Link -->
        <router-link 
          to="/accountant/reports" 
          @click="closeSidebar"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/accountant/reports')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/accountant/reports') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('reports') }}</span>
          <div v-if="isActiveRoute('/accountant/reports')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
      </div>
    </nav>
    
    <!-- Sidebar Footer (Logout) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
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
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

// Props - receive sidebar open state from parent
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emit event to close sidebar
const emit = defineEmits(['close'])

// Computed properties
const userFullName = computed(() => authStore.profile?.full_name || 'Accountant')
const userInitials = computed(() => {
  if (!userFullName.value) return 'A'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

// Sidebar class based on open state
const sidebarClass = computed(() => {
  if (window.innerWidth < 1024) {
    return props.isOpen ? 'translate-x-0' : '-translate-x-full'
  }
  return 'lg:translate-x-0'
})

// Check if route is active
const isActiveRoute = (path) => {
  if (path === '/accountant') {
    return route.path === '/accountant'
  }
  return route.path.startsWith(path)
}

// Close sidebar when link is clicked
const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    emit('close')
  }
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Custom scrollbar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #1f2937;
}

aside::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 8px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>