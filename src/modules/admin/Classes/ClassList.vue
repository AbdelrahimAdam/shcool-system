<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('classes') }}</h1>
      <router-link to="/admin/classes/create" class="btn-primary inline-flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ languageStore.t('addClass') }}</span>
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div class="relative">
          <input
            v-model="filters.search"
            type="text"
            :placeholder="languageStore.t('searchClasses')"
            class="input-field w-full pl-10"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            v-if="filters.search"
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Grade Level Filter -->
        <div>
          <select v-model="filters.grade_level" class="input-field w-full" @change="applyFilters">
            <option value="">{{ languageStore.t('allGrades') }}</option>
            <option v-for="i in 12" :key="i" :value="i">{{ languageStore.t('grade') }} {{ i }}</option>
          </select>
        </div>

        <!-- Teacher Filter -->
        <div>
          <select v-model="filters.teacher_id" class="input-field w-full" @change="applyFilters">
            <option value="">{{ languageStore.t('allTeachers') }}</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.full_name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <select v-model="filters.status" class="input-field w-full" @change="applyFilters">
            <option value="">{{ languageStore.t('allStatuses') }}</option>
            <option value="active">{{ languageStore.t('active') }}</option>
            <option value="inactive">{{ languageStore.t('inactive') }}</option>
            <option value="archived">{{ languageStore.t('archived') }}</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-2 border-t">
        <span class="text-sm text-gray-600">{{ languageStore.t('activeFilters') }}:</span>
        <span v-if="filters.search" class="filter-badge">
          {{ languageStore.t('search') }}: "{{ filters.search }}"
          <button @click="filters.search = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600">×</button>
        </span>
        <span v-if="filters.grade_level" class="filter-badge">
          {{ languageStore.t('grade') }} {{ filters.grade_level }}
          <button @click="filters.grade_level = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600">×</button>
        </span>
        <span v-if="filters.teacher_id" class="filter-badge">
          {{ getTeacherName(filters.teacher_id) }}
          <button @click="filters.teacher_id = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600">×</button>
        </span>
        <span v-if="filters.status" class="filter-badge">
          {{ languageStore.t(filters.status) }}
          <button @click="filters.status = ''; applyFilters()" class="ml-1 text-gray-400 hover:text-gray-600">×</button>
        </span>
        <button @click="clearAllFilters" class="text-sm text-red-600 hover:text-red-800 font-medium">
          {{ languageStore.t('clearAll') }}
        </button>
      </div>

      <!-- Results Count -->
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ languageStore.t('showing') }} {{ classes.length }} {{ languageStore.t('classes') }}</span>
        <span v-if="totalCount > 0">{{ languageStore.t('total') }}: {{ totalCount }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="classes.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-gray-500 text-lg">{{ hasActiveFilters ? languageStore.t('noClassesMatchFilters') : languageStore.t('noClassesFound') }}</p>
      <p class="text-gray-400 text-sm mt-2">{{ hasActiveFilters ? languageStore.t('tryAdjustingFilters') : languageStore.t('addFirstClassMessage') }}</p>
      <router-link v-if="!hasActiveFilters" to="/admin/classes/create" class="btn-primary inline-flex items-center gap-2 mt-4">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ languageStore.t('addFirstClass') }}</span>
      </router-link>
    </div>

    <!-- Classes Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="classItem in classes" :key="classItem.id" class="card hover:shadow-lg transition-shadow">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-primary-600">{{ classItem.name }}</h3>
              <p v-if="classItem.arabic_name" class="text-sm text-gray-500" dir="rtl">{{ classItem.arabic_name }}</p>
            </div>
            <span :class="getStatusClass(classItem.status || 'active')" class="ml-2 whitespace-nowrap">
              {{ languageStore.t(classItem.status || 'active') }}
            </span>
          </div>

          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>{{ languageStore.t('gradeLevel') }}:</span>
              <span class="font-medium">{{ languageStore.t('grade') }} {{ classItem.grade_level }}</span>
            </div>
            <div v-if="classItem.section" class="flex justify-between">
              <span>{{ languageStore.t('section') }}:</span>
              <span class="font-medium">{{ classItem.section }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ languageStore.t('teacher') }}:</span>
              <span class="font-medium">{{ classItem.teacher?.full_name || languageStore.t('notAssigned') }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ languageStore.t('students') }}:</span>
              <span class="font-medium">{{ classItem.current_enrollment }}/{{ classItem.capacity }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="rounded-full h-2 transition-all duration-500" 
                :class="getProgressBarClass(classItem.current_enrollment, classItem.capacity)"
                :style="{ width: `${getEnrollmentPercentage(classItem.current_enrollment, classItem.capacity)}%` }"
              ></div>
            </div>
            <div class="text-xs text-gray-400 text-right">
              {{ getEnrollmentPercentage(classItem.current_enrollment, classItem.capacity) }}%
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4 pt-4 border-t" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button @click="handleEdit(classItem)" class="text-primary-600 hover:text-primary-800 hover:underline text-sm font-medium">
              {{ languageStore.t('edit') }}
            </button>
            <button @click="handleDelete(classItem)" class="text-red-600 hover:text-red-800 hover:underline text-sm font-medium">
              {{ languageStore.t('delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="totalCount > 20"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalCount / 20)"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '../../../stores/class'
import { useTeacherStore } from '../../../stores/teacher'
import { useLanguageStore } from '../../../stores/language'
import Pagination from '../../../components/common/Pagination.vue'

const router = useRouter()
const classStore = useClassStore()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const classes = computed(() => classStore.classes)
const totalCount = computed(() => classStore.totalCount)
const isLoading = computed(() => classStore.isLoading)
const currentPage = ref(1)
const teachers = ref([])

// Filter state
const filters = ref({
  search: '',
  grade_level: '',
  teacher_id: '',
  status: ''
})

const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.grade_level || 
         filters.value.teacher_id || 
         filters.value.status
})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    applyFilters()
  }, 500)
}

