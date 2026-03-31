<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">Manage Grades</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="label">Select Class</label>
          <select v-model="selectedClass" class="input-field">
            <option :value="null">Select a class</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Select Exam</label>
          <select v-model="selectedExam" class="input-field">
            <option :value="null">Select an exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.subject }} - {{ exam.exam_type }} (Max: {{ exam.max_score }})
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button 
            @click="loadStudents" 
            :disabled="!selectedClass || !selectedExam" 
            class="btn-primary w-full"
          >
            Load Students
          </button>
        </div>
      </div>

      <div v-if="students.length && selectedExam" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">Student Name</th>
              <th class="px-3 py-2 text-center">Score (Max: {{ currentExam?.max_score }})</th>
              <th class="px-3 py-2 text-center">Percentage (%)</th>
              <th class="px-3 py-2 text-center">Grade</th>
              <th class="px-3 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-t">
              <td class="px-3 py-2">{{ student.full_name }}</td>
              <td class="px-3 py-2">
                <input 
                  v-model.number="grades[student.id].score" 
                  type="number" 
                  :max="currentExam?.max_score"
                  min="0"
                  step="0.5"
                  class="input-field text-center w-24"
                  @input="calculatePercentage(student.id)"
                />
              </td>
              <td class="px-3 py-2 text-center font-medium">
                {{ grades[student.id].percentage?.toFixed(1) || '-' }}%
              </td>
              <td class="px-3 py-2 text-center">
                <span :class="getGradeClass(grades[student.id].grade)">
                  {{ grades[student.id].grade || '-' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <input 
                  v-model="grades[student.id].remarks" 
                  type="text" 
                  class="input-field text-sm"
                  placeholder="Remarks"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <button @click="saveGrades" :disabled="isLoading" class="btn-primary">
            {{ isLoading ? 'Saving...' : 'Save Grades' }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedClass && selectedExam && !students.length && loaded" class="text-center py-8 text-gray-500">
        No students found in this class
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../services/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const classes = ref([])
const exams = ref([])
const students = ref([])
const selectedClass = ref(null)
const selectedExam = ref(null)
const grades = ref({})
const isLoading = ref(false)
const loaded = ref(false)

const currentExam = computed(() => {
  return exams.value.find(e => e.id === selectedExam.value)
})

// Load classes
const loadClasses = async () => {
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', authStore.profile?.school_id)
    .order('grade_level')
  classes.value = data || []
}

// Load exams when class changes
const loadExams = async () => {
  if (!selectedClass.value) return
  
  const { data } = await supabase
    .from('exams')
    .select('*')
    .eq('class_id', selectedClass.value)
    .eq('school_id', authStore.profile?.school_id)
    .order('exam_date', { ascending: false })
  exams.value = data || []
}

// Load students and existing grades
const loadStudents = async () => {
  if (!selectedClass.value || !selectedExam.value) return
  
  loaded.value = false
  
  const { data: studentList } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('class_id', selectedClass.value)
    .eq('status', 'active')
    .order('full_name')
  students.value = studentList || []

  // Fetch existing grades
  const { data: existingGrades } = await supabase
    .from('grades')
    .select('*')
    .eq('exam_id', selectedExam.value)

  // Initialize grades data
  grades.value = {}
  students.value.forEach(s => {
    const existing = existingGrades?.find(g => g.student_id === s.id)
    grades.value[s.id] = {
      score: existing?.score || '',
      percentage: existing?.percentage || null,
      grade: existing?.grade || '',
      remarks: existing?.remarks || ''
    }
    if (existing?.score) {
      calculatePercentage(s.id)
    }
  })
  
  loaded.value = true
}

// Calculate percentage and grade
const calculatePercentage = (studentId) => {
  const score = grades.value[studentId].score
  const maxScore = currentExam.value?.max_score
  
  if (score && maxScore && maxScore > 0) {
    const percentage = (score / maxScore) * 100
    grades.value[studentId].percentage = percentage
    
    // Assign letter grade
    if (percentage >= 90) grades.value[studentId].grade = 'A'
    else if (percentage >= 80) grades.value[studentId].grade = 'B'
    else if (percentage >= 70) grades.value[studentId].grade = 'C'
    else if (percentage >= 60) grades.value[studentId].grade = 'D'
    else grades.value[studentId].grade = 'F'
  } else {
    grades.value[studentId].percentage = null
    grades.value[studentId].grade = ''
  }
}

// Get grade color class
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

// Save grades
const saveGrades = async () => {
  isLoading.value = true
  const schoolId = authStore.profile?.school_id

  const records = students.value.map(student => ({
    school_id: schoolId,
    student_id: student.id,
    exam_id: selectedExam.value,
    score: grades.value[student.id].score,
    percentage: grades.value[student.id].percentage,
    grade: grades.value[student.id].grade,
    remarks: grades.value[student.id].remarks
  }))

  // Delete existing grades for this exam
  const { error: deleteError } = await supabase
    .from('grades')
    .delete()
    .eq('exam_id', selectedExam.value)

  if (!deleteError) {
    // Filter out records with no score
    const validRecords = records.filter(r => r.score && r.score > 0)
    
    if (validRecords.length > 0) {
      const { error } = await supabase.from('grades').insert(validRecords)
      if (error) {
        console.error('Error saving grades:', error)
        alert('Error saving grades')
      } else {
        alert('Grades saved successfully!')
      }
    } else {
      alert('No grades to save')
    }
  }

  isLoading.value = false
}

// Watch for class changes
import { watch } from 'vue'
watch(selectedClass, () => {
  selectedExam.value = null
  loadExams()
})

onMounted(() => {
  loadClasses()
})
</script>