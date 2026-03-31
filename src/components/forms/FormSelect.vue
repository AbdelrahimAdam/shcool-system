<template>
  <div>
    <label v-if="label" class="label">{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="input-field">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: Array
})
defineEmits(['update:modelValue'])
</script>