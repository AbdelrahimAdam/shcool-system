<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('payments') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="text-center">
          <p class="text-gray-500 text-sm">{{ languageStore.t('totalPaid') }}</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalPaid) }}</p>
        </div>
      </div>
      <div class="card p-6">
        <div class="text-center">
          <p class="text-gray-500 text-sm">{{ languageStore.t('pendingAmount') }}</p>
          <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(pendingAmount) }}</p>
        </div>
      </div>
      <div class="card p-6">
        <div class="text-center">
          <p class="text-gray-500 text-sm">{{ languageStore.t('totalPayments') }}</p>
          <p class="text-2xl font-bold text-primary-600">{{ totalPayments }}</p>
        </div>
      </div>
    </div>
    
    <div class="card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('student') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('paymentType') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('amount') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('dueDate') }}</th>
             </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id" class="border-t">
              <td class="px-4 py-2 font-mono">{{ payment.payment_number }}</td>
              <td class="px-4 py-2">{{ payment.student?.full_name }}</td>
              <td class="px-4 py-2">{{ languageStore.t(payment.payment_type) }}</td>
              <td class="px-4 py-2 text-right">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-4 py-2">
                <span :class="getStatusClass(payment.status)">
                  {{ languageStore.t(payment.status) }}
                </span>
              </td>
              <td class="px-4 py-2">{{ formatDate(payment.due_date) }}</td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noPayments') }}</td>
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
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const payments = ref([])

const totalPaid = computed(() => {
  return payments.value
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0)
})

const pendingAmount = computed(() => {
  return payments.value
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
})

const totalPayments = computed(() => payments.value.length)

const fetchParentPayments = async () => {
  const parentId = authStore.profile?.id
  
  if (!parentId) return
  
  // Get children
  const { data: children } = await supabase
    .from('students')
    .select('id')
    .eq('parent_id', parentId)
  
  if (children && children.length > 0) {
    const childIds = children.map(c => c.id)
    const { data } = await supabase
      .from('payments')
      .select('*, student:students(full_name)')
      .in('student_id', childIds)
      .order('created_at', { ascending: false })
    
    payments.value = data || []
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    approved: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || ''
}

onMounted(() => {
  fetchParentPayments()
})
</script>