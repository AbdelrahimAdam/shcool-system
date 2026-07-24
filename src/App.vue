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
  
  await nextTick()
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

/* Main app container */
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

/* Scrollable content area */
.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

.app-content > * {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
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

/* Fade transition */
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

/* Loading spinner */
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

/* Focus styles */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
*:focus:not(:focus-visible) {
  outline: none;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body, .app {
    background-color: #111827;
  }
}

/* Mobile improvements */
@media (max-width: 640px) {
  .app-content :deep(.overflow-x-auto) {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  .app-content :deep(input[type="radio"]) {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Touch targets */
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
</style>