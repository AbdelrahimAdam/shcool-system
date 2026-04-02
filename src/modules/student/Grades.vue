<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('myGrades') }}</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6 text-center">
        <p class="text-gray-500 text-sm">{{ languageStore.t('overallAverage') }}</p>
        <p class="text-3xl font-bold" :class="getGradeColor(overallAverage)">{{ overallAverage }}%</p>
      </div>
      <div class="card p-6 text-center">
        <p class="text-gray-500 text-sm">{{ languageStore.t('bestSubject') }}</p>
        <p class="text-lg font-semibold">{{ bestSubject?.subject || '-' }}</p>
        <p class="text-sm text-green-600">{{ bestSubject?.percentage }}%</p>
      </div>
      <div class="card p-6 text-center">
        <p class="text-gray-500 text-sm">{{ languageStore.t('needsImprovement') }}</p>
        <p class="text-lg font-semibold">{{ worstSubject?.subject || '-' }}</p>
        <p class="text-sm text-red-600">{{ worstSubject?.percentage }}%</p>
      </div>
      <div class="card p-6 text-center">
        <p class="text-gray-500 text-sm">{{ languageStore.t('totalExams') }}</p>
        <p class="text-3xl font-bold text-primary-600">{{ totalExams }}</p>
      </div>
    </div>

    <!-- Upcoming Exams -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('upcomingExams') }}</h2>
      <div v-if="upcomingExams.length" class="space-y-3">
        <div v-for="exam in upcomingExams" :key="exam.id" class="flex justify-between items-center border-b pb-2">
          <div>
            <p class="font-medium">{{ exam.subject }}</p>
            <p class="text-xs text-gray-500">{{ languageStore.t(exam.exam_type) }} - {{ exam.class?.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">{{ formatDate(exam.exam_date) }}</p>
            <p class="text-xs text-gray-400">{{ exam.term }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-500">{{ languageStore.t('noUpcomingExams') }}</div>
    </div>

    <!-- Grades by Subject -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('gradesBySubject') }}</h2>
      <div class="space-y-4">
        <div v-for="subject in subjectGrades" :key="subject.name">
          <div class="flex justify-between items-center mb-1">
            <span class="font-medium">{{ subject.name }}</span>
            <span :class="getGradeColor(subject.average)">{{ subject.average }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full" :class="getProgressBarColor(subject.average)" :style="{ width: `${subject.average}%` }"></div>
          </div>
        </div>
        <div v-if="!subjectGrades.length" class="text-center py-4 text-gray-500">{{ languageStore.t('noGrades') }}</div>
      </div>
    </div>

    <!-- Detailed Grades Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('subject') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('examType') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('score') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('percentage') }}%</th>
              <th class="px-4 py-2 text-center">{{ languageStore.t('grade') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('examDate') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('remarks') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in allGrades" :key="grade.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2">{{ grade.exam?.subject }}</td>
              <td class="px-4 py-2">{{ languageStore.t(grade.exam?.exam_type) }}</td>
              <td class="px-4 py-2 text-right">{{ grade.score }} / {{ grade.exam?.max_score }}</td>
              <td class="px-4 py-2 text-right font-medium">{{ grade.percentage }}%</td>
              <td class="px-4 py-2 text-center">
                <span :class="getGradeColor(grade.percentage)">{{ grade.grade }}</span>
              </td>
              <td class="px-4 py-2">{{ formatDate(grade.exam?.exam_date) }}</td>
              <td class="px-4 py-2">{{ grade.remarks || '-' }}</td>
            </tr>
            <tr v-if="allGrades.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">{{ languageStore.t('noGrades') }}</td>
            </tr>
          </tbody>
        </table>
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

const allGrades = ref([])
const upcomingExams = ref([])
const studentId = ref(null)

const overallAverage = computed(() => {
  if (!allGrades.value.length) return 0
  const total = allGrades.value.reduce((sum, g) => sum + (g.percentage || 0), 0)
  return Math.round(total / allGrades.value.length)
})

const totalExams = computed(() => allGrades.value.length)

const subjectGrades = computed(() => {
  const map = new Map()
  allGrades.value.forEach(g => {
    const subject = g.exam?.subject
    if (!subject) return
    if (!map.has(subject)) map.set(subject, [])
    map.get(subject).push(g.percentage)
  })
  return Array.from(map.entries()).map(([name, percentages]) => ({
    name,
    average: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
  }))
})

const bestSubject = computed(() => {
  if (!subjectGrades.value.length) return null
  return subjectGrades.value.reduce((best, curr) => curr.average > best.average ? curr : best, subjectGrades.value[0])
})

const worstSubject = computed(() => {
  if (!subjectGrades.value.length) return null
  return subjectGrades.value.reduce((worst, curr) => curr.average < worst.average ? curr : worst, subjectGrades.value[0])
})

const fetchData = async () => {
  const userId = authStore.user?.id
  if (!userId) return

  // Get student id from user
  const { data: student } = await supabase
    .from('students')
    .select('id, class_id')
    .eq('user_id', userId)
    .single()
  if (!student) return
  studentId.value = student.id

  // Fetch grades
  const { data: grades } = await supabase
    .from('grades')
    .select(`
      *,
      exam:exams(subject, exam_type, max_score, exam_date)
    `)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
  allGrades.value = grades || []

  // Fetch upcoming exams (future exams for the student's class)
  const today = new Date().toISOString().split('T')[0]
  const { data: exams } = await supabase
    .from('exams')
    .select('*, class:classes(name)')
    .eq('class_id', student.class_id)
    .gte('exam_date', today)
    .order('exam_date', { ascending: true })
    .limit(5)
  upcomingExams.value = exams || []
}

const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 80) return 'text-blue-600'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  if (percentage) return 'text-red-600'
  return ''
}

const getProgressBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-600'
  if (percentage >= 80) return 'bg-blue-600'
  if (percentage >= 70) return 'bg-yellow-600'
  if (percentage >= 60) return 'bg-orange-600'
  return 'bg-red-600'
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'

onMounted(() => {
  fetchData()
})
</script>