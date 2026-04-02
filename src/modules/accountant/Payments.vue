<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('paymentApprovals') }}</h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('reviewAndApprovePayments') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge-warning px-3 py-1.5 rounded-lg text-sm font-medium">
          {{ pendingCount }} {{ languageStore.t('pending') }}
        </span>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="block lg:hidden space-y-4">
      <div v-for="payment in payments" :key="payment.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
        <!-- Card Header -->
        <div class="relative">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="text-xs text-gray-500">{{ languageStore.t('paymentNumber') }}</p>
                <p class="font-mono text-sm font-semibold text-gray-800">{{ payment.payment_number }}</p>
              </div>
              <span class="badge-pending px-2 py-1 rounded-lg text-xs font-medium">
                {{ languageStore.t('pending') }}
              </span>
            </div>
            
            <!-- Student Info -->
            <div class="bg-gray-50 rounded-lg p-3 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ payment.student?.full_name }}</p>
                  <p class="text-xs text-gray-500">{{ payment.student?.student_number }}</p>
                </div>
              </div>
            </div>
            
            <!-- Payment Details Grid -->
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p class="text-xs text-gray-500">{{ languageStore.t('amount') }}</p>
                <p class="text-lg font-bold text-green-600">{{ formatCurrency(payment.amount) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ languageStore.t('paymentMethod') }}</p>
                <p class="text-sm font-medium text-gray-700">{{ payment.payment_method }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ languageStore.t('dueDate') }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(payment.due_date) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ languageStore.t('bankakNumber') }}</p>
                <p class="text-sm font-mono text-gray-600">{{ payment.bankak_number || '-' }}</p>
              </div>
            </div>
            
            <!-- Proof Link -->
            <div v-if="payment.proof_image_url" class="mb-3">
              <a :href="payment.proof_image_url" target="_blank" class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ languageStore.t('viewProof') }}
              </a>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button 
                @click="approvePayment(payment.id)" 
                :disabled="isProcessing === payment.id"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isProcessing !== payment.id">{{ languageStore.t('approve') }}</span>
                <span v-else class="inline-flex items-center justify-center gap-1">
                  <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  </svg>
                  {{ languageStore.t('processing') }}
                </span>
              </button>
              <button 
                @click="rejectPayment(payment.id)" 
                :disabled="isProcessing === payment.id"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ languageStore.t('reject') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('student') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('amount') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentMethod') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('bankakNumber') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('proof') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('dueDate') }}</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-mono text-xs text-gray-600">{{ payment.payment_number }}</td>
              <td class="px-5 py-3">
                <div class="font-medium text-gray-800">{{ payment.student?.full_name }}</div>
                <div class="text-xs text-gray-400">{{ payment.student?.student_number }}</div>
              </td>
              <td class="px-5 py-3 text-right font-semibold text-gray-800">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-5 py-3">
                <span class="badge-method px-2 py-1 rounded-lg text-xs font-medium">
                  {{ payment.payment_method }}
                </span>
              </td>
              <td class="px-5 py-3 font-mono text-xs text-gray-600">{{ payment.bankak_number || '-' }}</td>
              <td class="px-5 py-3">
                <a v-if="payment.proof_image_url" :href="payment.proof_image_url" target="_blank" class="text-yellow-600 hover:text-yellow-700 text-sm font-medium inline-flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ languageStore.t('view') }}
                </a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-5 py-3 text-gray-600">{{ formatDate(payment.due_date) }}</td>
              <td class="px-5 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="approvePayment(payment.id)" 
                    :disabled="isProcessing === payment.id"
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="isProcessing !== payment.id">{{ languageStore.t('approve') }}</span>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    </svg>
                  </button>
                  <button 
                    @click="rejectPayment(payment.id)" 
                    :disabled="isProcessing === payment.id"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ languageStore.t('reject') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="payments.length === 0 && !isLoading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 text-base">{{ languageStore.t('noPendingPayments') }}</p>
      <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('allPaymentsHaveBeenProcessed') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
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
const isLoading = ref(false)
const isProcessing = ref(null)

const pendingCount = computed(() => payments.value.length)

const fetchPayments = async () => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) return
  
  isLoading.value = true
  
  const { data } = await supabase
    .from('payments')
    .select('*, student:students(full_name, student_number)')
    .eq('school_id', schoolId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  payments.value = data || []
  isLoading.value = false
}

const approvePayment = async (paymentId) => {
  if (isProcessing.value) return
  isProcessing.value = paymentId
  
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
    alert(languageStore.t('errorApprovingPayment'))
  }
  isProcessing.value = null
}

const rejectPayment = async (paymentId) => {
  if (isProcessing.value) return
  isProcessing.value = paymentId
  
  const { error } = await supabase
    .from('payments')
    .update({ 
      status: 'rejected',
      approved_by: authStore.user?.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', paymentId)
  
  if (!error) {
    await fetchPayments()
  } else {
    alert(languageStore.t('errorRejectingPayment'))
  }
  isProcessing.value = null
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

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.badge-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-method {
  background-color: #f3f4f6;
  color: #6b7280;
  text-transform: capitalize;
}
</style>