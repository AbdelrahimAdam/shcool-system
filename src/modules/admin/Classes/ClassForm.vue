<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('classes') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">{{ languageStore.t('className') }} *</label>
            <input v-model="form.name" type="text" required class="input-field" />
          </div>

          <div>
            <label class="label">{{ languageStore.t('arabicName') }}</label>
            <input v-model="form.arabic_name" type="text" class="input-field" dir="rtl" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('gradeLevel') }} *</label>
              <select v-model="form.grade_level" required class="input-field">
                <option v-for="i in 12" :key="i" :value="i">{{ languageStore.t('grade') }} {{ i }}</option>
              </select>
            </div>

            <div>
              <label class="label">{{ languageStore.t('section') }}</label>
              <input v-model="form.section" type="text" class="input-field" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('teacher') }}</label>
              <select v-model="form.teacher_id" class="input-field">
                <option :value="null">{{ languageStore.t('selectTeacher') }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.full_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">{{ languageStore.t('capacity') }} *</label>
              <input v-model.number="form.capacity" type="number" min="1" max="100" required class="input-field" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('currentEnrollment') }}</label>
              <input v-model.number="form.current_enrollment" type="number" min="0" class="input-field" />
              <p class="text-xs text-gray-400 mt-1">{{ languageStore.t('currentEnrollmentNote') }}</p>
            </div>

            <div>
              <label class="label">{{ languageStore.t('academicYear') }} *</label>
              <input v-model="form.academic_year" type="text" required class="input-field" placeholder="2024-2025" />
            </div>
          </div>

          <div>
            <label class="label">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="input-field">
              <option value="active">{{ languageStore.t('active') }}</option>
              <option value="inactive">{{ languageStore.t('inactive') }}</option>
              <option value="archived">{{ languageStore.t('archived') }}</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button type="button" @click="$router.back()" class="btn-secondary">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? languageStore.t('loading') : languageStore.t('save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClassStore } from '../../../stores/class'
import { useTeacherStore } from '../../../stores/teacher'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const classStore = useClassStore()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const teachers = ref([])

const form = ref({
  name: '',
  arabic_name: '',
  grade_level: 1,
  section: '',
  teacher_id: null,
  capacity: 30,
  current_enrollment: 0,
  academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
  status: 'active'
})

const loadTeachers = async () => {
  try {
    const { data } = await teacherStore.fetchTeachers(1, { status: 'active' })
    teachers.value = data || []
  } catch (error) {
    console.error('Error loading teachers:', error)
    teachers.value = []
  }
}

const loadClass = async () => {
  if (isEdit.value) {
    try {
      const classData = await classStore.getClassById(route.params.id)
      if (classData) {
        form.value = {
          name: classData.name || '',
          arabic_name: classData.arabic_name || '',
          grade_level: classData.grade_level || 1,
          section: classData.section || '',
          teacher_id: classData.teacher_id || null,
          capacity: classData.capacity || 30,
          current_enrollment: classData.current_enrollment || 0,
          academic_year: classData.academic_year || (new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)),
          status: classData.status || 'active'
        }
      }
    } catch (error) {
      console.error('Error loading class:', error)
      alert(languageStore.t('errorLoadingClass'))
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    let result
    
    if (isEdit.value) {
      result = await classStore.updateClass(route.params.id, form.value)
    } else {
      result = await classStore.createClass(form.value)
    }
    
    if (result.success) {
      router.push('/admin/classes')
    } else {
      alert(result.error || languageStore.t('operationFailed'))
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(languageStore.t('operationFailed'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTeachers()
  loadClass()
})
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}
</style>