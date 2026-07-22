<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('paymentApproval') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('reviewAndApprovePayments') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          {{ pendingCount }} {{ languageStore.t('pending') }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <!-- Desktop Table View -->
    <div v-else class="hidden md:block card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('student') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-right dark:text-gray-300">{{ languageStore.t('amount') }}</th>
              <th class="hidden sm:table-cell px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('paymentMethod') }}</th>
              <th class="hidden lg:table-cell px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('bankakNumber') }}</th>
              <th class="hidden md:table-cell px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('proof') }}</th>
              <th class="hidden sm:table-cell px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('dueDate') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-center dark:text-gray-300">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-3 py-2 sm:px-4 font-mono text-xs text-gray-900 dark:text-white">
                {{ payment.payment_number }}
              </td>

              <td class="px-3 py-2 sm:px-4">
                <div class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                  {{ payment.student?.full_name || '-' }}
                </div>
                <div class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {{ payment.student?.student_number || '-' }}
                </div>
              </td>

              <td class="px-3 py-2 sm:px-4 text-right font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(payment.amount) }}
              </td>

              <td class="hidden sm:table-cell px-3 py-2 sm:px-4">
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-[10px] sm:text-xs font-medium">
                  {{ languageStore.t(payment.payment_method) }}
                </span>
              </td>

              <td class="hidden lg:table-cell px-3 py-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs">
                {{ payment.bankak_number || '-' }}
              </td>

              <td class="hidden md:table-cell px-3 py-2 sm:px-4">
                <a
                  v-if="payment.proof_image_url"
                  :href="payment.proof_image_url"
                  target="_blank"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 inline-flex items-center gap-1 text-xs"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ languageStore.t('view') }}
                </a>
                <span v-else class="text-gray-400 dark:text-gray-500 text-xs">-</span>
              </td>

              <td class="hidden sm:table-cell px-3 py-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs">
                {{ formatDate(payment.due_date) }}
              </td>

              <td class="px-3 py-2 sm:px-4 text-center">
                <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <button
                    @click="approvePayment(payment.id)"
                    class="btn-success text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg inline-flex items-center justify-center gap-1 transition-colors"
                    :class="{
                      'bg-green-600 hover:bg-green-700 text-white': isProcessing !== payment.id,
                      'bg-green-400 cursor-not-allowed': isProcessing === payment.id
                    }"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('approve') }}
                    </span>
                    <svg v-else class="animate-spin w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </button>

                  <button
                    @click="rejectPayment(payment.id)"
                    class="btn-danger text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg inline-flex items-center justify-center gap-1 transition-colors"
                    :class="{
                      'bg-red-600 hover:bg-red-700 text-white': isProcessing !== payment.id,
                      'bg-red-400 cursor-not-allowed': isProcessing === payment.id
                    }"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('reject') }}
                    </span>
                    <svg v-else class="animate-spin w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="pendingPayments.length === 0 && !isLoading">
              <td colspan="8" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                  {{ languageStore.t('noPendingPayments') }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ languageStore.t('allPaymentsApproved') }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div v-else class="md:hidden space-y-3">
      <div v-if="pendingPayments.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ languageStore.t('noPendingPayments') }}
        </p>
      </div>

      <div 
        v-for="payment in pendingPayments" 
        :key="payment.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- Payment Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ payment.student?.full_name || '-' }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {{ payment.payment_number || '-' }}
            </p>
          </div>
          <span class="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-[10px] font-medium flex-shrink-0 ml-2">
            {{ languageStore.t('pending') }}
          </span>
        </div>

        <!-- Payment Details -->
        <div class="grid grid-cols-2 gap-1.5 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('amount') }}:</span>
            <span class="font-medium text-gray-900 dark:text-white ml-1">
              {{ formatCurrency(payment.amount) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('method') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ languageStore.t(payment.payment_method) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('bankakNumber') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ payment.bankak_number || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('dueDate') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(payment.due_date) }}
            </span>
          </div>
        </div>

        <!-- Proof Link -->
        <div class="mt-1.5">
          <a
            v-if="payment.proof_image_url"
            :href="payment.proof_image_url"
            target="_blank"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 inline-flex items-center gap-1 text-xs font-medium"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ languageStore.t('viewProof') }}
          </a>
          <span v-else class="text-gray-400 dark:text-gray-500 text-xs">-</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            @click="approvePayment(payment.id)"
            class="flex-1 min-w-[50px] text-center px-2 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            :disabled="isProcessing === payment.id"
          >
            <span v-if="isProcessing !== payment.id">
              {{ languageStore.t('approve') }}
            </span>
            <svg v-else class="animate-spin w-3.5 h-3.5 mx-auto" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </button>
          <button
            @click="rejectPayment(payment.id)"
            class="flex-1 min-w-[50px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            :disabled="isProcessing === payment.id"
          >
            <span v-if="isProcessing !== payment.id">
              {{ languageStore.t('reject') }}
            </span>
            <svg v-else class="animate-spin w-3.5 h-3.5 mx-auto" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { usePaymentStore } from '@/stores/payment'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const paymentStore = usePaymentStore()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const isLoading = ref(false)
const isProcessing = ref(null)

const pendingPayments = computed(() =>
  paymentStore.payments.filter(p => p.status === 'pending')
)

const pendingCount = computed(() => pendingPayments.value.length)

const approvePayment = async (paymentId) => {
  if (isProcessing.value) return
  isProcessing.value = paymentId

  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'approved',
        approved_by: authStore.user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (error) throw error

    await paymentStore.fetchPayments(1, { status: 'pending' })
  } catch (error) {
    console.error('Error approving payment:', error)
  } finally {
    isProcessing.value = null
  }
}

const rejectPayment = async (paymentId) => {
  if (isProcessing.value) return
  isProcessing.value = paymentId

  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'rejected',
        approved_by: authStore.user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (error) throw error

    await paymentStore.fetchPayments(1, { status: 'pending' })
  } catch (error) {
    console.error('Error rejecting payment:', error)
  } finally {
    isProcessing.value = null
  }
}

const formatCurrency = (value) => `SDG ${value?.toLocaleString() || 0}`

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : '-'

onMounted(async () => {
  isLoading.value = true
  await paymentStore.fetchPayments(1, { status: 'pending' })
  isLoading.value = false
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

/* Mobile Card Styles */
.card {
  transition: box-shadow 0.2s ease;
}

/* Button order fix for mobile */
@media (max-width: 640px) {
  .btn-primary {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>