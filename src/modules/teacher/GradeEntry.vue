<template>
  <div class="flex flex-col h-full min-h-0">
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

    <div class="card p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200 flex flex-col flex-1 min-h-0">
      <h1 class="text-xl md:text-2xl font-bold mb-6 dark:text-white flex-shrink-0">{{ languageStore.t('enterGrades') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
        <div>
          <label class="form-label dark:text-gray-300">{{ languageStore.t('exam') }}</label>
          <select v-model="selectedExamId" @change="loadStudents" class="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
            <option :value="null">{{ languageStore.t('selectExam') }}</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.subject }} - {{ languageStore.t(exam.exam_type) }} ({{ exam.class?.name }})
            </option>
          </select>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="flex-1 min-h-0 overflow-auto">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
        </div>

        <div v-else-if="selectedExam && students.length" class="space-y-4">
          <div class="overflow-x-auto rounded-lg border dark:border-gray-700">
            <table class="min-w-full text-sm dark:text-gray-200">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th class="px-3 py-2 md:px-4 text-left dark:text-gray-300">{{ languageStore.t('studentName') }}</th>
                  <th class="px-3 py-2 md:px-4 text-center dark:text-gray-300">{{ languageStore.t('score') }} ({{ selectedExam.max_score }})</th>
                  <th class="px-3 py-2 md:px-4 text-center dark:text-gray-300">{{ languageStore.t('percentage') }}%</th>
                  <th class="px-3 py-2 md:px-4 text-center dark:text-gray-300">{{ languageStore.t('grade') }}</th>
                  <th class="px-3 py-2 md:px-4 text-left dark:text-gray-300">{{ languageStore.t('remarks') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-3 py-2 md:px-4 font-medium dark:text-gray-200">{{ student.full_name }}</td>
                  <td class="px-3 py-2 md:px-4 text-center">
                    <input
                      :value="getGradeScore(student.id)"
                      @input="updateScore(student.id, $event.target.value)"
                      type="number"
                      :max="selectedExam.max_score"
                      min="0"
                      step="0.5"
                      class="form-input w-20 sm:w-24 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td class="px-3 py-2 md:px-4 text-center font-medium dark:text-gray-300">{{ getGradePercentage(student.id) !== null ? getGradePercentage(student.id).toFixed(1) : '-' }}%</td>
                  <td class="px-3 py-2 md:px-4 text-center font-bold" :class="getGradeColor(getGradePercentage(student.id))">
                    {{ getGradeLetter(student.id) || '-' }}
                  </td>
                  <td class="px-3 py-2 md:px-4">
                    <input
                      :value="getGradeRemarks(student.id)"
                      @input="updateRemarks(student.id, $event.target.value)"
                      type="text"
                      class="form-input w-32 sm:w-40 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end flex-shrink-0 py-2">
            <button @click="saveGrades" :disabled="isSaving" class="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50">
              {{ isSaving ? languageStore.t('saving') : languageStore.t('saveGrades') }}
            </button>
          </div>
        </div>

        <div v-else-if="selectedExam && !students.length && !isLoading" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noStudentsInClass') }}
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

const exams = ref([])
const selectedExamId = ref(null)
const selectedExam = ref(null)
const students = ref([])
const gradesData = ref({})
const isLoading = ref(false)
const isSaving = ref(false)

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

const loadExams = async () => {
  const schoolId = authStore.profile?.school_id
  const teacherId = authStore.teacherId
  if (!schoolId) return

  let query = supabase
    .from('exams')
    .select('*, class:classes(id, name, teacher_id)')
    .eq('school_id', schoolId)
    .order('exam_date', { ascending: false })

  if (teacherId) {
    query = query.eq('class.teacher_id', teacherId)
  }

  const { data } = await query
  exams.value = data || []
}

const loadStudents = async () => {
  if (!selectedExamId.value) {
    students.value = []
    selectedExam.value = null
    gradesData.value = {}
    return
  }
  
  isLoading.value = true

  const exam = exams.value.find(e => e.id === selectedExamId.value)
  selectedExam.value = exam

  if (!exam) {
    isLoading.value = false
    return
  }

  const { data: studentList } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('class_id', exam.class_id)
    .eq('status', 'active')
    .order('full_name')
  students.value = studentList || []

  const { data: existingGrades } = await supabase
    .from('grades')
    .select('*')
    .eq('exam_id', selectedExamId.value)

  gradesData.value = {}
  students.value.forEach(student => {
    const existing = existingGrades?.find(g => g.student_id === student.id)
    gradesData.value[student.id] = {
      score: existing?.score ?? '',
      percentage: existing?.percentage ?? null,
      grade: existing?.grade ?? '',
      remarks: existing?.remarks ?? ''
    }
  })

  isLoading.value = false
}

const getGradeScore = (studentId) => gradesData.value[studentId]?.score ?? ''
const getGradePercentage = (studentId) => gradesData.value[studentId]?.percentage
const getGradeRemarks = (studentId) => gradesData.value[studentId]?.remarks ?? ''
const getGradeLetter = (studentId) => gradesData.value[studentId]?.grade ?? ''

const updateScore = (studentId, value) => {
  const score = value === '' ? null : parseFloat(value)
  if (!gradesData.value[studentId]) {
    gradesData.value[studentId] = {}
  }
  gradesData.value[studentId].score = score
  calculateGrade(studentId)
}

const updateRemarks = (studentId, value) => {
  if (!gradesData.value[studentId]) {
    gradesData.value[studentId] = {}
  }
  gradesData.value[studentId].remarks = value
}

const calculateGrade = (studentId) => {
  const score = gradesData.value[studentId].score
  const maxScore = selectedExam.value?.max_score
  if (score != null && maxScore && maxScore > 0 && score >= 0) {
    const percentage = (score / maxScore) * 100
    gradesData.value[studentId].percentage = percentage
    if (percentage >= 90) gradesData.value[studentId].grade = 'A'
    else if (percentage >= 80) gradesData.value[studentId].grade = 'B'
    else if (percentage >= 70) gradesData.value[studentId].grade = 'C'
    else if (percentage >= 60) gradesData.value[studentId].grade = 'D'
    else gradesData.value[studentId].grade = 'F'
  } else {
    gradesData.value[studentId].percentage = null
    gradesData.value[studentId].grade = ''
  }
}

const getGradeColor = (percentage) => {
  if (percentage === null || percentage === undefined) return ''
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
  if (percentage >= 60) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

const saveGrades = async () => {
  isSaving.value = true
  const schoolId = authStore.profile?.school_id

  const records = students.value
    .map(student => {
      const data = gradesData.value[student.id]
      if (!data || data.score === '' || data.score === null) return null
      return {
        school_id: schoolId,
        student_id: student.id,
        exam_id: selectedExamId.value,
        score: data.score,
        percentage: data.percentage,
        grade: data.grade,
        remarks: data.remarks || null
      }
    })
    .filter(r => r !== null)

  const { error: deleteError } = await supabase
    .from('grades')
    .delete()
    .eq('exam_id', selectedExamId.value)

  if (deleteError) {
    showNotification(languageStore.t('operationFailed'), 'error')
    isSaving.value = false
    return
  }

  if (records.length) {
    const { error } = await supabase.from('grades').insert(records)
    if (error) {
      showNotification(error.message, 'error')
    } else {
      showNotification(languageStore.t('gradesSaved'), 'success')
      selectedExamId.value = null
      selectedExam.value = null
      students.value = []
      gradesData.value = {}
    }
  } else {
    showNotification(languageStore.t('noGradesToSave'), 'error')
  }
  isSaving.value = false
}

onMounted(() => {
  loadExams()
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

/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
  .form-input, .form-select {
    font-size: 14px;
  }
  .card {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Custom scrollbar styles */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (prefers-color-scheme: dark) {
  .overflow-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .overflow-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}

/* Sticky header in table */
.sticky {
  position: sticky;
}

/* Ensure inputs don't overflow on small screens */
.form-input {
  max-width: 100%;
}
</style>