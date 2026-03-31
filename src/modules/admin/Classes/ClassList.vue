<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('classes') }}</h1>
      <router-link to="/admin/classes/create" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('add') }} {{ languageStore.t('classes') }}
      </router-link>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="classItem in classes" :key="classItem.id" class="card hover:shadow-lg transition-shadow">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-primary-600">{{ classItem.name }}</h3>
            <span :class="getStatusClass(classItem.status || 'active')">
              {{ languageStore.t(classItem.status || 'active') }}
            </span>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>{{ languageStore.t('gradeLevel') }}:</span>
              <span class="font-medium">Grade {{ classItem.grade_level }}</span>
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
              <div class="bg-primary-600 rounded-full h-2" :style="{ width: `${(classItem.current_enrollment / classItem.capacity) * 100}%` }"></div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 mt-4 pt-4 border-t" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button @click="handleEdit(classItem)" class="text-primary-600 hover:text-primary-800">
              {{ languageStore.t('edit') }}
            </button>
            <button @click="handleDelete(classItem)" class="text-red-600 hover:text-red-800">
              {{ languageStore.t('delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <Pagination
      v-if="totalCount > 20"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalCount / 20)"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '../../../stores/class'
import { useLanguageStore } from '../../../stores/language'
import Pagination from '../../../components/common/Pagination.vue'

const router = useRouter()
const classStore = useClassStore()
const languageStore = useLanguageStore()

const classes = computed(() => classStore.classes)
const totalCount = computed(() => classStore.totalCount)
const isLoading = computed(() => classStore.isLoading)
const currentPage = ref(1)

const getStatusClass = (status) => {
  return status === 'active' 
    ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs'
    : 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
}

const handleEdit = (classItem) => {
  router.push(`/admin/classes/${classItem.id}`)
}

const handleDelete = async (classItem) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    await classStore.deleteClass(classItem.id)
    await classStore.fetchClasses(currentPage.value)
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await classStore.fetchClasses(page)
}

onMounted(() => {
  classStore.fetchClasses(1)
})
</script>