const clearSearch = () => {
  filters.value.search = ''
  applyFilters()
}

const getTeacherName = (teacherId) => {
  const teacher = teachers.value.find(t => t.id === teacherId)
  return teacher ? teacher.full_name : ''
}

const getStatusClass = (status) => {
  const statusMap = {
    active: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium',
    inactive: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium',
    archived: 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium'
  }
  return statusMap[status] || statusMap.active
}

const getEnrollmentPercentage = (enrollment, capacity) => {
  if (!capacity || capacity === 0) return 0
  const percentage = (enrollment / capacity) * 100
  return Math.min(percentage, 100)
}

const getProgressBarClass = (enrollment, capacity) => {
  const percentage = getEnrollmentPercentage(enrollment, capacity)
  if (percentage >= 90) return 'bg-red-600'
  if (percentage >= 70) return 'bg-yellow-600'
  return 'bg-primary-600'
}

const applyFilters = async () => {
  const filterParams = {}
  
  if (filters.value.search) filterParams.search = filters.value.search
  if (filters.value.grade_level) filterParams.grade_level = parseInt(filters.value.grade_level)
  if (filters.value.teacher_id) filterParams.teacher_id = filters.value.teacher_id
  if (filters.value.status) filterParams.status = filters.value.status
  
  await classStore.fetchClasses(currentPage.value, filterParams)
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    grade_level: '',
    teacher_id: '',
    status: ''
  }
  currentPage.value = 1
  applyFilters()
}

const loadTeachers = async () => {
  try {
    const { data } = await teacherStore.fetchTeachers(1, { status: 'active' })
    teachers.value = data || []
  } catch (error) {
    console.error('Error loading teachers:', error)
    teachers.value = []
  }
}

const handleEdit = (classItem) => {
  router.push(`/admin/classes/${classItem.id}`)
}

const handleDelete = async (classItem) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await classStore.deleteClass(classItem.id)
    if (result.success) {
      await applyFilters()
    } else {
      alert(result.error || languageStore.t('deleteFailed'))
    }
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await applyFilters()
}

// Watch for filter changes (except search which uses debounce)
watch(
  () => [filters.value.grade_level, filters.value.teacher_id, filters.value.status],
  () => {
    currentPage.value = 1
    applyFilters()
  }
)

onMounted(async () => {
  await loadTeachers()
  await classStore.fetchClasses(1)
})
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: #2563eb;
  text-decoration: none;
  color: white;
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

.filter-badge {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  gap: 0.25rem;
}

.filter-badge button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  line-height: 1;
  padding: 0 0.25rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>