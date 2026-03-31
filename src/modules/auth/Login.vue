<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">
        {{ languageStore.t('login') }}
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1">{{ languageStore.t('email') }}</label>
          <input
            v-model="form.email"
            type="email"
            :placeholder="languageStore.t('emailPlaceholder')"
            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">{{ languageStore.t('password') }}</label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="languageStore.t('passwordPlaceholder')"
            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm text-center">{{ errorMessage }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          {{ loading ? languageStore.t('loading') : languageStore.t('login') }}
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        <router-link to="/forgot-password" class="text-primary-600 hover:underline">
          {{ languageStore.t('forgotPassword') }}
        </router-link>
      </div>

      <div class="mt-2 text-center text-sm">
        {{ languageStore.t('noAccount') }}
        <router-link to="/register" class="text-primary-600 hover:underline">
          {{ languageStore.t('register') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";
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
  
  setup() {
    const languageStore = useLanguageStore();
    return { languageStore };
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
      }

      return Object.keys(this.errors).length === 0;
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

        // Redirect based on role
        const role = result.role;
        console.log('Login successful, role:', role);
        
        if (role === 'super_admin') {
          this.$router.push('/super-admin');
        } else if (role === 'admin') {
          this.$router.push('/admin');
        } else if (role === 'teacher') {
          this.$router.push('/teacher');
        } else if (role === 'accountant') {
          this.$router.push('/accountant');
        } else {
          this.$router.push('/');
        }
        
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