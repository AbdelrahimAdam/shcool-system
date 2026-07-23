<template>
  <div class="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-0">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-base sm:text-xl font-bold flex-shrink-0">
              {{ schoolInitials }}
            </div>
            <div>
              <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {{ school?.name || languageStore.t('school') }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ school?.email || '-' }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <router-link to="/super-admin/schools" class="btn-secondary inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link :to="`/super-admin/schools/${school?.id}/edit`" class="btn-primary inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('loading') }}...</p>
      </div>

      <!-- Content -->
      <div v-else-if="school" class="p-4 sm:p-6">
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('status') }}</p>
            <span :class="getStatusClass(school.status)" class="text-xs sm:text-sm font-medium inline-block mt-0.5">
              {{ languageStore.t(school.status) }}
            </span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('students') }}</p>
            <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">{{ stats.students }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('teachers') }}</p>
            <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">{{ stats.teachers }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('revenue') }}</p>
            <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">{{ formatCurrency(stats.revenue) }}</p>
          </div>
        </div>

        <!-- Main Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <!-- School Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {{ languageStore.t('schoolInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('email') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ school.email || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('phone') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ school.phone || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('address') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ school.address || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Subscription Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ languageStore.t('subscriptionInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('subscriptionPlan') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ school.subscription_plan || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('subscriptionEndDate') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ formatDate(school.subscription_end_date) }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('createdAt') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ formatDate(school.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">{{ languageStore.t('quickActions') }}</h2>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <router-link 
              :to="`/super-admin/schools/${school.id}/edit`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
            <router-link 
              :to="`/super-admin/schools`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              </svg>
              {{ languageStore.t('allSchools') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'

const route = useRoute()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const school = ref(null)
const stats = ref({ students: 0, teachers: 0, revenue: 0 })
const isLoading = ref(true)

const schoolInitials = computed(() => {
  if (!school.value?.name) return '?'
  const parts = school.value.name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const loadSchool = async () => {
  isLoading.value = true
  try {
    const id = route.params.id
    school.value = await schoolStore.getSchoolById(id)
    if (school.value) {
      stats.value = await schoolStore.getSchoolStats(id)
    }
  } catch (error) {
    console.error('Error loading school:', error)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status) => {
  const map = {
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium',
    suspended: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium',
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium'
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'
const formatCurrency = (value) => `SDG ${value?.toLocaleString() || 0}`

onMounted(() => {
  loadSchool()
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}
</style>