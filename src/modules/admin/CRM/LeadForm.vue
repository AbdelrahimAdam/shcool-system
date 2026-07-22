<template>
  <div class="max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-0">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? languageStore.t('editLead') : languageStore.t('addLead') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ isEdit ? languageStore.t('editLeadDescription') : languageStore.t('addLeadDescription') }}
            </p>
          </div>
          <span v-if="isEdit" class="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full self-start sm:self-auto">
            {{ languageStore.t('editMode') }}
          </span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
        <!-- Personal Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ languageStore.t('personalInformation') }}
          </h2>
          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('fullName') }} *</label>
            <input 
              v-model="form.full_name" 
              type="text" 
              required 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterFullName')"
            />
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
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('phone') }} *</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterPhone')"
              />
            </div>
          </div>
        </div>

        <!-- Student Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {{ languageStore.t('studentInformation') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('studentName') }}</label>
              <input 
                v-model="form.student_name" 
                type="text" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterStudentName')"
              />
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('studentGrade') }}</label>
              <select 
                v-model="form.student_grade" 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option :value="null">{{ languageStore.t('selectGrade') }}</option>
                <option v-for="grade in 12" :key="grade" :value="grade">
                  {{ languageStore.t('grade') }} {{ grade }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('interestedProgram') }}</label>
            <input 
              v-model="form.interested_program" 
              type="text" 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterInterestedProgram')"
            />
          </div>
        </div>

        <!-- Lead Status -->
        <div class="space-y-3">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ languageStore.t('leadStatus') }}
          </h2>
          <div>
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('status') }}</label>
            <select 
              v-model="form.status" 
              class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="new">{{ languageStore.t('new') }}</option>
              <option value="contacted">{{ languageStore.t('contacted') }}</option>
              <option value="enrolled">{{ languageStore.t('enrolled') }}</option>
              <option value="lost">{{ languageStore.t('lost') }}</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('notes') }}</label>
          <textarea 
            v-model="form.notes" 
            rows="3" 
            class="form-textarea w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            :placeholder="languageStore.t('enterNotes')"
          ></textarea>
        </div>

        <!-- Quick Actions (for edit mode) -->
        <div v-if="isEdit && form.phone" class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ languageStore.t('quickActions') }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <a 
              :href="`tel:${form.phone}`"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ languageStore.t('call') }}
            </a>
            <a 
              :href="`https://wa.me/${formatPhoneForWhatsApp(form.phone)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {{ languageStore.t('whatsapp') }}
            </a>
            <button 
              v-if="form.status === 'new'"
              @click="updateStatus('contacted')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
              type="button"
            >
              {{ languageStore.t('markContacted') }}
            </button>
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
            {{ isLoading ? languageStore.t('saving') : languageStore.t('save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCRMStore } from '../../../stores/crm'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  student_name: '',
  student_grade: null,
  interested_program: '',
  status: 'new',
  notes: ''
})

const loadLead = async () => {
  if (isEdit.value) {
    const lead = await crmStore.getLeadById(route.params.id)
    if (lead) {
      form.value = { ...lead }
    }
  }
}

const formatPhoneForWhatsApp = (phone) => {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  if (!cleaned.startsWith('966') && !cleaned.startsWith('971') && !cleaned.startsWith('20')) {
    cleaned = '966' + cleaned
  }
  return cleaned
}

const updateStatus = async (newStatus) => {
  const result = await crmStore.updateLead(route.params.id, { status: newStatus })
  if (result.success) {
    form.value.status = newStatus
    alert(languageStore.t('statusUpdated'))
  } else {
    alert(result.error || languageStore.t('updateFailed'))
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  let result
  if (isEdit.value) {
    result = await crmStore.updateLead(route.params.id, form.value)
  } else {
    result = await crmStore.createLead(form.value)
  }
  isLoading.value = false
  if (result.success) {
    router.push('/admin/crm')
  } else {
    alert(result.error || languageStore.t('saveFailed'))
  }
}

onMounted(() => {
  loadLead()
})
</script>

<style scoped>
/* Animation for spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Mobile button order */
@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}
</style>