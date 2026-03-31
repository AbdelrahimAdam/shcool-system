<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header (same as homepage) -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo / School Name -->
          <router-link to="/" class="text-2xl font-bold text-primary-600">
            Elite School
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <router-link to="/" class="text-gray-700 hover:text-primary-600 transition-colors">
              {{ languageStore.t('home') }}
            </router-link>
            <router-link to="/about" class="text-gray-700 hover:text-primary-600 transition-colors">
              {{ languageStore.t('about') }}
            </router-link>
            <router-link to="/programs" class="text-gray-700 hover:text-primary-600 transition-colors">
              {{ languageStore.t('programs') }}
            </router-link>
            <router-link to="/admissions" class="text-gray-700 hover:text-primary-600 transition-colors">
              {{ languageStore.t('admissions') }}
            </router-link>
            <router-link to="/contact" class="text-gray-700 hover:text-primary-600 transition-colors">
              {{ languageStore.t('contact') }}
            </router-link>
          </nav>

          <!-- Right side: Language switcher and Login/Register -->
          <div class="flex items-center space-x-4" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button 
              @click="toggleLanguage" 
              class="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              {{ languageStore.currentLocale === 'en' ? 'عربي' : 'EN' }}
            </button>
            
            <!-- Show Register link if not on login page -->
            <router-link 
              v-if="$route.path !== '/register'"
              to="/register" 
              class="text-gray-600 hover:text-primary-600 transition-colors text-sm"
            >
              {{ languageStore.t('register') }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Login Form -->
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">{{ languageStore.t('login') }}</h2>
          <p class="text-sm text-gray-600 mt-2">{{ languageStore.t('welcomeBack') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
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
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ languageStore.t('password') }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :placeholder="languageStore.t('passwordPlaceholder')"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <router-link to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
              {{ languageStore.t('forgotPassword') }}
            </router-link>
          </div>

          <!-- Global Error -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
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

        <!-- Register Link -->
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

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="container mx-auto px-4 py-8 text-center">
        <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} Elite School. {{ languageStore.t('allRightsReserved') }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useLanguageStore } from "@/stores/language";

export default {
  name: "Login",

  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errors: {},
      errorMessage: "",
      loading: false
    };
  },

  computed: {
    languageStore() {
      return useLanguageStore();
    }
  },

  methods: {
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

    toggleLanguage() {
      const newLocale = this.languageStore.currentLocale === 'en' ? 'ar' : 'en';
      this.languageStore.setLocale(newLocale);
    },

    async handleLogin() {
      this.errorMessage = "";

      if (!this.validate()) return;

      this.loading = true;

      try {
        const authStore = useAuthStore();
        
        // Use the auth store login method
        const result = await authStore.login(this.form.email, this.form.password);
        
        if (!result.success) {
          this.errorMessage = result.error || this.languageStore.t('loginFailed');
          this.loading = false;
          return;
        }

        // Wait for auth store to be fully updated
        // The auth store's login method already sets the role, but we need to ensure it's ready
        await new Promise(resolve => {
          const checkRole = () => {
            if (authStore.role) {
              resolve();
            } else {
              setTimeout(checkRole, 50);
            }
          };
          checkRole();
        });
        
        const role = authStore.role;
        
        console.log('Login successful, role:', role);
        console.log('Profile:', authStore.profile);
        
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
        console.log('Redirecting to:', redirectPath);
        
        // Use nextTick to ensure Vue is ready
        await this.$nextTick();
        
        // Perform redirect
        this.$router.push(redirectPath);
        
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
/* Additional styles if needed */
</style>