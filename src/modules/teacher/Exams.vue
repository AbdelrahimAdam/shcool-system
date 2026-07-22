<template>
  <div class="space-y-6">
    <!-- Notification Toast -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <div v-if="notification.message" :class="[
        'fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg shadow-lg p-4',
        notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <button @click="clearNotification" class="ml-4 flex-shrink-0 text-white/80 hover:text-white">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('manageExams') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('createAndManageExams') }}</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addExam') }}
      </button>
    </div>

    <!-- Exams List -->
    <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm dark:text-gray-200">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-3 md:px-4 text-left dark:text-gray-300 min-w-[100px]">{{ languageStore.t('subject') }}</th>
              <th class="px-3 py-3 md:px-4 text-left dark:text-gray-300 min-w-[100px]">{{ languageStore.t('class') }}</th>
              <th class="px-3 py-3 md:px-4 text-left dark:text-gray-300 min-w-[80px]">{{ languageStore.t('examType') }}</th>
              <th class="px-3 py-3 md:px-4 text-right dark:text-gray-300 min-w-[80px]">{{ languageStore.t('maxScore') }}</th>
              <th class="px-3 py-3 md:px-4 text-left dark:text-gray-300 min-w-[100px]">{{ languageStore.t('examDate') }}</th>
              <th class="px-3 py-3 md:px-4 text-center dark:text-gray-300 min-w-[200px]">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in exams" :key="exam.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-3 py-2 md:px-4 font-medium">{{ exam.subject }}</td>
              <td class="px-3 py-2 md:px-4">{{ exam.class?.name }}</td>
              <td class="px-3 py-2 md:px-4">
                <span class="badge-neutral dark:bg-gray-600 dark:text-gray-200 text-xs sm:text-sm">{{ languageStore.t(exam.exam_type) }}</span>
              </td>
              <td class="px-3 py-2 md:px-4 text-right">{{ exam.max_score }}</td>
              <td class="px-3 py-2 md:px-4">{{ formatDate(exam.exam_date) }}</td>
              <td class="px-3 py-2 md:px-4 text-center">
                <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
                  <router-link :to="`/teacher/exams/${exam.id}/edit`" class="text-primary-600 hover:text-primary-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm whitespace-nowrap">
                    {{ languageStore.t('edit') }}
                  </router-link>
                  <router-link :to="`/teacher/grade-entry?exam=${exam.id}`" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm whitespace-nowrap">
                    {{ languageStore.t('enterGrades') }}
                  </router-link>
                  <button @click="deleteExam(exam.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm whitespace-nowrap">
                    {{ languageStore.t('delete') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="exams.length === 0 && !isLoadingExams">
              <td colspan="6" class="text-center py-8 text-gray-500 dark:text-gray-400">{{ languageStore.t('noExams') }}</td>
            </tr>
            <tr v-if="isLoadingExams">
              <td colspan="6" class="text-center py-8">
                <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Exam Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] flex flex-col shadow-xl transition-colors">
        <!-- Modal Header -->
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 class="text-xl font-bold dark:text-white">{{ languageStore.t('createExam') }}</h2>
        </div>

        <!-- Modal Body - Scrollable -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <form @submit.prevent="createExam" id="createExamForm">
            <div class="space-y-4">
              <div>
                <label class="form-label dark:text-gray-300">{{ languageStore.t('class') }} *</label>

                <!-- Search Input for Classes -->
                <div class="relative mb-2">
                  <input 
                    v-model="classSearch" 
                    type="text" 
                    :placeholder="languageStore.t('searchClasses')"
                    class="form-input pl-10 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select v-model="newExam.class_id" required class="form-select w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" size="4">
                  <option :value="null">{{ languageStore.t('selectClass') }}</option>
                  <option 
                    v-for="cls in filteredClasses" 
                    :key="cls.id" 
                    :value="cls.id"
                  >
                    {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }}) - {{ cls.section || 'A' }}
                  </option>
                </select>

                <p v-if="myClasses.length === 0 && !isLoadingClasses" class="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  {{ languageStore.t('noClassesAssigned') }}
                </p>
              </div>

              <div>
                <label class="form-label dark:text-gray-300">{{ languageStore.t('subject') }} *</label>
                <input v-model="newExam.subject" type="text" required class="form-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="form-label dark:text-gray-300">{{ languageStore.t('examType') }} *</label>
                  <select v-model="newExam.exam_type" required class="form-select w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="quiz">{{ languageStore.t('quiz') }}</option>
                    <option value="midterm">{{ languageStore.t('midterm') }}</option>
                    <option value="assignment">{{ languageStore.t('assignment') }}</option>
                    <option value="final">{{ languageStore.t('final') }}</option>
                  </select>
                </div>
                <div>
                  <label class="form-label dark:text-gray-300">{{ languageStore.t('maxScore') }} *</label>
                  <input v-model.number="newExam.max_score" type="number" step="0.5" min="0" required class="form-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="form-label dark:text-gray-300">{{ languageStore.t('examDate') }} *</label>
                  <input v-model="newExam.exam_date" type="date" required class="form-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label dark:text-gray-300">{{ languageStore.t('term') }}</label>
                  <input v-model="newExam.term" type="text" class="form-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Term 1" />
                </div>
              </div>

              <div>
                <label class="form-label dark:text-gray-300">{{ languageStore.t('description') }}</label>
                <textarea v-model="newExam.description" rows="2" class="form-textarea w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer - Fixed at bottom -->
        <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div class="flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" @click="closeModal" class="btn-secondary dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white w-full sm:w-auto order-2 sm:order-1">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" form="createExamForm" :disabled="isSubmitting" class="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2">
              {{ isSubmitting ? languageStore.t('creating') : languageStore.t('create') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const exams = ref([])
const myClasses = ref([])
const showCreateModal = ref(false)
const isSubmitting = ref(false)
const isLoadingExams = ref(false)
const isLoadingClasses = ref(false)
const classSearch = ref('')

// Notification state
const notification = ref({
  message: '',
  type: 'success'
})

let notificationTimeout = null

const showNotification = (message, type = 'success') => {
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notification.value = { message, type }
  notificationTimeout = setTimeout(() => {
    notification.value.message = ''
  }, 3000)
}

const clearNotification = () => {
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notification.value.message = ''
}

const newExam = ref({
  class_id: null,
  subject: '',
  exam_type: 'quiz',
  max_score: 100,
  exam_date: new Date().toISOString().split('T')[0],
  term: '',
  description: ''
})

// Filter classes based on search
const filteredClasses = computed(() => {
  if (!classSearch.value) return myClasses.value
  const search = classSearch.value.toLowerCase()
  return myClasses.value.filter(cls => 
    cls.name.toLowerCase().includes(search) ||
    cls.grade_level?.toString().includes(search) ||
    (cls.section && cls.section.toLowerCase().includes(search))
  )
})

// Fetch classes assigned to this teacher
const fetchMyClasses = async () => {
  isLoadingClasses.value = true

  try {
    const schoolId = authStore.profile?.school_id
    const teacherId = authStore.teacherId

    if (!schoolId) {
      console.log('No school ID found')
      isLoadingClasses.value = false
      return
    }

    if (!teacherId) {
      console.log('No teacher ID found. Please ensure teacher is properly linked.')
      isLoadingClasses.value = false
      return
    }

    console.log('Fetching classes for teacher ID:', teacherId)

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_level, section')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })

    if (error) {
      console.error('Error fetching classes:', error)
      return
    }

    myClasses.value = data || []
    console.log('Classes loaded:', myClasses.value.length)
  } catch (error) {
    console.error('Error in fetchMyClasses:', error)
  } finally {
    isLoadingClasses.value = false
  }
}

// SECURITY FIX: Fetch only exams that belong to the teacher's classes
const fetchExams = async () => {
  isLoadingExams.value = true

  try {
    const schoolId = authStore.profile?.school_id
    const teacherId = authStore.teacherId

    if (!schoolId) {
      isLoadingExams.value = false
      return
    }

    // SECURITY CHECK: If teacher has no classes, return empty array immediately
    if (!teacherId || myClasses.value.length === 0) {
      console.log('Teacher has no classes assigned - returning empty exam list')
      exams.value = []
      isLoadingExams.value = false
      return
    }

    // Get class IDs from teacher's assigned classes
    const classIds = myClasses.value.map(c => c.id)
    
    if (classIds.length === 0) {
      exams.value = []
      isLoadingExams.value = false
      return
    }

    console.log('Fetching exams for class IDs:', classIds)

    // SECURITY FIX: Only fetch exams that belong to the teacher's classes
    const { data, error } = await supabase
      .from('exams')
      .select('*, class:classes(name, grade_level)')
      .eq('school_id', schoolId)
      .in('class_id', classIds)
      .order('exam_date', { ascending: false })

    if (error) {
      console.error('Error fetching exams:', error)
      return
    }

    exams.value = data || []
    console.log('Exams loaded for teacher:', exams.value.length)
  } catch (error) {
    console.error('Error in fetchExams:', error)
  } finally {
    isLoadingExams.value = false
  }
}

// Create exam (with security check)
const createExam = async () => {
  // SECURITY CHECK: Verify the selected class belongs to this teacher
  if (!newExam.value.class_id) {
    showNotification(languageStore.t('pleaseSelectClass'), 'error')
    return
  }

  const selectedClass = myClasses.value.find(c => c.id === newExam.value.class_id)
  if (!selectedClass) {
    showNotification('You can only create exams for your assigned classes', 'error')
    return
  }

  isSubmitting.value = true
  const schoolId = authStore.profile?.school_id

  const examData = {
    ...newExam.value,
    school_id: schoolId,
    academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    created_by: authStore.teacherId
  }

  const { error } = await supabase
    .from('exams')
    .insert([examData])

  if (error) {
    console.error('Error creating exam:', error)
    showNotification(error.message, 'error')
  } else {
    showNotification(languageStore.t('examCreatedSuccessfully'), 'success')
    closeModal()
    await fetchExams()
  }
  isSubmitting.value = false
}

// Delete exam (with security check)
const deleteExam = async (id) => {
  const examToDelete = exams.value.find(e => e.id === id)
  if (!examToDelete) {
    showNotification('Exam not found', 'error')
    return
  }

  const isTeacherClass = myClasses.value.some(c => c.id === examToDelete.class_id)
  if (!isTeacherClass) {
    showNotification('You do not have permission to delete this exam', 'error')
    return
  }

  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)

    if (!error) {
      showNotification(languageStore.t('examDeletedSuccessfully'), 'success')
      await fetchExams()
    } else {
      showNotification(error.message, 'error')
    }
  }
}

// Close modal and reset form
const closeModal = () => {
  showCreateModal.value = false
  classSearch.value = ''
  newExam.value = {
    class_id: null,
    subject: '',
    exam_type: 'quiz',
    max_score: 100,
    exam_date: new Date().toISOString().split('T')[0],
    term: '',
    description: ''
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  if (authStore.role === 'teacher' && !authStore.teacherId) {
    await authStore.fetchTeacherId()
  }

  await fetchMyClasses()
  await fetchExams()
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .form-input, .form-select, .form-textarea {
    font-size: 14px;
  }
  .card {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  /* Ensure table cells have proper padding on mobile */
  td, th {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  /* Make action buttons more touchable */
  .whitespace-nowrap {
    padding: 4px 6px;
  }
}

/* Modal scroll styles */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (prefers-color-scheme: dark) {
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}

/* Button order fix for mobile */
@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}

/* Select size for modal */
select[size] {
  max-height: 120px;
  overflow-y: auto;
}

select option {
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
}

select option:hover {
  background-color: #f3f4f6;
}

@media (prefers-color-scheme: dark) {
  select option:hover {
    background-color: #374151;
  }
}
</style>