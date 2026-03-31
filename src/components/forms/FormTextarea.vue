<template>
  <div>
    <label v-if="label" class="label">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :rows="rows"
      class="input-field"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  rows: { type: Number, default: 3 }
})
defineEmits(['update:modelValue'])
</script>