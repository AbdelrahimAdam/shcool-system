<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('schools') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalSchools') }}: {{ totalCount }}
        </p>
      </div>
      <router-link to="/super-admin/schools/create" class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addSchool') }}
      </router-link>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="schools"
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
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <!-- Mobile Search & Filter -->
      <div class="flex flex-col gap-2">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="languageStore.t('searchSchools')"
            class="form-input w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select 
          v-model="statusFilter" 
          class="form-select w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          @change="applyFilter"
        >
          <option value="">{{ languageStore.t('allStatus') }}</option>
          <option value="active">{{ languageStore.t('active') }}</option>
          <option value="suspended">{{ languageStore.t('suspended') }}</option>
          <option value="pending">{{ languageStore.t('pending') }}</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && schools.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="schools.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noSchoolsFound') }}
      </div>

      <!-- School Cards -->
      <div 
        v-for="school in schools" 
        :key="school.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- School Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ school.name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ school.email || '-' }}
            </p>
          </div>
          <span :class="getStatusClass(school.status)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(school.status) }}
          </span>
        </div>

        <!-- School Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('phone') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ school.phone || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('createdAt') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(school.created_at) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="handleEdit(school)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>
          <button 
            @click="handleDelete(school)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('delete') }}
          </button>
          <router-link 
            :to="`/super-admin/schools/${school.id}`"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            {{ languageStore.t('view') }}
          </router-link>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalCount.value / 10))
const searchQuery = ref('')
const statusFilter = ref('')
let searchTimeout = null

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

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const handleSearch = async (query) => {
  currentPage.value = 1
  await schoolStore.fetchSchools(1, { ...schoolStore.filters, search: query })
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch(searchQuery.value)
  }, 300)
}

const handleFilter = async (filters) => {
  currentPage.value = 1
  await schoolStore.fetchSchools(1, { ...schoolStore.filters, ...filters })
}

const applyFilter = () => {
  const filters = {}
  if (statusFilter.value) filters.status = statusFilter.value
  handleFilter(filters)
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await schoolStore.fetchSchools(page, schoolStore.filters)
}

const handleEdit = (school) => {
  router.push(`/super-admin/schools/${school.id}`)
}

const handleDelete = async (school) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await schoolStore.deleteSchool(school.id)
    if (result.success) {
      await schoolStore.fetchSchools(currentPage.value, schoolStore.filters)
    } else {
      alert(result.error || languageStore.t('deleteFailed'))
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    suspended: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

onMounted(() => {
  schoolStore.fetchSchools(1)
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
</style>