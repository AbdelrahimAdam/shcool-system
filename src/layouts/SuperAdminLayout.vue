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

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <SuperAdminSidebar 
        v-if="mobileMenuOpen"
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
        class="fixed top-0 left-0 z-50 lg:hidden"
      />
    </transition>

    <!-- Desktop Sidebar - Always visible -->
    <div class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:mt-16">
      <SuperAdminSidebar 
        :is-open="true"
        class="relative h-full"
      />
    </div>

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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import SuperAdminSidebar from '@/components/super-admin/SuperAdminSidebar.vue'
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
  showUserMenu.value = false
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

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
})

// Watch for language changes to update RTL
watch(() => languageStore.isRTL, () => {
  // Force re-render if needed
  nextTick()
})

// Lifecycle
onMounted(() => {
  // Set initial state
  handleResize()
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  
  // Close sidebar on escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  // Clean up on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
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

/* Slide transition for mobile sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* RTL slide */
.rtl .slide-enter-from,
.rtl .slide-leave-to {
  transform: translateX(100%);
}

/* Dropdown transitions */
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

/* ============================================
   SCROLLABLE TABLES & CONTENT
   ============================================ */

main :deep(.attendance-table-container) {
  overflow: visible !important;
  max-height: none !important;
}

main :deep(.table-scroll-wrapper) {
  overflow-x: auto !important;
  overflow-y: visible !important;
  max-height: none !important;
  -webkit-overflow-scrolling: touch !important;
}

main :deep(.overflow-auto) {
  overflow: auto !important;
  max-height: none !important;
}

/* ============================================
   MOBILE TABLE FIXES
   ============================================ */

@media (max-width: 640px) {
  main :deep(.attendance-table) {
    min-width: 600px !important;
  }
  
  main :deep(.sticky-col) {
    position: sticky !important;
    left: 0 !important;
    z-index: 10 !important;
    background-color: #f9fafb !important;
  }
  
  main :deep(.dark .sticky-col) {
    background-color: #1f2937 !important;
  }
  
  main :deep(.attendance-table td),
  main :deep(.attendance-table th) {
    padding: 0.5rem 0.75rem !important;
  }
  
  main :deep(.radio-label) {
    padding: 8px !important;
    display: inline-block !important;
  }
  
  main :deep(.table-scroll-wrapper) {
    padding-bottom: 4px !important;
    margin-bottom: -4px !important;
  }
}

/* ============================================
   HEADER DARK MODE OVERRIDES
   ============================================ */

@media (prefers-color-scheme: dark) {
  header {
    background-color: rgba(31, 41, 55, 0.95) !important;
  }
}
</style>