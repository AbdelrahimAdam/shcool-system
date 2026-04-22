<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <!-- Sidebar -->
      <TeacherSidebar 
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
      />
      
      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 mt-16 lg:ml-72">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import TeacherSidebar from '@/components/teacher/TeacherSidebar.vue'

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