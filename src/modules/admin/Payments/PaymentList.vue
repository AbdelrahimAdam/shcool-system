<template>
  <div class="space-y-6 px-4 sm:px-0">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {{ languageStore.t('payments') }}
      </h1>
      <router-link 
        to="/admin/payments/create" 
        class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addPayment') }}
      </router-link>
    </div>

    <div class="overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="payments"
        :total="totalCount"
        :loading="isLoading"
        :filter-options="filterOptions"
        table-class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        header-class="bg-gray-50 dark:bg-gray-800"
        row-class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        cell-class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200"
        @search="handleSearch"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom slot for status badge (dark mode compatible) -->
        <template #column-status="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ languageStore.t(row.status) }}
          </span>
        </template>

        <!-- Custom slot for amount formatting -->
        <template #column-amount="{ row }">
          {{ formatCurrency(row.amount) }}
        </template>

        <!-- Custom slot for student name (extract from object) -->
        <template #column-student="{ row }">
          {{ row.student?.full_name || '-' }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '../../../stores/payment'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()

const payments = computed(() => paymentStore.payments)
const totalCount = computed(() => paymentStore.totalCount)
const isLoading = computed(() => paymentStore.isLoading)

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

const handleSearch = async (query) => {
  await paymentStore.fetchPayments(1, { ...paymentStore.filters, search: query })
}

const handleFilter = async (filters) => {
  await paymentStore.fetchPayments(1, { ...paymentStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  await paymentStore.fetchPayments(page, paymentStore.filters)
}

const handleEdit = (payment) => {
  router.push(`/admin/payments/${payment.id}`)
}

const handleDelete = async (payment) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    // Implement delete in store if needed
    const result = await paymentStore.deletePayment(payment.id)
    if (result.success) {
      await paymentStore.fetchPayments(1, paymentStore.filters)
    } else {
      alert(result.error)
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium',
    approved: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium',
    rejected: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium',
    cancelled: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium'
}

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString()}`
}

onMounted(() => {
  paymentStore.fetchPayments(1)
})
</script>