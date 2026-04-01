<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header for Authenticated Parent Dashboard -->
    <AppHeader />
    
    <div class="flex pt-16">
      <!-- Mobile Menu Overlay -->
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
        @click="closeMobileMenu"
      ></div>
      
      <!-- Parent Sidebar - Responsive -->
      <aside 
        class="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto"
        :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <ParentSidebar @close-mobile-menu="closeMobileMenu" />
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 min-w-0 lg:ml-64">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ParentSidebar from '@/components/parent/ParentSidebar.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Handle window resize - close mobile menu on desktop
const handleResize = () => {
  if (window.innerWidth >= 1024 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

// Expose toggle method to parent components if needed
defineExpose({
  toggleMobileMenu
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Fade animation for route transitions */
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

/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: #f1f1f1;
}

aside::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>