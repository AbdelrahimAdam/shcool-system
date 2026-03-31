<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('myProfile') }}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Info Card -->
      <div class="card p-6 lg:col-span-2">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('personalInformation') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('fullName') }}</p>
            <p class="font-medium">{{ student?.full_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('arabicName') }}</p>
            <p class="font-medium">{{ student?.arabic_name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('studentNumber') }}</p>
            <p class="font-medium">{{ student?.student_number }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('dateOfBirth') }}</p>
            <p class="font-medium">{{ formatDate(student?.date_of_birth) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('gender') }}</p>
            <p class="font-medium">{{ languageStore.t(student?.gender) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('class') }}</p>
            <p class="font-medium">{{ student?.class?.name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('enrollmentDate') }}</p>
            <p class="font-medium">{{ formatDate(student?.enrollment_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('status') }}</p>
            <p class="font-medium" :class="getStatusClass(student?.status)">{{ languageStore.t(student?.status) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Contact Info Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('contactInfo') }}</h2>
        
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('address') }}</p>
            <p class="font-medium">{{ student?.address || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('phone') }}</p>
            <p class="font-medium">{{ student?.phone || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('email') }}</p>
            <p class="font-medium">{{ student?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('emergencyContact') }}</p>
            <p class="font-medium">{{ student?.emergency_contact?.name || '-' }}</p>
            <p class="text-sm">{{ student?.emergency_contact?.phone || '-' }}</p>
          </div>
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

const student = ref(null)

const fetchStudentProfile = async () => {
  const studentId = authStore.profile?.id
  
  if (!studentId) return
  
  const { data } = await supabase
    .from('students')
    .select('*, class:classes(name)')
    .eq('id', studentId)
    .single()
  
  student.value = data
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-600',
    graduated: 'text-blue-600',
    transferred: 'text-yellow-600',
    suspended: 'text-red-600'
  }
  return classes[status] || ''
}

onMounted(() => {
  fetchStudentProfile()
})
</script>