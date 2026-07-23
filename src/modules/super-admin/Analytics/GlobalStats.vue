<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('globalAnalytics') }}
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
    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalSchools') }}</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalSchools }}</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 sm:p-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalStudents') }}</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalStudents }}</p>
          </div>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 sm:p-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalTeachers') }}</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTeachers }}</p>
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1.5 sm:p-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('totalRevenue') }}</p>
            <p class="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
          <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-1.5 sm:p-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('revenueOverTime') }}</h2>
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('last12Months') }}</span>
        </div>
        <div class="h-48 sm:h-56 md:h-64">
          <RevenueChart :data="revenueData" />
        </div>
      </div>

      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('schoolGrowth') }}</h2>
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('last12Months') }}</span>
        </div>
        <div class="h-48 sm:h-56 md:h-64">
          <SchoolGrowthChart :data="schoolGrowthData" />
        </div>
      </div>
    </div>

    <!-- Top Schools Table -->
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('topSchools') }}</h2>
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('byRevenue') }}</span>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">#</th>
              <th class="px-3 py-2 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('schoolName') }}</th>
              <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('students') }}</th>
              <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('teachers') }}</th>
              <th class="px-3 py-2 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('revenue') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(school, index) in topSchools" :key="school.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-3 py-2 sm:px-4 font-medium text-gray-900 dark:text-white">{{ index + 1 }}</td>
              <td class="px-3 py-2 sm:px-4 font-medium text-gray-900 dark:text-white">{{ school.name }}</td>
              <td class="px-3 py-2 sm:px-4 text-right text-gray-600 dark:text-gray-300">{{ school.students_count }}</td>
              <td class="px-3 py-2 sm:px-4 text-right text-gray-600 dark:text-gray-300">{{ school.teachers_count }}</td>
              <td class="px-3 py-2 sm:px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(school.revenue) }}</td>
            </tr>
            <tr v-if="topSchools.length === 0">
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
          v-for="(school, index) in topSchools" 
          :key="school.id" 
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 w-5">{{ index + 1 }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ school.name }}</span>
            </div>
            <span class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(school.revenue) }}</span>
          </div>
          <div class="flex gap-4 mt-1.5 text-xs">
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('students') }}: <span class="font-medium text-gray-700 dark:text-gray-300">{{ school.students_count }}</span></span>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('teachers') }}: <span class="font-medium text-gray-700 dark:text-gray-300">{{ school.teachers_count }}</span></span>
          </div>
        </div>
        <div v-if="topSchools.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noSchoolsFound') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../services/supabase'
import { useLanguageStore } from '../../../stores/language'
import RevenueChart from '../../../components/charts/RevenueChart.vue'
import SchoolGrowthChart from '../../../components/charts/SchoolGrowthChart.vue'

const languageStore = useLanguageStore()
const isLoading = ref(false)
const revenueData = ref([])
const schoolGrowthData = ref([])
const topSchools = ref([])
const stats = ref({
  totalSchools: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalRevenue: 0
})

const fetchData = async () => {
  isLoading.value = true
  try {
    // ====== STATS ======
    // Total Schools
    const { count: schoolsCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
    stats.value.totalSchools = schoolsCount || 0

    // Total Students (across all schools)
    const { count: studentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    stats.value.totalStudents = studentsCount || 0

    // Total Teachers (across all schools)
    const { count: teachersCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    stats.value.totalTeachers = teachersCount || 0

    // Total Revenue
    const { data: revenueDataTotal } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'approved')
    stats.value.totalRevenue = revenueDataTotal?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // ====== REVENUE OVER TIME ======
    const { data: payments } = await supabase
      .from('payments')
      .select('approved_at, amount')
      .eq('status', 'approved')
      .gte('approved_at', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString())
      .order('approved_at', { ascending: true })

    const monthly = {}
    payments?.forEach(p => {
      if (p.approved_at) {
        const month = new Date(p.approved_at).toLocaleDateString('en', { year: 'numeric', month: 'short' })
        monthly[month] = (monthly[month] || 0) + (p.amount || 0)
      }
    })

    // Sort months chronologically
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const sortedMonths = Object.keys(monthly).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ')
      const [bMonth, bYear] = b.split(' ')
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear)
      return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth)
    })
    revenueData.value = sortedMonths.map(month => ({
      month,
      amount: monthly[month]
    }))

    // ====== SCHOOL GROWTH ======
    const { data: schools } = await supabase
      .from('schools')
      .select('created_at')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString())
      .order('created_at', { ascending: true })

    const monthlySchools = {}
    schools?.forEach(s => {
      if (s.created_at) {
        const month = new Date(s.created_at).toLocaleDateString('en', { year: 'numeric', month: 'short' })
        monthlySchools[month] = (monthlySchools[month] || 0) + 1
      }
    })

    const sortedSchoolMonths = Object.keys(monthlySchools).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ')
      const [bMonth, bYear] = b.split(' ')
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear)
      return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth)
    })

    // Cumulative growth
    let cumulative = 0
    schoolGrowthData.value = sortedSchoolMonths.map(month => {
      cumulative += monthlySchools[month] || 0
      return { month, count: cumulative }
    })

    // ====== TOP SCHOOLS ======
    const { data: top } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        students:students(count),
        teachers:teachers(count),
        payments:payments(amount)
      `)
      .eq('payments.status', 'approved')
      .limit(10)

    topSchools.value = top?.map(s => ({
      ...s,
      students_count: s.students?.[0]?.count || 0,
      teachers_count: s.teachers?.[0]?.count || 0,
      revenue: (s.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
    })).sort((a, b) => b.revenue - a.revenue) || []
  } catch (error) {
    console.error('Error fetching analytics:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

const formatCurrency = (value) => `SDG ${value?.toLocaleString() || 0}`

onMounted(() => {
  fetchData()
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
</style>