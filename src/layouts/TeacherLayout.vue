<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <!-- Mobile Sidebar Overlay - Full screen -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <!-- Mobile Sidebar - Covers everything including header -->
    <transition name="slide">
      <TeacherSidebar 
        v-if="mobileMenuOpen"
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
        class="fixed top-0 left-0 z-50 lg:hidden"
      />
    </transition>

    <!-- Desktop Sidebar - Always visible -->
    <div class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:mt-16">
      <TeacherSidebar 
        :is-open="true"
        class="relative h-full"
      />
    </div>

    <!-- Main Content -->
    <div class="lg:ml-72 flex flex-col" style="min-height: 100vh; height: 100%;">
      <main class="flex-1 p-4 sm:p-6 lg:p-8 mt-16" style="min-height: calc(100vh - 4rem); height: 100%;">
        <div class="max-w-7xl mx-auto" style="height: 100%;">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Bottom Navigation (mobile only) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import TeacherSidebar from '@/components/teacher/TeacherSidebar.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // ✅ FIX: Don't set body overflow to hidden
  // This was causing the scroll freeze
  // The sidebar overlay already handles the backdrop
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  // ✅ FIX: No need to reset body overflow
}

const handleResize = () => {
  if (window.innerWidth >= 1024 && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// ✅ FIX: Force a scroll reset on mount
const fixScroll = () => {
  nextTick(() => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      // Force browser to recalculate layout
      mainElement.style.overflow = 'auto'
      mainElement.style.height = '100%'
      // Trigger reflow
      void mainElement.offsetHeight
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // ✅ FIX: Ensure scroll works on mount
  fixScroll()
  
  // ✅ FIX: Also fix scroll after a small delay (when content loads)
  setTimeout(fixScroll, 500)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // ✅ FIX: Don't reset body overflow on unmount
})
</script>

<style scoped>
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

/* ✅ FIX: Main content scroll */
main {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

/* Ensure content can grow */
main :deep(.router-view-wrapper),
main :deep(.fade-enter-active),
main :deep(.fade-leave-active) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Mobile bottom nav spacing */
@media (max-width: 1023px) {
  main {
    padding-bottom: 5rem;
  }
  
  .lg\:ml-72 {
    margin-left: 0;
  }
}

/* Desktop fixes */
@media (min-width: 1024px) {
  .lg\:mt-16 {
    margin-top: 4rem;
  }
  
  .lg\:ml-72 {
    margin-left: 18rem;
  }
}

/* Allow tables to scroll horizontally */
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

/* ✅ FIX: Prevent body overflow manipulation */
body {
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* Ensure radio buttons and controls are accessible on mobile */
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
</style>