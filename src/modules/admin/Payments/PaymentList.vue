<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('payments') }}</h1>
      <router-link to="/admin/payments/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addPayment') }}
      </router-link>
    </div>

    <DataTable
      :columns="columns"
      :data="payments"
      :total="totalCount"
      :loading="isLoading"
      :filter-options="filterOptions"
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
        {{ formatCurrency(row.amount) }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    approved: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs',
    cancelled: 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
  }
  return map[status] || ''
}

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString()}`
}

onMounted(() => {
  paymentStore.fetchPayments(1)
})
</script>