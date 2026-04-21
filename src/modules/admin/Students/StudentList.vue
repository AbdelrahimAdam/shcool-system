<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('students') }}</h1>
      <router-link to="/admin/students/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('add') }} {{ languageStore.t('students') }}
      </router-link>
    </div>
    
    <DataTable
      :columns="columns"
      :data="students"
      :total="totalCount"
      :loading="isLoading"
      :filter-options="filterOptions"
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
    active: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    graduated: 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs',
    transferred: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
}

onMounted(() => {
  studentStore.fetchStudents(1)
})
</script>