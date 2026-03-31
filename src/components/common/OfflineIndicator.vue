<template>
  <div class="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
    <div class="flex items-center justify-center space-x-2" :class="{ 'space-x-reverse': languageStore.isRTL }">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636L15.535 8.464M15.535 5.636l2.829 2.828M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ languageStore.t('networkError') }}</span>
    </div>
  </div>
</template>

<script setup>
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
</script>