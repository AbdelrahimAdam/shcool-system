<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-primary-600">{{ schoolName }}</router-link>
        <nav class="hidden md:flex space-x-6" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link to="/" class="text-gray-700 hover:text-primary-600">{{ languageStore.t('home') }}</router-link>
          <router-link to="/about" class="text-gray-700 hover:text-primary-600">{{ languageStore.t('about') }}</router-link>
          <router-link to="/programs" class="text-gray-700 hover:text-primary-600">{{ languageStore.t('programs') }}</router-link>
          <router-link to="/admissions" class="text-gray-700 hover:text-primary-600">{{ languageStore.t('admissions') }}</router-link>
          <router-link to="/contact" class="text-gray-700 hover:text-primary-600">{{ languageStore.t('contact') }}</router-link>
        </nav>
        <div class="flex items-center space-x-4" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <button @click="toggleLanguage" class="px-3 py-1 border rounded-lg text-sm">
            {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
          </button>
          <router-link to="/login" class="btn-primary text-sm">{{ languageStore.t('login') }}</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
const schoolName = ref('Elite School')

const toggleLanguage = () => {
  const newLocale = languageStore.currentLocale === 'en' ? 'ar' : 'en'
  languageStore.setLocale(newLocale)
}
</script>