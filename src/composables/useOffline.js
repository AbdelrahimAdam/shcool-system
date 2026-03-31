import { ref, onMounted, onUnmounted } from 'vue'

export function useOffline() {
  const isOnline = ref(navigator.onLine)
  const wasOffline = ref(false)
  
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    if (isOnline.value && wasOffline.value) {
      wasOffline.value = false
      // Trigger sync event
      window.dispatchEvent(new CustomEvent('online-sync'))
    } else if (!isOnline.value) {
      wasOffline.value = true
    }
  }
  
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })
  
  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })
  
  return {
    isOnline,
    wasOffline
  }
}