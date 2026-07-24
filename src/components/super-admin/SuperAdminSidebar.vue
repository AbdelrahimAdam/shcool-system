<template>
  <aside 
    class="sidebar fixed top-0 lg:top-16 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 shadow-2xl border-r border-gray-800 dark:border-gray-700 z-50 lg:z-20 overflow-hidden flex flex-col transition-transform duration-300 ease-in-out"
    :class="[
      isOpen ? 'sidebar-open' : 'sidebar-closed',
      isDesktop ? 'lg:translate-x-0' : '',
      isRTL ? 'rtl-sidebar' : 'ltr-sidebar'
    ]"
  >
    <!-- Close button for mobile -->
    <button 
      @click="closeSidebar"
      class="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors z-20"
      aria-label="Close menu"
    >
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Sidebar Header -->
    <div class="flex-shrink-0 p-5 border-b border-gray-700 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <span class="font-bold text-white text-lg truncate block">Super Admin</span>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ languageStore.t('managementPortal') }}</p>
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="flex-shrink-0 p-5 border-b border-gray-700 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border-2 border-yellow-500/30">
            <span class="text-base font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">Super Admin</p>
        </div>
      </div>
    </div>

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto py-6 px-4">
      <div class="space-y-1.5">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute(item.path)
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 flex-shrink-0 transition-all duration-200"
            :class="[
              isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300',
              isRTL ? 'ml-3' : 'mr-3'
            ]"
          />
          <span class="flex-1 truncate">{{ languageStore.t(item.label) }}</span>
          
          <!-- Active indicator -->
          <div v-if="isActiveRoute(item.path)" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer - Logout -->
    <div class="flex-shrink-0 p-4 border-t border-gray-700 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
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
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

// State
const isMobile = ref(window.innerWidth < 1024)
const isDesktop = ref(window.innerWidth >= 1024)

// Computed
const isRTL = computed(() => languageStore.isRTL)

const userFullName = computed(() => authStore.profile?.full_name || 'Super Admin')
const userInitials = computed(() => {
  if (!userFullName.value) return 'SA'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const menuItems = [
  { path: '/super-admin', label: 'dashboard', icon: 'DashboardIcon' },
  { path: '/super-admin/schools', label: 'schools', icon: 'SchoolsIcon' },
  { path: '/super-admin/users', label: 'userManagement', icon: 'UsersIcon' },
  { path: '/super-admin/analytics', label: 'analytics', icon: 'AnalyticsIcon' }
]

// Icons as components
const DashboardIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`
}

const SchoolsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
  </svg>`
}

const UsersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>`
}

const AnalyticsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>`
}

const isActiveRoute = (path) => {
  if (path === '/super-admin') return route.path === '/super-admin'
  return route.path.startsWith(path)
}

// Methods
const closeSidebar = () => {
  if (isMobile.value) {
    emit('close')
  }
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    emit('close')
  }
}

const handleLogout = async () => {
  closeSidebar()
  await authStore.logout()
  router.push('/login')
}

const handleResize = () => {
  const newIsMobile = window.innerWidth < 1024
  const newIsDesktop = window.innerWidth >= 1024
  
  isMobile.value = newIsMobile
  isDesktop.value = newIsDesktop
  
  // If resizing to desktop, ensure sidebar is open
  if (newIsDesktop && !props.isOpen) {
    // Parent will handle this
  }
}

// Watch for route changes to close sidebar on mobile
watch(() => route.path, () => {
  closeSidebarOnMobile()
})

// Watch for isOpen changes from parent
watch(() => props.isOpen, (newVal) => {
  // Handle any side effects if needed
}, { immediate: true })

// Expose methods for parent component
defineExpose({ 
  closeSidebar, 
  closeSidebarOnMobile,
  isOpen: props.isOpen
})

// Lifecycle
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ============================================
   SIDEBAR POSITIONING & VISIBILITY
   ============================================ */

.sidebar {
  position: fixed;
  top: 0;
  width: 288px; /* w-72 */
  height: 100vh;
  height: 100dvh;
  z-index: 50;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* LTR - Left side */
.sidebar.ltr-sidebar {
  left: 0;
  right: auto;
}

/* RTL - Right side */
.sidebar.rtl-sidebar {
  left: auto;
  right: 0;
}

/* ============================================
   MOBILE STYLES (default: hidden)
   ============================================ */

@media (max-width: 1023px) {
  /* LTR - Hidden off-screen to the left */
  .sidebar.ltr-sidebar {
    transform: translateX(-100%);
  }
  
  /* RTL - Hidden off-screen to the right */
  .sidebar.rtl-sidebar {
    transform: translateX(100%);
  }
  
  /* Open state - slide in from correct side */
  .sidebar.ltr-sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  .sidebar.rtl-sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  /* Closed state - ensure hidden */
  .sidebar.ltr-sidebar.sidebar-closed {
    transform: translateX(-100%);
  }
  
  .sidebar.rtl-sidebar.sidebar-closed {
    transform: translateX(100%);
  }
}

/* ============================================
   DESKTOP STYLES (always visible)
   ============================================ */

@media (min-width: 1024px) {
  .sidebar {
    top: 4rem !important;
    z-index: 20 !important;
    height: calc(100vh - 4rem) !important;
    height: calc(100dvh - 4rem) !important;
    transition: none !important;
  }
  
  .sidebar.ltr-sidebar {
    transform: translateX(0) !important;
    left: 0;
  }
  
  .sidebar.rtl-sidebar {
    transform: translateX(0) !important;
    right: 0;
  }
  
  /* Override any open/closed states on desktop */
  .sidebar.sidebar-open,
  .sidebar.sidebar-closed {
    transform: translateX(0) !important;
  }
}

/* ============================================
   SCROLLBAR STYLING
   ============================================ */

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

/* ============================================
   TRANSITIONS & ANIMATIONS
   ============================================ */

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effect for menu items */
.group:hover .group-hover\:text-gray-300 {
  color: #d1d5db;
}

/* Active state styling */
.bg-gradient-to-r.from-yellow-500\\/20.to-yellow-600\\/20 {
  background-image: linear-gradient(to right, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.2));
}
</style>