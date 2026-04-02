<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ child?.full_name }}</h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('childDetails') }}</p>
      </div>
      <router-link to="/parent/children" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ languageStore.t('back') }}
      </router-link>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="child" class="space-y-6 sm:space-y-8">
      <!-- Personal Information Card - 2 columns on mobile -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="relative">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          <div class="p-5 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ languageStore.t('personalInformation') }}
            </h2>
            
            <!-- 2 columns on mobile and desktop -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('fullName') }}</p>
                <p class="text-sm sm:text-base font-semibold text-gray-800 mt-1">{{ child.full_name }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('arabicName') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.arabic_name || '-' }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('studentNumber') }}</p>
                <p class="text-sm sm:text-base font-mono font-semibold text-gray-800 mt-1">{{ child.student_number }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('class') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.class?.name || '-' }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('dateOfBirth') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ formatDate(child.date_of_birth) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('gender') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ languageStore.t(child.gender) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('nationality') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.nationality || '-' }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('religion') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.religion || '-' }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('enrollmentDate') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ formatDate(child.enrollment_date) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</p>
                <span :class="getStatusClass(child.status)" class="inline-block mt-1 text-xs px-2 py-1 rounded-lg font-medium">
                  {{ languageStore.t(child.status) }}
                </span>
              </div>
              
              <div class="sm:col-span-2 bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">{{ languageStore.t('address') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.address || '-' }}</p>
              </div>
              
              <div v-if="child.medical_info" class="sm:col-span-2 bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                <p class="text-xs text-yellow-600 uppercase tracking-wider">{{ languageStore.t('medicalInfo') }}</p>
                <p class="text-sm sm:text-base font-medium text-gray-700 mt-1">{{ child.medical_info }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Statistics Cards - 2 columns on mobile, 3 on desktop -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('attendanceRate') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{{ attendanceRate }}%</p>
            </div>
            <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('averageGrade') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{{ averageGrade }}%</p>
            </div>
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('pendingPayments') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ pendingPayments }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs - Responsive -->
      <div class="border-b border-gray-200 overflow-x-auto">
        <nav class="flex space-x-4 sm:space-x-8 min-w-max">
          <button 
            @click="activeTab = 'attendance'" 
            class="py-2 px-2 sm:px-3 border-b-2 font-medium text-sm transition-all duration-200"
            :class="activeTab === 'attendance' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ languageStore.t('attendance') }}
          </button>
          <button 
            @click="activeTab = 'grades'" 
            class="py-2 px-2 sm:px-3 border-b-2 font-medium text-sm transition-all duration-200"
            :class="activeTab === 'grades' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ languageStore.t('grades') }}
          </button>
          <button 
            @click="activeTab = 'payments'" 
            class="py-2 px-2 sm:px-3 border-b-2 font-medium text-sm transition-all duration-200"
            :class="activeTab === 'payments' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ languageStore.t('payments') }}
          </button>
        </nav>
      </div>
      
      <!-- Attendance Tab -->
      <div v-if="activeTab === 'attendance'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-5 sm:p-6">
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('startDate') }}</label>
              <input v-model="attendanceStartDate" type="date" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
            </div>
            <div class="flex-1">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('endDate') }}</label>
              <input v-model="attendanceEndDate" type="date" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
            </div>
            <div class="flex items-end">
              <button @click="loadAttendance" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                {{ languageStore.t('filter') }}
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('date') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('notes') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(record.date) }}</td>
                  <td class="px-4 py-3">
                    <span :class="getAttendanceBadgeClass(record.status)" class="inline-block text-xs px-2 py-1 rounded-lg font-medium">
                      {{ languageStore.t(record.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ record.notes || '-' }}</td>
                </tr>
                <tr v-if="attendanceRecords.length === 0">
                  <td colspan="3" class="text-center py-8 text-gray-500">{{ languageStore.t('noAttendance') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Grades Tab -->
      <div v-if="activeTab === 'grades'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-5 sm:p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('subject') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('examType') }}</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('score') }}</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('percentage') }}</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('grade') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('date') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="grade in grades" :key="grade.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-gray-700">{{ grade.exam?.subject }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ languageStore.t(grade.exam?.exam_type) }}</td>
                  <td class="px-4 py-3 text-center text-sm text-gray-600">{{ grade.score }} / {{ grade.exam?.max_score }}</td>
                  <td class="px-4 py-3 text-center">
                    <span :class="getGradeColor(grade.percentage)" class="font-semibold">{{ grade.percentage }}%</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span :class="getGradeColor(grade.percentage)" class="font-bold">{{ grade.grade }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(grade.exam?.exam_date) }}</td>
                </tr>
                <tr v-if="grades.length === 0">
                  <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noGrades') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Payments Tab -->
      <div v-if="activeTab === 'payments'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-5 sm:p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentNumber') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentType') }}</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('amount') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('dueDate') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentDate') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ payment.payment_number }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ languageStore.t(payment.payment_type) }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-gray-700">{{ formatCurrency(payment.amount) }}</td>
                  <td class="px-4 py-3">
                    <span :class="getPaymentStatusClass(payment.status)" class="inline-block text-xs px-2 py-1 rounded-lg font-medium">
                      {{ languageStore.t(payment.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(payment.due_date) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(payment.payment_date) || '-' }}</td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noPayments') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">{{ languageStore.t('childNotFound') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const child = ref(null)
const loading = ref(true)
const activeTab = ref('attendance')
const attendanceRecords = ref([])
const grades = ref([])
const payments = ref([])
const attendanceStartDate = ref('')
const attendanceEndDate = ref('')

const attendanceRate = computed(() => {
  if (attendanceRecords.value.length === 0) return 0
  const present = attendanceRecords.value.filter(a => a.status === 'present' || a.status === 'late').length
  return Math.round((present / attendanceRecords.value.length) * 100)
})

const averageGrade = computed(() => {
  if (grades.value.length === 0) return 0
  const total = grades.value.reduce((sum, g) => sum + (g.percentage || 0), 0)
  return Math.round(total / grades.value.length)
})

const pendingPayments = computed(() => {
  return payments.value.filter(p => p.status === 'pending').length
})

const loadChildDetails = async () => {
  const childId = route.params.id
  
  const { data } = await supabase
    .from('students')
    .select('*, class:classes(name)')
    .eq('id', childId)
    .single()
  
  child.value = data
}

const loadAttendance = async () => {
  if (!child.value) return
  
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('student_id', child.value.id)
    .order('date', { ascending: false })
  
  if (attendanceStartDate.value) {
    query = query.gte('date', attendanceStartDate.value)
  }
  if (attendanceEndDate.value) {
    query = query.lte('date', attendanceEndDate.value)
  }
  
  const { data } = await query
  attendanceRecords.value = data || []
}

const loadGrades = async () => {
  if (!child.value) return
  
  const { data } = await supabase
    .from('grades')
    .select(`
      *,
      exam:exams(
        subject,
        exam_type,
        max_score,
        exam_date
      )
    `)
    .eq('student_id', child.value.id)
    .order('created_at', { ascending: false })
  
  grades.value = data || []
}

const loadPayments = async () => {
  if (!child.value) return
  
  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', child.value.id)
    .order('created_at', { ascending: false })
  
  payments.value = data || []
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    graduated: 'bg-blue-100 text-blue-700',
    transferred: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getAttendanceBadgeClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    excused: 'bg-blue-100 text-blue-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 80) return 'text-blue-600'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  return 'text-red-600'
}

const getPaymentStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

onMounted(async () => {
  await loadChildDetails()
  await Promise.all([
    loadAttendance(),
    loadGrades(),
    loadPayments()
  ])
  loading.value = false
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