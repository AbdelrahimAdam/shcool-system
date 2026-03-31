<template>
  <footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4 text-center">
      <p>&copy; {{ new Date().getFullYear() }} {{ schoolName }}. {{ languageStore.t('allRightsReserved') }}</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
const schoolName = ref('Elite School')
</script>