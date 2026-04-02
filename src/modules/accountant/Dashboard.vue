<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('accountantDashboard') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('manageAndTrackPayments') }}</p>
    </div>
    
    <!-- Stats Cards - 2 columns on mobile, 3 on desktop -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <!-- Pending Approvals Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('pendingApprovals') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ pendingCount }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('waitingForReview') }}</span>
            <router-link to="/accountant/payments" class="text-xs text-yellow-600 hover:text-yellow-700 font-medium">
              {{ languageStore.t('viewAll') }} →
            </router-link>
          </div>
        </div>
      </div>
      
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
            <span class="text-xs text-gray-500">{{ languageStore.t('totalApprovedPayments') }}</span>
            <span class="text-xs font-semibold text-green-600">{{ totalPayments }} {{ languageStore.t('payments') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Average Payment Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group sm:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('averagePayment') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">{{ formatCurrency(averagePayment) }}</p>
          </div>
          <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ languageStore.t('averagePerTransaction') }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Pending Payments Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-base font-semibold text-gray-800">{{ languageStore.t('recentPendingPayments') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('paymentsAwaitingYourApproval') }}</p>
        </div>
        <router-link to="/accountant/payments" class="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium transition-all duration-200">
          {{ languageStore.t('viewAllPending') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      
      <!-- Mobile Card View -->
      <div class="block lg:hidden divide-y divide-gray-100">
        <div v-for="payment in recentPending" :key="payment.id" class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-mono text-xs text-gray-500">{{ payment.payment_number }}</p>
              <p class="font-semibold text-gray-800 mt-1">{{ payment.student?.full_name }}</p>
            </div>
            <span class="badge-pending px-2 py-1 rounded-lg text-xs font-medium">
              {{ languageStore.t('pending') }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <p class="text-xs text-gray-500">{{ languageStore.t('amount') }}</p>
              <p class="font-semibold text-gray-700">{{ formatCurrency(payment.amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">{{ languageStore.t('method') }}</p>
              <p class="text-gray-600">{{ payment.payment_method }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-gray-500">{{ languageStore.t('dueDate') }}</p>
              <p class="text-gray-600">{{ formatDate(payment.due_date) }}</p>
            </div>
          </div>
          <div class="mt-3 pt-2">
            <router-link to="/accountant/payments" class="inline-flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-medium">
              {{ languageStore.t('reviewPayment') }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('student') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('amount') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('method') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('dueDate') }}</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payment in recentPending" :key="payment.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-mono text-xs text-gray-600">{{ payment.payment_number }}</td>
              <td class="px-5 py-3">
                <div class="font-medium text-gray-800">{{ payment.student?.full_name }}</div>
                <div class="text-xs text-gray-400">{{ payment.student?.student_number }}</div>
              </td>
              <td class="px-5 py-3 text-right font-semibold text-gray-800">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-5 py-3">
                <span class="badge-method px-2 py-1 rounded-lg text-xs font-medium">
                  {{ payment.payment_method }}
                </span>
              </td>
              <td class="px-5 py-3 text-gray-600">{{ formatDate(payment.due_date) }}</td>
              <td class="px-5 py-3 text-center">
                <span class="badge-pending px-2 py-1 rounded-lg text-xs font-medium">
                  {{ languageStore.t('pending') }}
                </span>
              </td>
              <td class="px-5 py-3 text-center">
                <router-link to="/accountant/payments" class="inline-flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  {{ languageStore.t('review') }}
                </router-link>
              </td>
            </tr>
            <tr v-if="recentPending.length === 0">
              <td colspan="7" class="text-center py-12">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">{{ languageStore.t('noPendingPayments') }}</p>
                <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('allPaymentsHaveBeenProcessed') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State for Mobile -->
      <div v-if="recentPending.length === 0" class="block lg:hidden text-center py-12">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500">{{ languageStore.t('noPendingPayments') }}</p>
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

const pendingCount = ref(0)
const totalRevenue = ref(0)
const totalPayments = ref(0)
const recentPending = ref([])

const averagePayment = computed(() => {
  if (totalPayments.value === 0) return 0
  return totalRevenue.value / totalPayments.value
})

const fetchData = async () => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) return
  
  // Get pending payments count
  const { count: pending } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'pending')
  pendingCount.value = pending || 0
  
  // Get approved payments for revenue
  const { data: approved } = await supabase
    .from('payments')
    .select('amount')
    .eq('school_id', schoolId)
    .eq('status', 'approved')
  totalRevenue.value = approved?.reduce((sum, p) => sum + p.amount, 0) || 0
  totalPayments.value = approved?.length || 0
  
  // Get recent pending payments
  const { data: recent } = await supabase
    .from('payments')
    .select('*, student:students(full_name, student_number)')
    .eq('school_id', schoolId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)
  recentPending.value = recent || []
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.badge-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-method {
  background-color: #f3f4f6;
  color: #6b7280;
  text-transform: capitalize;
}
</style>