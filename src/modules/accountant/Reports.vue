<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Financial Reports</h1>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Revenue</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalRevenue) }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Pending Amount</p>
            <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(pendingAmount) }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Total Payments</p>
            <p class="text-2xl font-bold text-primary-600">{{ totalPayments }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Pending Approvals</p>
            <p class="text-2xl font-bold text-orange-600">{{ pendingCount }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Methods -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">Payment Methods</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span>Bankak</span>
            <span class="font-bold">{{ formatCurrency(bankakTotal) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" :style="{ width: bankakPercentage + '%' }"></div>
          </div>
          <div class="flex justify-between mt-3">
            <span>Cash</span>
            <span class="font-bold">{{ formatCurrency(cashTotal) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" :style="{ width: cashPercentage + '%' }"></div>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">Payment Status</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Approved</span>
            <span class="text-green-600">{{ formatCurrency(approvedAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Pending</span>
            <span class="text-yellow-600">{{ formatCurrency(pendingAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Rejected</span>
            <span class="text-red-600">{{ formatCurrency(rejectedAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Monthly Revenue -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">Monthly Revenue</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Month</th>
              <th class="px-4 py-2 text-right">Revenue</th>
              <th class="px-4 py-2 text-right">Bankak</th>
              <th class="px-4 py-2 text-right">Cash</th>
              <th class="px-4 py-2 text-right">Transactions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="month in monthlyRevenue" :key="month.month" class="border-t">
              <td class="px-4 py-2">{{ month.month }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(month.total) }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(month.bankak) }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(month.cash) }}</td>
              <td class="px-4 py-2 text-right">{{ month.count }}</td>
            </tr>
            <tr v-if="monthlyRevenue.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-500">No payment data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const payments = ref([])

const totalRevenue = ref(0)
const pendingAmount = ref(0)
const approvedAmount = ref(0)
const rejectedAmount = ref(0)
const totalPayments = ref(0)
const pendingCount = ref(0)
const bankakTotal = ref(0)
const cashTotal = ref(0)
const monthlyRevenue = ref([])

const bankakPercentage = computed(() => {
  const total = bankakTotal.value + cashTotal.value
  return total > 0 ? (bankakTotal.value / total) * 100 : 0
})

const cashPercentage = computed(() => {
  const total = bankakTotal.value + cashTotal.value
  return total > 0 ? (cashTotal.value / total) * 100 : 0
})

const fetchData = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  
  const { data } = await supabase
    .from('payments')
    .select('amount, status, payment_method, created_at')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
  
  if (!data) return
  
  payments.value = data
  
  // Calculate totals
  const approved = data.filter(p => p.status === 'approved')
  const pending = data.filter(p => p.status === 'pending')
  const rejected = data.filter(p => p.status === 'rejected')
  
  totalRevenue.value = approved.reduce((sum, p) => sum + p.amount, 0)
  pendingAmount.value = pending.reduce((sum, p) => sum + p.amount, 0)
  approvedAmount.value = totalRevenue.value
  rejectedAmount.value = rejected.reduce((sum, p) => sum + p.amount, 0)
  totalPayments.value = approved.length
  pendingCount.value = pending.length
  
  // Payment methods
  bankakTotal.value = approved.filter(p => p.payment_method === 'bankak').reduce((sum, p) => sum + p.amount, 0)
  cashTotal.value = approved.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0)
  
  // Monthly breakdown
  const monthly = {}
  approved.forEach(p => {
    const month = new Date(p.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
    if (!monthly[month]) {
      monthly[month] = { total: 0, bankak: 0, cash: 0, count: 0 }
    }
    monthly[month].total += p.amount
    monthly[month].count++
    if (p.payment_method === 'bankak') {
      monthly[month].bankak += p.amount
    } else {
      monthly[month].cash += p.amount
    }
  })
  
  monthlyRevenue.value = Object.entries(monthly).map(([month, data]) => ({
    month,
    ...data
  })).reverse()
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

onMounted(() => {
  fetchData()
})
</script>