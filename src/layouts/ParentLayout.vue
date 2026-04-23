<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- App Header -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <div class="flex pt-16">
      <!-- Mobile Menu Overlay -->
      <transition name="fade">
        <div 
          v-if="mobileMenuOpen" 
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          @click="closeMobileMenu"
        ></div>
      </transition>

      <!-- Parent Sidebar - Responsive (dark mode compatible) -->
      <aside 
        class="fixed top-16 left-0 w-72 bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-100 dark:border-gray-700 transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto"
        :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        style="height: calc(100vh - 4rem);"
      >
        <ParentSidebar @close-mobile-menu="closeMobileMenu" />
      </aside>

      <!-- Main Content – adds bottom padding for mobile to avoid bottom nav -->
      <main class="flex-1 min-w-0 lg:ml-72 pb-16 lg:pb-0">
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
    </div>

    <!-- Bottom Navigation (mobile only) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ParentSidebar from '@/components/parent/ParentSidebar.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth >= 1024 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Fade animation for route transitions and overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for sidebar – dark mode compatible */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-track {
  background: #f3f4f6;
}
aside::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}
aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  aside::-webkit-scrollbar-track {
    background: #1f2937;
  }
  aside::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  aside::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}
</style>