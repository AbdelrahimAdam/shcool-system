<template>
  <aside 
    class="sidebar fixed top-16 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-40 overflow-y-auto lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Sidebar Header -->
    <div class="p-5 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="font-bold text-white text-lg truncate block">{{ languageStore.t('schoolAdmin') }}</span>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ languageStore.t('managementPortal') }}</p>
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="p-5 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border-2 border-yellow-500/30">
            <span class="text-base font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ userRole }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="py-6 pb-32">
      <div class="px-4 space-y-1.5">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute(item.path)
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebarOnMobile"
        >
          <!-- Dashboard Icon -->
          <svg v-if="item.icon === 'DashboardIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>

          <!-- Students Icon -->
          <svg v-else-if="item.icon === 'StudentsIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>

          <!-- Teachers Icon -->
          <svg v-else-if="item.icon === 'TeachersIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>

          <!-- Classes Icon -->
          <svg v-else-if="item.icon === 'ClassesIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          </svg>

          <!-- Attendance Icon -->
          <svg v-else-if="item.icon === 'AttendanceIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Payments Icon -->
          <svg v-else-if="item.icon === 'PaymentsIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- CRM Icon -->
          <svg v-else-if="item.icon === 'CRMIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          <!-- Reports Icon -->
          <svg v-else-if="item.icon === 'ReportsIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>

          <!-- Parents Icon -->
          <svg v-else-if="item.icon === 'ParentsIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <!-- Settings Icon -->
          <svg v-else-if="item.icon === 'SettingsIcon'" class="w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200" :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <span class="flex-1 truncate">{{ languageStore.t(item.label) }}</span>

          <!-- Active indicator -->
          <div v-if="isActiveRoute(item.path)" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
      <button 
        @click="handleLogout" 
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
      >
        <svg class="w-5 h-5 transition-colors group-hover:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="truncate">{{ languageStore.t('logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useLanguageStore } from '../../stores/language'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const isOpen = ref(false)

// Computed properties
const userFullName = computed(() => authStore.profile?.full_name || 'Admin User')
const userInitials = computed(() => {
  if (!userFullName.value) return 'AU'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const userRole = computed(() => {
  if (authStore.isSuperAdmin) return 'Super Admin'
  if (authStore.isAdmin) return 'School Admin'
  if (authStore.isAccountant) return 'Accountant'
  if (authStore.isTeacher) return 'Teacher'
  return 'Staff'
})

// Check if route is active
const isActiveRoute = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const menuItems = computed(() => {
  const baseItems = [
    { path: '/admin', label: 'dashboard', icon: 'DashboardIcon' },
    { path: '/admin/students', label: 'students', icon: 'StudentsIcon' },
    { path: '/admin/teachers', label: 'teachers', icon: 'TeachersIcon' },
    { path: '/admin/classes', label: 'classes', icon: 'ClassesIcon' },
    { path: '/admin/attendance', label: 'attendance', icon: 'AttendanceIcon' }
  ]
  
  if (authStore.isAdmin || authStore.isAccountant) {
    baseItems.push({ path: '/admin/payments', label: 'payments', icon: 'PaymentsIcon' })
  }
  
  if (authStore.isAdmin) {
    baseItems.push({ path: '/admin/crm', label: 'crm', icon: 'CRMIcon' })
    baseItems.push({ path: '/admin/reports', label: 'reports', icon: 'ReportsIcon' })
  }
  
  // Always show Parents link for admin sidebar
  baseItems.push({ path: '/admin/parents', label: 'parents', icon: 'ParentsIcon' })
  
  // ✅ NEW: Add Settings link for admin users
  if (authStore.isAdmin) {
    baseItems.push({ path: '/admin/settings', label: 'settings', icon: 'SettingsIcon' })
  }
  
  return baseItems
})

// Toggle sidebar on mobile
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    isOpen.value = false
  }
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

// Expose toggle function for parent component
defineExpose({ toggleSidebar })

// Watch for route changes to close sidebar on mobile
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    isOpen.value = false
  }
})

onMounted(() => {
  // Ensure sidebar is open on desktop, closed on mobile
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Custom scrollbar */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: #1f2937;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Active indicator animation */
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

/* Mobile styles - prevent flashing */
@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .sidebar.translate-x-0 {
    transform: translateX(0) !important;
  }
  
  .sidebar-footer {
    bottom: 0 !important;
  }
}

/* Desktop styles - always visible */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}
</style>