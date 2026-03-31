<template>
  <div class="min-h-screen">
    <PublicHeader />

    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ languageStore.t('ourPrograms') }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card p-6">
          <h2 class="text-2xl font-semibold mb-3">{{ languageStore.t('primarySchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('primaryDesc') }}</p>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>{{ languageStore.t('grades') }} 1-6</li>
            <li>{{ languageStore.t('coreSubjects') }}</li>
            <li>{{ languageStore.t('activityBased') }}</li>
          </ul>
        </div>
        <div class="card p-6">
          <h2 class="text-2xl font-semibold mb-3">{{ languageStore.t('middleSchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('middleDesc') }}</p>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>{{ languageStore.t('grades') }} 7-9</li>
            <li>{{ languageStore.t('subjectSpecialization') }}</li>
            <li>{{ languageStore.t('careerGuidance') }}</li>
          </ul>
        </div>
        <div class="card p-6">
          <h2 class="text-2xl font-semibold mb-3">{{ languageStore.t('highSchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('highDesc') }}</p>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>{{ languageStore.t('grades') }} 10-12</li>
            <li>{{ languageStore.t('advancedSubjects') }}</li>
            <li>{{ languageStore.t('collegePrep') }}</li>
          </ul>
        </div>
      </div>
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import { useLanguageStore } from '../../stores/language'
import PublicHeader from '../../components/public/PublicHeader.vue'
import PublicFooter from '../../components/public/PublicFooter.vue'

const languageStore = useLanguageStore()
</script>