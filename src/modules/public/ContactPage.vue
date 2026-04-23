<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <PublicHeader />

    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {{ languageStore.t('contactUs') }}
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contact Information Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{{ languageStore.t('getInTouch') }}</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">info@zackschool.edu</span>
            </div>
            <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">0997644442</span>
            </div>
            <div class="flex items-start gap-3" :class="{ 'flex-row-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">Gedaref, Sudan (ولاية القضارف)</span>
            </div>
            <!-- WhatsApp Button -->
            <div class="mt-4">
              <a 
                href="https://wa.me/249997644442" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ languageStore.t('whatsapp') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{{ languageStore.t('sendMessage') }}</h2>
          <form @submit.prevent="sendMessage" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('fullName') }}</label>
              <input v-model="contactForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('email') }}</label>
              <input v-model="contactForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('message') }}</label>
              <textarea v-model="contactForm.message" rows="4" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"></textarea>
            </div>
            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors">
              {{ languageStore.t('send') }}
            </button>
          </form>
        </div>
      </div>
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from '../../stores/language'
import PublicHeader from '../../components/public/PublicHeader.vue'
import PublicFooter from '../../components/public/PublicFooter.vue'

const languageStore = useLanguageStore()
const contactForm = ref({ name: '', email: '', message: '' })

const sendMessage = () => {
  alert(languageStore.t('messageSent'))
  contactForm.value = { name: '', email: '', message: '' }
}
</script>