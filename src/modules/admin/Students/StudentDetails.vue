<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('studentDetails') }}</h1>
          <div class="flex gap-3">
            <router-link
              to="/admin/students"
              class="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link
              :to="`/admin/students/${student?.id}/edit`"
              class="inline-flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
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
        <button @click="fetchStudent" class="mt-3 text-primary-600 hover:underline">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>

      <!-- Student Details Content -->
      <div v-else-if="student" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('personalInformation') }}</h2>
            
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('fullName') }}</label>
              <p class="text-gray-900 font-medium mt-1">{{ student.full_name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('arabicName') }}</label>
              <p class="text-gray-900 mt-1">{{ student.arabic_name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('studentNumber') }}</label>
              <p class="text-gray-900 font-mono mt-1">{{ student.student_number || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('dateOfBirth') }}</label>
              <p class="text-gray-900 mt-1">{{ formatDate(student.date_of_birth) }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('gender') }}</label>
              <p class="text-gray-900 mt-1">{{ languageStore.t(student.gender) || '-' }}</p>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('academicInformation') }}</h2>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('class') }}</label>
              <p class="text-gray-900 font-medium mt-1">{{ student.class?.name || '-' }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('enrollmentDate') }}</label>
              <p class="text-gray-900 mt-1">{{ formatDate(student.enrollment_date) }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</label>
              <p class="mt-1">
                <span :class="getStatusClass(student.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ languageStore.t(student.status) }}
                </span>
              </p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('address') }}</label>
              <p class="text-gray-900 mt-1">{{ student.address || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Information (if exists) -->
        <div v-if="student.medical_info" class="mt-6 pt-4 border-t border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ languageStore.t('medicalInfo') }}</h2>
          <div class="bg-yellow-50 p-3 rounded-lg">
            <p class="text-sm text-gray-700">{{ student.medical_info }}</p>
          </div>
        </div>

        <!-- Parent Information -->
        <div v-if="student.parent" class="mt-6 pt-4 border-t border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">{{ languageStore.t('parentInformation') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('fullName') }}</label>
              <p class="text-gray-900">{{ student.parent.full_name || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('phone') }}</label>
              <p class="text-gray-900">{{ student.parent.phone || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";
import { useLanguageStore } from "@/stores/language";

export default {
  name: "StudentDetails",

  data() {
    return {
      student: null,
      loading: true,
      error: ""
    };
  },

  computed: {
    languageStore() {
      return useLanguageStore();
    }
  },

  async mounted() {
    await this.fetchStudent();
  },

  methods: {
    async fetchStudent() {
      this.loading = true;
      this.error = "";

      try {
        const id = this.$route.params.id;

        const { data, error } = await supabase
          .from("students")
          .select(`
            *,
            class:classes(name),
            parent:parents(full_name, phone, email)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;

        this.student = data;

      } catch (err) {
        console.error("Error fetching student:", err);
        this.error = err.message || "Failed to load student";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },

    getStatusClass(status) {
      const classes = {
        active: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        graduated: "bg-blue-100 text-blue-700",
        transferred: "bg-orange-100 text-orange-700",
        suspended: "bg-red-100 text-red-700"
      };
      return classes[status] || "bg-gray-100 text-gray-700";
    }
  }
};
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>