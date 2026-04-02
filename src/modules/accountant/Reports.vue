<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('financialReports') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('trackAndAnalyzeFinancialData') }}</p>
    </div>
    
    <!-- Summary Cards - 2 columns on mobile, 4 on desktop -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <!-- Total Revenue Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('totalRevenue') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{{ formatCurrency(totalRevenue) }}</p>
          </div>
          <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('approvedPayments') }}</span>
            <span class="text-xs font-semibold text-green-600">{{ totalPayments }} {{ languageStore.t('transactions') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Pending Amount Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('pendingAmount') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ formatCurrency(pendingAmount) }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('pendingApprovals') }}</span>
            <span class="text-xs font-semibold text-yellow-600">{{ pendingCount }} {{ languageStore.t('payments') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Total Payments Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('totalPayments') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">{{ totalPayments }}</p>
          </div>
          <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('completedTransactions') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Average Payment Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('averagePayment') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{{ formatCurrency(averagePayment) }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('perTransaction') }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Methods & Status - 2 columns on mobile -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Payment Methods Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-800">{{ languageStore.t('paymentMethods') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('breakdownByMethod') }}</p>
        </div>
        <div class="p-5">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700">{{ languageStore.t('bankak') }}</span>
                </div>
                <div>
                  <span class="text-sm font-bold text-gray-800">{{ formatCurrency(bankakTotal) }}</span>
                  <span class="text-xs text-gray-400 ml-1">({{ bankakPercentage.toFixed(1) }}%)</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-500" :style="{ width: bankakPercentage + '%' }"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700">{{ languageStore.t('cash') }}</span>
                </div>
                <div>
                  <span class="text-sm font-bold text-gray-800">{{ formatCurrency(cashTotal) }}</span>
                  <span class="text-xs text-gray-400 ml-1">({{ cashPercentage.toFixed(1) }}%)</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-green-500 h-2.5 rounded-full transition-all duration-500" :style="{ width: cashPercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Payment Status Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-800">{{ languageStore.t('paymentStatus') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('breakdownByStatus') }}</p>
        </div>
        <div class="p-5">
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-700">{{ languageStore.t('approved') }}</span>
              </div>
              <span class="text-sm font-semibold text-green-600">{{ formatCurrency(approvedAmount) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-sm text-gray-700">{{ languageStore.t('pending') }}</span>
              </div>
              <span class="text-sm font-semibold text-yellow-600">{{ formatCurrency(pendingAmount) }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-sm text-gray-700">{{ languageStore.t('rejected') }}</span>
              </div>
              <span class="text-sm font-semibold text-red-600">{{ formatCurrency(rejectedAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Monthly Revenue Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-base font-semibold text-gray-800">{{ languageStore.t('monthlyRevenue') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('revenueBreakdownByMonth') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ languageStore.t('total') }}:</span>
          <span class="text-sm font-bold text-green-600">{{ formatCurrency(totalRevenue) }}</span>
        </div>
      </div>
      
      <!-- Mobile Card View for Monthly Revenue -->
      <div class="block lg:hidden divide-y divide-gray-100">
        <div v-for="month in monthlyRevenue" :key="month.month" class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-800">{{ month.month }}</h3>
            <span class="text-sm font-bold text-green-600">{{ formatCurrency(month.total) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs text-gray-500">{{ languageStore.t('bankak') }}</p>
              <p class="font-medium text-gray-700">{{ formatCurrency(month.bankak) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">{{ languageStore.t('cash') }}</p>
              <p class="font-medium text-gray-700">{{ formatCurrency(month.cash) }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-gray-500">{{ languageStore.t('transactions') }}</p>
              <p class="font-medium text-gray-700">{{ month.count }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('month') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('revenue') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('bankak') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('cash') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('transactions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="month in monthlyRevenue" :key="month.month" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-medium text-gray-800">{{ month.month }}</td>
              <td class="px-5 py-3 text-right font-semibold text-green-600">{{ formatCurrency(month.total) }}</td>
              <td class="px-5 py-3 text-right text-gray-600">{{ formatCurrency(month.bankak) }}</td>
              <td class="px-5 py-3 text-right text-gray-600">{{ formatCurrency(month.cash) }}</td>
              <td class="px-5 py-3 text-right font-medium text-gray-700">{{ month.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="monthlyRevenue.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-gray-500">{{ languageStore.t('noPaymentDataAvailable') }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('startProcessingPaymentsToSeeReports') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()
const payments = ref([])

const totalRevenue = ref(0)
const pendingAmount = ref(0)
const approvedAmount = ref(0)
const rejectedAmount = ref(0)
const totalPayments = ref(0)
const pendingCount = ref(0)
const bankakTotal = ref(0)
const cashTotal = ref(0)
const monthlyRevenue = ref([])

const averagePayment = computed(() => {
  if (totalPayments.value === 0) return 0
  return totalRevenue.value / totalPayments.value
})

const bankakPercentage = computed(() => {
  const total = bankakTotal.value + cashTotal.value
  return total > 0 ? (bankakTotal.value / total) * 100 : 0
})

const cashPercentage = computed(() => {
  const total = bankakTotal.value + cashTotal.value
  return total > 0 ? (cashTotal.value / total) * 100 : 0
})

const fetchData = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  
  const { data } = await supabase
    .from('payments')
    .select('amount, status, payment_method, created_at')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
  
  if (!data) return
  
  payments.value = data
  
  // Calculate totals
  const approved = data.filter(p => p.status === 'approved')
  const pending = data.filter(p => p.status === 'pending')
  const rejected = data.filter(p => p.status === 'rejected')
  
  totalRevenue.value = approved.reduce((sum, p) => sum + p.amount, 0)
  pendingAmount.value = pending.reduce((sum, p) => sum + p.amount, 0)
  approvedAmount.value = totalRevenue.value
  rejectedAmount.value = rejected.reduce((sum, p) => sum + p.amount, 0)
  totalPayments.value = approved.length
  pendingCount.value = pending.length
  
  // Payment methods
  bankakTotal.value = approved.filter(p => p.payment_method === 'bankak').reduce((sum, p) => sum + p.amount, 0)
  cashTotal.value = approved.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0)
  
  // Monthly breakdown
  const monthly = {}
  approved.forEach(p => {
    const month = new Date(p.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
    if (!monthly[month]) {
      monthly[month] = { total: 0, bankak: 0, cash: 0, count: 0 }
    }
    monthly[month].total += p.amount
    monthly[month].count++
    if (p.payment_method === 'bankak') {
      monthly[month].bankak += p.amount
    } else {
      monthly[month].cash += p.amount
    }
  })
  
  monthlyRevenue.value = Object.entries(monthly).map(([month, data]) => ({
    month,
    ...data
  })).reverse()
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

onMounted(() => {
  fetchData()
})
</script>