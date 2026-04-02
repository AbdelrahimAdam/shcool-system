<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('editExam') : languageStore.t('addExam') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="form-label">{{ languageStore.t('subject') }} *</label>
            <input v-model="form.subject" type="text" required class="form-input" />
          </div>

          <div>
            <label class="form-label">{{ languageStore.t('class') }} *</label>
            <select v-model="form.class_id" required class="form-select">
              <option :value="null">{{ languageStore.t('selectClass') }}</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ languageStore.t('examType') }} *</label>
              <select v-model="form.exam_type" required class="form-select">
                <option value="midterm">{{ languageStore.t('midterm') }}</option>
                <option value="final">{{ languageStore.t('final') }}</option>
                <option value="quiz">{{ languageStore.t('quiz') }}</option>
                <option value="assignment">{{ languageStore.t('assignment') }}</option>
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
              <label class="form-label">{{ languageStore.t('term') }} *</label>
              <input v-model="form.term" type="text" required class="form-input" placeholder="e.g., Term 1" />
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
import { ref, onMounted } from 'vue'
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
const classes = ref([])

const form = ref({
  subject: '',
  class_id: null,
  exam_type: 'midterm',
  max_score: 100,
  exam_date: new Date().toISOString().split('T')[0],
  term: '',
  academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
  description: ''
})

const loadClasses = async () => {
  const schoolId = authStore.profile?.school_id
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', schoolId)
    .order('grade_level')
  classes.value = data || []
}

const loadExam = async () => {
  if (isEdit.value) {
    const { data } = await supabase
      .from('exams')
      .select('*')
      .eq('id', route.params.id)
      .single()
    if (data) form.value = data
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  const schoolId = authStore.profile?.school_id
  const examData = { ...form.value, school_id: schoolId }

  let error
  if (isEdit.value) {
    const { error: updateError } = await supabase
      .from('exams')
      .update(examData)
      .eq('id', route.params.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('exams')
      .insert([examData])
    error = insertError
  }

  if (error) {
    alert(error.message)
  } else {
    router.push('/admin/exams')
  }
  isLoading.value = false
}

onMounted(() => {
  loadClasses()
  loadExam()
})
</script>