<template>
  <div class="max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-0">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? languageStore.t('editSchool') : languageStore.t('addSchool') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ isEdit ? languageStore.t('editSchoolDescription') : languageStore.t('addSchoolDescription') }}
            </p>
          </div>
          <span v-if="isEdit" class="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full self-start sm:self-auto">
            {{ languageStore.t('editMode') }}
          </span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
        <!-- School Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ languageStore.t('schoolInformation') }}
          </h2>

          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('schoolName') }} *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterSchoolName')"
            />
          </div>

          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('slug') }} *</label>
            <input 
              v-model="form.slug" 
              type="text" 
              required 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterSlug')"
            />
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('slugHelp') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('email') }}</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterEmail')"
              />
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('phone') }}</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterPhone')"
              />
            </div>
          </div>

          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('address') }}</label>
            <textarea 
              v-model="form.address" 
              rows="3" 
              class="form-textarea w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterAddress')"
            ></textarea>
          </div>
        </div>

        <!-- Subscription Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ languageStore.t('subscriptionInformation') }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('status') }}</label>
              <select 
                v-model="form.status" 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="active">{{ languageStore.t('active') }}</option>
                <option value="suspended">{{ languageStore.t('suspended') }}</option>
                <option value="pending">{{ languageStore.t('pending') }}</option>
              </select>
            </div>

            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('subscriptionPlan') }}</label>
              <select 
                v-model="form.subscription_plan" 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="basic">{{ languageStore.t('basic') }}</option>
                <option value="pro">{{ languageStore.t('pro') }}</option>
                <option value="enterprise">{{ languageStore.t('enterprise') }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('subscriptionEndDate') }}</label>
            <input 
              v-model="form.subscription_end_date" 
              type="date" 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Info Note -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
              {{ isEdit ? languageStore.t('editSchoolNote') : languageStore.t('createSchoolNote') }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="$router.back()" class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1">
            {{ languageStore.t('cancel') }}
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? languageStore.t('saving') : languageStore.t('saveSchool') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)

const form = ref({
  name: '',
  slug: '',
  email: '',
  phone: '',
  address: '',
  status: 'pending',
  subscription_plan: 'basic',
  subscription_end_date: ''
})

const loadSchool = async () => {
  if (isEdit.value) {
    const school = await schoolStore.getSchoolById(route.params.id)
    if (school) {
      form.value = { ...school }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  let result
  if (isEdit.value) {
    result = await schoolStore.updateSchool(route.params.id, form.value)
  } else {
    result = await schoolStore.createSchool(form.value)
  }
  isLoading.value = false
  if (result.success) {
    router.push('/super-admin/schools')
  } else {
    alert(result.error || languageStore.t('errorOccurred'))
  }
}

onMounted(() => {
  loadSchool()
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

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background-color: white;
  color: #1f2937;
}

.dark .form-input,
.dark .form-select,
.dark .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
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