<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('grades') }}</h1>
    
    <div class="card p-6">
      <div class="mb-6">
        <label class="label">{{ languageStore.t('selectChild') }}</label>
        <select v-model="selectedChildId" class="input-field max-w-md" @change="loadGrades">
          <option :value="null">{{ languageStore.t('selectChild') }}</option>
          <option v-for="child in children" :key="child.id" :value="child.id">
            {{ child.full_name }}
          </option>
        </select>
      </div>
      
      <div v-if="selectedChild && !loading" class="space-y-6">
        <!-- Grade Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-primary-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-primary-600">{{ overallAverage }}%</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('overallAverage') }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-lg font-bold text-green-600">{{ bestSubject?.subject || '-' }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('bestSubject') }}</p>
            <p class="text-xs text-green-600" v-if="bestSubject">{{ bestSubject.average }}%</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <p class="text-lg font-bold text-red-600">{{ worstSubject?.subject || '-' }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('needsImprovement') }}</p>
            <p class="text-xs text-red-600" v-if="worstSubject">{{ worstSubject.average }}%</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-yellow-600">{{ totalExams }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('totalExams') }}</p>
          </div>
        </div>
        
        <!-- Grades by Subject -->
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-3">{{ languageStore.t('gradesBySubject') }}</h3>
          <div class="space-y-3">
            <div v-for="subject in subjectsGrades" :key="subject.name" class="space-y-1">
              <div class="flex justify-between text-sm">
                <span>{{ subject.name }}</span>
                <span :class="getGradeColor(subject.average)">{{ subject.average }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  class="h-1.5 rounded-full transition-all" 
                  :class="getProgressBarColor(subject.average)"
                  :style="{ width: `${subject.average}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Detailed Grades Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">{{ languageStore.t('subject') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('examType') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('score') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('percentage') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('grade') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="grade in grades" :key="grade.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{{ grade.exam?.subject }}</td>
                <td class="px-4 py-2">{{ languageStore.t(grade.exam?.exam_type) }}</td>
                <td class="px-4 py-2 text-center">{{ grade.score }} / {{ grade.exam?.max_score }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="getGradeColor(grade.percentage)">{{ grade.percentage }}%</span>
                </td>
                <td class="px-4 py-2 text-center">
                  <span class="font-bold" :class="getGradeColor(grade.percentage)">{{ grade.grade }}</span>
                </td>
                <td class="px-4 py-2">{{ formatDate(grade.exam?.exam_date) }}</td>
              </tr>
              <tr v-if="grades.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-500">
                  {{ languageStore.t('noGrades') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="!loading && !selectedChild" class="text-center py-12 text-gray-500">
        {{ languageStore.t('selectChildToViewGrades') }}
      </div>
      
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const children = ref([])
const selectedChildId = ref(null)
const selectedChild = ref(null)
const grades = ref([])
const loading = ref(false)

const overallAverage = computed(() => {
  if (grades.value.length === 0) return 0
  const total = grades.value.reduce((sum, g) => sum + (g.percentage || 0), 0)
  return Math.round(total / grades.value.length)
})

const totalExams = computed(() => grades.value.length)

const subjectsGrades = computed(() => {
  const subjectsMap = new Map()
  
  grades.value.forEach(grade => {
    const subject = grade.exam?.subject
    if (!subject) return
    
    if (!subjectsMap.has(subject)) {
      subjectsMap.set(subject, [])
    }
    subjectsMap.get(subject).push(grade.percentage)
  })
  
  return Array.from(subjectsMap.entries()).map(([name, percentages]) => ({
    name,
    average: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
  }))
})

const bestSubject = computed(() => {
  if (subjectsGrades.value.length === 0) return null
  return subjectsGrades.value.reduce((best, current) => 
    current.average > best.average ? current : best
  , subjectsGrades.value[0])
})

const worstSubject = computed(() => {
  if (subjectsGrades.value.length === 0) return null
  return subjectsGrades.value.reduce((worst, current) => 
    current.average < worst.average ? current : worst
  , subjectsGrades.value[0])
})

const loadChildren = async () => {
  const parentId = authStore.profile?.id
  
  if (!parentId) return
  
  const { data } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('parent_id', parentId)
  
  children.value = data || []
}

const loadGrades = async () => {
  if (!selectedChildId.value) return
  
  loading.value = true
  
  selectedChild.value = children.value.find(c => c.id === selectedChildId.value)
  
  const { data } = await supabase
    .from('grades')
    .select(`
      *,
      exam:exams(
        subject,
        exam_type,
        max_score,
        exam_date
      )
    `)
    .eq('student_id', selectedChildId.value)
    .order('created_at', { ascending: false })
  
  grades.value = data || []
  loading.value = false
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 80) return 'text-blue-600'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 60) return 'text-orange-600'
  return 'text-red-600'
}

const getProgressBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-600'
  if (percentage >= 80) return 'bg-blue-600'
  if (percentage >= 70) return 'bg-yellow-600'
  if (percentage >= 60) return 'bg-orange-600'
  return 'bg-red-600'
}

onMounted(() => {
  loadChildren()
})
</script>