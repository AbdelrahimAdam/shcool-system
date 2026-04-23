<template>
  <div class="space-y-6 px-4 sm:px-0">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {{ languageStore.t('students') }}
      </h1>
      <router-link 
        to="/admin/students/create" 
        class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('add') }} {{ languageStore.t('students') }}
      </router-link>
    </div>

    <!-- Responsive table wrapper -->
    <div class="overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="students"
        :total="totalCount"
        :loading="isLoading"
        :filter-options="filterOptions"
        table-class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        header-class="bg-gray-50 dark:bg-gray-800"
        row-class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        cell-class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200"
        @search="handleSearch"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom slot for status column (badge styling) -->
        <template #column-status="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ languageStore.t(row.status) }}
          </span>
        </template>

        <!-- Custom slot for class column to extract the class name from the object -->
        <template #column-class="{ row }">
          {{ row.class?.name || '-' }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '../../../stores/student'
import { useLanguageStore } from '../../../stores/language'
import DataTable from '../../../components/common/DataTable.vue'

const router = useRouter()
const studentStore = useStudentStore()
const languageStore = useLanguageStore()

const students = computed(() => studentStore.students)
const totalCount = computed(() => studentStore.totalCount)
const isLoading = computed(() => studentStore.isLoading)

const columns = [
  { key: 'student_number', label: 'studentNumber', type: 'text' },
  { key: 'full_name', label: 'studentName', type: 'text' },
  { key: 'class', label: 'class', type: 'text' },
  { key: 'status', label: 'status', type: 'status' },
  { key: 'enrollment_date', label: 'enrollmentDate', type: 'date' }
]

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'graduated', label: 'Graduated' },
      { value: 'transferred', label: 'Transferred' }
    ]
  }
]

const handleSearch = async (query) => {
  await studentStore.fetchStudents(1, { ...studentStore.filters, search: query })
}

const handleFilter = async (filters) => {
  await studentStore.fetchStudents(1, { ...studentStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  await studentStore.fetchStudents(page, studentStore.filters)
}

const handleEdit = (student) => {
  router.push(`/admin/students/${student.id}`)
}

const handleDelete = async (student) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    await studentStore.deleteStudent(student.id)
    await studentStore.fetchStudents(1, studentStore.filters)
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium',
    graduated: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs font-medium',
    transferred: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium'
  }
  return classes[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium'
}

onMounted(() => {
  studentStore.fetchStudents(1)
})
</script>

<style scoped>
/* Ensure DataTable respects dark mode classes passed via props */
</style>