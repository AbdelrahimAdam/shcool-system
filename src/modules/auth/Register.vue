<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
    <!-- Public Header with Navigation -->
    <PublicHeader />

    <div class="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors">
        <!-- Logo/Brand -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('parentRegistration') }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ languageStore.t('createAccount') }}</p>
        </div>

        <!-- Success Message - Registration Complete (No Login) -->
        <div v-if="registrationSuccess" class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm text-green-800 dark:text-green-200 font-medium">{{ languageStore.t('registrationSuccess') }}</p>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">{{ languageStore.t('pendingApprovalMessage') }}</p>
              <p class="text-xs text-green-600 dark:text-green-300 mt-2 font-medium">{{ languageStore.t('willNotifyOnApproval') }}</p>
            </div>
          </div>
          <div class="mt-3 text-center">
            <router-link to="/login" class="text-sm text-green-700 dark:text-green-300 hover:underline font-medium">
              {{ languageStore.t('goToLogin') }}
            </router-link>
          </div>
        </div>

        <!-- Registration Form (Hidden after success) -->
        <form v-if="!registrationSuccess" @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('fullName') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                v-model="form.full_name"
                type="text"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.full_name }"
                :placeholder="languageStore.t('enterFullName')"
                @focus="errors.full_name = ''"
              />
            </div>
            <p v-if="errors.full_name" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.full_name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('email') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.email }"
                :placeholder="languageStore.t('emailPlaceholder')"
                @focus="errors.email = ''"
              />
            </div>
            <p v-if="errors.email" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('phone') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.phone }"
                :placeholder="languageStore.t('enterPhone')"
                @focus="errors.phone = ''"
              />
            </div>
            <p v-if="errors.phone" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.phone }}</p>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('address') }}
            </label>
            <textarea
              v-model="form.address"
              rows="2"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterAddress')"
            ></textarea>
          </div>

          <!-- School Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('school') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <select
                v-model="form.school_id"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white appearance-none"
                :class="{ 'border-red-500 dark:border-red-500': errors.school_id }"
                @focus="errors.school_id = ''"
              >
                <option :value="null">{{ languageStore.t('selectSchool') }}</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <p v-if="errors.school_id" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.school_id }}</p>
          </div>

          <!-- Relationship -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('relationship') }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <select
                v-model="form.relationship"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="father">{{ languageStore.t('father') }}</option>
                <option value="mother">{{ languageStore.t('mother') }}</option>
                <option value="guardian">{{ languageStore.t('guardian') }}</option>
              </select>
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('password') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.password }"
                :placeholder="languageStore.t('passwordPlaceholder')"
                @focus="errors.password = ''"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                :title="showPassword ? languageStore.t('hidePassword') : languageStore.t('showPassword')"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.password }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('confirmPassword') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                v-model="form.confirm_password"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.confirm_password }"
                :placeholder="languageStore.t('confirmPassword')"
                @focus="errors.confirm_password = ''"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                :title="showConfirmPassword ? languageStore.t('hidePassword') : languageStore.t('showPassword')"
              >
                <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.confirm_password" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.confirm_password }}</p>
          </div>

          <!-- Info Note -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">{{ languageStore.t('parentRegistrationNote') }}</p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">{{ languageStore.t('register') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ languageStore.t('registering') }}
            </span>
          </button>
        </form>

        <!-- Login Link (Hidden after success - user will click "Go to Login") -->
        <div v-if="!registrationSuccess" class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ languageStore.t('alreadyHaveAccount') }}
            <router-link to="/login" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
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

const errors = ref({})
const errorMessage = ref('')
const isLoading = ref(false)
const registrationSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Load active schools for selection
const loadSchools = async () => {
  const { data } = await supabase
    .from('schools')
    .select('id, name')
    .eq('status', 'active')
    .order('name')
  schools.value = data || []
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validate = () => {
  errors.value = {}

  if (!form.value.full_name || form.value.full_name.length < 2) {
    errors.value.full_name = languageStore.t('fullNameRequired')
  }

  if (!form.value.email) {
    errors.value.email = languageStore.t('emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = languageStore.t('invalidEmail')
  }

  if (!form.value.phone) {
    errors.value.phone = languageStore.t('phoneRequired')
  }

  if (!form.value.school_id) {
    errors.value.school_id = languageStore.t('pleaseSelectSchool')
  }

  if (!form.value.password) {
    errors.value.password = languageStore.t('passwordRequired')
  } else if (form.value.password.length < 6) {
    errors.value.password = languageStore.t('passwordTooShort')
  }

  if (!form.value.confirm_password) {
    errors.value.confirm_password = languageStore.t('confirmPasswordRequired')
  } else if (form.value.confirm_password !== form.value.password) {
    errors.value.confirm_password = languageStore.t('passwordsDoNotMatch')
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (!validate()) {
    return
  }

  isLoading.value = true
  
  try {
    // FIRST: Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', form.value.email)
      .maybeSingle()
    
    if (existingUser) {
      errorMessage.value = 'An account with this email already exists. Please login instead.'
      setTimeout(() => router.push('/login'), 2500)
      isLoading.value = false
      return
    }
    
    // Step 1: Create auth user
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
    
    if (authError) {
      if (authError.message?.includes('User already registered') || 
          authError.status === 400) {
        errorMessage.value = 'An account with this email already exists. Please login instead.'
        setTimeout(() => router.push('/login'), 2500)
        return
      }
      throw authError
    }
    
    if (!authData.user) {
      throw new Error('User creation failed')
    }
    
    // Step 2: Create parent record with PENDING status
    const parentData = {
      user_id: authData.user.id,
      school_id: form.value.school_id,
      full_name: form.value.full_name,
      phone: form.value.phone,
      email: form.value.email,
      address: form.value.address || null,
      relationship: form.value.relationship,
      status: 'pending'  // ← PENDING - NOT active
    }
    
    const { error: parentError } = await supabase
      .from('parents')
      .insert([parentData])
    
    if (parentError) throw parentError
    
    // Step 3: Upsert user record in public.users (NOT active)
    const userData = {
      id: authData.user.id,
      email: form.value.email,
      full_name: form.value.full_name,
      phone: form.value.phone,
      role: 'parent',
      school_id: form.value.school_id,
      is_active: false,  // ← FALSE - Account is not active until approved
      updated_at: new Date().toISOString()
    }
    
    const { error: userError } = await supabase
      .from('users')
      .upsert([userData], { onConflict: 'id' })
    
    if (userError) throw userError
    
    // Show success message (NO AUTO-LOGIN)
    registrationSuccess.value = true
    errorMessage.value = ''
    
    // Reset form
    form.value = {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      school_id: null,
      relationship: 'guardian',
      password: '',
      confirm_password: ''
    }
    
  } catch (error) {
    console.error('Registration error details:', error)
    
    if (error.message?.includes('duplicate key')) {
      errorMessage.value = 'This email is already registered. Please login or use a different email.'
    } else {
      errorMessage.value = error.message || languageStore.t('registrationFailed')
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
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Dark mode input autofill override */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1f2937 !important;
}
.dark input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #374151 inset !important;
  -webkit-text-fill-color: #f3f4f6 !important;
}

/* Select dropdown arrow */
select {
  appearance: none;
  -webkit-appearance: none;
}
</style>