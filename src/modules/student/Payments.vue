<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('studentPayments') }}</h1>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalPaid') }}</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalPaid) }}</p>
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
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingAmount') }}</p>
            <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(pendingAmount) }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalPayments') }}</p>
            <p class="text-2xl font-bold text-primary-600">{{ totalPaymentsCount }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm0 0v4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button 
          @click="activeTab = 'all'" 
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'all' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ languageStore.t('allPayments') }}
        </button>
        <button 
          @click="activeTab = 'approved'" 
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'approved' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ languageStore.t('approved') }}
        </button>
        <button 
          @click="activeTab = 'pending'" 
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ languageStore.t('pending') }}
        </button>
      </nav>
    </div>
    
    <!-- Payments Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentType') }}</th>
              <th class="px-4 py-3 text-right">{{ languageStore.t('amount') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentMethod') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('status') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('dueDate') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentDate') }}</th>
              <th class="px-4 py-3 text-center">{{ languageStore.t('proof') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in filteredPayments" :key="payment.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-sm">{{ payment.payment_number }}</td>
              <td class="px-4 py-3">{{ languageStore.t(payment.payment_type) }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-4 py-3">{{ languageStore.t(payment.payment_method) }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusBadgeClass(payment.status)">
                  {{ languageStore.t(payment.status) }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(payment.due_date) }}</td>
              <td class="px-4 py-3">{{ formatDate(payment.payment_date) || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <button 
                  v-if="payment.proof_image_url" 
                  @click="viewProof(payment.proof_image_url)" 
                  class="text-blue-600 hover:text-blue-800"
                  :title="languageStore.t('viewProof')"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-500">
                {{ languageStore.t('noPayments') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
        class="border-t border-gray-200"
      />
    </div>
    
    <!-- Payment Summary Section -->
    <div class="card p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('paymentSummary') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium mb-2">{{ languageStore.t('paymentByType') }}</h3>
          <div class="space-y-2">
            <div v-for="type in paymentTypeSummary" :key="type.name" class="flex justify-between items-center">
              <span class="text-gray-600">{{ languageStore.t(type.name) }}:</span>
              <span class="font-medium">{{ formatCurrency(type.total) }}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="font-medium mb-2">{{ languageStore.t('paymentByMethod') }}</h3>
          <div class="space-y-2">
            <div v-for="method in paymentMethodSummary" :key="method.name" class="flex justify-between items-center">
              <span class="text-gray-600">{{ languageStore.t(method.name) }}:</span>
              <span class="font-medium">{{ formatCurrency(method.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import Pagination from '@/components/common/Pagination.vue'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const payments = ref([])
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

const filteredPayments = computed(() => {
  let filtered = payments.value
  
  if (activeTab.value === 'approved') {
    filtered = filtered.filter(p => p.status === 'approved')
  } else if (activeTab.value === 'pending') {
    filtered = filtered.filter(p => p.status === 'pending')
  }
  
  return filtered
})

const totalPaid = computed(() => {
  return payments.value
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0)
})

const pendingAmount = computed(() => {
  return payments.value
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
})

const totalPaymentsCount = computed(() => {
  return payments.value.length
})

const paymentTypeSummary = computed(() => {
  const types = ['tuition', 'exam_fees', 'activity_fees', 'other']
  return types.map(type => ({
    name: type,
    total: payments.value
      .filter(p => p.payment_type === type && p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0)
  }))
})

const paymentMethodSummary = computed(() => {
  const methods = ['bankak', 'cash']
  return methods.map(method => ({
    name: method,
    total: payments.value
      .filter(p => p.payment_method === method && p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0)
  }))
})

const fetchStudentPayments = async () => {
  const userId = authStore.user?.id
  
  if (!userId) return
  
  // Get student ID from user
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!student) return
  
  // Fetch payments
  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
  
  payments.value = data || []
  
  // Calculate total pages
  totalPages.value = Math.ceil(filteredPayments.value.length / pageSize.value)
}

const changePage = (page) => {
  currentPage.value = page
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    approved: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    rejected: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
    cancelled: 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
}

const viewProof = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchStudentPayments()
})
</script>