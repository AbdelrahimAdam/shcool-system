<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('exams') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('manageExams') }}</p>
      </div>
      <router-link to="/admin/exams/create" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addExam') }}
      </router-link>
    </div>

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
              <th class="px-4 py-3 text-left">{{ languageStore.t('term') }}</th>
              <th class="px-4 py-3 text-center">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in exams" :key="exam.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ exam.subject }}</td>
              <td class="px-4 py-3">{{ exam.class?.name }}</td>
              <td class="px-4 py-3">{{ languageStore.t(exam.exam_type) }}</td>
              <td class="px-4 py-3 text-right">{{ exam.max_score }}</td>
              <td class="px-4 py-3">{{ formatDate(exam.exam_date) }}</td>
              <td class="px-4 py-3">{{ exam.term }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <router-link :to="`/admin/exams/${exam.id}/edit`" class="text-primary-600 hover:text-primary-800">
                    {{ languageStore.t('edit') }}
                  </router-link>
                  <button @click="deleteExam(exam.id)" class="text-red-600 hover:text-red-800">
                    {{ languageStore.t('delete') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="exams.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">{{ languageStore.t('noExams') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const exams = ref([])

const fetchExams = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return

  const { data } = await supabase
    .from('exams')
    .select('*, class:classes(name)')
    .eq('school_id', schoolId)
    .order('exam_date', { ascending: false })

  exams.value = data || []
}

const deleteExam = async (id) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase.from('exams').delete().eq('id', id)
    if (!error) fetchExams()
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString()

onMounted(() => {
  fetchExams()
})
</script>