<template>
  <!-- Mobile Menu Overlay -->
  <transition name="fade">
    <div 
      v-if="isOpen && isMobile" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
      @click="closeSidebar"
    ></div>
  </transition>

  <aside 
    class="sidebar fixed top-0 lg:top-16 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-hidden flex flex-col"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isDesktop ? 'lg:translate-x-0' : ''
    ]"
    :style="isRTL ? 'right: 0; left: auto;' : 'left: 0; right: auto;'"
  >
    <!-- Sidebar Header -->
    <div class="flex-shrink-0 p-5 border-b border-gray-700 bg-gray-900">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <span class="font-bold text-white text-lg truncate block">{{ languageStore.t('schoolAdmin') }}</span>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ languageStore.t('managementPortal') }}</p>
        </div>
        <!-- Close button for mobile -->
        <button 
          @click="closeSidebar"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-colors flex-shrink-0"
          aria-label="Close menu"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="flex-shrink-0 p-5 border-b border-gray-700">
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

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto py-4 px-4">
      <div class="space-y-1">
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
          <svg v-if="item.icon === 'DashboardIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>

          <!-- Students Icon -->
          <svg v-else-if="item.icon === 'StudentsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>

          <!-- Teachers Icon -->
          <svg v-else-if="item.icon === 'TeachersIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>

          <!-- Classes Icon -->
          <svg v-else-if="item.icon === 'ClassesIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          </svg>

          <!-- Attendance Icon -->
          <svg v-else-if="item.icon === 'AttendanceIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Payments Icon -->
          <svg v-else-if="item.icon === 'PaymentsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- CRM Icon -->
          <svg v-else-if="item.icon === 'CRMIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          <!-- Reports Icon -->
          <svg v-else-if="item.icon === 'ReportsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>

          <!-- Parents Icon -->
          <svg v-else-if="item.icon === 'ParentsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <!-- Exams Icon -->
          <svg v-else-if="item.icon === 'ExamsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>

          <!-- Settings Icon -->
          <svg v-else-if="item.icon === 'SettingsIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <!-- Profile Icon -->
          <svg v-else-if="item.icon === 'ProfileIcon'" class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>

          <span class="flex-1 truncate">{{ languageStore.t(item.label) }}</span>

          <!-- Active indicator -->
          <div v-if="isActiveRoute(item.path)" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer - Fixed at bottom -->
    <div class="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900">
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
const isMobile = ref(window.innerWidth < 1024)
const isDesktop = ref(window.innerWidth >= 1024)

const isRTL = computed(() => languageStore.isRTL)

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

const isActiveRoute = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const menuItems = computed(() => {
  const items = [
    { path: '/admin', label: 'dashboard', icon: 'DashboardIcon' },
    { path: '/admin/students', label: 'students', icon: 'StudentsIcon' },
    { path: '/admin/teachers', label: 'teachers', icon: 'TeachersIcon' },
    { path: '/admin/classes', label: 'classes', icon: 'ClassesIcon' },
    { path: '/admin/attendance', label: 'attendance', icon: 'AttendanceIcon' }
  ]
  
  if (authStore.isAdmin || authStore.isAccountant) {
    items.push({ path: '/admin/payments', label: 'payments', icon: 'PaymentsIcon' })
  }
  
  if (authStore.isAdmin) {
    items.push({ path: '/admin/crm', label: 'crm', icon: 'CRMIcon' })
    items.push({ path: '/admin/reports', label: 'reports', icon: 'ReportsIcon' })
  }
  
  items.push({ path: '/admin/parents', label: 'parents', icon: 'ParentsIcon' })
  
  if (authStore.isAdmin) {
    items.push({ path: '/admin/exams', label: 'exams', icon: 'ExamsIcon' })
    items.push({ path: '/admin/settings', label: 'settings', icon: 'SettingsIcon' })
  }
  
  items.push({ path: '/admin/profile', label: 'myProfile', icon: 'ProfileIcon' })
  
  return items
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

const handleLogout = async () => {
  closeSidebar()
  await authStore.logout()
  router.push('/login')
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
  isDesktop.value = window.innerWidth >= 1024
  
  if (isDesktop.value) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

defineExpose({ toggleSidebar, closeSidebar })

watch(() => route.path, () => {
  closeSidebarOnMobile()
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
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

/* RTL Support */
.sidebar[style*="right: 0"] {
  transform-origin: right;
}

/* Mobile styles */
@media (max-width: 1023px) {
  .sidebar {
    top: 0 !important;
    z-index: 50 !important;
    height: 100vh !important;
    height: 100dvh !important;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .sidebar {
    top: 4rem !important;
    z-index: 20 !important;
    height: calc(100vh - 4rem) !important;
    height: calc(100dvh - 4rem) !important;
  }
}
</style>