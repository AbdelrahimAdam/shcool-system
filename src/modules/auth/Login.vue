<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Public Header with Navigation -->
    <PublicHeader />
    
    <div class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">{{ languageStore.t('login') }}</h2>
          <p class="text-sm text-gray-600 mt-2">{{ languageStore.t('welcomeBack') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ languageStore.t('email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              :placeholder="languageStore.t('emailPlaceholder')"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ languageStore.t('password') }}
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="languageStore.t('passwordPlaceholder')"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg v-if="!showPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div class="text-right">
            <router-link to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
              {{ languageStore.t('forgotPassword') }}
            </router-link>
          </div>

          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ languageStore.t('login') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ languageStore.t('loading') }}
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ languageStore.t('noAccount') }}
            <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
              {{ languageStore.t('register') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Public Footer -->
    <PublicFooter />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useLanguageStore } from "@/stores/language";
import PublicHeader from "@/components/public/PublicHeader.vue";
import PublicFooter from "@/components/public/PublicFooter.vue";

export default {
  name: "Login",
  
  components: {
    PublicHeader,
    PublicFooter
  },

  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errors: {},
      errorMessage: "",
      loading: false,
      showPassword: false
    };
  },
  
  computed: {
    languageStore() {
      return useLanguageStore();
    }
  },

  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    validate() {
      this.errors = {};

      if (!this.form.email) {
        this.errors.email = this.languageStore.t('emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = this.languageStore.t('invalidEmail');
      }

      if (!this.form.password) {
        this.errors.password = this.languageStore.t('passwordRequired');
      } else if (this.form.password.length < 6) {
        this.errors.password = this.languageStore.t('passwordTooShort');
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleLogin() {
      this.errorMessage = "";

      if (!this.validate()) return;

      this.loading = true;

      try {
        const authStore = useAuthStore();
        
        const result = await authStore.login(this.form.email, this.form.password);
        
        if (!result.success) {
          this.errorMessage = result.error || this.languageStore.t('loginFailed');
          this.loading = false;
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 200));
        
        await authStore.getCurrentUser();
        
        const role = authStore.role;
        
        // Redirect based on role
        const redirectMap = {
          'super_admin': '/super-admin',
          'admin': '/admin',
          'teacher': '/teacher',
          'accountant': '/accountant',
          'parent': '/parent',
          'student': '/student'
        };
        
        const redirectPath = redirectMap[role] || '/';
        
        // Use window.location for guaranteed redirect
        window.location.href = redirectPath;
        
      } catch (err) {
        console.error('Login error:', err);
        this.errorMessage = err.message || this.languageStore.t('loginFailed');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
