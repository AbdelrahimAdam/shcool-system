<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-30 h-16 shadow-sm">
      <div class="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <!-- Left section -->
        <div class="flex items-center gap-4">
          <button 
            @click="toggleMobileMenu" 
            class="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-200"
            aria-label="Toggle menu"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">Super Admin</span>
          </div>
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-3">
          <button 
            @click="toggleLanguage" 
            class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Toggle language"
          >
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
              {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
            </span>
          </button>

          <div class="relative">
            <button 
              @click="toggleUserMenu" 
              class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="User menu"
            >
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span class="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{{ userInitials }}</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ userFullName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
              <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="dropdown">
              <div 
                v-if="showUserMenu" 
                class="absolute end-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ userFullName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
                </div>
                <router-link 
                  to="/super-admin/profile"
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {{ languageStore.t('logout') }}
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <!-- Sidebar - Fixed with proper mobile/desktop behavior -->
    <aside 
      class="sidebar fixed top-0 lg:top-16 w-72 bg-gray-900 dark:bg-gray-950 shadow-2xl border-r border-gray-800 dark:border-gray-700 z-50 lg:z-20 overflow-hidden flex flex-col transition-transform duration-300 ease-in-out"
      :class="[
        mobileMenuOpen ? 'sidebar-open' : 'sidebar-closed',
        isRTL ? 'rtl-sidebar' : 'ltr-sidebar'
      ]"
    >
      <!-- Close button for mobile -->
      <button 
        @click="closeMobileMenu"
        class="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors z-20"
        aria-label="Close menu"
      >
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Sidebar Header -->
      <div class="flex-shrink-0 p-5 border-b border-gray-800 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
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
      <div class="flex-shrink-0 p-5 border-b border-gray-800 dark:border-gray-700">
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
            to="/super-admin"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/super-admin')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="[isActiveRoute('/super-admin') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="flex-1">{{ languageStore.t('dashboard') }}</span>
            <div v-if="isActiveRoute('/super-admin')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
          </router-link>

          <router-link
            to="/super-admin/schools"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/super-admin/schools')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="[isActiveRoute('/super-admin/schools') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('schools') }}</span>
            <div v-if="isActiveRoute('/super-admin/schools')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
          </router-link>

          <router-link
            to="/super-admin/users"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/super-admin/users')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="[isActiveRoute('/super-admin/users') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('userManagement') }}</span>
            <div v-if="isActiveRoute('/super-admin/users')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
          </router-link>

          <router-link
            to="/super-admin/analytics"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/super-admin/analytics')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="[isActiveRoute('/super-admin/analytics') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('analytics') }}</span>
            <div v-if="isActiveRoute('/super-admin/analytics')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
          </router-link>

          <router-link
            to="/super-admin/profile"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/super-admin/profile')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="[isActiveRoute('/super-admin/profile') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300', isRTL ? 'ml-3' : 'mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('myProfile') }}</span>
            <div v-if="isActiveRoute('/super-admin/profile')" class="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
          </router-link>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="flex-shrink-0 p-4 border-t border-gray-800 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
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

    <!-- Main Content -->
    <main :class="mainContentClasses">
      <div class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation (mobile only) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import BottomNav from '@/components/common/BottomNav.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

// State
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const isMobile = ref(window.innerWidth < 1024)

// Computed
const isRTL = computed(() => languageStore.isRTL)

const userFullName = computed(() => authStore.profile?.full_name || 'Super Admin')
const userInitials = computed(() => {
  if (!userFullName.value) return 'SA'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const mainContentClasses = computed(() => {
  const classes = ['pt-16', 'pb-16', 'lg:pb-0', 'transition-all', 'duration-300']
  
  if (isRTL.value) {
    classes.push('lg:pr-72')
  } else {
    classes.push('lg:pl-72')
  }
  
  return classes
})

const isActiveRoute = (path) => {
  if (path === '/super-admin') return route.path === '/super-admin'
  return route.path.startsWith(path)
}

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}

const handleLogout = async () => {
  closeMobileMenu()
  await authStore.logout()
  router.push('/login')
}

const handleResize = () => {
  const newIsMobile = window.innerWidth < 1024
  isMobile.value = newIsMobile
  
  if (!newIsMobile && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Watch route changes to close mobile menu
watch(() => route.path, () => {
  closeMobileMenu()
})

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  
  // Close sidebar on escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  // Clean up
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
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
   TRANSITIONS
   ============================================ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================
   MAIN CONTENT
   ============================================ */

main {
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              padding-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: calc(100vh - 4rem);
}

/* ============================================
   MOBILE ADJUSTMENTS
   ============================================ */

@media (max-width: 1023px) {
  main {
    padding-bottom: 5rem;
  }
}
</style>