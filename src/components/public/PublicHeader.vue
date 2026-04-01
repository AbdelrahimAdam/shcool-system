<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3 md:py-4">
        <!-- Logo / School Name -->
        <router-link 
          to="/" 
          class="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {{ languageStore.t('schoolName') }}
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6 lg:space-x-8" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === '/' }"
          >
            {{ languageStore.t('home') }}
          </router-link>
          <router-link 
            to="/about" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === '/about' }"
          >
            {{ languageStore.t('about') }}
          </router-link>
          <router-link 
            to="/programs" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === '/programs' }"
          >
            {{ languageStore.t('programs') }}
          </router-link>
          <router-link 
            to="/admissions" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === '/admissions' }"
          >
            {{ languageStore.t('admissions') }}
          </router-link>
          <router-link 
            to="/contact" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === '/contact' }"
          >
            {{ languageStore.t('contact') }}
          </router-link>
        </nav>

        <!-- Right side: Language switcher and Login -->
        <div class="flex items-center space-x-3 sm:space-x-4" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <!-- Language Switcher -->
          <button 
            @click="toggleLanguage" 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            :title="languageStore.currentLocale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
          >
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </button>
          
          <!-- Login Button -->
          <router-link 
            to="/login" 
            class="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {{ languageStore.t('login') }}
          </router-link>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div 
        v-if="mobileMenuOpen" 
        class="md:hidden py-4 border-t border-gray-100"
      >
        <div class="flex flex-col space-y-3">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-primary-600 py-2 transition-colors"
            :class="{ 'text-primary-600 font-medium': $route.path === '/' }"
            @click="mobileMenuOpen = false"
          >
            {{ languageStore.t('home') }}
          </router-link>
          <router-link 
            to="/about" 
            class="text-gray-700 hover:text-primary-600 py-2 transition-colors"
            :class="{ 'text-primary-600 font-medium': $route.path === '/about' }"
            @click="mobileMenuOpen = false"
          >
            {{ languageStore.t('about') }}
          </router-link>
          <router-link 
            to="/programs" 
            class="text-gray-700 hover:text-primary-600 py-2 transition-colors"
            :class="{ 'text-primary-600 font-medium': $route.path === '/programs' }"
            @click="mobileMenuOpen = false"
          >
            {{ languageStore.t('programs') }}
          </router-link>
          <router-link 
            to="/admissions" 
            class="text-gray-700 hover:text-primary-600 py-2 transition-colors"
            :class="{ 'text-primary-600 font-medium': $route.path === '/admissions' }"
            @click="mobileMenuOpen = false"
          >
            {{ languageStore.t('admissions') }}
          </router-link>
          <router-link 
            to="/contact" 
            class="text-gray-700 hover:text-primary-600 py-2 transition-colors"
            :class="{ 'text-primary-600 font-medium': $route.path === '/contact' }"
            @click="mobileMenuOpen = false"
          >
            {{ languageStore.t('contact') }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const mobileMenuOpen = ref(false)

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}
</script>