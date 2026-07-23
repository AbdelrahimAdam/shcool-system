<template>
  <div 
    :dir="languageStore.isRTL ? 'rtl' : 'ltr'" 
    :class="['app', { 'rtl': languageStore.isRTL }]"
  >
    <OfflineIndicator v-if="!isOnline" />
    <div class="app-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">{{ languageStore.t('loading') }}...</p>
        </div>
      </div>

      <!-- Main Content -->
      <router-view v-else v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <InstallPrompt />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useLanguageStore } from './stores/language'
import OfflineIndicator from './components/common/OfflineIndicator.vue'
import InstallPrompt from './components/common/InstallPrompt.vue'

const languageStore = useLanguageStore()
const isOnline = ref(navigator.onLine)
const isLoading = ref(true)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(async () => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // ✅ FIX: Increased delay to ensure dashboard is fully loaded
  // Wait for DOM to be ready, then wait additional time for data fetching
  await nextTick()
  
  // Wait for the app to be fully ready - increased from 300ms to 1500ms
  // This gives enough time for the auth store to initialize and dashboard to load
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isLoading.value = false
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style>
/* ----- RESET & FULL HEIGHT WITH MOBILE FIRST ----- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Use 100dvh for dynamic viewport height (modern browsers) */
/* Fallback to 100vh for older browsers */
@supports (height: 100dvh) {
  html, body, #app {
    height: 100dvh;
    min-height: 100dvh;
  }
}

body {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f9fafb;
  -webkit-overflow-scrolling: touch;
}

/* Main app container – flex column with safe area support */
.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Scrollable content area – allows natural scrolling */
.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

/* Ensure router-view and its children can grow and scroll properly */
.app-content > * {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Allow nested components to control their own overflow */
.app-content .fade-enter-active,
.app-content .fade-leave-active {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Fix for transition wrapper */
.app-content .fade-enter-active > *,
.app-content .fade-leave-active > * {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Allow tables and their containers to scroll horizontally */
.app-content :deep(.overflow-x-auto),
.app-content :deep(.table-scroll-wrapper) {
  overflow-x: auto !important;
  overflow-y: visible !important;
  -webkit-overflow-scrolling: touch;
}

/* Ensure card components don't clip overflow content */
.app-content :deep(.card) {
  overflow: visible !important;
}

/* Allow attendance table container to display properly */
.app-content :deep(.attendance-table-container) {
  overflow: visible !important;
}

/* Improve touch targets for interactive elements */
button, 
a, 
[role="button"],
input[type="submit"],
input[type="reset"],
input[type="button"] {
  touch-action: manipulation;
  min-height: 44px;
  min-width: 44px;
}

/* RTL Support */
.rtl {
  direction: rtl;
  text-align: right;
}

/* RTL spacing utilities */
.rtl .ml-1 { margin-left: 0; margin-right: 0.25rem; }
.rtl .ml-2 { margin-left: 0; margin-right: 0.5rem; }
.rtl .ml-3 { margin-left: 0; margin-right: 0.75rem; }
.rtl .ml-4 { margin-left: 0; margin-right: 1rem; }
.rtl .ml-5 { margin-left: 0; margin-right: 1.25rem; }
.rtl .mr-1 { margin-right: 0; margin-left: 0.25rem; }
.rtl .mr-2 { margin-right: 0; margin-left: 0.5rem; }
.rtl .mr-3 { margin-right: 0; margin-left: 0.75rem; }
.rtl .mr-4 { margin-right: 0; margin-left: 1rem; }
.rtl .mr-5 { margin-right: 0; margin-left: 1.25rem; }
.rtl .pl-1 { padding-left: 0; padding-right: 0.25rem; }
.rtl .pl-2 { padding-left: 0; padding-right: 0.5rem; }
.rtl .pl-3 { padding-left: 0; padding-right: 0.75rem; }
.rtl .pl-4 { padding-left: 0; padding-right: 1rem; }
.rtl .pl-5 { padding-left: 0; padding-right: 1.25rem; }
.rtl .pr-1 { padding-right: 0; padding-left: 0.25rem; }
.rtl .pr-2 { padding-right: 0; padding-left: 0.5rem; }
.rtl .pr-3 { padding-right: 0; padding-left: 0.75rem; }
.rtl .pr-4 { padding-right: 0; padding-left: 1rem; }
.rtl .pr-5 { padding-right: 0; padding-left: 1.25rem; }
.rtl .space-x-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
.rtl .space-x-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
.rtl .space-x-3 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
.rtl .space-x-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
.rtl .space-x-5 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
.rtl .text-left { text-align: right; }
.rtl .text-right { text-align: left; }

/* Fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active {
  transition-delay: 0.05s;
}

/* Loading spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}

/* Focus styles for accessibility – visible only on keyboard navigation */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
*:focus:not(:focus-visible) {
  outline: none;
}

/* Dark mode support for base backgrounds */
@media (prefers-color-scheme: dark) {
  body, .app {
    background-color: #111827;
  }
}

/* Ensure tables and scrollable containers work on mobile */
@media (max-width: 640px) {
  .app-content :deep(.overflow-x-auto) {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  /* Ensure touch targets remain accessible */
  .app-content :deep(input[type="radio"]) {
    min-height: 44px;
    min-width: 44px;
  }
}

/* ============================================
   GLOBAL SIDEBAR STYLES - PREVENT FLASH ON LOGIN
   ============================================ */

/* Base sidebar styles - applied to all sidebars */
.sidebar {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* Ensure sidebar is in correct position by default */
  transform: translateX(0);
}

/* Mobile sidebar - start hidden, but only if not open */
@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
    top: 0 !important;
    z-index: 50 !important;
    height: 100vh !important;
    height: 100dvh !important;
    padding-bottom: 5rem !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* When open, slide in */
  .sidebar.mobile-open {
    transform: translateX(0) !important;
  }
  
  /* Sidebar footer adjustment for mobile */
  .sidebar-footer {
    bottom: 5rem !important;
  }
}

/* Desktop sidebar - always visible */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
    top: 4rem !important;
    z-index: 20 !important;
    height: calc(100vh - 4rem) !important;
    height: calc(100dvh - 4rem) !important;
    transition: none !important;
  }
}

/* Prevent sidebar flash during route transitions */
.fade-enter-active .sidebar,
.fade-leave-active .sidebar {
  transition: none !important;
}

/* Prevent sidebar from being affected by fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure sidebar content doesn't overflow */
.sidebar nav {
  padding-bottom: 8rem;
}

/* Custom scrollbar for all sidebars */
.sidebar::-webkit-scrollbar {
  width: 6px;
}
.sidebar::-webkit-scrollbar-track {
  background: #1f2937;
}
.sidebar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 8px;
}
.sidebar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Prevent layout shift during loading */
.app-content {
  min-height: 100vh;
}

/* Ensure content doesn't shift when sidebar appears */
main {
  transition: margin-left 0.3s ease;
}
</style>