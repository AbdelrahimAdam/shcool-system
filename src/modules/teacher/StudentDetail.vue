<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('studentDetails') }}</h1>
            <router-link to="/teacher/students" class="text-primary-600 hover:text-primary-700">
              ← {{ languageStore.t('back') }}
            </router-link>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="spinner"></div>
        </div>
        <div v-else-if="error" class="p-12 text-center text-red-600">
          {{ error }}
        </div>
        <div v-else-if="student" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('personalInformation') }}</h2>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('fullName') }}</label>
                <p class="text-gray-900 font-medium">{{ student.full_name }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('studentNumber') }}</label>
                <p class="text-gray-900">{{ student.student_number }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('dateOfBirth') }}</label>
                <p class="text-gray-900">{{ formatDate(student.date_of_birth) }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('gender') }}</label>
                <p class="text-gray-900">{{ languageStore.t(student.gender) }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('academicInformation') }}</h2>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('class') }}</label>
                <p class="text-gray-900">{{ className }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('enrollmentDate') }}</label>
                <p class="text-gray-900">{{ formatDate(student.enrollment_date) }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ languageStore.t('status') }}</label>
                <span :class="getStatusClass(student.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ languageStore.t(student.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const student = ref(null)
const loading = ref(true)
const error = ref('')
const className = ref('')

const fetchStudent = async () => {
  const studentId = route.params.id
  const teacherId = authStore.teacherId
  if (!teacherId) {
    error.value = 'Teacher not authenticated'
    loading.value = false
    return
  }
  try {
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*, class:classes(id, name, teacher_id)')
      .eq('id', studentId)
      .single()
    if (studentError) throw studentError

    if (studentData.class?.teacher_id !== teacherId) {
      error.value = languageStore.t('accessDenied')
      loading.value = false
      return
    }
    student.value = studentData
    className.value = studentData.class?.name || '-'
  } catch (err) {
    error.value = err.message || 'Failed to load student'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    graduated: 'bg-blue-100 text-blue-700',
    transferred: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

onMounted(() => {
  fetchStudent()
})
</script>