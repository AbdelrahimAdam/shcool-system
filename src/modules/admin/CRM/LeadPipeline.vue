<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('pipeline') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalLeads') }}: {{ totalLeads }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          @click="refreshPipeline" 
          class="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors text-gray-700 dark:text-gray-200"
        >
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ languageStore.t('refresh') }}
        </button>
        <router-link 
          to="/admin/crm/create" 
          class="btn-primary inline-flex items-center justify-center px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg"
        >
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ languageStore.t('addLead') }}
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <!-- Pipeline Board -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div 
        v-for="stage in stages" 
        :key="stage.key" 
        class="card bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden"
      >
        <!-- Stage Header -->
        <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span :class="getStageColor(stage.key)" class="w-2.5 h-2.5 rounded-full"></span>
              <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                {{ stage.label }}
              </h2>
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {{ stage.leads.length }}
            </span>
          </div>
        </div>

        <!-- Stage Cards -->
        <div class="p-2 sm:p-3 space-y-2 max-h-[500px] overflow-y-auto">
          <!-- Empty State -->
          <div v-if="!stage.leads.length" class="text-center py-6 sm:py-8 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {{ languageStore.t('noLeads') }}
          </div>

          <!-- Lead Cards -->
          <div
            v-for="lead in stage.leads"
            :key="lead.id"
            class="card bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition-all hover:border-primary-300 dark:hover:border-primary-600"
            @click="editLead(lead.id)"
          >
            <!-- Lead Header -->
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ lead.full_name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  {{ lead.phone || '-' }}
                </p>
              </div>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                {{ formatDate(lead.created_at) }}
              </span>
            </div>

            <!-- Student Name -->
            <p v-if="lead.student_name" class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 truncate">
              <span class="font-medium">{{ languageStore.t('student') }}:</span> {{ lead.student_name }}
            </p>

            <!-- Quick Actions -->
            <div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
              <!-- Call Button -->
              <a 
                v-if="lead.phone"
                :href="`tel:${lead.phone}`"
                class="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                @click.stop
                :title="languageStore.t('call')"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              
              <!-- WhatsApp Button -->
              <a 
                v-if="lead.phone"
                :href="`https://wa.me/${formatPhoneForWhatsApp(lead.phone)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                @click.stop
                :title="languageStore.t('whatsapp')"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
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

const router = useRouter()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

const isLoading = ref(false)
let realtimeSubscription = null
let refreshTimeout = null

// Filter leads by school_id (handled in store)
const leads = computed(() => crmStore.leads)

// Calculate total leads
const totalLeads = computed(() => leads.value.length)

// Define stages with labels and colors
const stages = computed(() => [
  { 
    key: 'new', 
    label: languageStore.t('new'), 
    leads: leads.value.filter(l => l.status === 'new'),
    color: 'bg-blue-500'
  },
  { 
    key: 'contacted', 
    label: languageStore.t('contacted'), 
    leads: leads.value.filter(l => l.status === 'contacted'),
    color: 'bg-yellow-500'
  },
  { 
    key: 'enrolled', 
    label: languageStore.t('enrolled'), 
    leads: leads.value.filter(l => l.status === 'enrolled'),
    color: 'bg-green-500'
  },
  { 
    key: 'lost', 
    label: languageStore.t('lost'), 
    leads: leads.value.filter(l => l.status === 'lost'),
    color: 'bg-red-500'
  }
])

// Get stage color for indicator dot
const getStageColor = (key) => {
  const map = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    enrolled: 'bg-green-500',
    lost: 'bg-red-500'
  }
  return map[key] || 'bg-gray-500'
}

const formatDate = (date) => {
  if (!date) return ''
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

const editLead = (id) => {
  router.push(`/admin/crm/${id}`)
}

const refreshPipeline = () => {
  isLoading.value = true
  crmStore.fetchLeads(crmStore.currentPage || 1, crmStore.filters || {})
    .finally(() => {
      isLoading.value = false
    })
}

const debouncedRefresh = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    refreshPipeline()
  }, 300)
}

onMounted(() => {
  refreshPipeline()
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
  width: 40px;
  height: 40px;
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

/* Stage cards scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
}

/* Card hover effects */
.card-hover {
  transition: all 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .overflow-y-auto {
    max-height: 300px !important;
  }
}
</style>