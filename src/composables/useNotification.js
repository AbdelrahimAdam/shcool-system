import { useToast } from 'vue-toastification'

export function useNotification() {
  const toast = useToast()

  const success = (message) => {
    toast.success(message, { timeout: 3000 })
  }

  const error = (message) => {
    toast.error(message, { timeout: 4000 })
  }

  const info = (message) => {
    toast.info(message, { timeout: 3000 })
  }

  const warning = (message) => {
    toast.warning(message, { timeout: 3000 })
  }

  return { success, error, info, warning }
}