<template>
  <div class="p-3 sm:p-4 md:p-6">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
      <!-- Header -->
      <div class="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-base sm:text-xl font-bold flex-shrink-0">
              {{ parentInitials }}
            </div>
            <div>
              <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {{ languageStore.t('parentDetails') }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ parent?.full_name || languageStore.t('parent') }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <router-link
              to="/admin/parents"
              class="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link
              :to="`/admin/parents/${parent?.id}/edit`"
              class="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('loading') }}...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-12 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        <button @click="fetchParent" class="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="parent" class="p-3 sm:p-4 md:p-6">
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('status') }}</p>
            <span :class="getStatusClass(parent.status)" class="text-xs sm:text-sm font-medium inline-block mt-0.5">
              {{ languageStore.t(parent.status) }}
            </span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('relationship') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">{{ languageStore.t(parent.relationship) || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('children') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">{{ children.length }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('registeredOn') }}</p>
            <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">{{ formatDate(parent.created_at) }}</p>
          </div>
        </div>

        <!-- Main Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <!-- Personal Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ languageStore.t('personalInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('fullName') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white font-medium mt-0.5">{{ parent.full_name || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('email') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ parent.email || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('phone') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ parent.phone || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('address') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ parent.address || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Account Information -->
          <div class="space-y-3 sm:space-y-4">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {{ languageStore.t('accountInformation') }}
            </h2>

            <div class="space-y-2">
              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('relationship') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ languageStore.t(parent.relationship) || '-' }}</span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('status') }}</span>
                <span :class="getStatusClass(parent.status)" class="mt-0.5 inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium">
                  {{ languageStore.t(parent.status) }}
                </span>
              </div>

              <div class="flex flex-col">
                <span class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ languageStore.t('lastUpdated') }}</span>
                <span class="text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">{{ formatDate(parent.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3">{{ languageStore.t('quickActions') }}</h2>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <a 
              v-if="parent.phone"
              :href="`tel:${parent.phone}`"
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ languageStore.t('call') }}
            </a>
            <a 
              v-if="parent.phone"
              :href="`https://wa.me/${formatPhoneForWhatsApp(parent.phone)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {{ languageStore.t('whatsapp') }}
            </a>
            <router-link 
              :to="`/admin/parents/${parent.id}/edit`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2 sm:py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>

        <!-- Children Section -->
        <div v-if="children.length" class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {{ languageStore.t('children') }}
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ children.length }} {{ languageStore.t('students') }}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div v-for="child in children" :key="child.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{{ child.full_name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{{ languageStore.t('studentNumber') }}: {{ child.student_number || '-' }}</p>
                </div>
                <router-link 
                  :to="`/admin/students/${child.id}`" 
                  class="text-primary-600 dark:text-primary-400 text-xs sm:text-sm hover:underline flex items-center gap-1"
                >
                  {{ languageStore.t('view') }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const languageStore = useLanguageStore()

const parent = ref(null)
const children = ref([])
const loading = ref(true)
const error = ref('')

const parentInitials = computed(() => {
  if (!parent.value?.full_name) return '?'
  const parts = parent.value.full_name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

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

const fetchParent = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data, error: err } = await supabase
      .from('parents')
      .select('*')
      .eq('id', route.params.id)
      .single()
    if (err) throw err
    parent.value = data

    // Fetch children (students linked to this parent)
    const { data: students } = await supabase
      .from('students')
      .select('id, full_name, student_number')
      .eq('parent_id', route.params.id)
      .order('full_name')
    children.value = students || []
  } catch (err) {
    error.value = err.message || 'Failed to load parent'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

onMounted(() => {
  fetchParent()
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
  margin: 0 auto;
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
</style>