<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('parents') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalParents') }}: {{ totalCount }}
        </p>
      </div>
      <router-link to="/admin/parents/create" class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addParent') }}
      </router-link>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="parents"
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

        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1 sm:gap-2">
            <button
              v-if="row.status === 'pending'"
              @click="approveParent(row)"
              class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
            >
              {{ languageStore.t('approve') }}
            </button>
            <button
              v-if="row.status === 'pending'"
              @click="rejectParent(row)"
              class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
            >
              {{ languageStore.t('reject') }}
            </button>
            <button
              @click="handleEdit(row)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
            >
              {{ languageStore.t('edit') }}
            </button>
            <button
              @click="handleDelete(row)"
              class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
            >
              {{ languageStore.t('delete') }}
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading && parents.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="parents.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noParentsFound') }}
      </div>

      <!-- Parent Cards -->
      <div 
        v-for="parent in parents" 
        :key="parent.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- Parent Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ parent.full_name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ parent.email || '-' }}
            </p>
          </div>
          <span :class="getStatusClass(parent.status)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(parent.status) }}
          </span>
        </div>

        <!-- Parent Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('phone') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ parent.phone || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('registrationDate') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(parent.created_at) }}
            </span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <!-- Approve Button (for pending) -->
          <button
            v-if="parent.status === 'pending'"
            @click="approveParent(parent)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            {{ languageStore.t('approve') }}
          </button>
          
          <!-- Reject Button (for pending) -->
          <button
            v-if="parent.status === 'pending'"
            @click="rejectParent(parent)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('reject') }}
          </button>

          <!-- Call Button -->
          <a 
            v-if="parent.phone"
            :href="`tel:${parent.phone}`"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ languageStore.t('call') }}
          </a>
          
          <!-- WhatsApp Button -->
          <a 
            v-if="parent.phone"
            :href="`https://wa.me/${formatPhoneForWhatsApp(parent.phone)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <svg class="w-3.5 h-3.5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {{ languageStore.t('whatsapp') }}
          </a>

          <!-- Edit Button -->
          <button
            @click="handleEdit(parent)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>

          <!-- Delete Button -->
          <button
            @click="handleDelete(parent)"
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

    <!-- Approve Parent Modal (Mobile Optimized) -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4" @click.self="closeApproveModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {{ languageStore.t('approveParentRegistration') }}
          </h3>
        </div>

        <!-- Body -->
        <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {{ languageStore.t('confirmApproveParent') }} 
            <strong class="text-gray-900 dark:text-white">{{ selectedParent?.full_name }}</strong>?
          </p>
          <div class="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
            <p class="text-xs sm:text-sm text-green-800 dark:text-green-300">
              {{ languageStore.t('approveParentNote') }}
            </p>
          </div>
          <div v-if="selectedParent?.email" class="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ languageStore.t('email') }}: {{ selectedParent.email }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button @click="closeApproveModal" class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1">
            {{ languageStore.t('cancel') }}
          </button>
          <button @click="confirmApprove" :disabled="isProcessing" class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center">
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? languageStore.t('processing') : languageStore.t('approve') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import DataTable from '@/components/common/DataTable.vue'

const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const parents = ref([])
const totalCount = ref(0)
const isLoading = ref(false)
const currentPage = ref(1)
const currentFilters = ref({})
const showApproveModal = ref(false)
const selectedParent = ref(null)
const isProcessing = ref(false)

let realtimeSubscription = null
let refreshTimeout = null

const totalPages = computed(() => Math.ceil(totalCount.value / 10))

const columns = [
  { key: 'full_name', label: 'fullName', type: 'text' },
  { key: 'email', label: 'email', type: 'text' },
  { key: 'phone', label: 'phone', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'created_at', label: 'registrationDate', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'active', label: 'Active' }
    ]
  }
]

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatPhoneForWhatsApp = (phone) => {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  if (!cleaned.startsWith('966') && !cleaned.startsWith('971') && !cleaned.startsWith('20')) {
    cleaned = '966' + cleaned
  }
  return cleaned
}

const fetchParents = async (page = 1, filters = {}) => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return

  isLoading.value = true
  try {
    let query = supabase
      .from('parents')
      .select('*', { count: 'exact' })
      .eq('school_id', schoolId)
      .range((page - 1) * 20, page * 20 - 1)
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query
    if (error) throw error

    parents.value = data || []
    totalCount.value = count || 0
    currentFilters.value = filters
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching parents:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshList = () => {
  fetchParents(currentPage.value, currentFilters.value)
}

const debouncedRefresh = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    refreshList()
  }, 300)
}

const handleSearch = (query) => {
  fetchParents(1, { ...currentFilters.value, search: query })
}

const handleFilter = (filters) => {
  fetchParents(1, { ...currentFilters.value, ...filters })
}

const handlePageChange = (page) => {
  fetchParents(page, currentFilters.value)
}

const handleEdit = (parent) => {
  router.push(`/admin/parents/${parent.id}`)
}

const handleDelete = async (parent) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('id', parent.id)
    if (!error) {
      refreshList()
    } else {
      alert(error.message)
    }
  }
}

const approveParent = (parent) => {
  selectedParent.value = parent
  showApproveModal.value = true
}

const rejectParent = async (parent) => {
  if (confirm(languageStore.t('confirmReject'))) {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('id', parent.id)
    if (!error) {
      refreshList()
    } else {
      alert(error.message)
    }
  }
}

const confirmApprove = async () => {
  if (!selectedParent.value) return
  isProcessing.value = true
  const schoolId = authStore.profile?.school_id
  try {
    const { error: parentError } = await supabase
      .from('parents')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', selectedParent.value.id)
    if (parentError) throw parentError

    if (selectedParent.value.user_id) {
      await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', selectedParent.value.user_id)
    }

    alert(languageStore.t('parentApprovedSuccessfully'))
    closeApproveModal()
    refreshList()
  } catch (error) {
    console.error('Approve error:', error)
    alert(error.message)
  } finally {
    isProcessing.value = false
  }
}

const closeApproveModal = () => {
  showApproveModal.value = false
  selectedParent.value = null
}

const subscribeToParents = () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return

  realtimeSubscription = supabase
    .channel('admin-parents')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'parents', filter: `school_id=eq.${schoolId}` },
      () => debouncedRefresh()
    )
    .subscribe()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return classes[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

onMounted(() => {
  fetchParents(1)
  subscribeToParents()
})

onUnmounted(() => {
  if (realtimeSubscription) supabase.removeChannel(realtimeSubscription)
  if (refreshTimeout) clearTimeout(refreshTimeout)
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

/* Mobile button order */
@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}
</style>