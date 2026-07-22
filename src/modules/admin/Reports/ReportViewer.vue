<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('reports') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('generateAndExportReports') }}
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ languageStore.t('selectReportToGenerate') }}
      </div>
    </div>

    <!-- Report Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Performance Report Card -->
      <div 
        class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
        @click="generateReport('performance')"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('performanceReport') }}</h2>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 sm:p-2.5 flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{{ languageStore.t('performanceReportDesc') }}</p>
        <button @click.stop="generateReport('performance')" class="btn-primary w-full text-xs sm:text-sm py-2 rounded-lg">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Attendance Report Card -->
      <div 
        class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-green-200 dark:hover:border-green-800"
        @click="generateReport('attendance')"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('attendanceReport') }}</h2>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-2 sm:p-2.5 flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{{ languageStore.t('attendanceReportDesc') }}</p>
        <button @click.stop="generateReport('attendance')" class="btn-primary w-full text-xs sm:text-sm py-2 rounded-lg">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Revenue Report Card -->
      <div 
        class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
        @click="generateReport('revenue')"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('revenueReport') }}</h2>
          <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 sm:p-2.5 flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{{ languageStore.t('revenueReportDesc') }}</p>
        <button @click.stop="generateReport('revenue')" class="btn-primary w-full text-xs sm:text-sm py-2 rounded-lg">
          {{ languageStore.t('generate') }}
        </button>
      </div>

      <!-- Pending Payments Report Card -->
      <div 
        class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-red-200 dark:hover:border-red-800"
        @click="generateReport('pending')"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('pendingPaymentsReport') }}</h2>
          <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-2 sm:p-2.5 flex-shrink-0">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{{ languageStore.t('pendingPaymentsReportDesc') }}</p>
        <button @click.stop="generateReport('pending')" class="btn-primary w-full text-xs sm:text-sm py-2 rounded-lg">
          {{ languageStore.t('generate') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <!-- Report Display Area -->
    <div 
      v-else-if="reportData && reportData.length > 0" 
      ref="reportContainer"
      class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <!-- Report Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div>
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            {{ currentReportTitle }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ languageStore.t('totalRecords') }}: {{ reportData.length }}
          </p>
        </div>
        <button @click="exportReport" class="btn-secondary inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ languageStore.t('export') }}
        </button>
      </div>

      <!-- Report Content -->
      <div class="p-0 overflow-x-auto">
        <!-- Attendance Report Table -->
        <div v-if="reportType === 'attendance'">
          <table class="min-w-full text-xs sm:text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('studentName') }}</th>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('class') }}</th>
                <th class="hidden sm:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('date') }}</th>
                <th class="px-3 py-2 sm:px-4 text-center dark:text-gray-300">{{ languageStore.t('status') }}</th>
                <th class="hidden md:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-3 py-2 sm:px-4 font-medium dark:text-gray-200">{{ record.student?.full_name || '-' }}</td>
                <td class="px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.class?.name || '-' }}</td>
                <td class="hidden sm:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ formatDate(record.date) }}</td>
                <td class="px-3 py-2 sm:px-4 text-center">
                  <span :class="getStatusBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="hidden md:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Attendance Summary -->
          <div v-if="attendanceSummary" class="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{{ attendanceSummary.present }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('present') }}</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{{ attendanceSummary.absent }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('absent') }}</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ attendanceSummary.late }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('late') }}</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ attendanceSummary.excused }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('excused') }}</p>
            </div>
            <div class="text-center col-span-2 sm:col-span-1">
              <p class="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{{ attendanceSummary.rate }}%</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('attendanceRate') }}</p>
            </div>
          </div>
        </div>

        <!-- Revenue Report Table -->
        <div v-else-if="reportType === 'revenue'">
          <table class="min-w-full text-xs sm:text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentNumber') }}</th>
                <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('amount') }}</th>
                <th class="hidden sm:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentMethod') }}</th>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('status') }}</th>
                <th class="hidden md:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentDate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-3 py-2 sm:px-4 font-mono text-xs dark:text-gray-300">{{ record.payment_number }}</td>
                <td class="px-3 py-2 sm:px-4 text-right font-medium dark:text-gray-200">{{ formatCurrency(record.amount) }}</td>
                <td class="hidden sm:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.payment_method }}</td>
                <td class="px-3 py-2 sm:px-4">
                  <span :class="getPaymentStatusBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="hidden md:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ formatDate(record.payment_date) || formatDate(record.created_at) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Revenue Summary -->
          <div v-if="revenueSummary" class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(revenueSummary.total) }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('totalRevenue') }}</p>
            </div>
            <div class="text-center">
              <p class="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(revenueSummary.bankak) }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('bankak') }}</p>
            </div>
            <div class="text-center col-span-2 sm:col-span-1">
              <p class="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(revenueSummary.cash) }}</p>
              <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{{ languageStore.t('cash') }}</p>
            </div>
          </div>
        </div>

        <!-- Performance Report Table -->
        <div v-else-if="reportType === 'performance'">
          <table class="min-w-full text-xs sm:text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('studentName') }}</th>
                <th class="hidden sm:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('subject') }}</th>
                <th class="hidden md:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('examType') }}</th>
                <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('score') }}</th>
                <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('percentage') }}%</th>
                <th class="px-3 py-2 sm:px-4 text-center dark:text-gray-300">{{ languageStore.t('grade') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-3 py-2 sm:px-4 font-medium dark:text-gray-200">{{ record.student?.full_name || '-' }}</td>
                <td class="hidden sm:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.exam?.subject || '-' }}</td>
                <td class="hidden md:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ languageStore.t(record.exam?.exam_type || '') }}</td>
                <td class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ record.score }} / {{ record.exam?.max_score }}</td>
                <td class="px-3 py-2 sm:px-4 text-right font-medium dark:text-gray-200">{{ record.percentage }}%</td>
                <td class="px-3 py-2 sm:px-4 text-center">
                  <span :class="getGradeColor(record.percentage)">{{ record.grade }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pending Payments Report Table -->
        <div v-else-if="reportType === 'pending'">
          <table class="min-w-full text-xs sm:text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentNumber') }}</th>
                <th class="hidden sm:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('student') }}</th>
                <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('amount') }}</th>
                <th class="hidden md:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentMethod') }}</th>
                <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('dueDate') }}</th>
                <th class="hidden lg:table-cell px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in reportData" :key="record.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-3 py-2 sm:px-4 font-mono text-xs dark:text-gray-300">{{ record.payment_number }}</td>
                <td class="hidden sm:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.student?.full_name || '-' }}</td>
                <td class="px-3 py-2 sm:px-4 text-right font-medium dark:text-gray-200">{{ formatCurrency(record.amount) }}</td>
                <td class="hidden md:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.payment_method }}</td>
                <td class="px-3 py-2 sm:px-4 dark:text-gray-300">{{ formatDate(record.due_date) }}</td>
                <td class="hidden lg:table-cell px-3 py-2 sm:px-4 dark:text-gray-300">{{ record.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && generated" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">{{ languageStore.t('noData') }}</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">{{ languageStore.t('tryDifferentReport') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
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
const reportContainer = ref(null)

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
    
    // Scroll to report after a short delay to ensure DOM update
    await nextTick()
    if (reportContainer.value) {
      reportContainer.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
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
    present: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    absent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    late: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    excused: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

const getPaymentStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400 font-bold'
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400 font-bold'
  if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
  if (percentage >= 60) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Report card hover effects */
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* Mobile improvements */
@media (max-width: 640px) {
  .card {
    padding: 1rem;
  }
}
</style>