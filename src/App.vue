<template>
  <div 
    :dir="languageStore.isRTL ? 'rtl' : 'ltr'" 
    :class="['app', { 'rtl': languageStore.isRTL }]"
  >
    <OfflineIndicator v-if="!isOnline" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from './stores/language'
import OfflineIndicator from './components/common/OfflineIndicator.vue'

const languageStore = useLanguageStore()
const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style>
/* Base styles */
.app {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* RTL Support */
.rtl {
  direction: rtl;
  text-align: right;
}

/* RTL spacing utilities */
.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .ml-2 {
  margin-left: 0;
  margin-right: 0.5rem;
}

.rtl .ml-3 {
  margin-left: 0;
  margin-right: 0.75rem;
}

.rtl .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

.rtl .ml-5 {
  margin-left: 0;
  margin-right: 1.25rem;
}

.rtl .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .mr-3 {
  margin-right: 0;
  margin-left: 0.75rem;
}

.rtl .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

.rtl .mr-5 {
  margin-right: 0;
  margin-left: 1.25rem;
}

.rtl .pl-1 {
  padding-left: 0;
  padding-right: 0.25rem;
}

.rtl .pl-2 {
  padding-left: 0;
  padding-right: 0.5rem;
}

.rtl .pl-3 {
  padding-left: 0;
  padding-right: 0.75rem;
}

.rtl .pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

.rtl .pl-5 {
  padding-left: 0;
  padding-right: 1.25rem;
}

.rtl .pr-1 {
  padding-right: 0;
  padding-left: 0.25rem;
}

.rtl .pr-2 {
  padding-right: 0;
  padding-left: 0.5rem;
}

.rtl .pr-3 {
  padding-right: 0;
  padding-left: 0.75rem;
}

.rtl .pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}

.rtl .pr-5 {
  padding-right: 0;
  padding-left: 1.25rem;
}

.rtl .space-x-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.rtl .space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.rtl .space-x-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.rtl .space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.rtl .space-x-5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.rtl .text-left {
  text-align: right;
}

.rtl .text-right {
  text-align: left;
}

/* Fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth scrolling for the whole app */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Disable outline for mouse users, keep for keyboard */
*:focus:not(:focus-visible) {
  outline: none;
}
</style>