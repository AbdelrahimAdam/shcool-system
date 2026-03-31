<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('grades') }}</h1>
    
    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ languageStore.t('academicPerformance') }}</h2>
        <div class="text-sm text-gray-500">
          {{ languageStore.t('averageGrade') }}: <span class="font-bold text-primary-600">{{ averageGrade }}%</span>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('subject') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('examType') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('score') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('maxScore') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('percentage') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('grade') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('remarks') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in grades" :key="grade.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2">{{ grade.exam?.subject }}</td>
              <td class="px-4 py-2">{{ languageStore.t(grade.exam?.exam_type) }}</td>
              <td class="px-4 py-2 text-right font-medium">{{ grade.score }}</td>
              <td class="px-4 py-2 text-right">{{ grade.exam?.max_score }}</td>
              <td class="px-4 py-2 text-right">
                <span :class="getPercentageClass(grade.percentage)">
                  {{ grade.percentage }}%
                </span>
              </td>
              <td class="px-4 py-2">
                <span :class="getGradeClass(grade.grade)">
                  {{ grade.grade }}
                </span>
              </td>
              <td class="px-4 py-2">{{ grade.remarks || '-' }}</td>
              <td class="px-4 py-2">{{ formatDate(grade.exam?.exam_date) }}</td>
            </tr>
            <tr v-if="grades.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-500">{{ languageStore.t('noGradesData') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Pagination
        v-if="total > pageSize"
        :current-page="currentPage"
        :total-pages="Math.ceil(total / pageSize)"
        @page-change="handlePageChange"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import Pagination from '@/components/common/Pagination.vue'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const grades = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20
const averageGrade = ref(0)

const fetchGrades = async () => {
  const studentId = authStore.profile?.id
  
  if (!studentId) return
  
  const { data, error, count } = await supabase
    .from('grades')
    .select('*, exam:exams(subject, exam_type, max_score, exam_date)', { count: 'exact' })
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1)
  
  if (!error) {
    grades.value = data || []
    total.value = count || 0
    
    // Calculate average
    if (grades.value.length > 0) {
      const sum = grades.value.reduce((acc, g) => acc + (g.percentage || 0), 0)
      averageGrade.value = Math.round(sum / grades.value.length)
    }
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getPercentageClass = (percentage) => {
  if (percentage >= 90) return 'text-green-600 font-bold'
  if (percentage >= 80) return 'text-blue-600 font-bold'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  return 'text-red-600'
}

const getGradeClass = (grade) => {
  const classes = {
    'A': 'text-green-600 font-bold',
    'B': 'text-blue-600 font-bold',
    'C': 'text-yellow-600',
    'D': 'text-orange-600',
    'F': 'text-red-600 font-bold'
  }
  return classes[grade] || ''
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchGrades()
}

onMounted(() => {
  fetchGrades()
})
</script>