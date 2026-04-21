<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('leads') }}</h1>
      <router-link to="/admin/crm/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addLead') }}
      </router-link>
    </div>

    <!-- Skeleton loading state -->
    <div v-if="isLoading && leads.length === 0" class="space-y-4">
      <div class="flex gap-4 mb-4">
        <div class="h-10 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
        <div class="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
      </div>
      <div class="space-y-2">
        <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :columns="columns"
      :data="leads"
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
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useCRMStore } from '../../../stores/crm'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

const leads = computed(() => crmStore.leads)
const totalCount = computed(() => crmStore.totalCount)
const isLoading = computed(() => crmStore.isLoading)

// Store current page and filters to preserve them on refresh
const currentPage = ref(1)
const currentFilters = ref({})

const columns = [
  { key: 'full_name', label: 'fullName', type: 'text' },
  { key: 'phone', label: 'phone', type: 'text' },
  { key: 'student_name', label: 'studentName', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'created_at', label: 'date', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'new', label: 'New' },
      { value: 'contacted', label: 'Contacted' },
      { value: 'enrolled', label: 'Enrolled' },
      { value: 'lost', label: 'Lost' }
    ]
  }
]

let realtimeSubscription = null
let refreshTimeout = null
let fetched = false

// Refresh the list preserving current page and filters
const refreshList = () => {
  crmStore.fetchLeads(currentPage.value, currentFilters.value)
}

// Debounced real‑time refresh (prevents excessive calls)
const debouncedRefresh = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    refreshList()
  }, 300)
}

const handleSearch = async (query) => {
  currentFilters.value = { ...currentFilters.value, search: query }
  currentPage.value = 1
  await crmStore.fetchLeads(1, currentFilters.value)
}

const handleFilter = async (filters) => {
  currentFilters.value = { ...currentFilters.value, ...filters }
  currentPage.value = 1
  await crmStore.fetchLeads(1, currentFilters.value)
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await crmStore.fetchLeads(page, currentFilters.value)
}

const handleEdit = (lead) => {
  router.push(`/admin/crm/${lead.id}`)
}

const handleDelete = async (lead) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await crmStore.deleteLead(lead.id)
    if (result.success) {
      // After delete, refresh the list on the same page
      await refreshList()
    } else {
      alert(result.error || languageStore.t('deleteFailed'))
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    new: 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs',
    contacted: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    enrolled: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    lost: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
  }
  return map[status] || ''
}

onMounted(() => {
  if (!fetched) {
    crmStore.fetchLeads(1)
    fetched = true
  }
  realtimeSubscription = crmStore.subscribeToLeadChanges(() => {
    debouncedRefresh()
  })
})

onUnmounted(() => {
  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription)
  }
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
})
</script>