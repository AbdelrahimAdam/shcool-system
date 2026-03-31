<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('teachers') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('manageTeachers') }}</p>
      </div>
      <router-link to="/admin/teachers/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addTeacher') }}
      </router-link>
    </div>
    
    <DataTable
      :columns="columns"
      :data="teachers"
      :total="totalCount"
      :loading="isLoading"
      :filter-options="filterOptions"
      @search="handleSearch"
      @filter="handleFilter"
      @page-change="handlePageChange"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #column-teacher="{ row }">
        <div>
          <div class="font-medium text-gray-900">{{ row.full_name }}</div>
          <div v-if="row.arabic_name" class="text-xs text-gray-500 mt-0.5" :dir="languageStore.isRTL ? 'rtl' : 'ltr'">
            {{ row.arabic_name }}
          </div>
        </div>
      </template>
      
      <template #column-specialization="{ row }">
        <span class="text-gray-700">{{ row.specialization || '-' }}</span>
      </template>
      
      <template #column-subjects="{ row }">
        <div v-if="row.subjects && row.subjects.length" class="flex flex-wrap gap-1">
          <span v-for="subject in row.subjects.slice(0, 2)" :key="subject" class="badge-neutral text-xs">
            {{ subject }}
          </span>
          <span v-if="row.subjects.length > 2" class="text-xs text-gray-400">+{{ row.subjects.length - 2 }}</span>
        </div>
        <span v-else class="text-gray-400">-</span>
      </template>
      
      <template #column-status="{ row }">
        <span :class="getStatusClass(row.status)">
          {{ languageStore.t(row.status) }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'
import DataTable from '@/components/common/DataTable.vue'

const router = useRouter()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

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

const handleSearch = async (query) => {
  await teacherStore.fetchTeachers(1, { ...teacherStore.filters, search: query })
}

const handleFilter = async (filters) => {
  await teacherStore.fetchTeachers(1, { ...teacherStore.filters, ...filters })
}

const handlePageChange = async (page) => {
  await teacherStore.fetchTeachers(page, teacherStore.filters)
}

const handleEdit = (teacher) => {
  router.push(`/admin/teachers/${teacher.id}`)
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
    active: 'badge-success',
    inactive: 'badge-danger',
    on_leave: 'badge-warning'
  }
  return classes[status] || 'badge-neutral'
}

onMounted(() => {
  teacherStore.fetchTeachers(1)
})
</script>