<template>
  <header class="bg-gradient-to-r from-sky-100 to-sky-200 shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3 md:py-4">
        <!-- Logo / School Name - more prominent -->
        <router-link 
          to="/" 
          class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-primary-700 hover:text-primary-800 transition-colors"
        >
          {{ languageStore.t('schoolName') }}
        </router-link>

        <!-- Desktop Navigation - enhanced colors and spacing -->
        <nav class="hidden md:flex items-center space-x-6 lg:space-x-8" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link 
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-800 hover:text-primary-600 transition-colors font-semibold text-base lg:text-lg"
            :class="{ 'text-primary-600 border-b-2 border-primary-500': $route.path === item.path }"
          >
            {{ languageStore.t(item.label) }}
          </router-link>
        </nav>

        <!-- Right section: Language switcher + mobile menu button -->
        <div class="flex items-center space-x-3 sm:space-x-4" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <!-- Language Switcher - more visible -->
          <button 
            @click="toggleLanguage" 
            class="px-3 py-1.5 bg-white/80 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-white hover:border-primary-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            :title="languageStore.currentLocale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
          >
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </button>
          
          <!-- Login Button (desktop) -->
          <router-link 
            to="/login" 
            class="hidden md:inline-block bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {{ languageStore.t('login') }}
          </router-link>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-lg bg-white/50 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu (includes Login button) -->
      <transition name="mobile-menu">
        <div 
          v-if="mobileMenuOpen" 
          class="md:hidden py-4 border-t border-gray-200 bg-sky-50 rounded-b-xl"
        >
          <div class="flex flex-col space-y-3">
            <router-link 
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-gray-800 hover:text-primary-600 hover:bg-white/50 px-4 py-2 rounded-lg transition-colors font-medium"
              :class="{ 'text-primary-600 bg-white/70 font-semibold': $route.path === item.path }"
              @click="mobileMenuOpen = false"
            >
              {{ languageStore.t(item.label) }}
            </router-link>
            <!-- Login button inside mobile dropdown -->
            <router-link 
              to="/login" 
              class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-primary-700 transition-all mt-2 mx-4"
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
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', label: 'home' },
  { path: '/about', label: 'about' },
  { path: '/programs', label: 'programs' },
  { path: '/admissions', label: 'admissions' },
  { path: '/contact', label: 'contact' }
]

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}
</script>

<style scoped>
/* Smooth transition for mobile menu */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>