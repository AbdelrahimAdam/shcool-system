<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('myStudents') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('studentsInYourClasses') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 dark:bg-gray-800 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('filterByClass') }}</label>
          <select v-model="selectedClassId" @change="loadStudents" class="form-select w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option :value="null">{{ languageStore.t('allClasses') }}</option>
            <option v-for="cls in myClasses" :key="cls.id" :value="cls.id">
              {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }})
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ languageStore.t('search') }}</label>
          <input v-model="searchQuery" type="text" :placeholder="languageStore.t('searchByNameOrNumber')" class="form-input w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" @input="debouncedSearch" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
    </div>

    <!-- Content: Desktop + Mobile (shown when not loading) -->
    <template v-else>
      <!-- Desktop Table View (hidden on mobile) -->
      <div class="hidden sm:block card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm dark:text-gray-200">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left dark:text-gray-300">{{ languageStore.t('studentNumber') }}</th>
                <th class="px-4 py-3 text-left dark:text-gray-300">{{ languageStore.t('studentName') }}</th>
                <th class="px-4 py-3 text-left dark:text-gray-300">{{ languageStore.t('class') }}</th>
                <th class="px-4 py-3 text-center dark:text-gray-300">{{ languageStore.t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id" class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-4 py-3 font-mono text-xs dark:text-gray-400">{{ student.student_number }}</td>
                <td class="px-4 py-3 font-medium dark:text-gray-200">{{ student.full_name }}</td>
                <td class="px-4 py-3 dark:text-gray-300">
                  {{ getClassName(student.class_id) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-3">
                    <router-link :to="`/teacher/students/${student.id}`" class="text-primary-600 hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      {{ languageStore.t('view') }}
                    </router-link>
                    <span class="text-gray-300 dark:text-gray-600">|</span>
                    <router-link :to="`/teacher/grades?student=${student.id}`" class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium">
                      {{ languageStore.t('grades') }}
                    </router-link>
                    <span class="text-gray-300 dark:text-gray-600">|</span>
                    <router-link :to="`/teacher/attendance?student=${student.id}`" class="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium">
                      {{ languageStore.t('attendance') }}
                    </router-link>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-500 dark:text-gray-400">{{ languageStore.t('noStudentsFound') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Card View (visible only on mobile) -->
      <div class="sm:hidden space-y-4">
        <div v-if="filteredStudents.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noStudentsFound') }}
        </div>
        
        <div 
          v-for="student in filteredStudents" 
          :key="student.id" 
          class="card dark:bg-gray-800 dark:border-gray-700 p-4 space-y-3"
        >
          <!-- Header: Student Name and Number -->
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">{{ student.full_name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{{ languageStore.t('studentNumber') }}: {{ student.student_number }}</p>
            </div>
            <span class="badge-neutral dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
              {{ getClassName(student.class_id) }}
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <router-link 
              :to="`/teacher/students/${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {{ languageStore.t('view') }}
            </router-link>
            <router-link 
              :to="`/teacher/grades?student=${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              {{ languageStore.t('grades') }}
            </router-link>
            <router-link 
              :to="`/teacher/attendance?student=${student.id}`" 
              class="flex-1 min-w-[60px] text-center px-3 py-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
              {{ languageStore.t('attendance') }}
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const myClasses = ref([])
const students = ref([])
const selectedClassId = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
let searchTimeout = null

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(s => 
    s.full_name.toLowerCase().includes(query) || 
    s.student_number?.toLowerCase().includes(query) || ''
  )
})

const getClassName = (classId) => {
  const cls = myClasses.value.find(c => c.id === classId)
  return cls ? cls.name : '-'
}

const loadClasses = async () => {
  try {
    let schoolId = authStore.schoolId
    
    if (!schoolId) {
      schoolId = authStore.profile?.school_id
    }
    
    if (!schoolId) {
      schoolId = localStorage.getItem('schoolId')
    }
    
    const teacherId = authStore.teacherId
    
    if (!schoolId || !teacherId) {
      console.log('No school ID or teacher ID found')
      return
    }

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_level, section')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })

    if (error) {
      console.error('Error loading classes:', error)
      return
    }

    myClasses.value = data || []
    console.log('Classes loaded:', myClasses.value.length)
  } catch (error) {
    console.error('Error in loadClasses:', error)
  }
}

const loadStudents = async () => {
  isLoading.value = true
  try {
    let schoolId = authStore.schoolId
    
    if (!schoolId) {
      schoolId = authStore.profile?.school_id
    }
    
    if (!schoolId) {
      schoolId = localStorage.getItem('schoolId')
    }

    let query = supabase
      .from('students')
      .select('id, full_name, student_number, class_id')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .order('full_name')

    if (selectedClassId.value) {
      query = query.eq('class_id', selectedClassId.value)
    } else if (myClasses.value.length > 0) {
      const classIds = myClasses.value.map(c => c.id)
      query = query.in('class_id', classIds)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading students:', error)
      return
    }

    students.value = data || []
    console.log('Students loaded:', students.value.length)
  } catch (error) {
    console.error('Error in loadStudents:', error)
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {}, 300)
}

onMounted(async () => {
  if (authStore.role === 'teacher' && !authStore.teacherId) {
    await authStore.fetchTeacherId()
  }
  
  await loadClasses()
  await loadStudents()
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

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}

/* Mobile Card Styles */
@media (max-width: 640px) {
  .card {
    padding: 0.75rem;
  }
  
  .badge-neutral {
    font-size: 0.65rem;
    padding: 2px 10px;
  }
}
</style>