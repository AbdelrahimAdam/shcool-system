<template>
  <aside class="sidebar fixed top-16 left-0 w-64 h-full bg-white shadow-lg transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto">
    <nav class="p-4">
      <div class="space-y-1">
        <!-- Dashboard -->
        <router-link 
          to="/teacher" 
          class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/teacher' }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="ml-3">{{ languageStore.t('dashboard') }}</span>
        </router-link>

        <!-- Exams Management -->
        <router-link 
          to="/teacher/exams" 
          class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/teacher/exams' }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="ml-3">{{ languageStore.t('exams') }}</span>
        </router-link>

        <!-- Enter Grades -->
        <router-link 
          to="/teacher/grade-entry" 
          class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/teacher/grade-entry' }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="ml-3">{{ languageStore.t('enterGrades') }}</span>
        </router-link>

        <!-- Attendance -->
        <router-link 
          to="/teacher/attendance" 
          class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === '/teacher/attendance' }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="ml-3">{{ languageStore.t('attendance') }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    document.querySelector('.sidebar')?.classList.remove('open')
  }
}
</script>