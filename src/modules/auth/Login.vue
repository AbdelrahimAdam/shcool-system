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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('login') }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ languageStore.t('welcomeBack') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('email') }}
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
                :placeholder="languageStore.t('emailPlaceholder')"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.email }"
                @focus="errors.email = ''"
              />
            </div>
            <p v-if="errors.email" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ languageStore.t('password') }}
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
                :placeholder="languageStore.t('passwordPlaceholder')"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.password }"
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
          </div>

          <!-- Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ languageStore.t('rememberMe') }}
              </label>
            </div>
            <router-link to="/forgot-password" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              {{ languageStore.t('forgotPassword') }}
            </router-link>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 animate-shake">
            <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ languageStore.t('login') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ languageStore.t('loggingIn') }}
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ languageStore.t('noAccount') }}
            <router-link to="/register" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              {{ languageStore.t('register') }}
            </router-link>
          </p>
        </div>

        <!-- Demo Credentials (Development Only) -->
        <div v-if="isDevelopment" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">{{ languageStore.t('demoCredentials') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button 
              @click="fillDemoCredentials('super_admin')"
              class="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              Super Admin
            </button>
            <button 
              @click="fillDemoCredentials('admin')"
              class="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              Admin
            </button>
            <button 
              @click="fillDemoCredentials('teacher')"
              class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              Teacher
            </button>
            <button 
              @click="fillDemoCredentials('parent')"
              class="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              Parent
            </button>
          </div>
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
import { supabase } from "@/services/supabase";

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
      showPassword: false,
      rememberMe: false
    };
  },
  
  computed: {
    languageStore() {
      return useLanguageStore();
    },
    isDevelopment() {
      return import.meta.env.MODE === 'development';
    }
  },

  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    fillDemoCredentials(role) {
      const credentials = {
        super_admin: { email: 'superadmin@example.com', password: 'password123' },
        admin: { email: 'admin@example.com', password: 'password123' },
        teacher: { email: 'teacher@example.com', password: 'password123' },
        parent: { email: 'parent@example.com', password: 'password123' }
      };
      
      if (credentials[role]) {
        this.form.email = credentials[role].email;
        this.form.password = credentials[role].password;
        this.errors = {};
      }
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
        
        // 🔒 SECURITY CHECK: Prevent pending parents from logging in
        if (role === 'parent') {
          const { data: parentData, error: parentError } = await supabase
            .from('parents')
            .select('status')
            .eq('user_id', authStore.user?.id)
            .maybeSingle();
          
          if (parentError) {
            console.error('Error checking parent status:', parentError);
          }
          
          // If parent status is 'pending', prevent login
          if (parentData?.status === 'pending') {
            this.errorMessage = 'حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم الموافقة على حسابك.';
            await authStore.logout();
            this.loading = false;
            return;
          }
        }
        
        const redirectMap = {
          'super_admin': '/super-admin',
          'admin': '/admin',
          'teacher': '/teacher',
          'accountant': '/accountant',
          'parent': '/parent',
          'student': '/student'
        };
        
        const redirectPath = redirectMap[role] || '/';
        
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
</style>