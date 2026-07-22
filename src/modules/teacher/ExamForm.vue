<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('editExam') : languageStore.t('createExam') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Class Selection with Search -->
          <div>
            <label class="form-label">{{ languageStore.t('class') }} *</label>

            <!-- Search Input -->
            <div class="relative mb-2">
              <input 
                v-model="classSearch" 
                type="text" 
                :placeholder="languageStore.t('searchClasses')"
                class="form-input pl-10"
                @input="filterClasses"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Class Dropdown -->
            <select v-model="form.class_id" required class="form-select" size="5">
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
            <input v-model="form.subject" type="text" required class="form-input" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('examType') }} *</label>
              <select v-model="form.exam_type" required class="form-select">
                <option value="quiz">{{ languageStore.t('quiz') }}</option>
                <option value="midterm">{{ languageStore.t('midterm') }}</option>
                <option value="assignment">{{ languageStore.t('assignment') }}</option>
                <option value="final">{{ languageStore.t('final') }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('maxScore') }} *</label>
              <input v-model.number="form.max_score" type="number" step="0.5" min="0" required class="form-input" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('examDate') }} *</label>
              <input v-model="form.exam_date" type="date" required class="form-input" />
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('term') }}</label>
              <input v-model="form.term" type="text" class="form-input" placeholder="e.g., Term 1" />
            </div>
          </div>

          <div>
            <label class="form-label">{{ languageStore.t('academicYear') }} *</label>
            <input v-model="form.academic_year" type="text" required class="form-input" placeholder="2024-2025" />
          </div>

          <div>
            <label class="form-label">{{ languageStore.t('description') }}</label>
            <textarea v-model="form.description" rows="3" class="form-textarea"></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="$router.back()" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? languageStore.t('saving') : languageStore.t('save') }}
            </button>
          </div>
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
const originalExamClassId = ref(null) // Store original class ID for security check

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
    const schoolId = authStore.profile?.school_id
    const teacherId = authStore.teacherId
    
    if (!schoolId) {
      console.log('No school ID found')
      isLoadingClasses.value = false
      return
    }
    
    if (!teacherId) {
      console.log('No teacher ID found. Make sure teacher is properly linked.')
      isLoadingClasses.value = false
      return
    }
    
    console.log('Loading classes for teacher ID:', teacherId)
    
    const { data: classes, error } = await supabase
      .from('classes')
      .select('id, name, grade_level, section')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })

    if (error) {
      console.error('Error loading classes:', error)
      return
    }

    myClasses.value = classes || []
    console.log('Classes loaded:', myClasses.value.length)
    
    if (myClasses.value.length === 0) {
      console.warn('No classes assigned to this teacher. Please ask admin to assign classes.')
    }
  } catch (error) {
    console.error('Error in loadMyClasses:', error)
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
  const schoolId = authStore.profile?.school_id
  
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
    created_by: authStore.teacherId // Track who created/updated it
  }

  let error
  if (isEdit.value) {
    // SECURITY CHECK: Ensure we're only updating the teacher's own exam
    const { error: updateError } = await supabase
      .from('exams')
      .update(examData)
      .eq('id', route.params.id)
      .in('class_id', myClasses.value.map(c => c.id)) // Only update if class belongs to teacher
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
  max-height: 200px;
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
</style>