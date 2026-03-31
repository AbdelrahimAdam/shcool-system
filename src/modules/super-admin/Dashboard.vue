<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('superAdminDashboard') }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalSchools') }}</p>
            <p class="text-3xl font-bold">{{ stats.totalSchools }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalUsers') }}</p>
            <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalRevenue') }}</p>
            <p class="text-3xl font-bold">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('recentSchools') }}</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('schoolName') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('email') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('createdAt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="school in recentSchools" :key="school.id" class="border-t">
              <td class="px-4 py-2">{{ school.name }}</td>
              <td class="px-4 py-2">{{ school.email }}</td>
              <td class="px-4 py-2">
                <span :class="school.status === 'active' ? 'text-green-600' : 'text-red-600'">
                  {{ school.status }}
                </span>
              </td>
              <td class="px-4 py-2">{{ formatDate(school.created_at) }}</td>
            </tr>
            <tr v-if="recentSchools.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-500">{{ languageStore.t('noData') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const stats = ref({ totalSchools: 0, totalUsers: 0, totalRevenue: 0 })
const recentSchools = ref([])

const fetchStats = async () => {
  try {
    const { count: schoolsCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
    
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'approved')
    
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    stats.value = {
      totalSchools: schoolsCount || 0,
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

const formatCurrency = (value) => {
  return `SDG ${value?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchStats()
  fetchRecentSchools()
})
</script>