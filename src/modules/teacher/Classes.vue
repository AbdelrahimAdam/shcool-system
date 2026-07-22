<template>
  <div class="flex flex-col h-full min-h-0">
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="space-y-6 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ languageStore.t('myClasses') }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('classesYouTeach') }}</p>
        </div>

        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="spinner dark:border-gray-600 dark:border-t-primary-400"></div>
        </div>

        <div v-else-if="myClasses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="cls in myClasses" :key="cls.id" class="card bg-white dark:bg-gray-800 p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">{{ cls.name }}</h3>
              <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full flex-shrink-0">{{ languageStore.t('active') }}</span>
            </div>
            <div class="space-y-2 text-sm flex-1">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('gradeLevel') }}:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ languageStore.t('grade') }} {{ cls.grade_level }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('students') }}:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ cls.current_enrollment }}/{{ cls.capacity }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div class="bg-primary-600 dark:bg-primary-500 rounded-full h-2 transition-all duration-300" :style="{ width: `${(cls.current_enrollment / cls.capacity) * 100}%` }"></div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <router-link :to="`/teacher/attendance?class=${cls.id}`" class="btn-secondary text-sm flex-1 text-center py-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                {{ languageStore.t('markAttendance') }}
              </router-link>
              <router-link :to="`/teacher/students?class=${cls.id}`" class="btn-outline text-sm flex-1 text-center py-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                {{ languageStore.t('viewStudents') }}
              </router-link>
            </div>
          </div>
        </div>

        <div v-else-if="myClasses.length === 0 && !isLoading" class="card bg-white dark:bg-gray-800 p-12 text-center text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noClassesAssigned') }}
        </div>
      </div>
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
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadClasses()
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

/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
  .card {
    padding: 1rem;
  }
  
  .card h3 {
    font-size: 1rem;
  }
  
  .btn-secondary, .btn-outline {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 0.75rem;
  }
  
  .card h3 {
    font-size: 0.9rem;
  }
  
  .space-y-6 {
    gap: 1rem;
  }
  
  .grid {
    gap: 1rem;
  }
}

/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
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
</style>