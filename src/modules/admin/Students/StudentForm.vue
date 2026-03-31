<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('students') }}</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Basic Information -->
          <div>
            <label class="label">{{ languageStore.t('fullName') }} *</label>
            <input v-model="form.full_name" type="text" required class="input-field" />
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('arabicName') }}</label>
            <input v-model="form.arabic_name" type="text" class="input-field" dir="rtl" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('dateOfBirth') }} *</label>
              <input v-model="form.date_of_birth" type="date" required class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('gender') }} *</label>
              <select v-model="form.gender" required class="input-field">
                <option value="male">{{ languageStore.t('male') }}</option>
                <option value="female">{{ languageStore.t('female') }}</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('class') }} *</label>
            <select v-model="form.class_id" required class="input-field">
              <option :value="null">{{ languageStore.t('selectClass') }}</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('parent') }}</label>
            <select v-model="form.parent_id" class="input-field">
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
              <label class="label">{{ languageStore.t('createStudentAccount') }}</label>
              <select v-model="accountOption" class="input-field" @change="handleAccountOptionChange">
                <option value="none">{{ languageStore.t('noAccount') }}</option>
                <option value="existing">{{ languageStore.t('linkExistingUser') }}</option>
                <option value="new">{{ languageStore.t('createNewAccount') }}</option>
              </select>
            </div>
            
            <!-- Link Existing User -->
            <div v-if="accountOption === 'existing'" class="mt-3">
              <label class="label">{{ languageStore.t('selectUser') }}</label>
              <select v-model="form.user_id" class="input-field">
                <option :value="null">{{ languageStore.t('selectUser') }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.full_name }} ({{ user.email }})
                </option>
              </select>
            </div>
            
            <!-- Create New Account -->
            <div v-if="accountOption === 'new'" class="mt-3 space-y-3">
              <div>
                <label class="label">{{ languageStore.t('email') }} *</label>
                <input v-model="newAccount.email" type="email" required class="input-field" />
              </div>
              <div>
                <label class="label">{{ languageStore.t('password') }} *</label>
                <input v-model="newAccount.password" type="password" required class="input-field" />
              </div>
              <div>
                <label class="label">{{ languageStore.t('confirmPassword') }} *</label>
                <input v-model="newAccount.confirm_password" type="password" required class="input-field" />
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div>
            <label class="label">{{ languageStore.t('phone') }}</label>
            <input v-model="form.phone" type="tel" class="input-field" />
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="3" class="input-field"></textarea>
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('medicalInfo') }}</label>
            <textarea v-model="form.medical_info" rows="2" class="input-field"></textarea>
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="input-field">
              <option value="active">{{ languageStore.t('active') }}</option>
              <option value="graduated">{{ languageStore.t('graduated') }}</option>
              <option value="transferred">{{ languageStore.t('transferred') }}</option>
              <option value="suspended">{{ languageStore.t('suspended') }}</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
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
import { useStudentStore } from '../../../stores/student'
import { useLanguageStore } from '../../../stores/language'
import { useAuthStore } from '../../../stores/auth'
import { supabase } from '../../../services/supabase'

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
  const { data } = await supabase.from('classes').select('id, name')
  classes.value = data || []
}

const loadParents = async () => {
  const { data } = await supabase
    .from('parents')
    .select('id, full_name, phone, email')
    .order('full_name')
  parents.value = data || []
}

const loadUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('id, full_name, email, role')
    .in('role', ['parent', 'student'])
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
    if (newAccount.value.password !== newAccount.value.confirm_password) {
      alert(languageStore.t('passwordsDoNotMatch'))
      isLoading.value = false
      return
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newAccount.value.email,
      password: newAccount.value.password,
      options: {
        data: {
          full_name: form.value.full_name,
          role: 'student'
        }
      }
    })
    
    if (authError) {
      alert(authError.message)
      isLoading.value = false
      return
    }
    
    userId = authData.user.id
    
    // Update the users table with school_id
    const schoolId = authStore.profile?.school_id
    if (schoolId) {
      await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', userId)
    }
  } else if (accountOption.value === 'existing') {
    userId = form.value.user_id
  }
  
  // Prepare student data with created_by
  const studentData = {
    school_id: authStore.profile?.school_id,
    student_number: form.value.student_number || `STU-${Date.now()}`,
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
    created_by: createdBy  // Add the created_by field
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
    alert(result.error)
  }
}

onMounted(() => {
  loadClasses()
  loadParents()
  loadUsers()
  loadStudent()
})
</script>