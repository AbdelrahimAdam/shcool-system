<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <PublicHeader />

    <main class="container mx-auto px-4 py-8 sm:py-12">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white">
        {{ languageStore.t('admissions') }}
      </h1>

      <div class="max-w-2xl mx-auto">
        <!-- Information Tabs -->
        <div class="mb-6 sm:mb-8">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-4 sm:space-x-8">
              <button 
                @click="activeTab = 'inquiry'" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="activeTab === 'inquiry' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              >
                {{ languageStore.t('inquiryForm') }}
              </button>
              <button 
                @click="activeTab = 'existing'" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="activeTab === 'existing' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              >
                {{ languageStore.t('alreadyHaveAccount') }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Inquiry Form (For new leads) -->
        <div v-if="activeTab === 'inquiry'">
          <form @submit.prevent="submitLead" class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              {{ languageStore.t('admissionsNote') }}
            </div>

            <!-- FIX: School Selection Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ languageStore.t('school') }} *
              </label>
              <select 
                v-model="leadForm.school_id" 
                required 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.school_id }"
              >
                <option :value="null">{{ languageStore.t('selectSchool') }}</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
              <p v-if="errors.school_id" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.school_id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('fullName') }} *</label>
              <input 
                v-model="leadForm.full_name" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.full_name }"
                @focus="errors.full_name = ''"
              />
              <p v-if="errors.full_name" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.full_name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('email') }}</label>
              <input 
                v-model="leadForm.email" 
                type="email" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.email }"
                @focus="errors.email = ''"
              />
              <p v-if="errors.email" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('phone') }} *</label>
              <input 
                v-model="leadForm.phone" 
                type="tel" 
                required 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500 dark:border-red-500': errors.phone }"
                @focus="errors.phone = ''"
              />
              <p v-if="errors.phone" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ errors.phone }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('studentName') }}</label>
              <input 
                v-model="leadForm.student_name" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('studentGrade') }}</label>
              <select 
                v-model="leadForm.student_grade" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option :value="null">{{ languageStore.t('selectGrade') }}</option>
                <option v-for="i in 12" :key="i" :value="i">{{ languageStore.t('grade') }} {{ i }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('interestedProgram') }}</label>
              <input 
                v-model="leadForm.interested_program" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('message') }}</label>
              <textarea 
                v-model="leadForm.notes" 
                rows="4" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ errorMessage }}</p>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting" 
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? languageStore.t('submitting') : languageStore.t('submitInquiry') }}
            </button>

            <div v-if="leadSubmitted" class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-800 dark:text-green-200 text-sm">
              {{ languageStore.t('inquirySubmitted') }}
            </div>
          </form>
        </div>

        <!-- Existing Account Option -->
        <div v-else-if="activeTab === 'existing'" class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 text-center">
          <svg class="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ languageStore.t('alreadyHaveAccount') }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ languageStore.t('existingAccountNote') }}</p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
            <router-link to="/login" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              {{ languageStore.t('login') }}
            </router-link>
            <router-link to="/register" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors">
              {{ languageStore.t('register') }}
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'
import PublicHeader from '@/components/public/PublicHeader.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'

const languageStore = useLanguageStore()

const activeTab = ref('inquiry')
const isSubmitting = ref(false)
const leadSubmitted = ref(false)
const errorMessage = ref('')
const schools = ref([])

const errors = ref({
  school_id: '',
  full_name: '',
  email: '',
  phone: ''
})

const leadForm = ref({
  school_id: null,  // ← ADDED: School selection
  full_name: '',
  email: '',
  phone: '',
  student_name: '',
  student_grade: null,
  interested_program: '',
  notes: ''
})

// Load active schools for selection
const loadSchools = async () => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('id, name')
      .eq('status', 'active')
      .order('name')
    
    if (error) throw error
    schools.value = data || []
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

const validate = () => {
  errors.value = {}
  let isValid = true

  if (!leadForm.value.school_id) {
    errors.value.school_id = languageStore.t('pleaseSelectSchool')
    isValid = false
  }

  if (!leadForm.value.full_name || leadForm.value.full_name.length < 2) {
    errors.value.full_name = languageStore.t('fullNameRequired')
    isValid = false
  }

  if (!leadForm.value.phone) {
    errors.value.phone = languageStore.t('phoneRequired')
    isValid = false
  }

  if (leadForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.value.email)) {
    errors.value.email = languageStore.t('invalidEmail')
    isValid = false
  }

  return isValid
}

const submitLead = async () => {
  errorMessage.value = ''
  leadSubmitted.value = false
  
  if (!validate()) {
    return
  }

  isSubmitting.value = true
  
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{
        school_id: leadForm.value.school_id,
        full_name: leadForm.value.full_name,
        email: leadForm.value.email || null,
        phone: leadForm.value.phone,
        student_name: leadForm.value.student_name || null,
        student_grade: leadForm.value.student_grade || null,
        interested_program: leadForm.value.interested_program || null,
        notes: leadForm.value.notes || null,
        source: 'website',
        status: 'new'
      }])
    
    if (error) throw error
    
    leadSubmitted.value = true
    
    // Reset form
    leadForm.value = {
      school_id: null,
      full_name: '',
      email: '',
      phone: '',
      student_name: '',
      student_grade: null,
      interested_program: '',
      notes: ''
    }
    errors.value = {}
    
  } catch (error) {
    console.error('Error submitting lead:', error)
    errorMessage.value = error.message || languageStore.t('inquiryFailed')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSchools()
})
</script>

<style scoped>
/* Reset any unwanted styles */
</style>