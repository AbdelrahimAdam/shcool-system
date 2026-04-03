<template>
  <div class="min-h-screen bg-gray-50">
    <PublicHeader />

    <main>
      <!-- Hero Section with Background Image (improved visibility) -->
      <section class="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <!-- Background Image with lighter overlay -->
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-black/30 z-10"></div> <!-- Reduced opacity from 60 to 30 -->
          <img 
            src="/images/school-hero.jpeg" 
            alt="Students learning at Zack International Schools" 
            class="w-full h-full object-cover"
            loading="eager"
          />
          <!-- Fallback gradient with lighter opacity -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/70 z-0"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {{ languageStore.t('schoolName') }}
            </h1>
            <p class="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-primary-100 drop-shadow-md">
              {{ languageStore.t('tagline') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link 
                to="/admissions" 
                class="bg-white text-primary-700 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 px-6 py-3 text-base md:text-lg font-semibold rounded-lg"
              >
                {{ languageStore.t('enrollNow') }}
              </router-link>
              <router-link 
                to="/about" 
                class="border-2 border-white text-white bg-transparent backdrop-blur-sm hover:bg-white hover:text-primary-700 transition-all duration-300 px-6 py-3 text-base md:text-lg font-semibold rounded-lg"
              >
                {{ languageStore.t('learnMore') }}
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section (2 columns on mobile) -->
      <section class="py-12 md:py-16 lg:py-20 bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ languageStore.t('whyChooseUs') }}
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto text-base">
              {{ languageStore.t('whyChooseUsDesc') }}
            </p>
          </div>

          <!-- Two columns on mobile, three on desktop -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <!-- Card 1: Quality Education -->
            <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md border border-blue-100 p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="text-5xl lg:text-6xl text-blue-600 mb-4">🎓</div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('qualityEducation') }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ languageStore.t('qualityEducationDesc') }}</p>
            </div>

            <!-- Card 2: Expert Teachers -->
            <div class="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md border border-green-100 p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="text-5xl lg:text-6xl text-green-600 mb-4">👩‍🏫</div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('expertTeachers') }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ languageStore.t('expertTeachersDesc') }}</p>
            </div>

            <!-- Card 3: Modern Facilities -->
            <div class="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md border border-purple-100 p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="text-5xl lg:text-6xl text-purple-600 mb-4">🏆</div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('modernFacilities') }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ languageStore.t('modernFacilitiesDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Programs Overview Section (2 columns on mobile) -->
      <section class="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ languageStore.t('ourPrograms') }}
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto text-base">
              {{ languageStore.t('ourProgramsDesc') }}
            </p>
          </div>

          <!-- Two columns on mobile, three on desktop -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <!-- Primary School Card -->
            <div class="bg-white rounded-xl shadow-md border border-primary-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:border-primary-300">
              <div class="text-primary-600 mb-4">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('primarySchool') }}</h3>
              <p class="text-gray-600 mb-4">{{ languageStore.t('primaryDesc') }}</p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>✓ {{ languageStore.t('grades') }} 1-6</li>
                <li>✓ {{ languageStore.t('coreSubjects') }}</li>
                <li>✓ {{ languageStore.t('activityBased') }}</li>
              </ul>
            </div>

            <!-- Middle School Card -->
            <div class="bg-white rounded-xl shadow-md border border-primary-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:border-primary-300">
              <div class="text-primary-600 mb-4">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('middleSchool') }}</h3>
              <p class="text-gray-600 mb-4">{{ languageStore.t('middleDesc') }}</p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>✓ {{ languageStore.t('grades') }} 7-9</li>
                <li>✓ {{ languageStore.t('subjectSpecialization') }}</li>
                <li>✓ {{ languageStore.t('careerGuidance') }}</li>
              </ul>
            </div>

            <!-- High School Card -->
            <div class="bg-white rounded-xl shadow-md border border-primary-100 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:border-primary-300">
              <div class="text-primary-600 mb-4">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">{{ languageStore.t('highSchool') }}</h3>
              <p class="text-gray-600 mb-4">{{ languageStore.t('highDesc') }}</p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>✓ {{ languageStore.t('grades') }} 10-12</li>
                <li>✓ {{ languageStore.t('advancedSubjects') }}</li>
                <li>✓ {{ languageStore.t('collegePrep') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section -->
      <section class="bg-primary-600 py-12 md:py-16 lg:py-20">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
            {{ languageStore.t('startYourJourney') }}
          </h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto text-base">
            {{ languageStore.t('startYourJourneyDesc') }}
          </p>
          <router-link 
            to="/admissions" 
            class="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {{ languageStore.t('contactUsToday') }}
          </router-link>
        </div>
      </section>
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language'
import PublicHeader from '@/components/public/PublicHeader.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'

const languageStore = useLanguageStore()
</script>

<style scoped>
/* Card and button improvements */
.rounded-xl {
  border-radius: 1rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Ensure backdrop blur works */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Drop shadows for better text contrast */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-md {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
}
</style>