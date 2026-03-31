<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payment Approvals</h1>
        <p class="text-sm text-gray-500 mt-1">Review and approve pending payments</p>
      </div>
      <span class="badge-warning px-3 py-1">{{ pendingCount }} Pending</span>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">Payment #</th>
              <th class="px-4 py-3 text-left">Student</th>
              <th class="px-4 py-3 text-right">Amount</th>
              <th class="px-4 py-3 text-left">Method</th>
              <th class="px-4 py-3 text-left">Bankak #</th>
              <th class="px-4 py-3 text-left">Proof</th>
              <th class="px-4 py-3 text-left">Due Date</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-sm">{{ payment.payment_number }}</td>
              <td class="px-4 py-3">
                <div class="font-medium">{{ payment.student?.full_name }}</div>
                <div class="text-xs text-gray-500">{{ payment.student?.student_number }}</div>
              </td>
              <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-4 py-3">
                <span class="badge-neutral">{{ payment.payment_method }}</span>
              </td>
              <td class="px-4 py-3">{{ payment.bankak_number || '-' }}</td>
              <td class="px-4 py-3">
                <a v-if="payment.proof_image_url" :href="payment.proof_image_url" target="_blank" class="text-primary-600 hover:text-primary-800">
                  View
                </a>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-3">{{ formatDate(payment.due_date) }}</td>
              <td class="px-4 py-3 text-center">
                <button 
                  @click="approvePayment(payment.id)" 
                  class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2 text-sm"
                >
                  Approve
                </button>
                <button 
                  @click="rejectPayment(payment.id)" 
                  class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                >
                  Reject
                </button>
              </td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">No pending payments to approve</td>
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

const pendingCount = computed(() => payments.value.length)

const fetchPayments = async () => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) return
  
  const { data } = await supabase
    .from('payments')
    .select('*, student:students(full_name, student_number)')
    .eq('school_id', schoolId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  payments.value = data || []
}

const approvePayment = async (paymentId) => {
  const { error } = await supabase
    .from('payments')
    .update({ 
      status: 'approved',
      approved_by: authStore.user?.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', paymentId)
  
  if (!error) {
    await fetchPayments()
  } else {
    alert('Error approving payment')
  }
}

const rejectPayment = async (paymentId) => {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId)
  
  if (!error) {
    await fetchPayments()
  } else {
    alert('Error rejecting payment')
  }
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchPayments()
})
</script>