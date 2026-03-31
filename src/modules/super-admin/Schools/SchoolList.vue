<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('schools') }}</h1>
      <router-link to="/super-admin/schools/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addSchool') }}
      </router-link>
    </div>

    <DataTable
      :columns="columns"
      :data="schools"
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
          {{ row.status }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const schools = computed(() => schoolStore.schools)
const totalCount = computed(() => schoolStore.totalCount)
const isLoading = computed(() => schoolStore.isLoading)

const columns = [
  { key: 'name', label: 'schoolName', type: 'text' },
  { key: 'email', label: 'email', type: 'text' },
  { key: 'phone', label: 'phone', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'created_at', label: 'createdAt', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'pending', label: 'Pending' }
    ]
  }
]

const handleSearch = async (query) => {
  await schoolStore.fetchSchools(1, { search: query })
}

const handleFilter = async (filters) => {
  await schoolStore.fetchSchools(1, filters)
}

const handlePageChange = async (page) => {
  await schoolStore.fetchSchools(page, schoolStore.filters)
}

const handleEdit = (school) => {
  router.push(`/super-admin/schools/${school.id}`)
}

const handleDelete = async (school) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    // Implement delete in store if needed
  }
}

const getStatusClass = (status) => {
  const map = {
    active: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    suspended: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs',
    pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs'
  }
  return map[status] || ''
}

onMounted(() => {
  schoolStore.fetchSchools(1)
})
</script>