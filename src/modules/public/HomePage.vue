<template>
  <div class="min-h-screen">
    <PublicHeader />

    <main>
      <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ schoolName }}</h1>
          <p class="text-lg md:text-xl mb-8">{{ tagline }}</p>
          <router-link to="/admissions" class="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            {{ languageStore.t('enrollNow') }}
          </router-link>
        </div>
      </section>

      <section class="py-12 md:py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">{{ languageStore.t('whyChooseUs') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="card p-6 text-center">
              <div class="text-4xl text-primary-600 mb-4">🎓</div>
              <h3 class="text-xl font-semibold mb-2">{{ languageStore.t('qualityEducation') }}</h3>
              <p class="text-gray-600">{{ languageStore.t('qualityEducationDesc') }}</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-4xl text-primary-600 mb-4">👩‍🏫</div>
              <h3 class="text-xl font-semibold mb-2">{{ languageStore.t('expertTeachers') }}</h3>
              <p class="text-gray-600">{{ languageStore.t('expertTeachersDesc') }}</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-4xl text-primary-600 mb-4">🏆</div>
              <h3 class="text-xl font-semibold mb-2">{{ languageStore.t('modernFacilities') }}</h3>
              <p class="text-gray-600">{{ languageStore.t('modernFacilitiesDesc') }}</p>
            </div>
          </div>
        </div>
      </section>
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
const schoolName = ref('Elite School')
const tagline = ref('Empowering the next generation of leaders')
</script>