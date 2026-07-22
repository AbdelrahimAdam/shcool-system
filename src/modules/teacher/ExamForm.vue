<template>
  <div class="max-w-2xl mx-auto h-full flex flex-col min-h-0">
    <div class="card p-4 sm:p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
      <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex-shrink-0">{{ isEdit ? languageStore.t('editExam') : languageStore.t('createExam') }}</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 min-h-0">
        <div class="flex-1 overflow-y-auto px-1 -mx-1">
          <div class="space-y-4 pb-4">
            <!-- Class Selection with Search -->
            <div>
              <label class="form-label">{{ languageStore.t('class') }} *</label>

              <!-- Search Input -->
              <div class="relative mb-2">
                <input 
                  v-model="classSearch" 
                  type="text" 
                  :placeholder="languageStore.t('searchClasses')"
                  class="form-input pl-10 w-full"
                  @input="filterClasses"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Class Dropdown -->
              <select v-model="form.class_id" required class="form-select w-full" size="4">
                <option :value="null">{{ languageStore.t('selectClass') }}</option>
                <option 
                  v-for="cls in filteredClasses" 
                  :key="cls.id" 
                  :value="cls.id"
                  :class="{ 'bg-primary-50': form.class_id === cls.id }"
                >
                  {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }}) - {{ cls.section || 'A' }}
                </option>
              </select>

              <!-- Loading State -->
              <div v-if="isLoadingClasses" class="text-center py-4">
                <div class="spinner"></div>
              </div>

              <!-- No results message -->
              <p v-if="!isLoadingClasses && filteredClasses.length === 0 && classSearch" class="text-sm text-gray-500 mt-2">
                {{ languageStore.t('noClassesFound') }}
              </p>

              <p v-if="!isLoadingClasses && filteredClasses.length === 0 && !classSearch && !isLoadingClasses" class="text-sm text-yellow-600 mt-2">
                {{ languageStore.t('noClassesAssigned') }}
              </p>
            </div>

            <div>
              <label class="form-label">{{ languageStore.t('subject') }} *</label>
              <input v-model="form.subject" type="text" required class="form-input w-full" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">{{ languageStore.t('examType') }} *</label>
                <select v-model="form.exam_type" required class="form-select w-full">
                  <option value="quiz">{{ languageStore.t('quiz') }}</option>
                  <option value="midterm">{{ languageStore.t('midterm') }}</option>
                  <option value="assignment">{{ languageStore.t('assignment') }}</option>
                  <option value="final">{{ languageStore.t('final') }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('maxScore') }} *</label>
                <input v-model.number="form.max_score" type="number" step="0.5" min="0" required class="form-input w-full" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">{{ languageStore.t('examDate') }} *</label>
                <input v-model="form.exam_date" type="date" required class="form-input w-full" />
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('term') }}</label>
                <input v-model="form.term" type="text" class="form-input w-full" placeholder="e.g., Term 1" />
              </div>
            </div>

            <div>
              <label class="form-label">{{ languageStore.t('academicYear') }} *</label>
              <input v-model="form.academic_year" type="text" required class="form-input w-full" placeholder="2024-2025" />
            </div>

            <div>
              <label class="form-label">{{ languageStore.t('description') }}</label>
              <textarea v-model="form.description" rows="3" class="form-textarea w-full"></textarea>
            </div>
          </div>
        </div>

        <!-- Fixed bottom buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button type="button" @click="$router.back()" class="btn-secondary w-full sm:w-auto order-2 sm:order-1">
            {{ languageStore.t('cancel') }}
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary w-full sm:w-auto order-1 sm:order-2">
            {{ isLoading ? languageStore.t('saving') : languageStore.t('save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const isLoadingClasses = ref(false)
const myClasses = ref([])
const classSearch = ref('')
const originalExamClassId = ref(null)

const form = ref({
  class_id: null,
  subject: '',
  exam_type: 'quiz',
  max_score: 100,
  exam_date: new Date().toISOString().split('T')[0],
  term: '',
  academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
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

// Load classes assigned to this teacher
const loadMyClasses = async () => {
  isLoadingClasses.value = true
  
  try {
    // FIX: Use authStore.schoolId with fallbacks
    let schoolId = authStore.schoolId
    
    if (!schoolId) {
      schoolId = authStore.profile?.school_id
    }
    
    if (!schoolId) {
      schoolId = localStorage.getItem('schoolId')
    }
    
    const teacherId = authStore.teacherId
    
    if (!schoolId) {
      console.log('No school ID found')
      alert('School not found. Please logout and login again.')
      isLoadingClasses.value = false
      return
    }
    
    if (!teacherId) {
      console.log('No teacher ID found.')
      alert('Teacher profile not found. Please contact administrator.')
      isLoadingClasses.value = false
      return
    }
    
    console.log('Loading classes for teacher ID:', teacherId, 'School ID:', schoolId)
    
    const { data: classes, error } = await supabase
      .from('classes')
      .select('id, name, grade_level, section')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })

    if (error) {
      console.error('Error loading classes:', error)
      alert('Failed to load classes: ' + error.message)
      return
    }

    myClasses.value = classes || []
    console.log('Classes loaded:', myClasses.value.length)
    
    if (myClasses.value.length === 0) {
      console.warn('No classes assigned to this teacher.')
    }
  } catch (error) {
    console.error('Error in loadMyClasses:', error)
    alert('Failed to load classes. Please try again.')
  } finally {
    isLoadingClasses.value = false
  }
}

// Load exam data if editing
const loadExam = async () => {
  if (isEdit.value) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (error) {
      console.error('Error loading exam:', error)
      return
    }
    
    if (data) {
      // SECURITY CHECK: Verify the exam belongs to one of the teacher's classes
      const isTeacherClass = myClasses.value.some(c => c.id === data.class_id)
      if (!isTeacherClass) {
        alert('You do not have permission to edit this exam')
        router.push('/teacher/exams')
        return
      }
      
      form.value = data
      originalExamClassId.value = data.class_id
    }
  }
}

// Handle form submission
const handleSubmit = async () => {
  isLoading.value = true
  
  // FIX: Get school_id with fallbacks
  let schoolId = authStore.schoolId
  
  if (!schoolId) {
    schoolId = authStore.profile?.school_id
  }
  
  if (!schoolId) {
    schoolId = localStorage.getItem('schoolId')
  }
  
  const teacherId = authStore.teacherId
  
  if (!schoolId) {
    alert('No school found. Please contact administrator.')
    isLoading.value = false
    return
  }

  if (!form.value.class_id) {
    alert(languageStore.t('pleaseSelectClass'))
    isLoading.value = false
    return
  }

  // SECURITY CHECK: Verify the selected class belongs to this teacher
  const selectedClass = myClasses.value.find(c => c.id === form.value.class_id)
  if (!selectedClass) {
    alert('You can only create exams for your assigned classes')
    isLoading.value = false
    return
  }

  // SECURITY CHECK: For edit, verify the class hasn't been changed to an unauthorized class
  if (isEdit.value && originalExamClassId.value !== form.value.class_id) {
    const newClass = myClasses.value.find(c => c.id === form.value.class_id)
    if (!newClass) {
      alert('You can only assign exams to your assigned classes')
      isLoading.value = false
      return
    }
  }

  const examData = { 
    ...form.value, 
    school_id: schoolId,
    academic_year: form.value.academic_year || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    created_by: teacherId
  }

  let error
  if (isEdit.value) {
    // SECURITY CHECK: Ensure we're only updating the teacher's own exam
    const { error: updateError } = await supabase
      .from('exams')
      .update(examData)
      .eq('id', route.params.id)
      .in('class_id', myClasses.value.map(c => c.id))
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('exams')
      .insert([examData])
    error = insertError
  }

  if (error) {
    console.error('Error saving exam:', error)
    alert(error.message)
  } else {
    router.push('/teacher/exams')
  }
  isLoading.value = false
}

onMounted(async () => {
  // Ensure teacher_id is loaded from auth store
  if (authStore.role === 'teacher' && !authStore.teacherId) {
    await authStore.fetchTeacherId()
  }
  
  // SECURITY FIX: Load classes first, then load exam
  await loadMyClasses()
  await loadExam()
})
</script>

<style scoped>
select[size] {
  max-height: 150px;
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

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .form-input, .form-select, .form-textarea {
    font-size: 14px;
    padding: 0.5rem 0.75rem;
  }
  
  select[size] {
    max-height: 120px;
  }
}

/* Scrollable form container */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Custom scrollbar */
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
</style>