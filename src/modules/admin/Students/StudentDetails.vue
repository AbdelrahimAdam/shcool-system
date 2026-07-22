<template>
  <div class="p-3 sm:p-4 md:p-6">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
      <!-- Header -->
      <div class="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-base sm:text-xl font-bold flex-shrink-0">
              {{ studentInitials }}
            </div>
            <div>
              <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {{ languageStore.t('studentDetails') }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ student?.full_name || languageStore.t('student') }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <router-link
              to="/admin/students"
              class="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link
              :to="`/admin/students/${student?.id}/edit`"
              class="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('loading') }}...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        <button @click="fetchStudent" class="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>

      <!-- Student Details Content -->
      <div v-else-if="student" class="p-3 sm:p-4 md:p-6">
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('status') }}</p>
            <span :class="getStatusClass(student.status)" class="text-xs sm:text-sm font-medium inline-block mt-0.5">
              {{ languageStore.t(student.status) }}
            </span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('class') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">{{ student.class?.name || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('studentNumber') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5 font-mono">{{ student.student_number || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('gender') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">{{ languageStore.t(student.gender) || '-' }}</p>
          </div>
        </div>

        <!-- Main Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <!-- Personal Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ languageStore.t('personalInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('fullName') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white font-medium mt-0.5">{{ student.full_name || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('arabicName') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5" dir="rtl">{{ student.arabic_name || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('dateOfBirth') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ formatDate(student.date_of_birth) }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('address') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ student.address || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {{ languageStore.t('academicInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('class') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white font-medium mt-0.5">{{ student.class?.name || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('enrollmentDate') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ formatDate(student.enrollment_date) }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('status') }}</span>
                <span :class="getStatusClass(student.status)" class="mt-0.5 inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium">
                  {{ languageStore.t(student.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical Information -->
        <div v-if="student.medical_info" class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ languageStore.t('medicalInfo') }}
          </h2>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg">
            <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{{ student.medical_info }}</p>
          </div>
        </div>

        <!-- Parent Information -->
        <div v-if="student.parent" class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ languageStore.t('parentInformation') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
            <div>
              <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('fullName') }}</span>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ student.parent.full_name || '-' }}</p>
            </div>
            <div>
              <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('phone') }}</span>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ student.parent.phone || '-' }}</p>
            </div>
            <div class="sm:col-span-2">
              <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('email') }}</span>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ student.parent.email || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3">{{ languageStore.t('quickActions') }}</h2>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <router-link 
              :to="`/admin/attendance?student=${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
              {{ languageStore.t('attendance') }}
            </router-link>
            <router-link 
              :to="`/admin/grades?student=${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              {{ languageStore.t('grades') }}
            </router-link>
            <router-link 
              :to="`/admin/payments?student=${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {{ languageStore.t('payments') }}
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
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const languageStore = useLanguageStore()

const student = ref(null)
const loading = ref(true)
const error = ref('')

const studentInitials = computed(() => {
  if (!student.value?.full_name) return '?'
  const parts = student.value.full_name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const fetchStudent = async () => {
  loading.value = true
  error.value = ''

  try {
    const id = route.params.id

    const { data, error: fetchError } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(name),
        parent:parents(full_name, phone, email)
      `)
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    student.value = data
  } catch (err) {
    console.error('Error fetching student:', err)
    error.value = err.message || 'Failed to load student'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    graduated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    transferred: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
}

onMounted(() => {
  fetchStudent()
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