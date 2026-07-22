<template>
  <div class="max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? languageStore.t('editTeacher') : languageStore.t('addTeacher') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ isEdit ? languageStore.t('editTeacherDescription') : languageStore.t('addTeacherDescription') }}
            </p>
          </div>
          <span v-if="isEdit" class="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full self-start sm:self-auto">
            {{ languageStore.t('editMode') }}
          </span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
        <!-- Basic Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ languageStore.t('basicInformation') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('arabicName') }}</label>
              <input 
                v-model="form.arabic_name" 
                type="text" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" 
                dir="rtl"
                :placeholder="languageStore.t('enterArabicName')"
              />
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ languageStore.t('contactInformation') }}
          </h2>
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
        </div>

        <!-- Professional Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ languageStore.t('professionalInformation') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('qualification') }}</label>
              <input 
                v-model="form.qualification" 
                type="text" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterQualification')"
              />
            </div>

            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('specialization') }}</label>
              <input 
                v-model="form.specialization" 
                type="text" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterSpecialization')"
              />
            </div>
          </div>
        </div>

        <!-- Subjects (Array Field) -->
        <div>
          <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('subjects') }}</label>
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30">
            <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
              <span 
                v-for="subject in form.subjects" 
                :key="subject" 
                class="badge badge-neutral inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm"
              >
                {{ subject }}
                <button 
                  type="button" 
                  @click="removeSubject(subject)" 
                  class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 ml-0.5"
                >
                  ×
                </button>
              </span>
              <span v-if="form.subjects.length === 0" class="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                {{ languageStore.t('noSubjectsAdded') }}
              </span>
            </div>
            <div class="flex flex-col sm:flex-row gap-2">
              <input 
                v-model="newSubject" 
                type="text" 
                class="form-input flex-1 w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('addSubjectPlaceholder')"
                @keyup.enter="addSubject"
              />
              <button 
                type="button" 
                @click="addSubject" 
                class="btn-secondary px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                :disabled="!newSubject.trim()"
              >
                {{ languageStore.t('add') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Employment Information -->
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ languageStore.t('employmentInformation') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('hireDate') }}</label>
              <input 
                v-model="form.hire_date" 
                type="date" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('status') }}</label>
              <select v-model="form.status" class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="active">{{ languageStore.t('active') }}</option>
                <option value="inactive">{{ languageStore.t('inactive') }}</option>
                <option value="on_leave">{{ languageStore.t('onLeave') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- School Information (Read-only) -->
        <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ languageStore.t('schoolInformation') }}
          </h2>
          <div class="grid grid-cols-1 gap-2">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('school') }}</label>
              <div class="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {{ schoolName || languageStore.t('noSchoolAssigned') }}
              </div>
              <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('schoolInfoHelp') }}</p>
            </div>
          </div>
        </div>

        <!-- Account Creation (for new teachers) -->
        <div v-if="!isEdit" class="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-5">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {{ languageStore.t('teacherAccount') }}
          </h2>
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
            <p class="text-xs sm:text-sm text-blue-800 dark:text-blue-300">{{ languageStore.t('teacherAccountHelp') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('email') }} *</label>
              <input 
                v-model="accountForm.email" 
                type="email" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterEmail')"
              />
            </div>

            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('password') }} *</label>
              <input 
                v-model="accountForm.password" 
                type="password" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterPassword')"
              />
            </div>
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
            {{ isLoading ? languageStore.t('saving') : languageStore.t('saveTeacher') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useTeacherStore } from '@/stores/teacher'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const route = useRoute()
const teacherStore = useTeacherStore()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const newSubject = ref('')
const schoolName = ref('')

// Teacher form data (matching database schema)
const form = ref({
  full_name: '',
  arabic_name: '',
  email: '',
  phone: '',
  qualification: '',
  specialization: '',
  hire_date: new Date().toISOString().split('T')[0],
  status: 'active',
  subjects: []
})

// Account creation form (for new teachers)
const accountForm = ref({
  email: '',
  password: ''
})

// Load teacher if editing
const loadTeacher = async () => {
  if (isEdit.value) {
    const teacher = await teacherStore.getTeacherById(route.params.id)
    if (teacher) {
      form.value = {
        full_name: teacher.full_name || '',
        arabic_name: teacher.arabic_name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        qualification: teacher.qualification || '',
        specialization: teacher.specialization || '',
        hire_date: teacher.hire_date || new Date().toISOString().split('T')[0],
        status: teacher.status || 'active',
        subjects: teacher.subjects || []
      }
    }
  }
}

// Load school name
const loadSchoolName = async () => {
  const schoolId = authStore.profile?.school_id
  if (schoolId) {
    const { data } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single()
    schoolName.value = data?.name || ''
  }
}

// Subject management
const addSubject = () => {
  if (newSubject.value.trim()) {
    form.value.subjects.push(newSubject.value.trim())
    newSubject.value = ''
  }
}

const removeSubject = (subject) => {
  form.value.subjects = form.value.subjects.filter(s => s !== subject)
}

// Generate teacher code
const generateTeacherCode = async () => {
  const schoolId = authStore.profile?.school_id
  const { count } = await supabase
    .from('teachers')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
  
  const year = new Date().getFullYear()
  const number = String((count || 0) + 1).padStart(4, '0')
  return `TCH-${year}-${number}`
}

// Create or update teacher
const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    let userId = null
    let teacherCode = form.value.teacher_code
    
    const schoolId = authStore.profile?.school_id
    
    if (!schoolId) {
      alert(languageStore.t('noSchoolAssignedError'))
      isLoading.value = false
      return
    }
    
    console.log('Creating teacher with school_id:', schoolId)
    console.log('Admin profile:', authStore.profile)
    
    if (!isEdit.value) {
      if (!accountForm.value.email || !accountForm.value.password) {
        alert(languageStore.t('accountCredentialsRequired'))
        isLoading.value = false
        return
      }
      
      if (accountForm.value.password.length < 6) {
        alert(languageStore.t('passwordTooShort'))
        isLoading.value = false
        return
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountForm.value.email,
        password: accountForm.value.password,
        options: {
          data: {
            full_name: form.value.full_name,
            role: 'teacher',
            phone: form.value.phone,
            school_id: schoolId
          }
        }
      })
      
      if (authError) throw authError
      userId = authData.user.id
      
      teacherCode = await generateTeacherCode()
      
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', userId)
      
      if (updateUserError) {
        console.error('Error updating user school_id:', updateUserError)
      } else {
        console.log('✅ Updated users table with school_id for teacher')
      }
    }
    
    const teacherData = {
      school_id: schoolId,
      user_id: userId,
      teacher_code: teacherCode,
      full_name: form.value.full_name,
      arabic_name: form.value.arabic_name,
      email: form.value.email || accountForm.value.email,
      phone: form.value.phone,
      qualification: form.value.qualification,
      specialization: form.value.specialization,
      hire_date: form.value.hire_date,
      status: form.value.status,
      subjects: form.value.subjects
    }
    
    console.log('Teacher data to save:', teacherData)
    
    let result
    if (isEdit.value) {
      delete teacherData.teacher_code
      delete teacherData.user_id
      result = await teacherStore.updateTeacher(route.params.id, teacherData)
    } else {
      result = await teacherStore.createTeacher(teacherData)
    }
    
    if (result.success) {
      router.push('/admin/teachers')
    } else {
      alert(result.error || languageStore.t('errorOccurred'))
    }
  } catch (error) {
    console.error('Error saving teacher:', error)
    alert(error.message || languageStore.t('errorOccurred'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTeacher()
  loadSchoolName()
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