<template>
  <div class="space-y-6 px-4 sm:px-0">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('teachers') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ languageStore.t('manageTeachers') }}
        </p>
      </div>
      <router-link 
        to="/admin/teachers/create" 
        class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addTeacher') }}
      </router-link>
    </div>

    <div class="overflow-x-auto rounded-lg shadow dark:shadow-gray-800">
      <DataTable
        :columns="columns"
        :data="teachers"
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
        <!-- Custom slot for teacher name + arabic name -->
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

        <!-- Custom slot for specialization -->
        <template #column-specialization="{ row }">
          <span class="text-gray-700 dark:text-gray-300">{{ row.specialization || '-' }}</span>
        </template>

        <!-- Custom slot for subjects (with dark mode badges) -->
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

        <!-- Custom slot for status badge -->
        <template #column-status="{ row }">
          <span :class="getStatusClass(row.status)">
            {{ languageStore.t(row.status) }}
          </span>
        </template>
      </DataTable>
    </div>
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

// ✅ FIXED: Use /edit suffix to match the actual route
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
    active: 'badge-success dark:bg-green-900/30 dark:text-green-300',
    inactive: 'badge-danger dark:bg-red-900/30 dark:text-red-300',
    on_leave: 'badge-warning dark:bg-yellow-900/30 dark:text-yellow-300'
  }
  return classes[status] || 'badge-neutral dark:bg-gray-700 dark:text-gray-300'
}

onMounted(() => {
  teacherStore.fetchTeachers(1)
})
</script>

<style scoped>
.badge-success {
  @apply bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium;
}
.badge-danger {
  @apply bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium;
}
.badge-warning {
  @apply bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium;
}
.badge-neutral {
  @apply bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium;
}
.dark .badge-success {
  @apply bg-green-900/30 text-green-300;
}
.dark .badge-danger {
  @apply bg-red-900/30 text-red-300;
}
.dark .badge-warning {
  @apply bg-yellow-900/30 text-yellow-300;
}
.dark .badge-neutral {
  @apply bg-gray-700 text-gray-300;
}
</style>