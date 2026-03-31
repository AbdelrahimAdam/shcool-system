<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ languageStore.t('globalAnalytics') }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('revenueOverTime') }}</h2>
        <RevenueChart :data="revenueData" />
      </div>

      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('schoolGrowth') }}</h2>
        <SchoolGrowthChart :data="schoolGrowthData" />
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('topSchools') }}</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('schoolName') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('students') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('teachers') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('revenue') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="school in topSchools" :key="school.id" class="border-t">
              <td class="px-4 py-2">{{ school.name }}</td>
              <td class="px-4 py-2 text-right">{{ school.students_count }}</td>
              <td class="px-4 py-2 text-right">{{ school.teachers_count }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(school.revenue) }}</td>
            </tr>
          </tbody>
        </table>
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
const revenueData = ref([])
const schoolGrowthData = ref([])
const topSchools = ref([])

const fetchData = async () => {
  // Revenue over time (monthly)
  const { data: payments } = await supabase
    .from('payments')
    .select('approved_at, amount')
    .eq('status', 'approved')
    .gte('approved_at', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString())
  // Aggregate by month
  const monthly = {}
  payments?.forEach(p => {
    const month = new Date(p.approved_at).toLocaleDateString('en', { year: 'numeric', month: 'short' })
    monthly[month] = (monthly[month] || 0) + p.amount
  })
  revenueData.value = Object.entries(monthly).map(([month, amount]) => ({ month, amount }))

  // School growth (count by month)
  const { data: schools } = await supabase
    .from('schools')
    .select('created_at')
    .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString())
  const monthlySchools = {}
  schools?.forEach(s => {
    const month = new Date(s.created_at).toLocaleDateString('en', { year: 'numeric', month: 'short' })
    monthlySchools[month] = (monthlySchools[month] || 0) + 1
  })
  schoolGrowthData.value = Object.entries(monthlySchools).map(([month, count]) => ({ month, count }))

  // Top schools by revenue
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
    students_count: s.students[0]?.count || 0,
    teachers_count: s.teachers[0]?.count || 0,
    revenue: (s.payments || []).reduce((sum, p) => sum + p.amount, 0)
  })).sort((a,b) => b.revenue - a.revenue) || []
}

const formatCurrency = (value) => `SDG ${value?.toLocaleString()}`

onMounted(() => {
  fetchData()
})
</script>