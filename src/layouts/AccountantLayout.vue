<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 transition-colors duration-200">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <!-- Sidebar Component - handles its own overlay and responsive behavior -->
    <AccountantSidebar ref="sidebarRef" />

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import AppHeader from '@/components/common/AppHeader.vue'
import AccountantSidebar from '@/components/accountant/AccountantSidebar.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const languageStore = useLanguageStore()
const sidebarRef = ref(null)

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

const toggleMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}

// Close sidebar on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && sidebarRef.value?.isMobile) {
    sidebarRef.value.closeSidebar()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
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

main :deep(.btn-primary:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
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

main :deep(.badge-danger) {
  background-color: #fecaca;
  color: #991b1b;
}

/* Input focus states */
main :deep(input:focus),
main :deep(select:focus),
main :deep(textarea:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table header styling */
main :deep(table thead th) {
  background-color: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
}

main :deep(.dark table thead th) {
  background-color: #1e293b;
  color: #e2e8f0;
}

/* Progress bars */
main :deep(.progress-bar) {
  background-color: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

main :deep(.progress-bar .progress-fill) {
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  transition: width 0.5s ease;
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
  
  main :deep(.badge-danger) {
    background-color: #7f1d1d;
    color: #fca5a5;
  }
  
  main :deep(input:focus),
  main :deep(select:focus),
  main :deep(textarea:focus) {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
  }
  
  main :deep(.progress-bar) {
    background-color: #374151;
  }
}
</style>