<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ languageStore.t('aboutUs') }}</h3>
          <p class="text-sm text-gray-300">
            {{ languageStore.t('footerAboutText') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ languageStore.t('quickLinks') }}</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="text-gray-300 hover:text-white transition-colors">
                {{ languageStore.t('home') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-gray-300 hover:text-white transition-colors">
                {{ languageStore.t('about') }}
              </router-link>
            </li>
            <li>
              <router-link to="/programs" class="text-gray-300 hover:text-white transition-colors">
                {{ languageStore.t('programs') }}
              </router-link>
            </li>
            <li>
              <router-link to="/admissions" class="text-gray-300 hover:text-white transition-colors">
                {{ languageStore.t('admissions') }}
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-300 hover:text-white transition-colors">
                {{ languageStore.t('contact') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ languageStore.t('contactUs') }}</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li class="flex items-start space-x-2" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@eliteschool.edu</span>
            </li>
            <li class="flex items-start space-x-2" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+249 123 456 789</span>
            </li>
            <li class="flex items-start space-x-2" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>123 Main Street, Khartoum, Sudan</span>
            </li>
          </ul>
        </div>

        <!-- Working Hours -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ languageStore.t('workingHours') }}</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li>{{ languageStore.t('sundayToThursday') }}: 8:00 AM - 2:00 PM</li>
            <li>{{ languageStore.t('friday') }}: {{ languageStore.t('closed') }}</li>
            <li>{{ languageStore.t('saturday') }}: 9:00 AM - 12:00 PM</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Elite School. {{ languageStore.t('allRightsReserved') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
</script>