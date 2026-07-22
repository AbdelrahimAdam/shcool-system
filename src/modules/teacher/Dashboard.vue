<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('teacherDashboard') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('welcomeBackTeacher') }}, {{ authStore.profile?.full_name || authStore.user?.email }}</p>
      </div>
      <div class="flex flex-wrap gap-2 sm:gap-3">
        <router-link to="/teacher/attendance" class="btn-primary w-full sm:w-auto text-sm sm:text-base">
          <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ languageStore.t('markAttendance') }}
        </router-link>
        <router-link to="/teacher/exams" class="btn-secondary w-full sm:w-auto text-sm sm:text-base">
          <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ languageStore.t('manageExams') }}
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <!-- My Classes -->
      <div class="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('myClasses') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ teacherStats.classesCount || 0 }}</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 sm:p-3">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Students (Fixed - Only teacher's students) -->
      <div class="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('totalStudents') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ teacherStats.studentsCount || 0 }}</p>
          </div>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-2 sm:p-3">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Today Attendance -->
      <div class="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('todayAttendance') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ teacherStats.todayAttendance || 0 }}%</p>
          </div>
          <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 sm:p-3">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Upcoming Exams -->
      <div class="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('upcomingExams') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ teacherStats.upcomingExams || 0 }}</p>
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 sm:p-3">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- My Classes Section -->
    <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ languageStore.t('myClasses') }}</h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="cls in myClasses" :key="cls.id" class="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ cls.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ languageStore.t('grade') }} {{ cls.grade_level }} | 
                {{ languageStore.t('students') }}: {{ cls.current_enrollment || 0 }}/{{ cls.capacity || 0 }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <router-link :to="`/teacher/attendance?class=${cls.id}`" class="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                {{ languageStore.t('markAttendance') }}
              </router-link>
              <router-link :to="`/teacher/exams/create?class=${cls.id}`" class="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                {{ languageStore.t('addExam') }}
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="myClasses.length === 0 && !isLoading" class="p-8 text-center text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noClassesAssigned') }}
        </div>
        <div v-if="isLoading" class="p-8 text-center">
          <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ languageStore.t('recentActivities') }}</h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="activity in recentActivities" :key="activity.id" class="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatRelativeTime(activity.created_at) }}</p>
            </div>
          </div>
        </div>
        <div v-if="recentActivities.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noRecentActivity') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const isLoading = ref(false)
const recentActivities = ref([])

// Computed properties from teacher store
const myClasses = computed(() => teacherStore.myClasses)
const teacherStats = computed(() => teacherStore.teacherStats)

// Fetch recent activities for this teacher
const fetchRecentActivities = async () => {
  const userId = authStore.user?.id
  if (!userId) return

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching activities:', error)
    return
  }

  recentActivities.value = data || []
}

// Format relative time
const formatRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diffMinutes = Math.floor((now - then) / 60000)
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} ${languageStore.t('minutesAgo')}`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ${languageStore.t('hoursAgo')}`
  return `${Math.floor(diffMinutes / 1440)} ${languageStore.t('daysAgo')}`
}

onMounted(async () => {
  isLoading.value = true
  
  // Load teacher dashboard data from store
  await teacherStore.loadTeacherDashboard()
  await fetchRecentActivities()
  
  isLoading.value = false
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