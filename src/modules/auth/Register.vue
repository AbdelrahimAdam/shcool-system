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
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import PublicHeader from '@/components/public/PublicHeader.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'

const router = useRouter()
const authStore = useAuthStore()
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
    
    // Handle case where user already exists
    if (authError) {
      if (authError.message?.includes('User already registered') || authError.status === 400) {
        alert('An account with this email already exists. Please login instead.')
        router.push('/login')
        return
      }
      throw authError
    }
    
    if (!authData.user) {
      throw new Error('User creation failed')
    }
    
    // Step 2: Create parent record with selected school and pending status
    const parentData = {
      user_id: authData.user.id,
      school_id: form.value.school_id,
      full_name: form.value.full_name,
      phone: form.value.phone,
      email: form.value.email,
      address: form.value.address || null,
      relationship: form.value.relationship,
      status: 'pending'
    }
    
    const { error: parentError } = await supabase
      .from('parents')
      .insert([parentData])
    
    if (parentError) throw parentError
    
    // Step 3: Upsert user record in public.users (to avoid duplicate key errors)
    const userData = {
      id: authData.user.id,
      email: form.value.email,
      full_name: form.value.full_name,
      phone: form.value.phone,
      role: 'parent',
      school_id: form.value.school_id,
      is_active: true,
      updated_at: new Date().toISOString()
    }
    
    const { error: userError } = await supabase
      .from('users')
      .upsert([userData], { onConflict: 'id' })
    
    if (userError) throw userError
    
    // Step 4: Wait for auth session to be established (Supabase signs in automatically)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Refresh auth store to get the current user
    await authStore.getCurrentUser()
    
    // Redirect to parent dashboard (will show pending approval message)
    router.push('/parent')
    
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

<style scoped>
/* (All styles remain exactly as originally provided) */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  max-width: 28rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}
.form-input, .form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
.form-input:focus, .form-select:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  border-color: transparent;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
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
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #f9fafb;
}
.badge-warning {
  background-color: #fef3c7;
  color: #d97706;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}
</style>
