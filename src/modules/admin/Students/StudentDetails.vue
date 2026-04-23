<template>
  <div class="p-4 sm:p-6">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
      <!-- Header -->
      <div class="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {{ languageStore.t('studentDetails') }}
          </h1>
          <div class="flex gap-2 sm:gap-3">
            <router-link
              to="/admin/students"
              class="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link
              :to="`/admin/students/${student?.id}/edit`"
              class="inline-flex items-center justify-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-500 dark:text-gray-400">{{ languageStore.t('loading') }}...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="fetchStudent" class="mt-3 text-primary-600 dark:text-primary-400 hover:underline">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>

      <!-- Student Details Content -->
      <div v-else-if="student" class="p-4 sm:p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {{ languageStore.t('personalInformation') }}
            </h2>
            
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('fullName') }}</label>
              <p class="text-gray-900 dark:text-white font-medium mt-1">{{ student.full_name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('arabicName') }}</label>
              <p class="text-gray-900 dark:text-white mt-1">{{ student.arabic_name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('studentNumber') }}</label>
              <p class="text-gray-900 dark:text-white font-mono mt-1">{{ student.student_number || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('dateOfBirth') }}</label>
              <p class="text-gray-900 dark:text-white mt-1">{{ formatDate(student.date_of_birth) }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('gender') }}</label>
              <p class="text-gray-900 dark:text-white mt-1">{{ languageStore.t(student.gender) || '-' }}</p>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {{ languageStore.t('academicInformation') }}
            </h2>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('class') }}</label>
              <p class="text-gray-900 dark:text-white font-medium mt-1">{{ student.class?.name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('enrollmentDate') }}</label>
              <p class="text-gray-900 dark:text-white mt-1">{{ formatDate(student.enrollment_date) }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('status') }}</label>
              <p class="mt-1">
                <span :class="getStatusClass(student.status)" class="px-2 py-1 rounded-full text-xs font-medium inline-block">
                  {{ languageStore.t(student.status) }}
                </span>
              </p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('address') }}</label>
              <p class="text-gray-900 dark:text-white mt-1">{{ student.address || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Information (if exists) -->
        <div v-if="student.medical_info" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">{{ languageStore.t('medicalInfo') }}</h2>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ student.medical_info }}</p>
          </div>
        </div>

        <!-- Parent Information -->
        <div v-if="student.parent" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">{{ languageStore.t('parentInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('fullName') }}</label>
              <p class="text-gray-900 dark:text-white">{{ student.parent.full_name || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('phone') }}</label>
              <p class="text-gray-900 dark:text-white">{{ student.parent.phone || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const languageStore = useLanguageStore()

const student = ref(null)
const loading = ref(true)
const error = ref('')

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
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>