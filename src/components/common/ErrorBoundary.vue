<template>
  <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div class="flex">
      <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">{{ languageStore.t('error') }}</h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ error.message }}</p>
        </div>
        <button @click="reset" class="mt-3 text-sm font-medium text-red-800 hover:text-red-900">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
const error = ref(null)

const reset = () => {
  error.value = null
}

onErrorCaptured((err) => {
  error.value = err
  return false // prevent propagation
})
</script>