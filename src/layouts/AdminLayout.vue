<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <!-- Sidebar Component - handles its own overlay and responsive behavior -->
    <AppSidebar ref="sidebarRef" />

    <!-- Main Content - adjusts based on RTL/LTR -->
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

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const languageStore = useLanguageStore()
const sidebarRef = ref(null)

const isRTL = computed(() => languageStore.isRTL)

const mainContentClasses = computed(() => {
  const classes = ['pt-16', 'pb-16', 'lg:pb-0']
  
  if (isRTL.value) {
    classes.push('lg:pr-72')
  } else {
    classes.push('lg:pl-72')
  }
  
  return classes
})

const toggleMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}
</script>