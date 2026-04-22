<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">{{ languageStore.t('enterGrades') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="form-label">{{ languageStore.t('exam') }}</label>
          <select v-model="selectedExamId" @change="loadStudents" class="form-select">
            <option :value="null">{{ languageStore.t('selectExam') }}</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.subject }} - {{ languageStore.t(exam.exam_type) }} ({{ exam.class?.name }})
            </option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>

      <div v-else-if="selectedExam && students.length" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('studentName') }}</th>
              <th class="px-4 py-2 text-center">{{ languageStore.t('score') }} ({{ selectedExam.max_score }})</th>
              <th class="px-4 py-2 text-center">{{ languageStore.t('percentage') }}%</th>
              <th class="px-4 py-2 text-center">{{ languageStore.t('grade') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('remarks') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2 font-medium">{{ student.full_name }}</td>
              <td class="px-4 py-2 text-center">
                <input
                  :value="getGradeScore(student.id)"
                  @input="updateScore(student.id, $event.target.value)"
                  type="number"
                  :max="selectedExam.max_score"
                  min="0"
                  step="0.5"
                  class="form-input w-24 text-center"
                />
              </td>
              <td class="px-4 py-2 text-center font-medium">{{ getGradePercentage(student.id) || '-' }}%</td>
              <td class="px-4 py-2 text-center font-bold" :class="getGradeColor(getGradePercentage(student.id))">
                {{ getGradeLetter(student.id) || '-' }}
              </td>
              <td class="px-4 py-2">
                <input
                  :value="getGradeRemarks(student.id)"
                  @input="updateRemarks(student.id, $event.target.value)"
                  type="text"
                  class="form-input text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <button @click="saveGrades" :disabled="isSaving" class="btn-primary">
            {{ isSaving ? languageStore.t('saving') : languageStore.t('saveGrades') }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedExam && !students.length && !isLoading" class="text-center py-8 text-gray-500">
        {{ languageStore.t('noStudentsInClass') }}
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
  if (!selectedExamId.value) return
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
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 80) return 'text-blue-600'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  if (percentage) return 'text-red-600'
  return ''
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
    alert(languageStore.t('operationFailed'))
    isSaving.value = false
    return
  }

  if (records.length) {
    const { error } = await supabase.from('grades').insert(records)
    if (error) {
      alert(error.message)
    } else {
      alert(languageStore.t('gradesSaved'))
    }
  } else {
    alert(languageStore.t('noGradesToSave'))
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
</style>