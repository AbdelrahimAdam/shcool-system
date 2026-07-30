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

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- Search Input -->
        <div class="relative">
          <input
            v-model="filters.search"
            type="text"
            :placeholder="languageStore.t('searchPayments')"
            class="input-field w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            v-if="filters.search"
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Status Filter -->
        <div>
          <select v-model="filters.status" class="input-field w-full py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent" @change="applyFilters">
            <option value="">{{ languageStore.t('allStatuses') }}</option>
            <option value="pending">{{ languageStore.t('pending') }}</option>
            <option value="approved">{{ languageStore.t('approved') }}</option>
            <option value="rejected">{{ languageStore.t('rejected') }}</option>
            <option value="cancelled">{{ languageStore.t('cancelled') }}</option>
          </select>
        </div>

        <!-- Payment Method Filter -->
        <div>
          <select v-model="filters.payment_method" class="input-field w-full py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent" @change="applyFilters">
            <option value="">{{ languageStore.t('allMethods') }}</option>
            <option value="bankak">{{ languageStore.t('bankak') }}</option>
            <option value="cash">{{ languageStore.t('cash') }}</option>
          </select>
        </div>

        <!-- Parent Requests Toggle -->
        <div class="flex items-center">
          <button
            @click="toggleParentRequests"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full"
            :class="showParentRequests 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ languageStore.t('parentRequests') }}
            <span v-if="parentRequestCount" class="ml-1 px-2 py-0.5 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
              {{ parentRequestCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ languageStore.t('activeFilters') }}:</span>
        <span v-if="filters.search" class="filter-badge">
          {{ languageStore.t('search') }}: "{{ filters.search }}"
          <button @click="filters.search = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">×</button>
        </span>
        <span v-if="filters.status" class="filter-badge">
          {{ languageStore.t(filters.status) }}
          <button @click="filters.status = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">×</button>
        </span>
        <span v-if="filters.payment_method" class="filter-badge">
          {{ languageStore.t(filters.payment_method) }}
          <button @click="filters.payment_method = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">×</button>
        </span>
        <span v-if="showParentRequests" class="filter-badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {{ languageStore.t('parentRequests') }}
          <button @click="showParentRequests = false; applyFilters()" class="ml-1 text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">×</button>
        </span>
        <button @click="clearAllFilters" class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">
          {{ languageStore.t('clearAll') }}
        </button>
      </div>

      <!-- Results Count -->
      <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{{ languageStore.t('showing') }} {{ displayPayments.length }} {{ languageStore.t('payments') }}</span>
        <span v-if="totalCount > 0">{{ languageStore.t('total') }}: {{ totalCount }}</span>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('paymentNumber') }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('student') }}
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('amount') }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('paymentMethod') }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('status') }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('dueDate') }}
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ languageStore.t('actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading && displayPayments.length === 0">
            <td colspan="7" class="px-4 py-8 text-center">
              <div class="spinner mx-auto dark:border-gray-600 dark:border-t-blue-400"></div>
            </td>
          </tr>
          <tr v-else-if="displayPayments.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>{{ languageStore.t('noPaymentsFound') }}</p>
            </td>
          </tr>
          <tr 
            v-for="payment in displayPayments" 
            :key="payment.id" 
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-xs text-gray-900 dark:text-white">{{ payment.payment_number }}</span>
                <span v-if="payment.created_by && payment.status === 'pending'" class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {{ languageStore.t('parentRequest') }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
              {{ payment.student?.full_name || '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
              {{ formatCurrency(payment.amount) }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs font-medium">
                {{ languageStore.t(payment.payment_method) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span :class="getStatusClass(payment.status)">
                {{ languageStore.t(payment.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              {{ formatDate(payment.due_date) }}
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <div class="flex flex-wrap items-center justify-center gap-1.5">
                <button 
                  @click="handleEdit(payment)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium"
                >
                  {{ languageStore.t('edit') }}
                </button>
                <button 
                  @click="handleDelete(payment)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                >
                  {{ languageStore.t('delete') }}
                </button>
                <button 
                  v-if="payment.status === 'pending'"
                  @click="approvePayment(payment)"
                  class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-xs font-medium"
                >
                  {{ languageStore.t('approve') }}
                </button>
                <button 
                  v-if="payment.status === 'pending'"
                  @click="rejectPayment(payment)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                >
                  {{ languageStore.t('reject') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalCount > 10" class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
        >
          {{ languageStore.t('previous') }}
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ languageStore.t('page') }} {{ currentPage }} {{ languageStore.t('of') }} {{ totalPages }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
        >
          {{ languageStore.t('next') }}
        </button>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <div v-if="isLoading && displayPayments.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <div v-else-if="displayPayments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noPaymentsFound') }}
      </div>

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
        </div>
      </div>

      <!-- Pagination (mobile) -->
      <div v-if="totalCount > 10" class="flex justify-between items-center mt-4">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {{ languageStore.t('previous') }}
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ languageStore.t('page') }} {{ currentPage }} {{ languageStore.t('of') }} {{ totalPages }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {{ languageStore.t('next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '../../../stores/payment'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()

const currentPage = ref(1)
const showParentRequests = ref(false)
let searchTimeout = null

const filters = ref({
  search: '',
  status: '',
  payment_method: ''
})

const payments = computed(() => paymentStore.payments)
const totalCount = computed(() => paymentStore.totalCount)
const isLoading = computed(() => paymentStore.isLoading)

const totalPages = computed(() => Math.ceil(totalCount.value / 20))

const pendingCount = computed(() => {
  return payments.value.filter(p => p.status === 'pending').length
})

const parentRequestCount = computed(() => {
  return payments.value.filter(p => p.created_by && p.status === 'pending').length
})

const displayPayments = computed(() => {
  let result = payments.value
  
  if (showParentRequests.value) {
    result = result.filter(p => p.created_by && p.status === 'pending')
  }
  
  return result
})

const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.status || 
         filters.value.payment_method ||
         showParentRequests.value
})

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    applyFilters()
  }, 500)
}

const clearSearch = () => {
  filters.value.search = ''
  applyFilters()
}

const toggleParentRequests = () => {
  showParentRequests.value = !showParentRequests.value
  currentPage.value = 1
  applyFilters()
}

const applyFilters = async () => {
  const filterParams = {}
  
  if (filters.value.search) filterParams.search = filters.value.search
  if (filters.value.status) filterParams.status = filters.value.status
  if (filters.value.payment_method) filterParams.payment_method = filters.value.payment_method
  if (showParentRequests.value) filterParams.is_parent_request = true
  
  await paymentStore.fetchPayments(currentPage.value, filterParams)
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    status: '',
    payment_method: ''
  }
  showParentRequests.value = false
  currentPage.value = 1
  applyFilters()
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString() || 0}`
}

const handlePageChange = async (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await applyFilters()
}

const handleEdit = (payment) => {
  router.push(`/admin/payments/${payment.id}`)
}

const handleDelete = async (payment) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await paymentStore.deletePayment(payment.id)
    if (result.success) {
      await applyFilters()
    } else {
      alert(result.error || languageStore.t('deleteFailed'))
    }
  }
}

const approvePayment = async (payment) => {
  if (confirm(languageStore.t('confirmApprovePayment'))) {
    const result = await paymentStore.approvePayment(payment.id, true)
    if (result.success) {
      await applyFilters()
    } else {
      alert(result.error || languageStore.t('approvalFailed'))
    }
  }
}

const rejectPayment = async (payment) => {
  if (confirm(languageStore.t('confirmRejectPayment'))) {
    const result = await paymentStore.approvePayment(payment.id, false)
    if (result.success) {
      await applyFilters()
    } else {
      alert(result.error || languageStore.t('rejectionFailed'))
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    approved: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    rejected: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    cancelled: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return map[status] || map.pending
}

// Watch for filter changes (except search which uses debounce)
watch(
  () => [filters.value.status, filters.value.payment_method],
  () => {
    currentPage.value = 1
    applyFilters()
  }
)

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

.card {
  transition: box-shadow 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  transition: background-color 0.2s;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  .btn-secondary {
    background-color: #374151;
    color: #d1d5db;
    border-color: #4b5563;
  }
  .btn-secondary:hover {
    background-color: #4b5563;
  }
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  gap: 0.25rem;
}

@media (prefers-color-scheme: dark) {
  .filter-badge {
    background-color: #374151;
    color: #d1d5db;
  }
}

.filter-badge button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0 0.25rem;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>