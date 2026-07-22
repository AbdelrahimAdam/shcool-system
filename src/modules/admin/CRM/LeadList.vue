<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('leads') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalLeads') }}: {{ totalCount }}
        </p>
      </div>
      <router-link to="/admin/crm/create" class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addLead') }}
      </router-link>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="leads"
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
      <!-- Loading State -->
      <div v-if="isLoading && leads.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="leads.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noLeadsFound') }}
      </div>

      <!-- Lead Cards -->
      <div 
        v-for="lead in leads" 
        :key="lead.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- Lead Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ lead.full_name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ lead.phone || '-' }}
            </p>
          </div>
          <span :class="getStatusClass(lead.status)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(lead.status) }}
          </span>
        </div>

        <!-- Lead Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('studentName') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ lead.student_name || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('date') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(lead.created_at) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="handleEdit(lead)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>
          
          <!-- Call Button -->
          <a 
            v-if="lead.phone"
            :href="`tel:${lead.phone}`"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ languageStore.t('call') }}
          </a>
          
          <!-- WhatsApp Button -->
          <a 
            v-if="lead.phone"
            :href="`https://wa.me/${formatPhoneForWhatsApp(lead.phone)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <svg class="w-3.5 h-3.5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {{ languageStore.t('whatsapp') }}
          </a>
          
          <button 
            @click="handleDelete(lead)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('delete') }}
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

const currentPage = ref(1)
const currentFilters = ref({})
const totalPages = computed(() => Math.ceil(totalCount.value / 10))

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

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatPhoneForWhatsApp = (phone) => {
  // Remove any non-numeric characters
  let cleaned = phone.replace(/\D/g, '')
  // Remove leading zero if present (for international format)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  // Add country code if not present (default to 966 for Saudi Arabia, adjust as needed)
  if (!cleaned.startsWith('966') && !cleaned.startsWith('971') && !cleaned.startsWith('20')) {
    cleaned = '966' + cleaned
  }
  return cleaned
}

const refreshList = () => {
  crmStore.fetchLeads(currentPage.value, currentFilters.value)
}

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
      await refreshList()
    } else {
      alert(result.error || languageStore.t('deleteFailed'))
    }
  }
}

const getStatusClass = (status) => {
  const map = {
    new: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    contacted: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    enrolled: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    lost: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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