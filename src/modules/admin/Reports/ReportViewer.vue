<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('reports') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('generateAndExportReports') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Performance Report Card -->
      <div class="card p-6 hover:shadow-md transition-shadow cursor-pointer" @click="generateReport('performance')">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ languageStore.t('performanceReport') }}</h2>
          <div class="bg-blue-100 rounded-full p-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-4">{{ languageStore.t('performanceReportDesc') }}</p>
        <button @click.stop="generateReport('performance')" class="btn-primary text-sm w-full">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Attendance Report Card -->
      <div class="card p-6 hover:shadow-md transition-shadow cursor-pointer" @click="generateReport('attendance')">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ languageStore.t('attendanceReport') }}</h2>
          <div class="bg-green-100 rounded-full p-2">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-4">{{ languageStore.t('attendanceReportDesc') }}</p>
        <button @click.stop="generateReport('attendance')" class="btn-primary text-sm w-full">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Revenue Report Card -->
      <div class="card p-6 hover:shadow-md transition-shadow cursor-pointer" @click="generateReport('revenue')">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ languageStore.t('revenueReport') }}</h2>
          <div class="bg-yellow-100 rounded-full p-2">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-4">{{ languageStore.t('revenueReportDesc') }}</p>
        <button @click.stop="generateReport('revenue')" class="btn-primary text-sm w-full">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Pending Payments Report Card -->
      <div class="card p-6 hover:shadow-md transition-shadow cursor-pointer" @click="generateReport('pending')">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ languageStore.t('pendingPaymentsReport') }}</h2>
          <div class="bg-red-100 rounded-full p-2">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-4">{{ languageStore.t('pendingPaymentsReportDesc') }}</p>
        <button @click.stop="generateReport('pending')" class="btn-primary text-sm w-full">
          {{ languageStore.t('generate') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner"></div>
    </div>

    <!-- Report Display Area -->
    <div v-else-if="reportData && reportData.length > 0" class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="text-lg font-semibold">{{ currentReportTitle }}</h2>
        <button @click="exportReport" class="btn-secondary text-sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ languageStore.t('export') }}
        </button>
      </div>
      <div class="card-body p-0 overflow-x-auto">
        <!-- Attendance Report Table -->
        <div v-if="reportType === 'attendance'">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">{{ languageStore.t('studentName') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('class') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('date') }}</th>
                <th class="px-4 py-3 text-center">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">{{ record.student?.full_name || '-' }}</td>
                <td class="px-4 py-3">{{ record.class?.name || '-' }}</td>
                <td class="px-4 py-3">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="getStatusBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ record.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Revenue Report Table -->
        <div v-else-if="reportType === 'revenue'">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">{{ languageStore.t('paymentNumber') }}</th>
                <th class="px-4 py-3 text-right">{{ languageStore.t('amount') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('paymentMethod') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('paymentDate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-mono">{{ record.payment_number }}</td>
                <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(record.amount) }}</td>
                <td class="px-4 py-3">{{ record.payment_method }}</td>
                <td class="px-4 py-3">
                  <span :class="getPaymentStatusBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ formatDate(record.payment_date) || formatDate(record.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Performance Report Table -->
        <div v-else-if="reportType === 'performance'">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">{{ languageStore.t('studentName') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('subject') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('examType') }}</th>
                <th class="px-4 py-3 text-right">{{ languageStore.t('score') }}</th>
                <th class="px-4 py-3 text-right">{{ languageStore.t('percentage') }}%</th>
                <th class="px-4 py-3 text-center">{{ languageStore.t('grade') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3">{{ record.student?.full_name || '-' }}</td>
                <td class="px-4 py-3">{{ record.exam?.subject || '-' }}</td>
                <td class="px-4 py-3">{{ languageStore.t(record.exam?.exam_type) }}</td>
                <td class="px-4 py-3 text-right">{{ record.score }} / {{ record.exam?.max_score }}</td>
                <td class="px-4 py-3 text-right font-medium">{{ record.percentage }}%</td>
                <td class="px-4 py-3 text-center">
                  <span :class="getGradeColor(record.percentage)">{{ record.grade }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pending Payments Report Table -->
        <div v-else-if="reportType === 'pending'">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">{{ languageStore.t('paymentNumber') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('student') }}</th>
                <th class="px-4 py-3 text-right">{{ languageStore.t('amount') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('paymentMethod') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('dueDate') }}</th>
                <th class="px-4 py-3 text-left">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-mono">{{ record.payment_number }}</td>
                <td class="px-4 py-3">{{ record.student?.full_name || '-' }}</td>
                <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(record.amount) }}</td>
                <td class="px-4 py-3">{{ record.payment_method }}</td>
                <td class="px-4 py-3">{{ formatDate(record.due_date) }}</td>
                <td class="px-4 py-3">{{ record.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Stats for Attendance -->
        <div v-if="reportType === 'attendance' && attendanceSummary" class="mt-4 p-4 border-t bg-gray-50">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ attendanceSummary.present }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('present') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-red-600">{{ attendanceSummary.absent }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('absent') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">{{ attendanceSummary.late }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('late') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ attendanceSummary.excused }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('excused') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-600">{{ attendanceSummary.rate }}%</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('attendanceRate') }}</p>
            </div>
          </div>
        </div>

        <!-- Summary Stats for Revenue -->
        <div v-if="reportType === 'revenue' && revenueSummary" class="mt-4 p-4 border-t bg-gray-50">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(revenueSummary.total) }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('totalRevenue') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(revenueSummary.bankak) }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('bankak') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(revenueSummary.cash) }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('cash') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && generated" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">{{ languageStore.t('noData') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const reportData = ref(null)
const currentReportTitle = ref('')
const reportType = ref('')
const isLoading = ref(false)
const generated = ref(false)

const attendanceSummary = computed(() => {
  if (!reportData.value || reportType.value !== 'attendance') return null
  const stats = { present: 0, absent: 0, late: 0, excused: 0 }
  reportData.value.forEach(record => {
    if (stats[record.status] !== undefined) stats[record.status]++
  })
  const total = stats.present + stats.absent + stats.late + stats.excused
  const rate = total > 0 ? Math.round(((stats.present + stats.late) / total) * 100) : 0
  return { ...stats, rate }
})

const revenueSummary = computed(() => {
  if (!reportData.value || reportType.value !== 'revenue') return null
  const total = reportData.value.reduce((sum, r) => sum + (r.amount || 0), 0)
  const bankak = reportData.value.filter(r => r.payment_method === 'bankak').reduce((sum, r) => sum + (r.amount || 0), 0)
  const cash = reportData.value.filter(r => r.payment_method === 'cash').reduce((sum, r) => sum + (r.amount || 0), 0)
  return { total, bankak, cash }
})

const generateReport = async (type) => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) {
    alert('No school assigned. Please contact super admin.')
    return
  }
  
  isLoading.value = true
  generated.value = true
  reportType.value = type
  
  try {
    if (type === 'performance') {
      currentReportTitle.value = languageStore.t('performanceReport')
      const { data } = await supabase
        .from('grades')
        .select(`
          *,
          student:students(full_name),
          exam:exams(subject, exam_type, max_score)
        `)
        .eq('school_id', schoolId)
      reportData.value = data
    } 
    else if (type === 'attendance') {
      currentReportTitle.value = languageStore.t('attendanceReport')
      const { data } = await supabase
        .from('attendance')
        .select(`
          *,
          student:students(full_name),
          class:classes(name)
        `)
        .eq('school_id', schoolId)
        .order('date', { ascending: false })
      reportData.value = data
    }
    else if (type === 'revenue') {
      currentReportTitle.value = languageStore.t('revenueReport')
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('school_id', schoolId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      reportData.value = data
    }
    else if (type === 'pending') {
      currentReportTitle.value = languageStore.t('pendingPaymentsReport')
      const { data } = await supabase
        .from('payments')
        .select('*, student:students(full_name)')
        .eq('school_id', schoolId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      reportData.value = data
    }
  } catch (error) {
    console.error('Error generating report:', error)
  } finally {
    isLoading.value = false
  }
}

const exportReport = () => {
  if (!reportData.value || reportData.value.length === 0) return
  
  let headers = []
  let rows = []
  
  if (reportType.value === 'attendance') {
    headers = ['Student Name', 'Class', 'Date', 'Status', 'Notes']
    rows = reportData.value.map(r => [
      r.student?.full_name || '',
      r.class?.name || '',
      formatDate(r.date),
      languageStore.t(r.status),
      r.notes || ''
    ])
  } 
  else if (reportType.value === 'revenue') {
    headers = ['Payment Number', 'Amount', 'Method', 'Status', 'Date']
    rows = reportData.value.map(r => [
      r.payment_number,
      formatCurrency(r.amount),
      r.payment_method,
      languageStore.t(r.status),
      formatDate(r.payment_date) || formatDate(r.created_at)
    ])
  }
  else if (reportType.value === 'performance') {
    headers = ['Student', 'Subject', 'Exam Type', 'Score', 'Percentage', 'Grade']
    rows = reportData.value.map(r => [
      r.student?.full_name || '',
      r.exam?.subject || '',
      languageStore.t(r.exam?.exam_type || ''),
      `${r.score}/${r.exam?.max_score}`,
      r.percentage,
      r.grade
    ])
  }
  else if (reportType.value === 'pending') {
    headers = ['Payment Number', 'Student', 'Amount', 'Method', 'Due Date', 'Notes']
    rows = reportData.value.map(r => [
      r.payment_number,
      r.student?.full_name || '',
      formatCurrency(r.amount),
      r.payment_method,
      formatDate(r.due_date),
      r.notes || ''
    ])
  }
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${currentReportTitle.value}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const getStatusBadgeClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    absent: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
    late: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    excused: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
}

const getPaymentStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    approved: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    rejected: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
}

const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600 font-bold'
  if (percentage >= 80) return 'text-blue-600 font-bold'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  return 'text-red-600'
}
</script>