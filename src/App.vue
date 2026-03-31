<template>
  <div :dir="languageStore.isRTL ? 'rtl' : 'ltr'" :class="['app', { 'rtl': languageStore.isRTL }]">
    <OfflineIndicator v-if="!isOnline" />
    <router-view />
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
.app {
  min-height: 100vh;
  background-color: #f3f4f6;
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

.rtl .pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

.rtl .pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}

.rtl .text-left {
  text-align: right;
}

.rtl .text-right {
  text-align: left;
}
</style>