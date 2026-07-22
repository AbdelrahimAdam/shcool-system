<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('teachers') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalTeachers') }}: {{ totalCount }}
        </p>
      </div>
      <router-link 
        to="/admin/teachers/create" 
        class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addTeacher') }}
      </router-link>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="teachers"
        :total="totalCount"
        :loading="isLoading"
        :filter-options="filterOptions"
        table-class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        header-class="bg-gray-50 dark:bg-gray-800"
        row-class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        cell-class="px-3 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-gray-200"
        @search="handleSearch"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #column-teacher="{ row }">
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{{ row.full_name }}</div>
            <div 
              v-if="row.arabic_name" 
              class="text-xs text-gray-500 dark:text-gray-400 mt-0.5" 
              :dir="languageStore.isRTL ? 'rtl' : 'ltr'"
            >
              {{ row.arabic_name }}
            </div>
          </div>
        </template>

        <template #column-specialization="{ row }">
          <span class="text-gray-700 dark:text-gray-300">{{ row.specialization || '-' }}</span>
        </template>

        <template #column-subjects="{ row }">
          <div v-if="row.subjects && row.subjects.length" class="flex flex-wrap gap-1">
            <span 
              v-for="subject in row.subjects.slice(0, 2)" 
              :key="subject" 
              class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
            >
              {{ subject }}
            </span>
            <span v-if="row.subjects.length > 2" class="text-xs text-gray-400 dark:text-gray-500">
              +{{ row.subjects.length - 2 }}
            </span>
          </div>
          <span v-else class="text-gray-400 dark:text-gray-500">-</span>
        </template>

        <template #column-status="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ languageStore.t(row.status) }}
          </span>
        </template>
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="teachers.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noTeachersFound') }}
      </div>

      <!-- Teacher Cards -->
      <div 
        v-for="teacher in teachers" 
        :key="teacher.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- Teacher Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ teacher.full_name }}
            </h3>
            <p v-if="teacher.arabic_name" class="text-xs text-gray-500 dark:text-gray-400" :dir="languageStore.isRTL ? 'rtl' : 'ltr'">
              {{ teacher.arabic_name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
              {{ teacher.teacher_code || '-' }}
            </p>
          </div>
          <span :class="getStatusClass(teacher.status)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(teacher.status) }}
          </span>
        </div>

        <!-- Teacher Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('specialization') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ teacher.specialization || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('hireDate') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ formatDate(teacher.hire_date) }}
            </span>
          </div>
        </div>

        <!-- Subjects -->
        <div class="mt-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ languageStore.t('subjects') }}:</span>
          <div v-if="teacher.subjects && teacher.subjects.length" class="flex flex-wrap gap-1 mt-1">
            <span 
              v-for="subject in teacher.subjects.slice(0, 3)" 
              :key="subject" 
              class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
            >
              {{ subject }}
            </span>
            <span v-if="teacher.subjects.length > 3" class="text-xs text-gray-400 dark:text-gray-500">
              +{{ teacher.subjects.length - 3 }}
            </span>
          </div>
          <span v-else class="text-xs text-gray-400 dark:text-gray-500">-</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="handleEdit(teacher)"
            class="flex-1 min-w-[50px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>
          <button 
            @click="handleDelete(teacher)"
            class="flex-1 min-w-[50px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('delete') }}
          </button>
        </div>
      </div>

      <!-- Pagination (mobile) -->
      <div v-if="totalCount > 10" class="flex justify-between items-center mt-4">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('previous') }}
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'
import DataTable from '@/components/common/DataTable.vue'

const router = useRouter()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalCount.value / 10))

const teachers = computed(() => teacherStore.teachers)
const totalCount = computed(() => teacherStore.totalCount)
const isLoading = computed(() => teacherStore.isLoading)

const columns = [
  { key: 'teacher_code', label: 'teacherCode', type: 'text' },
  { key: 'teacher', label: 'teacherName', type: 'text' },
  { key: 'specialization', label: 'specialization', type: 'text' },
  { key: 'subjects', label: 'subjects', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'hire_date', label: 'hireDate', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'on_leave', label: 'On Leave' }
    ]
  }
]

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const handleSearch = async (query) => {
  await teacherStore.fetchTeachers(1, { ...teacherStore.filters, search: query })
}

const handleFilter = async (filters) => {
  await teacherStore.fetchTeachers(1, { ...teacherStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await teacherStore.fetchTeachers(page, teacherStore.filters)
}

const handleEdit = (teacher) => {
  router.push(`/admin/teachers/${teacher.id}/edit`)
}

const handleDelete = async (teacher) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const result = await teacherStore.deleteTeacher(teacher.id)
    if (result.success) {
      await teacherStore.fetchTeachers(1, teacherStore.filters)
    } else {
      alert(result.error)
    }
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    inactive: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    on_leave: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return classes[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

onMounted(() => {
  teacherStore.fetchTeachers(1)
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
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

/* Mobile Card Styles */
.card {
  transition: box-shadow 0.2s ease;
}

/* Button order fix for mobile */
@media (max-width: 640px) {
  .btn-primary {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>