<template>
  <div class="flex flex-col h-full">
    <!-- Sidebar Header (Mobile only) -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span class="font-semibold text-gray-900">{{ languageStore.t('schoolNameShort') }}</span>
      </div>
      <button 
        @click="$emit('close-mobile-menu')" 
        class="p-2 rounded-lg hover:bg-gray-100"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-3 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="$emit('close-mobile-menu')"
          class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActiveRoute(item.path)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 mr-3 flex-shrink-0"
            :class="isActiveRoute(item.path) ? 'text-primary-600' : 'text-gray-400'"
          />
          <span class="flex-1">{{ languageStore.t(item.label) }}</span>
        </router-link>
      </div>
    </nav>
    
    <!-- Sidebar Footer (User Info) -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span class="text-sm font-medium text-primary-700">{{ userInitials }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ languageStore.t('parent') }}</p>
        </div>
        <button 
          @click="handleLogout" 
          class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

defineEmits(['close-mobile-menu'])

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

// Menu items
const menuItems = computed(() => {
  return [
    { path: '/parent', label: 'dashboard', icon: 'DashboardIcon' },
    { path: '/parent/children', label: 'myChildren', icon: 'ChildrenIcon' },
    { path: '/parent/attendance', label: 'attendance', icon: 'AttendanceIcon' },
    { path: '/parent/grades', label: 'grades', icon: 'GradesIcon' },
    { path: '/parent/payments', label: 'payments', icon: 'PaymentsIcon' }
  ]
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

// Icons
const DashboardIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const ChildrenIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' }
const AttendanceIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const GradesIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }
const PaymentsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
</script>