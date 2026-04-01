<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Public Header with Navigation -->
    <PublicHeader />
    
    <div class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">{{ languageStore.t('parentRegistration') }}</h2>
          <p class="text-sm text-gray-600 mt-2">{{ languageStore.t('createAccount') }}</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="form-label">{{ languageStore.t('fullName') }} *</label>
            <input v-model="form.full_name" type="text" required class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('email') }} *</label>
            <input v-model="form.email" type="email" required class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('phone') }} *</label>
            <input v-model="form.phone" type="tel" required class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="2" class="form-textarea"></textarea>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('school') }} *</label>
            <select v-model="form.school_id" required class="form-select">
              <option :value="null">{{ languageStore.t('selectSchool') }}</option>
              <option v-for="school in schools" :key="school.id" :value="school.id">
                {{ school.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('relationship') }}</label>
            <select v-model="form.relationship" class="form-select">
              <option value="father">{{ languageStore.t('father') }}</option>
              <option value="mother">{{ languageStore.t('mother') }}</option>
              <option value="guardian">{{ languageStore.t('guardian') }}</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('password') }} *</label>
            <input v-model="form.password" type="password" required class="form-input" />
          </div>
          
          <div>
            <label class="form-label">{{ languageStore.t('confirmPassword') }} *</label>
            <input v-model="form.confirm_password" type="password" required class="form-input" />
          </div>
          
          <div class="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
            {{ languageStore.t('parentRegistrationNote') }}
          </div>
          
          <button type="submit" :disabled="isLoading" class="btn-primary w-full">
            {{ isLoading ? languageStore.t('loading') : languageStore.t('register') }}
          </button>
        </form>
        
        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ languageStore.t('alreadyHaveAccount') }}
            <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ languageStore.t('login') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Public Footer -->
    <PublicFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'
import PublicHeader from '@/components/public/PublicHeader.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'

const router = useRouter()
const languageStore = useLanguageStore()
const schools = ref([])

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  school_id: null,
  relationship: 'guardian',
  password: '',
  confirm_password: ''
})
const isLoading = ref(false)

// Load active schools for selection
const loadSchools = async () => {
  const { data } = await supabase
    .from('schools')
    .select('id, name')
    .eq('status', 'active')
    .order('name')
  schools.value = data || []
}

const handleRegister = async () => {
  // Validate password match
  if (form.value.password !== form.value.confirm_password) {
    alert(languageStore.t('passwordsDoNotMatch'))
    return
  }
  
  // Validate password length
  if (form.value.password.length < 6) {
    alert(languageStore.t('passwordTooShort'))
    return
  }
  
  // Validate school selection
  if (!form.value.school_id) {
    alert(languageStore.t('pleaseSelectSchool'))
    return
  }
  
  isLoading.value = true
  
  try {
    // Step 1: Create auth user with 'parent' role
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.full_name,
          role: 'parent',
          phone: form.value.phone,
          school_id: form.value.school_id
        }
      }
    })
    
    if (authError) throw authError
    
    if (!authData.user) {
      throw new Error('User creation failed')
    }
    
    console.log('Auth user created:', authData.user.id)
    
    // Step 2: Create parent record with selected school and pending status
    const parentData = {
      user_id: authData.user.id,
      school_id: form.value.school_id,
      full_name: form.value.full_name,
      phone: form.value.phone,
      email: form.value.email,
      address: form.value.address || null,
      relationship: form.value.relationship,
      status: 'pending'  // Pending approval from admin
    }
    
    console.log('Creating parent record:', parentData)
    
    const { error: parentError } = await supabase
      .from('parents')
      .insert([parentData])
    
    if (parentError) {
      console.error('Parent creation error:', parentError)
      throw parentError
    }
    
    console.log('Parent record created')
    
    // Step 3: Create user record in public.users
    const userData = {
      id: authData.user.id,
      email: form.value.email,
      full_name: form.value.full_name,
      phone: form.value.phone,
      role: 'parent',
      school_id: form.value.school_id,
      is_active: true
    }
    
    console.log('Creating user record:', userData)
    
    const { error: userError } = await supabase
      .from('users')
      .insert([userData])
    
    if (userError) {
      console.error('User creation error:', userError)
      throw userError
    }
    
    console.log('User record created')
    
    // Show success message
    alert(languageStore.t('registrationSuccess') + ' ' + languageStore.t('pendingAdminApproval'))
    
    // Redirect to login page
    router.push('/login')
    
  } catch (error) {
    console.error('Registration error details:', error)
    
    // Provide more specific error messages
    if (error.message?.includes('duplicate key')) {
      alert('This email is already registered. Please login or use a different email.')
    } else {
      alert(error.message || languageStore.t('registrationFailed'))
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSchools()
})
</script>