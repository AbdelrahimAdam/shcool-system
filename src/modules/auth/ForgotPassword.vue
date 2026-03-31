<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">{{ languageStore.t('resetPassword') }}</h2>
        <p class="mt-2 text-center text-sm text-gray-600">{{ languageStore.t('resetInstructions') }}</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleReset">
        <div>
          <label for="email" class="sr-only">{{ languageStore.t('email') }}</label>
          <input id="email" v-model="email" type="email" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" :placeholder="languageStore.t('email')" />
        </div>

        <div v-if="message" class="text-green-600 text-sm text-center">{{ message }}</div>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

        <div>
          <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            {{ isLoading ? languageStore.t('loading') : languageStore.t('sendResetLink') }}
          </button>
        </div>

        <div class="text-sm text-center">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ languageStore.t('backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../../services/supabase'
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
const email = ref('')
const isLoading = ref(false)
const message = ref('')
const error = ref('')

const handleReset = async () => {
  isLoading.value = true
  message.value = ''
  error.value = ''

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (resetError) {
    error.value = resetError.message
  } else {
    message.value = languageStore.t('resetEmailSent')
  }

  isLoading.value = false
}
</script>