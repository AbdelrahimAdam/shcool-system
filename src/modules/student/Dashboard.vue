<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('studentDashboard') }}</h1>
    
    <!-- Welcome Card -->
    <div class="card p-6 mb-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
      <h2 class="text-xl font-bold mb-2">{{ languageStore.t('welcomeBack') }}, {{ student?.full_name }}!</h2>
      <p class="text-primary-100">{{ languageStore.t('studentDashboardWelcome') }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('attendanceRate') }}</p>
            <p class="text-3xl font-bold">{{ attendanceRate }}%</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('averageGrade') }}</p>
            <p class="text-3xl font-bold">{{ averageGrade }}%</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-3xl font-bold">{{ pendingAmount }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Attendance -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('recentAttendance') }}</h2>
        <div class="space-y-3">
          <div v-for="record in recentAttendance" :key="record.id" class="flex justify-between items-center border-b pb-2">
            <span class="text-sm">{{ formatDate(record.date) }}</span>
            <span :class="getAttendanceBadgeClass(record.status)">
              {{ languageStore.t(record.status) }}
            </span>
          </div>
          <div v-if="recentAttendance.length === 0" class="text-center py-4 text-gray-500">
            {{ languageStore.t('noAttendanceData') }}
          </div>
        </div>
      </div>
      
      <!-- Recent Grades -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('recentGrades') }}</h2>
        <div class="space-y-3">
          <div v-for="grade in recentGrades" :key="grade.id" class="flex justify-between items-center border-b pb-2">
            <div>
              <span class="text-sm font-medium">{{ grade.exam?.subject }}</span>
              <span class="text-xs text-gray-500 ml-2">{{ grade.exam?.exam_type }}</span>
            </div>
            <div>
              <span class="text-sm font-bold">{{ grade.score }}/{{ grade.exam?.max_score }}</span>
              <span class="text-xs ml-2 text-gray-500">({{ grade.percentage }}%)</span>
            </div>
          </div>
          <div v-if="recentGrades.length === 0" class="text-center py-4 text-gray-500">
            {{ languageStore.t('noGradesData') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'
import { useLanguageStore } from '@/stores/language'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const languageStore = useLanguageStore()

const student = ref(null)
const attendanceRate = ref(0)
const averageGrade = ref(0)
const pendingPayments = ref(0)
const className = ref('')
const recentGrades = ref([])
const recentAttendance = ref([])
const loading = ref(true)

const fetchStudentData = async () => {
  loading.value = true
  const userId = authStore.user?.id
  
  if (!userId) {
    loading.value = false
    return
  }
  
  // Get student profile
  student.value = await studentStore.getStudentByUserId(userId)
  
  if (student.value) {
    className.value = student.value.class?.name
    
    // Get grades
    const { data: grades } = await supabase
      .from('grades')
      .select(`
        *,
        exam:exams(subject, exam_type, max_score, exam_date)
      `)
      .eq('student_id', student.value.id)
      .order('created_at', { ascending: false })
    
    recentGrades.value = grades?.slice(0, 5) || []
    
    if (grades && grades.length > 0) {
      const total = grades.reduce((sum, g) => sum + (g.percentage || 0), 0)
      averageGrade.value = Math.round(total / grades.length)
    }
    
    // Get attendance
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*, class:classes(name)')
      .eq('student_id', student.value.id)
      .order('date', { ascending: false })
      .limit(5)
    
    recentAttendance.value = attendance || []
    
    // Calculate attendance rate
    const { data: last30Days } = await supabase
      .from('attendance')
      .select('status')
      .eq('student_id', student.value.id)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    
    if (last30Days && last30Days.length > 0) {
      const present = last30Days.filter(a => a.status === 'present' || a.status === 'late').length
      attendanceRate.value = Math.round((present / last30Days.length) * 100)
    }
    
    // Get pending payments
    const { data: payments } = await supabase
      .from('payments')
      .select('id')
      .eq('student_id', student.value.id)
      .eq('status', 'pending')
    
    pendingPayments.value = payments?.length || 0
  }
  
  loading.value = false
}

onMounted(() => {
  fetchStudentData()
})
</script>