<template>
  <div class="file-uploader">
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
      :class="{
        'border-primary-500 bg-primary-50': isDragging,
        'border-gray-300 hover:border-primary-400': !isDragging
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="acceptedTypes"
        @change="handleFileSelect"
      />
      
      <div v-if="!previewUrl">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">
          Click or drag file to upload
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ acceptedTypes }} (Max {{ maxSize }}MB)
        </p>
      </div>
      
      <div v-else class="relative">
        <img :src="previewUrl" class="max-h-48 mx-auto rounded" />
        <button
          @click.stop="removeFile"
          class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
      <div class="bg-gray-200 rounded-full h-2">
        <div class="bg-primary-600 rounded-full h-2 transition-all" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ uploadProgress }}% uploaded</p>
    </div>
    
    <p v-if="error" class="mt-2 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: File,
    default: null
  },
  acceptedTypes: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5 // MB
  }
})

const emit = defineEmits(['update:modelValue', 'upload'])

const fileInput = ref(null)
const isDragging = ref(false)
const previewUrl = ref('')
const uploadProgress = ref(0)
const error = ref('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

const processFile = (file) => {
  if (!file) return
  
  // Validate file type
  const acceptedTypesArray = props.acceptedTypes.split(',')
  const fileType = file.type
  const isValidType = acceptedTypesArray.some(type => {
    if (type.includes('/*')) {
      return fileType.startsWith(type.replace('/*', '/'))
    }
    return fileType === type
  })
  
  if (!isValidType) {
    error.value = `Invalid file type. Please upload ${props.acceptedTypes}`
    return
  }
  
  // Validate file size
  if (file.size > props.maxSize * 1024 * 1024) {
    error.value = `File too large. Maximum size is ${props.maxSize}MB`
    return
  }
  
  error.value = ''
  
  // Create preview for images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
  
  emit('update:modelValue', file)
  simulateUpload(file)
}

const simulateUpload = (file) => {
  // Simulate upload progress for demo
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    uploadProgress.value = progress
    
    if (progress >= 100) {
      clearInterval(interval)
      emit('upload', file)
    }
  }, 200)
}

const removeFile = () => {
  previewUrl.value = ''
  uploadProgress.value = 0
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>