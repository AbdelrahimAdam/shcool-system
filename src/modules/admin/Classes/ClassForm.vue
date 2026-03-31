<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('classes') }}</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">{{ languageStore.t('className') }}</label>
            <input v-model="form.name" type="text" required class="input-field" />
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('arabicName') }}</label>
            <input v-model="form.arabic_name" type="text" class="input-field" dir="rtl" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('gradeLevel') }}</label>
              <select v-model="form.grade_level" required class="input-field">
                <option v-for="i in 12" :key="i" :value="i">Grade {{ i }}</option>
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
              <label class="label">{{ languageStore.t('capacity') }}</label>
              <input v-model.number="form.capacity" type="number" min="1" max="100" required class="input-field" />
            </div>
          </div>
          
          <div>
            <label class="label">{{ languageStore.t('academicYear') }}</label>
            <input v-model="form.academic_year" type="text" required class="input-field" placeholder="2024-2025" />
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
  academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
})

const loadTeachers = async () => {
  const { data } = await teacherStore.fetchTeachers(1, { status: 'active' })
  teachers.value = data || []
}

const loadClass = async () => {
  if (isEdit.value) {
    const classData = await classStore.getClassById(route.params.id)
    if (classData) {
      form.value = { ...classData }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  let result
  
  if (isEdit.value) {
    result = await classStore.updateClass(route.params.id, form.value)
  } else {
    result = await classStore.createClass(form.value)
  }
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/admin/classes')
  }
}

onMounted(() => {
  loadTeachers()
  loadClass()
})
</script>