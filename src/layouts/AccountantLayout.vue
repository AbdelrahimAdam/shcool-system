<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 transition-colors duration-200">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

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
      <AccountantSidebar 
        v-if="mobileMenuOpen"
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
        class="fixed top-0 left-0 z-50 lg:hidden"
      />
    </transition>

    <!-- Desktop Sidebar - Always visible -->
    <div class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:mt-16">
      <AccountantSidebar 
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import AppHeader from '@/components/common/AppHeader.vue'
import AccountantSidebar from '@/components/accountant/AccountantSidebar.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const router = useRouter()
const route = useRoute()
const languageStore = useLanguageStore()

// State
const mobileMenuOpen = ref(false)
const isMobile = ref(window.innerWidth < 1024)

// Computed
const isRTL = computed(() => languageStore.isRTL)

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

const handleResize = () => {
  const newIsMobile = window.innerWidth < 1024
  isMobile.value = newIsMobile
  
  if (!newIsMobile && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
})

// Lifecycle
onMounted(() => {
  // Set initial state
  handleResize()
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
  
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
   ADDITIONAL CONTENT STYLING
   ============================================ */

/* Card hover effects */
main :deep(.card) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

main :deep(.card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
}

/* Stats cards gradient accents */
main :deep(.stat-card) {
  position: relative;
  overflow: hidden;
}

main :deep(.stat-card::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
}

/* Button primary color override */
main :deep(.btn-primary) {
  background-color: #3b82f6;
  transition: background-color 0.2s ease;
}

main :deep(.btn-primary:hover) {
  background-color: #2563eb;
}

/* Link hover effects */
main :deep(a:not(.no-hover)) {
  color: #3b82f6;
  transition: color 0.2s ease;
}

main :deep(a:not(.no-hover):hover) {
  color: #1d4ed8;
}

/* Badge colors */
main :deep(.badge-blue) {
  background-color: #dbeafe;
  color: #1e40af;
}

main :deep(.badge-success) {
  background-color: #d1fae5;
  color: #065f46;
}

main :deep(.badge-warning) {
  background-color: #fef3c7;
  color: #92400e;
}

/* Dark mode overrides for better contrast */
@media (prefers-color-scheme: dark) {
  main :deep(.card) {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  main :deep(.card:hover) {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
  
  main :deep(.badge-blue) {
    background-color: #1e3a5f;
    color: #93c5fd;
  }
  
  main :deep(.badge-success) {
    background-color: #064e3b;
    color: #6ee7b7;
  }
  
  main :deep(.badge-warning) {
    background-color: #78350f;
    color: #fcd34d;
  }
}
</style>