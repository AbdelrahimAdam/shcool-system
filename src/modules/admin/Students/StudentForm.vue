<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('students') }}</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Basic Information -->
          <div>
            <label class="form-label">{{ languageStore.t('fullName') }} *</label>
            <input v-model="form.full_name" type="text" required class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('arabicName') }}</label>
            <input v-model="form.arabic_name" type="text" class="form-input" dir="rtl" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('dateOfBirth') }} *</label>
              <input v-model="form.date_of_birth" type="date" required class="form-input" />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('gender') }} *</label>
              <select v-model="form.gender" required class="form-select">
                <option value="male">{{ languageStore.t('male') }}</option>
                <option value="female">{{ languageStore.t('female') }}</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('class') }} *</label>
            <select v-model="form.class_id" required class="form-select">
              <option :value="null">{{ languageStore.t('selectClass') }}</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('parent') }}</label>
            <select v-model="form.parent_id" class="form-select">
              <option :value="null">{{ languageStore.t('selectParent') }}</option>
              <option v-for="parent in parents" :key="parent.id" :value="parent.id">
                {{ parent.full_name }} ({{ parent.phone }})
              </option>
            </select>
          </div>
          
          <!-- Student Account Section -->
          <div class="border-t pt-4 mt-4">
            <h3 class="text-lg font-semibold mb-3">{{ languageStore.t('studentAccount') }}</h3>
            <div class="bg-blue-50 p-3 rounded-lg mb-3">
              <p class="text-sm text-blue-800">{{ languageStore.t('studentAccountHelp') }}</p>
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('createStudentAccount') }}</label>
              <select v-model="accountOption" class="form-select" @change="handleAccountOptionChange">
                <option value="none">{{ languageStore.t('noAccount') }}</option>
                <option value="existing">{{ languageStore.t('linkExistingUser') }}</option>
                <option value="new">{{ languageStore.t('createNewAccount') }}</option>
              </select>
            </div>
            
            <!-- Link Existing User -->
            <div v-if="accountOption === 'existing'" class="mt-3">
              <label class="form-label">{{ languageStore.t('selectUser') }}</label>
              <select v-model="form.user_id" class="form-select">
                <option :value="null">{{ languageStore.t('selectUser') }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.full_name }} ({{ user.email }})
                </option>
              </select>
            </div>
            
            <!-- Create New Account -->
            <div v-if="accountOption === 'new'" class="mt-3 space-y-3">
              <div class="bg-yellow-50 p-3 rounded-lg">
                <p class="text-sm text-yellow-800">{{ languageStore.t('studentAccountNote') }}</p>
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('email') }} *</label>
                <input v-model="newAccount.email" type="email" required class="form-input" />
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('password') }} *</label>
                <input v-model="newAccount.password" type="password" required class="form-input" />
                <p class="text-xs text-gray-500 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('confirmPassword') }} *</label>
                <input v-model="newAccount.confirm_password" type="password" required class="form-input" />
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div>
            <label class="form-label">{{ languageStore.t('phone') }}</label>
            <input v-model="form.phone" type="tel" class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="3" class="form-textarea"></textarea>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('medicalInfo') }}</label>
            <textarea v-model="form.medical_info" rows="2" class="form-textarea"></textarea>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="form-select">
              <option value="active">{{ languageStore.t('active') }}</option>
              <option value="graduated">{{ languageStore.t('graduated') }}</option>
              <option value="transferred">{{ languageStore.t('transferred') }}</option>
              <option value="suspended">{{ languageStore.t('suspended') }}</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3">
            <button type="button" @click="$router.back()" class="btn-secondary">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? languageStore.t('loading') : languageStore.t('save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'

const router = useRouter()
const route = useRoute()
const studentStore = useStudentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const classes = ref([])
const parents = ref([])
const users = ref([])
const accountOption = ref('none')

const form = ref({
  full_name: '',
  arabic_name: '',
  date_of_birth: '',
  gender: 'male',
  class_id: null,
  parent_id: null,
  user_id: null,
  phone: '',
  address: '',
  medical_info: '',
  status: 'active'
})

const newAccount = ref({
  email: '',
  password: '',
  confirm_password: ''
})

const loadClasses = async () => {
  const schoolId = authStore.profile?.school_id
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', schoolId)
  classes.value = data || []
}

const loadParents = async () => {
  const schoolId = authStore.profile?.school_id
  const { data } = await supabase
    .from('parents')
    .select('id, full_name, phone, email')
    .eq('school_id', schoolId)
    .order('full_name')
  parents.value = data || []
}

const loadUsers = async () => {
  const schoolId = authStore.profile?.school_id
  const { data } = await supabase
    .from('users')
    .select('id, full_name, email, role')
    .in('role', ['parent', 'student'])
    .eq('school_id', schoolId)
    .order('full_name')
  users.value = data || []
}

const loadStudent = async () => {
  if (isEdit.value) {
    const student = await studentStore.getStudentById(route.params.id)
    if (student) {
      form.value = { ...student }
      if (student.user_id) {
        accountOption.value = 'existing'
      }
    }
  }
}

const handleAccountOptionChange = () => {
  if (accountOption.value !== 'existing') {
    form.value.user_id = null
  }
  if (accountOption.value !== 'new') {
    newAccount.value = { email: '', password: '', confirm_password: '' }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  
  let userId = null
  
  // Get the current admin user ID
  const createdBy = authStore.user?.id
  
  if (!createdBy) {
    alert('You must be logged in to create a student')
    isLoading.value = false
    return
  }
  
  // Create student account if requested
  if (accountOption.value === 'new') {
    // Validate passwords
    if (!newAccount.value.password || !newAccount.value.confirm_password) {
      alert(languageStore.t('passwordRequired'))
      isLoading.value = false
      return
    }
    
    if (newAccount.value.password !== newAccount.value.confirm_password) {
      alert(languageStore.t('passwordsDoNotMatch'))
      isLoading.value = false
      return
    }
    
    if (newAccount.value.password.length < 6) {
      alert(languageStore.t('passwordTooShort'))
      isLoading.value = false
      return
    }
    
    if (!newAccount.value.email) {
      alert(languageStore.t('emailRequired'))
      isLoading.value = false
      return
    }
    
    try {
      // Create auth user for student
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAccount.value.email,
        password: newAccount.value.password,
        options: {
          data: {
            full_name: form.value.full_name,
            role: 'student',
            phone: form.value.phone
          }
        }
      })
      
      if (authError) {
        console.error('Auth error:', authError)
        
        if (authError.message.includes('already registered')) {
          alert(languageStore.t('emailAlreadyRegistered'))
        } else if (authError.message.includes('password')) {
          alert(languageStore.t('invalidPassword'))
        } else {
          alert(authError.message)
        }
        isLoading.value = false
        return
      }
      
      if (!authData.user) {
        alert(languageStore.t('userCreationFailed'))
        isLoading.value = false
        return
      }
      
      userId = authData.user.id
      
      // Update the users table with school_id
      const schoolId = authStore.profile?.school_id
      if (schoolId) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ school_id: schoolId })
          .eq('id', userId)
        
        if (updateError) {
          console.error('Error updating user school_id:', updateError)
        }
      }
    } catch (error) {
      console.error('Error creating student account:', error)
      alert(error.message || languageStore.t('userCreationFailed'))
      isLoading.value = false
      return
    }
  } else if (accountOption.value === 'existing') {
    userId = form.value.user_id
  }
  
  // Generate student number if not provided
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const studentNumber = `STU-${year}-${randomNum}`
  
  // Prepare student data
  const studentData = {
    school_id: authStore.profile?.school_id,
    student_number: studentNumber,
    full_name: form.value.full_name,
    arabic_name: form.value.arabic_name,
    date_of_birth: form.value.date_of_birth,
    gender: form.value.gender,
    class_id: form.value.class_id,
    parent_id: form.value.parent_id,
    user_id: userId,
    phone: form.value.phone,
    address: form.value.address,
    medical_info: form.value.medical_info,
    status: form.value.status,
    created_by: createdBy
  }
  
  let result
  if (isEdit.value) {
    result = await studentStore.updateStudent(route.params.id, studentData)
  } else {
    result = await studentStore.createStudent(studentData)
  }
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/admin/students')
  } else {
    alert(result.error || languageStore.t('errorOccurred'))
  }
}

onMounted(() => {
  loadClasses()
  loadParents()
  loadUsers()
  loadStudent()
})
</script>