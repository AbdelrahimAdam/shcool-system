<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ languageStore.t('paymentApproval') }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ languageStore.t('reviewAndApprovePayments') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="badge-warning px-3 py-1">
          {{ pendingCount }} {{ languageStore.t('pending') }}
        </span>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('student') }}</th>
              <th class="px-4 py-3 text-right">{{ languageStore.t('amount') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('paymentMethod') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('bankakNumber') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('proof') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('dueDate') }}</th>
              <th class="px-4 py-3 text-center">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="border-t hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 font-mono text-sm">
                {{ payment.payment_number }}
              </td>

              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">
                  {{ payment.student?.full_name }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ payment.student?.student_number }}
                </div>
              </td>

              <td class="px-4 py-3 text-right font-medium">
                {{ formatCurrency(payment.amount) }}
              </td>

              <td class="px-4 py-3">
                <span class="badge-neutral">
                  {{ languageStore.t(payment.payment_method) }}
                </span>
              </td>

              <td class="px-4 py-3">
                {{ payment.bankak_number || '-' }}
              </td>

              <td class="px-4 py-3">
                <a
                  v-if="payment.proof_image_url"
                  :href="payment.proof_image_url"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ languageStore.t('viewProof') }}
                </a>

                <span v-else class="text-gray-400">-</span>
              </td>

              <td class="px-4 py-3">
                {{ formatDate(payment.due_date) }}
              </td>

              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="approvePayment(payment.id)"
                    class="btn-success text-sm px-3 py-1.5 inline-flex items-center gap-1"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('approve') }}
                    </span>

                    <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    </svg>
                  </button>

                  <button
                    @click="rejectPayment(payment.id)"
                    class="btn-danger text-sm px-3 py-1.5 inline-flex items-center gap-1"
                    :disabled="isProcessing === payment.id"
                  >
                    <span v-if="isProcessing !== payment.id">
                      {{ languageStore.t('reject') }}
                    </span>

                    <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="pendingPayments.length === 0 && !isLoading">
              <td colspan="8" class="text-center py-12">
                <p class="text-gray-500">
                  {{ languageStore.t('noPendingPayments') }}
                </p>
              </td>
            </tr>

            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-12">
                <div class="flex justify-center">
                  <div class="spinner"></div>
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