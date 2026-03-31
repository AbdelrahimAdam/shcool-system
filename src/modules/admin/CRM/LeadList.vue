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

    <DataTable
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCRMStore } from '../../../stores/crm'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

const leads = computed(() => crmStore.leads)
const totalCount = computed(() => crmStore.totalCount)
const isLoading = computed(() => crmStore.isLoading)

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

const handleSearch = async (query) => {
  await crmStore.fetchLeads(1, { ...crmStore.filters, search: query })
}

const handleFilter = async (filters) => {
  await crmStore.fetchLeads(1, { ...crmStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  await crmStore.fetchLeads(page, crmStore.filters)
}

const handleEdit = (lead) => {
  router.push(`/admin/crm/${lead.id}`)
}

const handleDelete = async (lead) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    // Implement delete in store if needed
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
  crmStore.fetchLeads(1)
})
</script>