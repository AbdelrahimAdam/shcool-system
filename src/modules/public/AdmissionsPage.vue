<template>
  <div class="min-h-screen">
    <PublicHeader />
    
    <main class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ languageStore.t('admissions') }}</h1>
      
      <div class="max-w-2xl mx-auto">
        <!-- Information Tabs -->
        <div class="mb-8">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8">
              <button 
                @click="activeTab = 'inquiry'" 
                class="py-2 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'inquiry' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                {{ languageStore.t('inquiryForm') }}
              </button>
              <button 
                @click="activeTab = 'existing'" 
                class="py-2 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'existing' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                {{ languageStore.t('alreadyHaveAccount') }}
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Inquiry Form (For new leads) -->
        <div v-if="activeTab === 'inquiry'">
          <form @submit.prevent="submitLead" class="card p-6 space-y-4">
            <div class="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
              {{ languageStore.t('admissionsNote') }}
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('fullName') }} *</label>
              <input v-model="leadForm.full_name" type="text" required class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('email') }}</label>
              <input v-model="leadForm.email" type="email" class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('phone') }} *</label>
              <input v-model="leadForm.phone" type="tel" required class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('studentName') }}</label>
              <input v-model="leadForm.student_name" type="text" class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('studentGrade') }}</label>
              <select v-model="leadForm.student_grade" class="input-field">
                <option :value="null">{{ languageStore.t('selectGrade') }}</option>
                <option v-for="i in 12" :key="i" :value="i">{{ languageStore.t('grade') }} {{ i }}</option>
              </select>
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('interestedProgram') }}</label>
              <input v-model="leadForm.interested_program" type="text" class="input-field" />
            </div>
            
            <div>
              <label class="label">{{ languageStore.t('message') }}</label>
              <textarea v-model="leadForm.notes" rows="4" class="input-field"></textarea>
            </div>
            
            <button type="submit" :disabled="isSubmitting" class="btn-primary w-full">
              {{ isSubmitting ? languageStore.t('submitting') : languageStore.t('submitInquiry') }}
            </button>
            
            <div v-if="leadSubmitted" class="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              {{ languageStore.t('inquirySubmitted') }}
            </div>
          </form>
        </div>
        
        <!-- Existing Account Option -->
        <div v-else-if="activeTab === 'existing'" class="card p-6 text-center">
          <svg class="w-16 h-16 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">{{ languageStore.t('alreadyHaveAccount') }}</h2>
          <p class="text-gray-600 mb-4">{{ languageStore.t('existingAccountNote') }}</p>
          <div class="flex justify-center space-x-4">
            <router-link to="/login" class="btn-primary">
              {{ languageStore.t('login') }}
            </router-link>
            <router-link to="/register" class="btn-secondary">
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
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'
import PublicHeader from '@/components/public/PublicHeader.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'

const languageStore = useLanguageStore()

const activeTab = ref('inquiry')
const isSubmitting = ref(false)
const leadSubmitted = ref(false)

const leadForm = ref({
  full_name: '',
  email: '',
  phone: '',
  student_name: '',
  student_grade: null,
  interested_program: '',
  notes: ''
})

const submitLead = async () => {
  isSubmitting.value = true
  leadSubmitted.value = false
  
  try {
    // Get the default school (or you can let parent select school)
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('status', 'active')
      .limit(1)
      .single()
    
    // Create lead in CRM
    const { error } = await supabase
      .from('leads')
      .insert([{
        school_id: school?.id || null,
        full_name: leadForm.value.full_name,
        email: leadForm.value.email,
        phone: leadForm.value.phone,
        student_name: leadForm.value.student_name,
        student_grade: leadForm.value.student_grade,
        interested_program: leadForm.value.interested_program,
        notes: leadForm.value.notes,
        source: 'website',
        status: 'new'
      }])
    
    if (error) throw error
    
    leadSubmitted.value = true
    
    // Reset form
    leadForm.value = {
      full_name: '',
      email: '',
      phone: '',
      student_name: '',
      student_grade: null,
      interested_program: '',
      notes: ''
    }
    
  } catch (error) {
    console.error('Error submitting lead:', error)
    alert(languageStore.t('inquiryFailed'))
  } finally {
    isSubmitting.value = false
  }
}
</script>