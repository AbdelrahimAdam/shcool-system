<template>
  <header class="sticky top-0 z-50 bg-blue-100 dark:bg-gray-800 shadow-md transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3 md:py-4 gap-4">
        <!-- Logo / School Name -->
        <router-link 
          to="/" 
          class="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors truncate max-w-[200px] sm:max-w-[300px] md:max-w-none"
          :title="languageStore.t('schoolName')"
        >
          {{ languageStore.t('schoolName') }}
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-4 lg:space-x-6" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link 
            to="/" 
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium whitespace-nowrap"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === '/' }"
          >
            {{ languageStore.t('home') }}
          </router-link>
          <router-link 
            to="/about" 
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium whitespace-nowrap"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === '/about' }"
          >
            {{ languageStore.t('about') }}
          </router-link>
          <router-link 
            to="/programs" 
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium whitespace-nowrap"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === '/programs' }"
          >
            {{ languageStore.t('programs') }}
          </router-link>
          <router-link 
            to="/admissions" 
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium whitespace-nowrap"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === '/admissions' }"
          >
            {{ languageStore.t('admissions') }}
          </router-link>
          <router-link 
            to="/contact" 
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium whitespace-nowrap"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === '/contact' }"
          >
            {{ languageStore.t('contact') }}
          </router-link>
        </nav>

        <!-- Right section: language switcher + dark mode toggle + login (desktop) + mobile menu button -->
        <div class="flex items-center gap-2 sm:gap-3" :class="{ 'flex-row-reverse': languageStore.isRTL }">
          <!-- Language Switcher -->
          <button 
            @click="toggleLanguage" 
            class="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 whitespace-nowrap"
            :title="languageStore.currentLocale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
          >
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </button>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="!isDark" class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <!-- Login Button (desktop only) -->
          <router-link 
            to="/login" 
            class="hidden md:inline-block bg-primary-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
          >
            {{ languageStore.t('login') }}
          </router-link>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu (includes login button) -->
      <transition name="slide-down">
        <div 
          v-if="mobileMenuOpen" 
          class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex flex-col space-y-3">
            <router-link 
              to="/" 
              class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/' }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('home') }}
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/about' }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('about') }}
            </router-link>
            <router-link 
              to="/programs" 
              class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/programs' }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('programs') }}
            </router-link>
            <router-link 
              to="/admissions" 
              class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/admissions' }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('admissions') }}
            </router-link>
            <router-link 
              to="/contact" 
              class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/contact' }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('contact') }}
            </router-link>
            <!-- Login button inside mobile dropdown -->
            <router-link 
              to="/login" 
              class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-primary-700 transition-colors mt-2"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t('login') }}
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useDarkMode } from '@/composables/useDarkMode'

const languageStore = useLanguageStore()
const { isDark, toggleDarkMode } = useDarkMode()
const mobileMenuOpen = ref(false)

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}

// Click outside to close mobile menu
const handleClickOutside = (event) => {
  const header = event.target.closest('header')
  if (!header && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

// Close on window resize (if resizing to desktop, close mobile menu)
const handleResize = () => {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Slide down animation for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>