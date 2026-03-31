<template>
  <div class="min-h-screen">
    <PublicHeader />

    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ languageStore.t('aboutUs') }}</h1>
      <div class="max-w-3xl mx-auto space-y-6">
        <p class="text-gray-700 leading-relaxed">
          {{ languageStore.t('aboutText1') }}
        </p>
        <p class="text-gray-700 leading-relaxed">
          {{ languageStore.t('aboutText2') }}
        </p>
        <h2 class="text-2xl font-semibold mt-8">{{ languageStore.t('ourMission') }}</h2>
        <p class="text-gray-700 leading-relaxed">
          {{ languageStore.t('missionText') }}
        </p>
        <h2 class="text-2xl font-semibold mt-8">{{ languageStore.t('ourVision') }}</h2>
        <p class="text-gray-700 leading-relaxed">
          {{ languageStore.t('visionText') }}
        </p>
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