<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ child?.full_name }} - {{ languageStore.t('childDetails') }}</h1>
      <router-link to="/parent/children" class="btn-secondary">
        ← {{ languageStore.t('back') }}
      </router-link>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="child" class="space-y-6">
      <!-- Student Information -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('personalInformation') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('fullName') }}</p>
            <p class="font-medium">{{ child.full_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('arabicName') }}</p>
            <p class="font-medium">{{ child.arabic_name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('studentNumber') }}</p>
            <p class="font-medium">{{ child.student_number }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('class') }}</p>
            <p class="font-medium">{{ child.class?.name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('dateOfBirth') }}</p>
            <p class="font-medium">{{ formatDate(child.date_of_birth) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('gender') }}</p>
            <p class="font-medium">{{ languageStore.t(child.gender) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('nationality') }}</p>
            <p class="font-medium">{{ child.nationality || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('religion') }}</p>
            <p class="font-medium">{{ child.religion || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('enrollmentDate') }}</p>
            <p class="font-medium">{{ formatDate(child.enrollment_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('status') }}</p>
            <span :class="getStatusClass(child.status)">{{ languageStore.t(child.status) }}</span>
          </div>
          <div class="col-span-2">
            <p class="text-sm text-gray-500">{{ languageStore.t('address') }}</p>
            <p class="font-medium">{{ child.address || '-' }}</p>
          </div>
          <div class="col-span-2" v-if="child.medical_info">
            <p class="text-sm text-gray-500">{{ languageStore.t('medicalInfo') }}</p>
            <p class="font-medium">{{ child.medical_info }}</p>
          </div>
        </div>
      </div>
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card p-6">
          <div class="text-center">
            <p class="text-gray-500 text-sm">{{ languageStore.t('attendanceRate') }}</p>
            <p class="text-3xl font-bold text-green-600">{{ attendanceRate }}%</p>
          </div>
        </div>
        <div class="card p-6">
          <div class="text-center">
            <p class="text-gray-500 text-sm">{{ languageStore.t('averageGrade') }}</p>
            <p class="text-3xl font-bold text-primary-600">{{ averageGrade }}%</p>
          </div>
        </div>
        <div class="card p-6">
          <div class="text-center">
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-3xl font-bold text-yellow-600">{{ pendingPayments }}</p>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button 
            @click="activeTab = 'attendance'" 
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'attendance' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            {{ languageStore.t('attendance') }}
          </button>
          <button 
            @click="activeTab = 'grades'" 
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'grades' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            {{ languageStore.t('grades') }}
          </button>
          <button 
            @click="activeTab = 'payments'" 
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'payments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            {{ languageStore.t('payments') }}
          </button>
        </nav>
      </div>
      
      <!-- Attendance Tab -->
      <div v-if="activeTab === 'attendance'" class="card p-6">
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label class="label">{{ languageStore.t('startDate') }}</label>
            <input v-model="attendanceStartDate" type="date" class="input-field" />
          </div>
          <div class="flex-1">
            <label class="label">{{ languageStore.t('endDate') }}</label>
            <input v-model="attendanceEndDate" type="date" class="input-field" />
          </div>
          <div class="flex items-end">
            <button @click="loadAttendance" class="btn-primary">{{ languageStore.t('filter') }}</button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('notes') }}</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="record in attendanceRecords" :key="record.id" class="border-t">
                <td class="px-4 py-2">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-2">
                  <span :class="getAttendanceBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ record.notes || '-' }}</td>
              </tr>
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="3" class="text-center py-8 text-gray-500">{{ languageStore.t('noAttendance') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Grades Tab -->
      <div v-if="activeTab === 'grades'" class="card p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">{{ languageStore.t('subject') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('examType') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('score') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('percentage') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('grade') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="grade in grades" :key="grade.id" class="border-t">
                <td class="px-4 py-2">{{ grade.exam?.subject }}</td>
                <td class="px-4 py-2">{{ languageStore.t(grade.exam?.exam_type) }}</td>
                <td class="px-4 py-2 text-center">{{ grade.score }} / {{ grade.exam?.max_score }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="getGradeColor(grade.percentage)">{{ grade.percentage }}%</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <span class="font-bold" :class="getGradeColor(grade.percentage)">{{ grade.grade }}</span>
                </td>
                <td class="px-4 py-2">{{ formatDate(grade.exam?.exam_date) }}</td>
              </tr>
              <tr v-if="grades.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noGrades') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Payments Tab -->
      <div v-if="activeTab === 'payments'" class="card p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">{{ languageStore.t('paymentNumber') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('paymentType') }}</th>
                <th class="px-4 py-2 text-right">{{ languageStore.t('amount') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('dueDate') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('paymentDate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in payments" :key="payment.id" class="border-t">
                <td class="px-4 py-2 font-mono">{{ payment.payment_number }}</td>
                <td class="px-4 py-2">{{ languageStore.t(payment.payment_type) }}</td>
                <td class="px-4 py-2 text-right">{{ formatCurrency(payment.amount) }}</td>
                <td class="px-4 py-2">
                  <span :class="getPaymentStatusClass(payment.status)">
                    {{ languageStore.t(payment.status) }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ formatDate(payment.due_date) }}</td>
                <td class="px-4 py-2">{{ formatDate(payment.payment_date) || '-' }}</td>
              </tr>
              <tr v-if="payments.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noPayments') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12 text-gray-500">
      {{ languageStore.t('childNotFound') }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

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
    active: 'text-green-600',
    graduated: 'text-blue-600',
    transferred: 'text-yellow-600',
    suspended: 'text-red-600'
  }
  return classes[status] || ''
}

const getAttendanceBadgeClass = (status) => {
  const classes = {
    present: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    absent: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs',
    late: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    excused: 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || ''
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
    pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    approved: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || ''
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