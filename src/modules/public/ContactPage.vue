<template>
  <div class="min-h-screen">
    <PublicHeader />

    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ languageStore.t('contactUs') }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">{{ languageStore.t('getInTouch') }}</h2>
          <div class="space-y-3">
            <div class="flex items-center space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@eliteschool.edu</span>
            </div>
            <div class="flex items-center space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+249 123 456 789</span>
            </div>
            <div class="flex items-start space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
              <svg class="w-5 h-5 text-gray-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>123 Main Street, Khartoum, Sudan</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">{{ languageStore.t('sendMessage') }}</h2>
          <form @submit.prevent="sendMessage" class="space-y-4">
            <div>
              <label class="label">{{ languageStore.t('fullName') }}</label>
              <input v-model="contactForm.name" type="text" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('email') }}</label>
              <input v-model="contactForm.email" type="email" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('message') }}</label>
              <textarea v-model="contactForm.message" rows="4" required class="input-field"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full">{{ languageStore.t('send') }}</button>
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