<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Header with toggle event listener -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <div class="flex">
      <!-- Sidebar (updated to accept isOpen prop) -->
      <StudentSidebar 
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
      />
      
      <!-- Main Content – adds bottom padding for mobile to avoid bottom nav -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 mt-16 lg:ml-72 pb-16 lg:pb-0">
        <div class="max-w-7xl mx-auto">
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
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import StudentSidebar from '@/components/student/StudentSidebar.vue'
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
</style>