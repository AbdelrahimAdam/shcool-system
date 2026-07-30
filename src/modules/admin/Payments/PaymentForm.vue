<template>
  <div class="max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-0">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ languageStore.t('viewPayment') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ languageStore.t('viewPaymentDescription') }}
            </p>
          </div>
          <span class="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full self-start sm:self-auto">
            {{ languageStore.t('viewOnly') }}
          </span>
        </div>
      </div>

      <div class="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
        <!-- Student Information -->
        <div class="space-y-3">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {{ languageStore.t('studentInformation') }}
          </h2>

          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                  {{ displayStudent?.full_name || manualStudentData?.full_name || languageStore.t('unknownStudent') }}
                </p>
                <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ languageStore.t('studentNumber') }}: <span class="font-mono">{{ displayStudent?.student_number || manualStudentData?.student_number || '-' }}</span></span>
                  <span>{{ languageStore.t('class') }}: {{ displayStudent?.class_name || manualStudentData?.class_name || '-' }}</span>
                  <span v-if="displayStudent?.phone" class="hidden sm:inline">{{ languageStore.t('phone') }}: {{ displayStudent?.phone }}</span>
                </div>
                <div v-if="manualStudentData" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ languageStore.t('manualEntryNote') }}
                </div>
              </div>
              <span v-if="form.created_by" class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex-shrink-0">
                {{ languageStore.t('parentSubmitted') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="space-y-3">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ languageStore.t('paymentDetails') }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('amount') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">SDG</span>
                <div class="w-full mt-1 pl-12 pr-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                  {{ formatCurrency(form.amount) }}
                </div>
              </div>
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('paymentType') }}</label>
              <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {{ languageStore.t(form.payment_type) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('paymentMethod') }}</label>
              <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {{ languageStore.t(form.payment_method) }}
              </div>
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('dueDate') }}</label>
              <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {{ formatDate(form.due_date) }}
              </div>
            </div>
          </div>

          <!-- Bankak Details Section -->
          <div v-if="form.payment_method === 'bankak'" class="space-y-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {{ languageStore.t('bankakDetails') }}
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- School Bankak Account Number (from school settings) -->
              <div>
                <label class="form-label text-xs font-medium text-gray-600 dark:text-gray-400">{{ languageStore.t('bankakAccountNumber') }}</label>
                <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono">
                  {{ schoolBankakDetails?.accountNumber || '-' }}
                </div>
              </div>
              
              <!-- School Bankak Account Name -->
              <div>
                <label class="form-label text-xs font-medium text-gray-600 dark:text-gray-400">{{ languageStore.t('bankakAccountName') }}</label>
                <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {{ schoolBankakDetails?.accountName || '-' }}
                </div>
              </div>
              
              <!-- Parent's Bankak Transaction/Reference Number -->
              <div>
                <label class="form-label text-xs font-medium text-gray-600 dark:text-gray-400">{{ languageStore.t('bankakTransactionNumber') }}</label>
                <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono">
                  {{ form.bankak_number || '-' }}
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ languageStore.t('bankakTransactionHelp') }}
                </p>
              </div>
              
              <!-- School Phone (if available) -->
              <div v-if="schoolBankakDetails?.phone">
                <label class="form-label text-xs font-medium text-gray-600 dark:text-gray-400">{{ languageStore.t('bankakPhone') }}</label>
                <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {{ schoolBankakDetails.phone }}
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('status') }}</label>
              <div class="mt-1">
                <span :class="getStatusClass(form.status || 'pending')" class="px-3 py-1.5 rounded-full text-sm font-medium inline-block">
                  {{ languageStore.t(form.status || 'pending') }}
                </span>
              </div>
            </div>
            <div v-if="form.approved_by">
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('approvedBy') }}</label>
              <div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ approvedByName || form.approved_by || '-' }}
              </div>
            </div>
          </div>

          <!-- Payment Date (if approved) -->
          <div v-if="form.payment_date">
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('paymentDate') }}</label>
            <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {{ formatDate(form.payment_date) }}
            </div>
          </div>
        </div>

        <!-- Parent Notes -->
        <div v-if="form.notes">
          <div class="space-y-1">
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('parentNotes') }}</label>
            <div class="w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white whitespace-pre-wrap">
              {{ form.notes }}
            </div>
          </div>
        </div>

        <!-- Admin Notes (Editable) -->
        <div>
          <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('adminNotes') }}</label>
          <textarea 
            v-model="form.admin_notes" 
            rows="3" 
            class="form-textarea w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            :placeholder="languageStore.t('enterAdminNotes')"
          ></textarea>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {{ languageStore.t('adminNotesHelp') }}
          </p>
        </div>

        <!-- Proof Image -->
        <div v-if="form.proof_image_url">
          <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('proofImage') }}</label>
          <div class="mt-1">
            <a 
              :href="form.proof_image_url" 
              target="_blank" 
              class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ languageStore.t('viewProofImage') }}
            </a>
          </div>
        </div>

        <!-- Audit Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('submittedBy') }}</label>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ form.created_by ? languageStore.t('parent') : languageStore.t('system') }}
            </div>
          </div>
          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('submittedAt') }}</label>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ formatDateTime(form.created_at) }}
            </div>
          </div>
        </div>

        <!-- Info Note -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
              {{ languageStore.t('viewOnlyPaymentNote') }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            @click="saveAdminNotes" 
            :disabled="isLoading" 
            class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? languageStore.t('saving') : languageStore.t('saveNotes') }}
          </button>
          <button 
            type="button" 
            @click="$router.back()" 
            class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {{ languageStore.t('back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'

const router = useRouter()
const route = useRoute()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const students = ref([])
const displayStudent = ref(null)
const manualStudentData = ref(null)
const schoolBankakDetails = ref(null)
const approvedByName = ref(null)

const form = ref({
  id: null,
  student_id: null,
  amount: '',
  payment_type: 'tuition',
  payment_method: 'cash',
  due_date: '',
  bankak_number: '',
  notes: '',
  admin_notes: '',
  status: 'pending',
  created_by: null,
  approved_by: null,
  proof_image_url: null,
  payment_date: null,
  created_at: null,
  updated_at: null,
  manual_student_data: null
})

const getStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
    approved: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30',
    rejected: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
    cancelled: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
  }
  return map[status] || map.pending
}

const formatCurrency = (value) => {
  if (!value) return 'SDG 0'
  return `SDG ${Number(value).toLocaleString()}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

const loadSchoolBankakDetails = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('bankak_account_number, bankak_account_name, bankak_phone, bankak_reference_prefix')
      .eq('id', schoolId)
      .single()
    
    if (error) throw error
    
    if (data && data.bankak_account_number) {
      schoolBankakDetails.value = {
        accountNumber: data.bankak_account_number,
        accountName: data.bankak_account_name || '',
        phone: data.bankak_phone || '',
        referencePrefix: data.bankak_reference_prefix || ''
      }
    }
  } catch (error) {
    console.error('Error loading school Bankak details:', error)
    schoolBankakDetails.value = null
  }
}

const loadApprovedByName = async (userId) => {
  if (!userId) return
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    
    approvedByName.value = data?.full_name || userId
  } catch (error) {
    console.error('Error loading approved by name:', error)
    approvedByName.value = userId
  }
}

const loadStudentData = async (studentId) => {
  if (!studentId) return
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id, 
        full_name, 
        student_number, 
        phone,
        class:classes(name)
      `)
      .eq('id', studentId)
      .single()
    
    if (error) throw error
    
    displayStudent.value = {
      ...data,
      class_name: data.class?.name || null
    }
  } catch (error) {
    console.error('Error loading student:', error)
    displayStudent.value = null
  }
}

