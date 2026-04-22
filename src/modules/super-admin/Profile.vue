<template>
  <div class="p-6">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('myProfile') }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('manageYourAccount') }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p class="mt-2 text-gray-500">{{ languageStore.t('loading') }}...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600">{{ error }}</p>
          <button @click="loadProfile" class="mt-3 text-primary-600 hover:underline">
            {{ languageStore.t('tryAgain') }}
          </button>
        </div>

        <!-- Profile Form -->
        <div v-else class="p-6">
          <form @submit.prevent="updateProfile">
            <!-- Profile Information Section -->
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{{ languageStore.t('personalInformation') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('fullName') }}</label>
                  <input v-model="form.full_name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('email') }}</label>
                  <input v-model="form.email" type="email" disabled class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p class="text-xs text-gray-400 mt-1">{{ languageStore.t('emailCannotBeChanged') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('phone') }}</label>
                  <input v-model="form.phone" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            <!-- Password Change Section -->
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{{ languageStore.t('changePassword') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('currentPassword') }}</label>
                  <input v-model="passwordForm.current_password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('newPassword') }}</label>
                  <input v-model="passwordForm.new_password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <p class="text-xs text-gray-400 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('confirmNewPassword') }}</label>
                  <input v-model="passwordForm.confirm_password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" @click="$router.back()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                {{ languageStore.t('cancel') }}
              </button>
              <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {{ isSubmitting ? languageStore.t('saving') : languageStore.t('saveChanges') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const loading = ref(true)
const error = ref('')
const isSubmitting = ref(false)

const form = ref({
  full_name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const loadProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    // Get current user from auth store
    const user = authStore.user
    const profile = authStore.profile

    if (!user || !profile) {
      throw new Error('User not authenticated')
    }

    form.value = {
      full_name: profile.full_name || '',
      email: user.email || '',
      phone: profile.phone || ''
    }
  } catch (err) {
    error.value = err.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  isSubmitting.value = true
  error.value = ''

  try {
    // 1. Update profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: form.value.full_name,
        phone: form.value.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', authStore.user.id)

    if (profileError) throw profileError

    // 2. Update password if provided
    if (passwordForm.value.new_password) {
      // Validate passwords
      if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
        throw new Error(languageStore.t('passwordsDoNotMatch'))
      }
      if (passwordForm.value.new_password.length < 6) {
        throw new Error(languageStore.t('passwordTooShort'))
      }

      // Update auth password
      const { error: authError } = await supabase.auth.updateUser({
        password: passwordForm.value.new_password
      })

      if (authError) throw authError

      // Clear password fields
      passwordForm.value = {
        current_password: '',
        new_password: '',
        confirm_password: ''
      }
    }

    // Refresh auth store profile
    await authStore.refreshProfile()

    alert(languageStore.t('profileUpdatedSuccessfully'))
  } catch (err) {
    error.value = err.message || languageStore.t('updateFailed')
    alert(error.value)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>