<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">
        {{ isEdit ? languageStore.t('editParent') : languageStore.t('addParent') }}
      </h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">{{ languageStore.t('fullName') }} *</label>
            <input v-model="form.full_name" type="text" required class="input-field" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('email') }} *</label>
              <input v-model="form.email" type="email" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('phone') }} *</label>
              <input v-model="form.phone" type="tel" required class="input-field" />
            </div>
          </div>

          <div>
            <label class="label">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="2" class="input-field"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('relationship') }}</label>
              <select v-model="form.relationship" class="input-field">
                <option value="father">{{ languageStore.t('father') }}</option>
                <option value="mother">{{ languageStore.t('mother') }}</option>
                <option value="guardian">{{ languageStore.t('guardian') }}</option>
              </select>
            </div>
            <div>
              <label class="label">{{ languageStore.t('status') }}</label>
              <select v-model="form.status" class="input-field">
                <option value="active">{{ languageStore.t('active') }}</option>
                <option value="pending">{{ languageStore.t('pending') }}</option>
              </select>
            </div>
          </div>

          <!-- Password fields only when creating a new parent -->
          <div v-if="!isEdit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('password') }} *</label>
              <input v-model="form.password" type="password" required class="input-field" />
              <p class="text-xs text-gray-500 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
            </div>
            <div>
              <label class="label">{{ languageStore.t('confirmPassword') }} *</label>
              <input v-model="form.confirm_password" type="password" required class="input-field" />
            </div>
          </div>

          <div class="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            {{ isEdit ? languageStore.t('editParentNote') : languageStore.t('createParentNote') }}
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="$router.back()" class="btn-secondary">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? languageStore.t('processing') : languageStore.t('save') }}
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
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  relationship: 'guardian',
  status: 'pending',
  password: '',
  confirm_password: ''
})

const loadParent = async () => {
  if (!isEdit.value) return
  const { data, error } = await supabase
    .from('parents')
    .select('*')
    .eq('id', route.params.id)
    .single()
  if (error) {
    console.error(error)
    alert(languageStore.t('errorLoadingParent'))
    router.push('/admin/parents')
  } else {
    form.value = { ...data, password: '', confirm_password: '' }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  const schoolId = authStore.profile?.school_id
  if (!schoolId) {
    alert(languageStore.t('noSchoolFound'))
    isLoading.value = false
    return
  }

  if (!isEdit.value && form.value.password !== form.value.confirm_password) {
    alert(languageStore.t('passwordsDoNotMatch'))
    isLoading.value = false
    return
  }
  if (!isEdit.value && form.value.password.length < 6) {
    alert(languageStore.t('passwordTooShort'))
    isLoading.value = false
    return
  }

  try {
    let userId = null

    if (!isEdit.value) {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.value.email,
        password: form.value.password,
        options: {
          data: {
            full_name: form.value.full_name,
            role: 'parent',
            phone: form.value.phone
          }
        }
      })
      if (authError) throw authError
      userId = authData.user.id

      // 2. Create public user record
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email: form.value.email,
          full_name: form.value.full_name,
          phone: form.value.phone,
          role: 'parent',
          school_id: schoolId,
          is_active: true
        }])
      if (userError) throw userError
    }

    // 3. Create/update parent record
    const parentData = {
      school_id: schoolId,
      user_id: userId,
      full_name: form.value.full_name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address || null,
      relationship: form.value.relationship,
      status: form.value.status,
      updated_at: new Date().toISOString()
    }

    let result
    if (isEdit.value) {
      result = await supabase
        .from('parents')
        .update(parentData)
        .eq('id', route.params.id)
    } else {
      parentData.created_at = new Date().toISOString()
      result = await supabase
        .from('parents')
        .insert([parentData])
    }

    if (result.error) throw result.error

    alert(isEdit.value ? languageStore.t('parentUpdated') : languageStore.t('parentCreated'))
    router.push('/admin/parents')
  } catch (error) {
    console.error(error)
    alert(error.message || languageStore.t('operationFailed'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadParent()
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