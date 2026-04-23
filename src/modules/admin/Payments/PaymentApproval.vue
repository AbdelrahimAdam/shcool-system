<template>
  <div class="space-y-6 px-4 sm:px-0">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('paymentApproval') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ languageStore.t('reviewAndApprovePayments') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          {{ pendingCount }} {{ languageStore.t('pending') }}
        </span>
      </div>
    </div>

    <div class="card bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('paymentNumber') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('student') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-right text-gray-700 dark:text-gray-300">
                {{ languageStore.t('amount') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('paymentMethod') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('bankakNumber') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('proof') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-left text-gray-700 dark:text-gray-300">
                {{ languageStore.t('dueDate') }}
              </th>
              <th class="px-3 py-3 sm:px-4 text-center text-gray-700 dark:text-gray-300">
                {{ languageStore.t('actions') }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-3 py-2 sm:py-3 sm:px-4 font-mono text-sm text-gray-900 dark:text-white">
                {{ payment.payment_number }}
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4">
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ payment.student?.full_name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ payment.student?.student_number }}
                </div>
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4 text-right font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(payment.amount) }}
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4">
                <span class="badge-neutral dark:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded-full text-xs">
                  {{ languageStore.t(payment.payment_method) }}
                </span>
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4 text-gray-700 dark:text-gray-300">
                {{ payment.bankak_number || '-' }}
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4">
                <a
                  v-if="payment.proof_image_url"
                  :href="payment.proof_image_url"
                  target="_blank"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 inline-flex items-center gap-1 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ languageStore.t('viewProof') }}
                </a>
                <span v-else class="text-gray-400 dark:text-gray-500">-</span>
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4 text-gray-700 dark:text-gray-300">
                {{ formatDate(payment.due_date) }}
              </td>

              <td class="px-3 py-2 sm:py-3 sm:px-4 text-center">
                <div class="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    @click="approvePayment(payment.id)"
                    class="btn-success text-sm px-3 py-1.5 rounded-lg inline-flex items-center justify-center gap-1 transition-colors"
                    :class="{
                      'bg-green-600 hover:bg-green-700 text-white': isProcessing !== payment.id,
                      'bg-green-400 cursor-not-allowed': isProcessing === payment.id
                    }"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('approve') }}
                    </span>
                    <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </button>

                  <button
                    @click="rejectPayment(payment.id)"
                    class="btn-danger text-sm px-3 py-1.5 rounded-lg inline-flex items-center justify-center gap-1 transition-colors"
                    :class="{
                      'bg-red-600 hover:bg-red-700 text-white': isProcessing !== payment.id,
                      'bg-red-400 cursor-not-allowed': isProcessing === payment.id
                    }"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('reject') }}
                    </span>
                    <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
                <p class="text-gray-500 dark:text-gray-400">
                  {{ languageStore.t('noPendingPayments') }}
                </p>
              </td>
            </tr>

            <!-- Loading state -->
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-12">
                <div class="flex justify-center">
                  <div class="spinner border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400 rounded-full w-8 h-8 animate-spin"></div>
                </div>
              </td>
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
    console.error(error)
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
    console.error(error)
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
/* Spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Badge styles for payment method */
.badge-neutral {
  @apply bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium;
}
.dark .badge-neutral {
  @apply bg-gray-700 text-gray-300;
}
</style>