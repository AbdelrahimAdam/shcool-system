<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('myStudents') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('studentsInYourClasses') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="w-full sm:w-64">
          <label class="text-xs font-medium text-gray-500">{{ languageStore.t('filterByClass') }}</label>
          <select v-model="selectedClassId" @change="loadStudents" class="form-select w-full mt-1">
            <option :value="null">{{ languageStore.t('allClasses') }}</option>
            <option v-for="cls in myClasses" :key="cls.id" :value="cls.id">
              {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }})
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-xs font-medium text-gray-500">{{ languageStore.t('search') }}</label>
          <input v-model="searchQuery" type="text" :placeholder="languageStore.t('searchByNameOrNumber')" class="form-input w-full mt-1" @input="debouncedSearch" />
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="card overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center">
        <div class="spinner"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">{{ languageStore.t('studentNumber') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('studentName') }}</th>
              <th class="px-4 py-3 text-left">{{ languageStore.t('class') }}</th>
              <th class="px-4 py-3 text-center">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-xs">{{ student.student_number }}</td>
              <td class="px-4 py-3 font-medium">{{ student.full_name }}</td>
              <td class="px-4 py-3">
                {{ getClassName(student.class_id) }}
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <router-link :to="`/teacher/students/${student.id}`" class="text-primary-600 hover:text-primary-700 text-sm">
                    {{ languageStore.t('view') }}
                  </router-link>
                  <router-link :to="`/teacher/grades?student=${student.id}`" class="text-green-600 hover:text-green-700 text-sm">
                    {{ languageStore.t('grades') }}
                  </router-link>
                  <router-link :to="`/teacher/attendance?student=${student.id}`" class="text-yellow-600 hover:text-yellow-700 text-sm">
                    {{ languageStore.t('attendance') }}
                  </router-link>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-500">{{ languageStore.t('noStudentsFound') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'

const teacherStore = useTeacherStore()
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
    s.student_number.toLowerCase().includes(query)
  )
})

const getClassName = (classId) => {
  const cls = myClasses.value.find(c => c.id === classId)
  return cls ? cls.name : '-'
}

const loadClasses = async () => {
  myClasses.value = await teacherStore.fetchMyClasses()
}

const loadStudents = async () => {
  isLoading.value = true
  try {
    students.value = await teacherStore.fetchMyStudents(selectedClassId.value)
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {}, 300)
}

onMounted(async () => {
  await loadClasses()
  await loadStudents()
})
</script>