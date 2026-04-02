<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('manageExams') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('createAndManageExams') }}</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addExam') }}
      </button>
    </div>

    <!-- Exams List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">{{ languageStore.t('subject') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('class') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('examType') }}</th>
              <th class="px-4 py-3 text-right">{{ languageStore.t('maxScore') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('examDate') }}</th>
              <th class="px-4 py-3 text-center">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in exams" :key="exam.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ exam.subject }}</td>
              <td class="px-4 py-3">{{ exam.class?.name }}</td>
              <td class="px-4 py-3">
                <span class="badge-neutral">{{ languageStore.t(exam.exam_type) }}</span>
              </td>
              <td class="px-4 py-3 text-right">{{ exam.max_score }}</td>
              <td class="px-4 py-3">{{ formatDate(exam.exam_date) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <router-link :to="`/teacher/exams/${exam.id}/edit`" class="text-primary-600 hover:text-primary-800">
                    {{ languageStore.t('edit') }}
                  </router-link>
                  <router-link :to="`/teacher/grade-entry?exam=${exam.id}`" class="text-green-600 hover:text-green-800">
                    {{ languageStore.t('enterGrades') }}
                  </router-link>
                  <button @click="deleteExam(exam.id)" class="text-red-600 hover:text-red-800">
                    {{ languageStore.t('delete') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="exams.length === 0 && !isLoadingExams">
              <td colspan="6" class="text-center py-8 text-gray-500">{{ languageStore.t('noExams') }}</td>
            </tr>
            <tr v-if="isLoadingExams">
              <td colspan="6" class="text-center py-8">
                <div class="spinner"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Exam Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ languageStore.t('createExam') }}</h2>
        <form @submit.prevent="createExam">
          <div class="space-y-4">
            <div>
              <label class="form-label">{{ languageStore.t('class') }} *</label>
              
              <!-- Search Input for Classes -->
              <div class="relative mb-2">
                <input 
                  v-model="classSearch" 
                  type="text" 
                  :placeholder="languageStore.t('searchClasses')"
                  class="form-input pl-10"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select v-model="newExam.class_id" required class="form-select">
                <option :value="null">{{ languageStore.t('selectClass') }}</option>
                <option 
                  v-for="cls in filteredClasses" 
                  :key="cls.id" 
                  :value="cls.id"
                >
                  {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }}) - {{ cls.section || 'A' }}
                </option>
              </select>
              
              <p v-if="myClasses.length === 0 && !isLoadingClasses" class="text-sm text-yellow-600 mt-2">
                {{ languageStore.t('noClassesAssigned') }}
              </p>
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('subject') }} *</label>
              <input v-model="newExam.subject" type="text" required class="form-input" />
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">{{ languageStore.t('examType') }} *</label>
                <select v-model="newExam.exam_type" required class="form-select">
                  <option value="quiz">{{ languageStore.t('quiz') }}</option>
                  <option value="midterm">{{ languageStore.t('midterm') }}</option>
                  <option value="assignment">{{ languageStore.t('assignment') }}</option>
                  <option value="final">{{ languageStore.t('final') }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('maxScore') }} *</label>
                <input v-model.number="newExam.max_score" type="number" step="0.5" min="0" required class="form-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">{{ languageStore.t('examDate') }} *</label>
                <input v-model="newExam.exam_date" type="date" required class="form-input" />
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('term') }}</label>
                <input v-model="newExam.term" type="text" class="form-input" placeholder="e.g., Term 1" />
              </div>
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('description') }}</label>
              <textarea v-model="newExam.description" rows="2" class="form-textarea"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary">
              {{ isSubmitting ? languageStore.t('creating') : languageStore.t('create') }}
            </button>
          </div>
        </form>
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

// Fetch exams
const fetchExams = async () => {
  isLoadingExams.value = true
  
  try {
    const schoolId = authStore.profile?.school_id
    const teacherId = authStore.teacherId
    
    if (!schoolId) {
      isLoadingExams.value = false
      return
    }
    
    let query = supabase
      .from('exams')
      .select('*, class:classes(name, grade_level)')
      .eq('school_id', schoolId)
      .order('exam_date', { ascending: false })

    // If teacher has classes assigned, filter by those classes
    if (teacherId && myClasses.value.length > 0) {
      const classIds = myClasses.value.map(c => c.id)
      if (classIds.length) {
        query = query.in('class_id', classIds)
      }
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching exams:', error)
      return
    }
    
    exams.value = data || []
    console.log('Exams loaded:', exams.value.length)
  } catch (error) {
    console.error('Error in fetchExams:', error)
  } finally {
    isLoadingExams.value = false
  }
}

// Create exam
const createExam = async () => {
  isSubmitting.value = true
  const schoolId = authStore.profile?.school_id

  if (!newExam.value.class_id) {
    alert(languageStore.t('pleaseSelectClass'))
    isSubmitting.value = false
    return
  }

  const examData = {
    ...newExam.value,
    school_id: schoolId,
    academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  }

  const { error } = await supabase
    .from('exams')
    .insert([examData])

  if (error) {
    console.error('Error creating exam:', error)
    alert(error.message)
  } else {
    closeModal()
    await fetchExams()
  }
  isSubmitting.value = false
}

// Delete exam
const deleteExam = async (id) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await fetchExams()
    } else {
      alert(error.message)
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
  // Ensure teacher_id is loaded from auth store
  if (authStore.role === 'teacher' && !authStore.teacherId) {
    await authStore.fetchTeacherId()
  }
  
  await fetchMyClasses()
  await fetchExams()
})
</script>