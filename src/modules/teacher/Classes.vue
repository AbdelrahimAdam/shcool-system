<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('myClasses') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('classesYouTeach') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="cls in myClasses" :key="cls.id" class="card p-5 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-semibold text-primary-600">{{ cls.name }}</h3>
          <span class="badge-success text-xs px-2 py-1 rounded-full">{{ languageStore.t('active') }}</span>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">{{ languageStore.t('gradeLevel') }}:</span>
            <span class="font-medium">{{ languageStore.t('grade') }} {{ cls.grade_level }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ languageStore.t('students') }}:</span>
            <span class="font-medium">{{ cls.current_enrollment }}/{{ cls.capacity }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-primary-600 rounded-full h-2" :style="{ width: `${(cls.current_enrollment / cls.capacity) * 100}%` }"></div>
          </div>
        </div>
        <div class="flex gap-2 mt-4 pt-3 border-t">
          <router-link :to="`/teacher/attendance?class=${cls.id}`" class="btn-secondary text-sm flex-1 text-center">
            {{ languageStore.t('markAttendance') }}
          </router-link>
          <router-link :to="`/teacher/students?class=${cls.id}`" class="btn-outline text-sm flex-1 text-center">
            {{ languageStore.t('viewStudents') }}
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="myClasses.length === 0 && !isLoading" class="card p-12 text-center text-gray-500">
      {{ languageStore.t('noClassesAssigned') }}
    </div>
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'

const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const myClasses = ref([])
const isLoading = ref(false)

const loadClasses = async () => {
  isLoading.value = true
  try {
    myClasses.value = await teacherStore.fetchMyClasses()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadClasses()
})
</script>