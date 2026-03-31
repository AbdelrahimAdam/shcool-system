import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { supabase } from './services/supabase'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './index.css'  // Make sure this imports Tailwind CSS
import App from './App.vue'
import { useLanguageStore } from './stores/language'

const toastOptions = {
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: false,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    position: 'top-right'
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// Initialize language
const languageStore = useLanguageStore()
languageStore.setLocale(localStorage.getItem('locale') || 'en')

app.config.globalProperties.$supabase = supabase
app.config.globalProperties.$t = languageStore.t

app.mount('#app')