const loadPayment = async () => {
  try {
    const paymentId = route.params.id
    if (!paymentId) {
      router.push('/admin/payments')
      return
    }

    const payment = await paymentStore.getPaymentById(paymentId)
    if (!payment) {
      alert(languageStore.t('paymentNotFound'))
      router.push('/admin/payments')
      return
    }

    form.value = { ...payment }
    
    // Format dates
    if (form.value.due_date) {
      form.value.due_date = form.value.due_date.split('T')[0]
    }
    
    // Load school Bankak details
    await loadSchoolBankakDetails()
    
    // Load approved by name
    if (payment.approved_by) {
      await loadApprovedByName(payment.approved_by)
    }
    
    // Load student if exists
    if (payment.student_id) {
      await loadStudentData(payment.student_id)
    } else if (payment.manual_student_data) {
      manualStudentData.value = payment.manual_student_data
    }
  } catch (error) {
    console.error('Error loading payment:', error)
    alert(languageStore.t('errorLoadingPayment'))
    router.push('/admin/payments')
  }
}

const saveAdminNotes = async () => {
  if (!form.value.id) return
  
  isLoading.value = true
  
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        admin_notes: form.value.admin_notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', form.value.id)
    
    if (error) throw error
    
    alert(languageStore.t('notesSaved'))
  } catch (error) {
    console.error('Error saving admin notes:', error)
    alert(error.message || languageStore.t('errorSavingNotes'))
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadPayment()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dark .card {
  background-color: #1f2937;
}

.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background-color: white;
  color: #1f2937;
}

.dark .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #f9fafb;
}

.dark .btn-secondary {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
.dark .btn-secondary:hover {
  background-color: #4b5563;
}
</style>