<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Accountant Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">Pending Approvals</p>
            <p class="text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
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
            <p class="text-gray-500 text-sm">Total Revenue</p>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(totalRevenue) }}</p>
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
            <p class="text-gray-500 text-sm">Total Payments</p>
            <p class="text-3xl font-bold text-primary-600">{{ totalPayments }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Pending Payments</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Payment #</th>
              <th class="px-4 py-2 text-left">Student</th>
              <th class="px-4 py-2 text-right">Amount</th>
              <th class="px-4 py-2 text-left">Method</th>
              <th class="px-4 py-2 text-left">Due Date</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in recentPending" :key="payment.id" class="border-t">
              <td class="px-4 py-2 font-mono">{{ payment.payment_number }}</td>
              <td class="px-4 py-2">{{ payment.student?.full_name }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-4 py-2">{{ payment.payment_method }}</td>
              <td class="px-4 py-2">{{ formatDate(payment.due_date) }}</td>
              <td class="px-4 py-2 text-center">
                <router-link to="/accountant/payments" class="text-primary-600 hover:text-primary-800">
                  View All
                </router-link>
              </td>
            </tr>
            <tr v-if="recentPending.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">No pending payments</td>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const pendingCount = ref(0)
const totalRevenue = ref(0)
const totalPayments = ref(0)
const recentPending = ref([])

const fetchData = async () => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) return
  
  // Get pending payments count
  const { count: pending } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'pending')
  pendingCount.value = pending || 0
  
  // Get approved payments for revenue
  const { data: approved } = await supabase
    .from('payments')
    .select('amount')
    .eq('school_id', schoolId)
    .eq('status', 'approved')
  totalRevenue.value = approved?.reduce((sum, p) => sum + p.amount, 0) || 0
  totalPayments.value = approved?.length || 0
  
  // Get recent pending payments
  const { data: recent } = await supabase
    .from('payments')
    .select('*, student:students(full_name)')
    .eq('school_id', schoolId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)
  recentPending.value = recent || []
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchData()
})
</script>