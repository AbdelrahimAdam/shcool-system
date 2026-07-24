<template>
  <div class="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-0">
    <!-- Page Header -->
    <div>
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ languageStore.t('schoolSettings') }}
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ languageStore.t('manageSchoolSettings') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <form @submit.prevent="saveSettings" class="p-4 sm:p-6 space-y-6">
        <!-- School Information -->
        <div>
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ languageStore.t('schoolInformation') }}
          </h2>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('schoolName') }}
              </label>
              <p class="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                {{ schoolData.name || '-' }}
              </p>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('schoolCode') }}
              </label>
              <p class="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-mono">
                {{ schoolData.slug || '-' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bankak Payment Settings -->
        <div>
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ languageStore.t('bankakPaymentSettings') }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
            {{ languageStore.t('bankakSettingsNote') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('bankakAccountNumber') }} *
              </label>
              <input
                v-model="form.bankak_account_number"
                type="text"
                required
                class="form-input w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                :placeholder="languageStore.t('enterBankakAccountNumber')"
              />
              <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ languageStore.t('bankakAccountNumberHelp') }}
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('bankakAccountName') }} *
              </label>
              <input
                v-model="form.bankak_account_name"
                type="text"
                required
                class="form-input w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterBankakAccountName')"
              />
              <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ languageStore.t('bankakAccountNameHelp') }}
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('bankakPhone') }} *
              </label>
              <input
                v-model="form.bankak_phone"
                type="tel"
                required
                class="form-input w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterBankakPhone')"
              />
              <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ languageStore.t('bankakPhoneHelp') }}
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('bankakReferencePrefix') }}
              </label>
              <input
                v-model="form.bankak_reference_prefix"
                type="text"
                class="form-input w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono uppercase"
                :placeholder="languageStore.t('enterBankakReferencePrefix')"
              />
              <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ languageStore.t('bankakReferenceHelp') }}
              </p>
            </div>
          </div>

          <!-- Preview Section -->
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ languageStore.t('parentViewPreview') }}
            </h4>
            <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><span class="font-medium">{{ languageStore.t('accountNumber') }}:</span> <span class="font-mono">{{ form.bankak_account_number || '❌ Not set' }}</span></p>
              <p><span class="font-medium">{{ languageStore.t('accountName') }}:</span> {{ form.bankak_account_name || '❌ Not set' }}</p>
              <p><span class="font-medium">{{ languageStore.t('phone') }}:</span> {{ form.bankak_phone || '❌ Not set' }}</p>
              <p><span class="font-medium">{{ languageStore.t('reference') }}:</span> <span class="font-mono">{{ form.bankak_reference_prefix ? form.bankak_reference_prefix + '-2024' : '❌ Not set' }}</span></p>
            </div>
            <p v-if="!form.bankak_account_number || !form.bankak_account_name || !form.bankak_phone" class="text-xs text-amber-600 dark:text-amber-400 mt-2">
              ⚠️ {{ languageStore.t('fillRequiredFieldsToEnableBankak') }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {{ languageStore.t('reset') }}
          </button>
          <button type="submit" :disabled="isSaving" class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <svg v-if="isSaving" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isSaving ? languageStore.t('saving') : languageStore.t('saveSettings') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300">
      {{ languageStore.t('settingsSavedSuccessfully') }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { usePaymentStore } from '@/stores/payment'

const authStore = useAuthStore()
const languageStore = useLanguageStore()
const paymentStore = usePaymentStore()

const isLoading = ref(true)
const isSaving = ref(false)
const showSuccess = ref(false)
const schoolData = ref({})

const schoolId = computed(() => authStore.profile?.school_id || authStore.schoolId)

const form = ref({
  bankak_account_number: '',
  bankak_account_name: '',
  bankak_phone: '',
  bankak_reference_prefix: 'ZACK'
})

const loadSchoolSettings = async () => {
  if (!schoolId.value) {
    alert(languageStore.t('noSchoolFound'))
    isLoading.value = false
    return
  }

  try {
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, slug, bankak_account_number, bankak_account_name, bankak_phone, bankak_reference_prefix')
      .eq('id', schoolId.value)
      .single()

    if (error) throw error

    schoolData.value = data || {}
    
    form.value = {
      bankak_account_number: data?.bankak_account_number || '',
      bankak_account_name: data?.bankak_account_name || '',
      bankak_phone: data?.bankak_phone || '',
      bankak_reference_prefix: data?.bankak_reference_prefix || 'ZACK'
    }
    
    // Clear the payment store cache so it fetches fresh data
    paymentStore.clearBankakCache()
  } catch (error) {
    console.error('Error loading school settings:', error)
    alert(error.message || languageStore.t('errorLoadingSettings'))
  } finally {
    isLoading.value = false
  }
}

const saveSettings = async () => {
  // Validate required fields
  if (!form.value.bankak_account_number || !form.value.bankak_account_name || !form.value.bankak_phone) {
    alert(languageStore.t('pleaseFillRequiredFields'))
    return
  }

  isSaving.value = true

  try {
    const updateData = {
      bankak_account_number: form.value.bankak_account_number.trim(),
      bankak_account_name: form.value.bankak_account_name.trim(),
      bankak_phone: form.value.bankak_phone.trim(),
      bankak_reference_prefix: form.value.bankak_reference_prefix?.trim() || 'ZACK',
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('schools')
      .update(updateData)
      .eq('id', schoolId.value)

    if (error) throw error

    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 3000)
    
    // Reload the data to confirm it was saved
    await loadSchoolSettings()
    
    // Clear the payment store cache so parents get fresh data
    paymentStore.clearBankakCache()
    
  } catch (error) {
    console.error('Error saving settings:', error)
    alert(error.message || languageStore.t('errorSavingSettings'))
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  form.value = {
    bankak_account_number: schoolData.value.bankak_account_number || '',
    bankak_account_name: schoolData.value.bankak_account_name || '',
    bankak_phone: schoolData.value.bankak_phone || '',
    bankak_reference_prefix: schoolData.value.bankak_reference_prefix || 'ZACK'
  }
}

onMounted(() => {
  loadSchoolSettings()
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

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background-color: white;
  color: #1f2937;
}

.dark .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-input:focus {
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