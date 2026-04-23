// src/composables/useDarkMode.js
import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const init = () => {
    // Check localStorage first
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      // Fallback to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDark.value)
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const setDarkMode = (value) => {
    isDark.value = value
    applyTheme()
  }

  onMounted(() => {
    init()
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        isDark.value = e.matches
        applyTheme()
      }
    }
    mediaQuery.addEventListener('change', handler)
  })

  return { isDark, toggleDarkMode, setDarkMode }
}