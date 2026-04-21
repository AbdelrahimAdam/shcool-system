<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('parents') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('manageParentAccounts') }}</p>
      </div>
      <router-link to="/admin/parents/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addParent') }}
      </router-link>
    </div>

    <DataTable
      :columns="columns"
      :data="parents"
      :total="totalCount"
      :loading="isLoading"
      :filter-options="filterOptions"
      @search="handleSearch"
      @filter="handleFilter"
      @page-change="handlePageChange"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <!-- Custom slot for status column (badge styling) -->
      <template #column-status="{ row }">
        <span :class="getStatusClass(row.status)">
          {{ languageStore.t(row.status) }}
        </span>
      </template>

      <!-- Custom slot for actions (extra approve/reject buttons) -->
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <button
            v-if="row.status === 'pending'"
            @click="approveParent(row)"
            class="text-green-600 hover:text-green-700 px-2 py-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-sm"
          >
            {{ languageStore.t('approve') }}
          </button>
          <button
            v-if="row.status === 'pending'"
            @click="rejectParent(row)"
            class="text-red-600 hover:text-red-700 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm"
          >
            {{ languageStore.t('reject') }}
          </button>
          <button
            @click="handleEdit(row)"
            class="text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors text-sm"
          >
            {{ languageStore.t('edit') }}
          </button>
          <button
            @click="handleDelete(row)"
            class="text-red-600 hover:text-red-700 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm"
          >
            {{ languageStore.t('delete') }}
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Approve Parent Modal (optional confirmation) -->
    <div v-if="showApproveModal" class="modal-overlay" @click.self="closeApproveModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-lg font-semibold">{{ languageStore.t('approveParentRegistration') }}</h3>
        </div>
        <div class="modal-body space-y-4">
          <p>{{ languageStore.t('confirmApproveParent') }} <strong>{{ selectedParent?.full_name }}</strong>?</p>
          <div class="bg-green-50 p-3 rounded-lg">
            <p class="text-sm text-green-800">{{ languageStore.t('approveParentNote') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeApproveModal" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
          <button @click="confirmApprove" :disabled="isProcessing" class="btn-primary">
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

// State
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

// Columns for DataTable
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

// Helper: fetch parents for the current school
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

// Refresh list (preserve page & filters)
const refreshList = () => {
  fetchParents(currentPage.value, currentFilters.value)
}

// Debounced real‑time refresh
const debouncedRefresh = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    refreshList()
  }, 300)
}

// Event handlers for DataTable
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

// Approve / Reject logic
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
    // Update parent status to active
    const { error: parentError } = await supabase
      .from('parents')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', selectedParent.value.id)
    if (parentError) throw parentError

    // Also update the corresponding user record (if exists) to set school_id
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

// Real‑time subscription
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
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
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
/* Modal styles (same as admin dashboard) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  max-width: 28rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.btn-secondary {
  background-color: white;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
}
</style>