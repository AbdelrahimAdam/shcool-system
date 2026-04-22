<template>
  <div class="min-h-screen">
    <PublicHeader />

    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ languageStore.t('ourPrograms') }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <!-- Primary School Card -->
        <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md border border-blue-100 p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('primarySchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('primaryDesc') }}</p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('grades') }} 1-6
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('coreSubjects') }}
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('activityBased') }}
            </li>
          </ul>
        </div>

        <!-- Middle School Card -->
        <div class="bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-md border border-teal-100 p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('middleSchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('middleDesc') }}</p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('grades') }} 7-9
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('subjectSpecialization') }}
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('careerGuidance') }}
            </li>
          </ul>
        </div>

        <!-- High School Card -->
        <div class="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md border border-indigo-100 p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('highSchool') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('highDesc') }}</p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('grades') }} 10-12
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('advancedSubjects') }}
            </li>
            <li class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ languageStore.t('collegePrep') }}
            </li>
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