<template>
  <div v-if="showPrompt" class="install-prompt-container">
    <div class="install-prompt">
      <div class="install-prompt-content">
        <div class="install-prompt-icon">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div class="install-prompt-text">
          <h3 class="text-sm font-semibold text-gray-900">{{ t('installApp') }}</h3>
          <p class="text-xs text-gray-500">{{ t('installAppDescription') }}</p>
        </div>
        <div class="install-prompt-buttons">
          <button @click="dismissPrompt" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button @click="installApp" class="install-button">
            {{ t('install') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const t = (key) => languageStore.t(key)

const showPrompt = ref(false)
let deferredPrompt = null
let isInstalled = false

// Check if app is already installed (standalone mode)
const checkIfInstalled = () => {
  // On mobile: check if display-mode is standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  // On iOS: check if navigator.standalone is true
  const isIOSStandalone = window.navigator.standalone === true
  isInstalled = isStandalone || isIOSStandalone
  return isInstalled
}

// Dismiss prompt (user closes it)
const dismissPrompt = () => {
  showPrompt.value = false
  // Store dismissal in localStorage to not show again for a while (e.g., 7 days)
  localStorage.setItem('installPromptDismissed', Date.now())
}

// Install app (trigger the deferred prompt)
const installApp = async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  console.log(`User response to install prompt: ${outcome}`)
  deferredPrompt = null
  showPrompt.value = false
}

// Listen for beforeinstallprompt event
const handleBeforeInstallPrompt = (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  deferredPrompt = e
  // Check if user dismissed recently (within 7 days)
  const dismissed = localStorage.getItem('installPromptDismissed')
  if (dismissed && (Date.now() - parseInt(dismissed)) < 7 * 24 * 60 * 60 * 1000) {
    return
  }
  // Only show if app is not already installed
  if (!checkIfInstalled()) {
    showPrompt.value = true
  }
}

// Also listen for appinstalled event (to know when installation completed)
const handleAppInstalled = () => {
  console.log('PWA was installed')
  showPrompt.value = false
  deferredPrompt = null
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  // For iOS devices that do not support beforeinstallprompt, we can show a custom message
  // but iOS does not support PWA installation via prompt – users must use "Add to Home Screen"
  // So we can conditionally show a different message (optional)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
.install-prompt-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.install-prompt {
  pointer-events: auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin: 0 16px;
  max-width: 400px;
  width: calc(100% - 32px);
  border: 1px solid #e5e7eb;
}

.install-prompt-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.install-prompt-icon {
  flex-shrink: 0;
}

.install-prompt-text {
  flex: 1;
}

.install-prompt-text h3 {
  margin: 0 0 2px 0;
}

.install-prompt-text p {
  margin: 0;
}

.install-prompt-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.install-button {
  background-color: #f59e0b;
  color: white;
  padding: 6px 12px;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.install-button:hover {
  background-color: #d97706;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .install-prompt-content {
    padding: 10px 12px;
  }
  .install-prompt-text h3 {
    font-size: 0.75rem;
  }
  .install-prompt-text p {
    font-size: 0.7rem;
  }
  .install-button {
    padding: 4px 10px;
    font-size: 0.7rem;
  }
}
</style>