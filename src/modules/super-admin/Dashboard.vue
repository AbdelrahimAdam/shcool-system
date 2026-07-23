<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('superAdminDashboard') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('overviewOfAllSchools') }}
        </p>
      </div>
      <button 
        @click="refreshData" 
        class="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors text-gray-700 dark:text-gray-200"
      >
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ languageStore.t('refresh') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalSchools') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalSchools }}</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 sm:p-2 md:p-2.5">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalUsers') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
          </div>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 sm:p-2 md:p-2.5">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalRevenue') }}</p>
            <p class="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
          <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-1.5 sm:p-2 md:p-2.5">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('activeSchools') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.activeSchools }}</p>
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1.5 sm:p-2 md:p-2.5">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Schools -->
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ languageStore.t('recentSchools') }}
          </h2>
          <router-link to="/super-admin/schools" class="text-primary-600 dark:text-primary-400 hover:underline text-xs sm:text-sm">
            {{ languageStore.t('viewAll') }} →
          </router-link>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">#</th>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('schoolName') }}</th>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('email') }}</th>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('status') }}</th>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('createdAt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(school, index) in recentSchools" :key="school.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-3 py-2 sm:px-4 font-medium text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
              <td class="px-3 py-2 sm:px-4 font-medium text-gray-900 dark:text-white">{{ school.name }}</td>
              <td class="px-3 py-2 sm:px-4 text-gray-600 dark:text-gray-300">{{ school.email || '-' }}</td>
              <td class="px-3 py-2 sm:px-4">
                <span :class="getStatusClass(school.status)" class="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                  {{ languageStore.t(school.status) }}
                </span>
              </td>
              <td class="px-3 py-2 sm:px-4 text-gray-600 dark:text-gray-300">{{ formatDate(school.created_at) }}</td>
            </tr>
            <tr v-if="recentSchools.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-500 dark:text-gray-400">
                {{ languageStore.t('noSchoolsFound') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="sm:hidden space-y-3 p-3">
        <div 
          v-for="(school, index) in recentSchools" 
          :key="school.id" 
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-400 dark:text-gray-500">{{ index + 1 }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ school.name }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ school.email || '-' }}</p>
            </div>
            <span :class="getStatusClass(school.status)" class="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium">
              {{ languageStore.t(school.status) }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ languageStore.t('createdAt') }}: {{ formatDate(school.created_at) }}
          </div>
        </div>
        <div v-if="recentSchools.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noSchoolsFound') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const isLoading = ref(false)
const stats = ref({ 
  totalSchools: 0, 
  totalUsers: 0, 
  totalRevenue: 0,
  activeSchools: 0 
})
const recentSchools = ref([])

const fetchStats = async () => {
  try {
    // Total Schools
    const { count: schoolsCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
    
    // Active Schools
    const { count: activeSchoolsCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    // Total Users
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    // Total Revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'approved')
    
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    stats.value = {
      totalSchools: schoolsCount || 0,
      activeSchools: activeSchoolsCount || 0,
      totalUsers: usersCount || 0,
      totalRevenue
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchRecentSchools = async () => {
  try {
    const { data } = await supabase
      .from('schools')
      .select('id, name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    recentSchools.value = data || []
  } catch (error) {
    console.error('Error fetching schools:', error)
  }
}

const refreshData = async () => {
  isLoading.value = true
  await Promise.all([fetchStats(), fetchRecentSchools()])
  isLoading.value = false
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  refreshData()
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

.card {
  transition: box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-1px);
}
</style>