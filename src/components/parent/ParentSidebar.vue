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
          <span class="font-bold text-white text-lg truncate block">{{ languageStore.t('schoolNameShort') }}</span>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ languageStore.t('parentPortal') }}</p>
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
          <p class="text-xs text-gray-400 truncate">{{ languageStore.t('parent') }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto py-6 px-4">
      <div class="space-y-1.5">
        <!-- Dashboard -->
        <router-link
          to="/parent"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="flex-1">{{ languageStore.t('dashboard') }}</span>
          <div v-if="isActiveRoute('/parent')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- My Children -->
        <router-link
          to="/parent/children"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/children')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent/children') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('myChildren') }}</span>
          <div v-if="isActiveRoute('/parent/children')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Attendance -->
        <router-link
          to="/parent/attendance"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/attendance')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent/attendance') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('attendance') }}</span>
          <div v-if="isActiveRoute('/parent/attendance')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Grades -->
        <router-link
          to="/parent/grades"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/grades')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent/grades') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="flex-1">{{ languageStore.t('grades') }}</span>
          <div v-if="isActiveRoute('/parent/grades')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Payments -->
        <router-link
          to="/parent/payments"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/payments')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent/payments') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('payments') }}</span>
          <div v-if="isActiveRoute('/parent/payments')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
        </router-link>

        <!-- Profile -->
        <router-link
          to="/parent/profile"
          @click="closeSidebarOnMobile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActiveRoute('/parent/profile')
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0 transition-all duration-200" :class="[isActiveRoute('/parent/profile') ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="flex-1">{{ languageStore.t('myProfile') }}</span>
          <div v-if="isActiveRoute('/parent/profile')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
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

const userFullName = computed(() => authStore.profile?.full_name || 'Parent')
const userInitials = computed(() => {
  if (!userFullName.value) return 'P'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const isActiveRoute = (path) => {
  if (path === '/parent') return route.path === '/parent'
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
</style>