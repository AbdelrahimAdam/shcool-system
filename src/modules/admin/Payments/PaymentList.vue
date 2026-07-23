<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('payments') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalPayments') }}: {{ totalCount }}
          <span v-if="pendingCount" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            {{ pendingCount }} {{ languageStore.t('pending') }}
          </span>
          <span v-if="parentRequestCount" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {{ parentRequestCount }} {{ languageStore.t('parentRequests') }}
          </span>
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <router-link 
          to="/admin/payments/create" 
          class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ languageStore.t('addPayment') }}
        </router-link>
        <router-link 
          to="/admin/payments/approval" 
          class="btn-secondary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ languageStore.t('approve') }}
          <span v-if="pendingCount" class="ml-1.5 px-1.5 py-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-[10px]">
            {{ pendingCount }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- Filter: Show Parent Requests Toggle -->
    <div class="flex flex-wrap items-center gap-4">
      <button
        @click="showParentRequests = !showParentRequests"
        class="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors"
        :class="showParentRequests 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {{ languageStore.t('parentPaymentRequests') }}
        <span v-if="parentRequestCount" class="ml-1 text-xs text-blue-600 dark:text-blue-400">{{ parentRequestCount }}</span>
      </button>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="displayPayments"
        :total="totalCount"
        :loading="isLoading"
        :filter-options="filterOptions"
        table-class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        header-class="bg-gray-50 dark:bg-gray-800"
        row-class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        cell-class="px-3 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-gray-200"
        @search="handleSearch"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #column-status="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ languageStore.t(row.status) }}
          </span>
        </template>

        <template #column-amount="{ row }">
          <span class="font-medium">{{ formatCurrency(row.amount) }}</span>
        </template>

        <template #column-student="{ row }">
          {{ row.student?.full_name || '-' }}
        </template>

        <!-- Add badge for parent-requested payments -->
        <template #column-payment_number="{ row }">
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-xs">{{ row.payment_number }}</span>
            <span v-if="row.created_by && row.status === 'pending'" class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {{ languageStore.t('parentRequest') }}
            </span>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading && displayPayments.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayPayments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noPaymentsFound') }}
      </div>

      <!-- Payment Cards -->
      <div 
        v-for="payment in displayPayments" 
        :key="payment.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- Payment Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                {{ payment.student?.full_name || '-' }}
              </h3>
              <span v-if="payment.created_by && payment.status === 'pending'" class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex-shrink-0">
                {{ languageStore.t('parentRequest') }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {{ payment.payment_number || '-' }}
            </p>
          </div>
          <span :class="getStatusClass(payment.status)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(payment.status) }}
          </span>
        </div>

        <!-- Payment Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('amount') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatCurrency(payment.amount) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('paymentMethod') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ languageStore.t(payment.payment_method) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('dueDate') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(payment.due_date) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('paymentDate') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(payment.payment_date) || '-' }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="handleEdit(payment)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>
          <button 
            @click="handleDelete(payment)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('delete') }}
          </button>
          <button 
            v-if="payment.status === 'pending'"
            @click="approvePayment(payment)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            {{ languageStore.t('approve') }}
          </button>
          <button 
            v-if="payment.status === 'pending'"
            @click="rejectPayment(payment)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('reject') }}
          </button>
          <button 
            v-if="payment.created_by && payment.status === 'pending'"
            @click="markPaymentReceived(payment)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('markReceived') }}
          </button>
        </div>
      </div>

      <!-- Pagination (mobile) -->
      <div v-if="totalCount > 10" class="flex justify-between items-center mt-4">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('previous') }}
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { usePaymentStore } from '../../../stores/payment'
import { useLanguageStore } from '../../../stores/language'
import { useAuthStore } from '../../../stores/auth'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const currentPage = ref(1)
const showParentRequests = ref(false)
const totalPages = computed(() => Math.ceil(totalCount.value / 10))

const payments = computed(() => paymentStore.payments)
const totalCount = computed(() => paymentStore.totalCount)
const isLoading = computed(() => paymentStore.isLoading)

// Count pending payments and parent requests
const pendingCount = computed(() => {
  return payments.value.filter(p => p.status === 'pending').length
})

const parentRequestCount = computed(() => {
  return payments.value.filter(p => p.created_by && p.status === 'pending').length
})

// Display filtered payments
const displayPayments = computed(() => {
  if (showParentRequests.value) {
    return payments.value.filter(p => p.created_by && p.status === 'pending')
  }
  return payments.value
})

const columns = [
  { key: 'payment_number', label: 'paymentNumber', type: 'text' },
  { key: 'student', label: 'studentName', type: 'text' },
  { key: 'amount', label: 'amount', type: 'currency' },
  { key: 'payment_method', label: 'paymentMethod', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'due_date', label: 'dueDate', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ]
  },
  {
    key: 'payment_method',
    label: 'Payment Method',
    options: [
      { value: 'bankak', label: 'Bankak' },
      { value: 'cash', label: 'Cash' }
    ]
  }
]

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString() || 0}`
}

const handleSearch = async (query) => {
  currentPage.value = 1
  await paymentStore.fetchPayments(1, { ...paymentStore.filters, search: query })
}

const handleFilter = async (filters) => {
  currentPage.value = 1
  await paymentStore.fetchPayments(1, { ...paymentStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await paymentStore.fetchPayments(page, paymentStore.filters)
}

const handleEdit = (payment) => {
  router.push(`/admin/payments/${payment.id}`)
}

const handleDelete = async (payment) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await paymentStore.deletePayment(payment.id)
    if (result.success) {
      await paymentStore.fetchPayments(1, paymentStore.filters)
    } else {
      alert(result.error)
    }
  }
}

const approvePayment = async (payment) => {
  if (confirm(languageStore.t('confirmApprovePayment'))) {
    const { error } = await supabase
      .from('payments')
      .update({ 
        status: 'approved',
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)
    
    if (error) {
      alert(error.message)
    } else {
      await paymentStore.fetchPayments(currentPage.value, paymentStore.filters)
    }
  }
}

const rejectPayment = async (payment) => {
  if (confirm(languageStore.t('confirmRejectPayment'))) {
    const { error } = await supabase
      .from('payments')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)
    
    if (error) {
      alert(error.message)
    } else {
      await paymentStore.fetchPayments(currentPage.value, paymentStore.filters)
    }
  }
}

// Mark parent payment as received (admin confirms parent paid)
const markPaymentReceived = async (payment) => {
  if (confirm(languageStore.t('confirmMarkReceived'))) {
    const { error } = await supabase
      .from('payments')
      .update({ 
        status: 'processing',
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: payment.notes ? `${payment.notes}\nPayment received by admin on ${new Date().toLocaleDateString()}` : `Payment received by admin on ${new Date().toLocaleDateString()}`
      })
      .eq('id', payment.id)
    
    if (error) {
      alert(error.message)
    } else {
      alert(languageStore.t('paymentMarkedReceived'))
      await paymentStore.fetchPayments(currentPage.value, paymentStore.filters)
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    processing: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    approved: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    rejected: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    cancelled: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

onMounted(() => {
  paymentStore.fetchPayments(1)
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
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

/* Mobile Card Styles */
.card {
  transition: box-shadow 0.2s ease;
}

/* Button order fix for mobile */
@media (max-width: 640px) {
  .btn-primary {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>