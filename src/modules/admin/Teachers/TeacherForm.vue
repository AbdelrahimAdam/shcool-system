<template>
  <div class="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="card">
      <div class="card-header">
        <h1 class="text-xl font-semibold text-secondary-900">
          {{ isEdit ? languageStore.t('editTeacher') : languageStore.t('addTeacher') }}
        </h1>
        <p class="text-sm text-secondary-500 mt-1">
          {{ isEdit ? languageStore.t('editTeacherDescription') : languageStore.t('addTeacherDescription') }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="card-body space-y-6">
        <!-- Basic Information -->
        <div>
          <h2 class="text-base font-medium text-secondary-900 mb-4">{{ languageStore.t('basicInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('fullName') }} *</label>
              <input 
                v-model="form.full_name" 
                type="text" 
                required 
                class="form-input"
                :placeholder="languageStore.t('enterFullName')"
              />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('arabicName') }}</label>
              <input 
                v-model="form.arabic_name" 
                type="text" 
                class="form-input" 
                dir="rtl"
                :placeholder="languageStore.t('enterArabicName')"
              />
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div>
          <h2 class="text-base font-medium text-secondary-900 mb-4">{{ languageStore.t('contactInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('email') }}</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input"
                :placeholder="languageStore.t('enterEmail')"
              />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('phone') }}</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                class="form-input"
                :placeholder="languageStore.t('enterPhone')"
              />
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div>
          <h2 class="text-base font-medium text-secondary-900 mb-4">{{ languageStore.t('professionalInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('qualification') }}</label>
              <input 
                v-model="form.qualification" 
                type="text" 
                class="form-input"
                :placeholder="languageStore.t('enterQualification')"
              />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('specialization') }}</label>
              <input 
                v-model="form.specialization" 
                type="text" 
                class="form-input"
                :placeholder="languageStore.t('enterSpecialization')"
              />
            </div>
          </div>
        </div>

        <!-- Subjects (Array Field) -->
        <div>
          <label class="form-label">{{ languageStore.t('subjects') }}</label>
          <div class="border border-secondary-200 rounded-lg p-3 bg-secondary-50">
            <div class="flex flex-wrap gap-2 mb-3">
              <span 
                v-for="subject in form.subjects" 
                :key="subject" 
                class="badge badge-neutral inline-flex items-center gap-1 px-3 py-1"
              >
                {{ subject }}
                <button 
                  type="button" 
                  @click="removeSubject(subject)" 
                  class="text-secondary-400 hover:text-red-500 ml-1"
                >
                  ×
                </button>
              </span>
              <span v-if="form.subjects.length === 0" class="text-sm text-secondary-400">
                {{ languageStore.t('noSubjectsAdded') }}
              </span>
            </div>
            <div class="flex gap-2">
              <input 
                v-model="newSubject" 
                type="text" 
                class="form-input flex-1"
                :placeholder="languageStore.t('addSubjectPlaceholder')"
                @keyup.enter="addSubject"
              />
              <button 
                type="button" 
                @click="addSubject" 
                class="btn-secondary"
                :disabled="!newSubject.trim()"
              >
                {{ languageStore.t('add') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Employment Information -->
        <div>
          <h2 class="text-base font-medium text-secondary-900 mb-4">{{ languageStore.t('employmentInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('hireDate') }}</label>
              <input 
                v-model="form.hire_date" 
                type="date" 
                class="form-input"
              />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('status') }}</label>
              <select v-model="form.status" class="form-select">
                <option value="active">{{ languageStore.t('active') }}</option>
                <option value="inactive">{{ languageStore.t('inactive') }}</option>
                <option value="on_leave">{{ languageStore.t('onLeave') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- School Information (Read-only) -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h2 class="text-base font-medium text-secondary-900 mb-3">{{ languageStore.t('schoolInformation') }}</h2>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="form-label">{{ languageStore.t('school') }}</label>
              <div class="p-2 bg-gray-100 rounded-lg text-secondary-600">
                {{ schoolName || languageStore.t('noSchoolAssigned') }}
              </div>
              <p class="text-xs text-secondary-500 mt-1">{{ languageStore.t('schoolInfoHelp') }}</p>
            </div>
          </div>
        </div>

        <!-- Account Creation (for new teachers) -->
        <div v-if="!isEdit" class="border-t border-secondary-200 pt-4">
          <h2 class="text-base font-medium text-secondary-900 mb-4">{{ languageStore.t('teacherAccount') }}</h2>
          <div class="bg-blue-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">{{ languageStore.t('teacherAccountHelp') }}</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('email') }} *</label>
              <input 
                v-model="accountForm.email" 
                type="email" 
                required 
                class="form-input"
                :placeholder="languageStore.t('enterEmail')"
              />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('password') }} *</label>
              <input 
                v-model="accountForm.password" 
                type="password" 
                required 
                class="form-input"
                :placeholder="languageStore.t('enterPassword')"
              />
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-secondary-200">
          <button type="button" @click="$router.back()" class="btn-secondary">
            {{ languageStore.t('cancel') }}
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary">
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
    
    // Get school_id from admin profile
    const schoolId = authStore.profile?.school_id
    
    // Validate school_id
    if (!schoolId) {
      alert(languageStore.t('noSchoolAssignedError'))
      isLoading.value = false
      return
    }
    
    console.log('Creating teacher with school_id:', schoolId)
    console.log('Admin profile:', authStore.profile)
    
    // If creating new teacher, create auth user
    if (!isEdit.value) {
      // Validate account form
      if (!accountForm.value.email || !accountForm.value.password) {
        alert(languageStore.t('accountCredentialsRequired'))
        isLoading.value = false
        return
      }
      
      // Check password length
      if (accountForm.value.password.length < 6) {
        alert(languageStore.t('passwordTooShort'))
        isLoading.value = false
        return
      }
      
      // Create auth user
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
      
      // Generate teacher code
      teacherCode = await generateTeacherCode()
      
      // Update the users table with school_id
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
    
    // Prepare teacher data with school_id
    const teacherData = {
      school_id: schoolId,  // Explicitly set school_id from admin profile
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
      // Remove fields that shouldn't be updated
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