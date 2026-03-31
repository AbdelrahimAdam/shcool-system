<template>
  <div v-if="src" class="relative inline-block">
    <img :src="src" :alt="alt" class="max-w-full h-auto rounded-lg" />
    <button
      v-if="removable"
      @click="$emit('remove')"
      class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  alt: String,
  removable: Boolean
})
defineEmits(['remove'])
</script>