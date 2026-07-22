<template>
  <div class="p-4 sm:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <!-- Header -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{{ languageStore.t('studentDetails') }}</h1>
            <router-link to="/teacher/students" class="text-primary-600 hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center text-red-600 dark:text-red-400">
          {{ error }}
        </div>

        <!-- Student Details -->
        <div v-else-if="student" class="p-4 sm:p-6">
          <!-- Student Name Header -->
          <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {{ studentInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ student.full_name }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ languageStore.t('studentNumber') }}: {{ student.student_number }}</p>
            </div>
            <span :class="getStatusClass(student.status)" class="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0">
              {{ languageStore.t(student.status) }}
            </span>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                {{ languageStore.t('personalInformation') }}
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('fullName') }}</label>
                    <p class="text-gray-900 dark:text-white font-medium">{{ student.full_name }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-4m0 0l4 4m-4-4V4" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('studentNumber') }}</label>
                    <p class="text-gray-900 dark:text-white font-mono text-sm">{{ student.student_number }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('dateOfBirth') }}</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(student.date_of_birth) }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('gender') }}</label>
                    <p class="text-gray-900 dark:text-white">{{ languageStore.t(student.gender) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Academic Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                {{ languageStore.t('academicInformation') }}
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('class') }}</label>
                    <p class="text-gray-900 dark:text-white font-medium">{{ className }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('enrollmentDate') }}</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(student.enrollment_date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              {{ languageStore.t('quickActions') }}
            </h3>
            <div class="flex flex-wrap gap-3">
              <router-link 
                :to="`/teacher/grades?student=${student.id}`" 
                class="flex-1 min-w-[80px] text-center px-4 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                {{ languageStore.t('grades') }}
              </router-link>
              <router-link 
                :to="`/teacher/attendance?student=${student.id}`" 
                class="flex-1 min-w-[80px] text-center px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
              >
                {{ languageStore.t('attendance') }}
              </router-link>
              <router-link 
                :to="`/teacher/students`" 
                class="flex-1 min-w-[80px] text-center px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {{ languageStore.t('allStudents') }}
              </router-link>
            </div>
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
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const student = ref(null)
const loading = ref(true)
const error = ref('')
const className = ref('')

const studentInitials = computed(() => {
  if (!student.value?.full_name) return '?'
  const parts = student.value.full_name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const fetchStudent = async () => {
  const studentId = route.params.id
  const teacherId = authStore.teacherId
  
  if (!teacherId) {
    error.value = 'Teacher not authenticated'
    loading.value = false
    return
  }
  
  try {
    // Get school_id with fallback
    let schoolId = authStore.schoolId
    
    if (!schoolId) {
      schoolId = authStore.profile?.school_id
    }
    
    if (!schoolId) {
      schoolId = localStorage.getItem('schoolId')
    }

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*, class:classes(id, name, teacher_id, school_id)')
      .eq('id', studentId)
      .eq('school_id', schoolId)
      .single()
      
    if (studentError) throw studentError

    // Security check: Verify teacher owns the class
    if (studentData.class?.teacher_id !== teacherId) {
      error.value = languageStore.t('accessDenied')
      loading.value = false
      return
    }
    
    student.value = studentData
    className.value = studentData.class?.name || '-'
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
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    graduated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    transferred: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

onMounted(() => {
  if (authStore.role === 'teacher' && !authStore.teacherId) {
    authStore.fetchTeacherId().then(() => {
      fetchStudent()
    })
  } else {
    fetchStudent()
  }
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}
</style>