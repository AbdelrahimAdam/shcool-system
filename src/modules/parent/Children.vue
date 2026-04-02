<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('myChildren') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('manageAndTrackYourChildren') }}</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Children Cards - 2 columns on all screen sizes -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <div 
        v-for="child in children" 
        :key="child.id" 
        class="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <!-- Card Header with Gradient Accent -->
        <div class="relative">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h2 class="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                  {{ child.full_name }}
                </h2>
                <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('studentId') }}: {{ child.student_number }}</p>
              </div>
              <span :class="getStatusClass(child.status)" class="text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ml-2">
                {{ languageStore.t(child.status) }}
              </span>
            </div>
            
            <!-- Student Details -->
            <div class="space-y-2.5 mb-4">
              <div class="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('class') }}</span>
                <span class="text-sm font-semibold text-gray-700">{{ child.class?.name || '-' }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('enrollmentDate') }}</span>
                <span class="text-sm text-gray-600">{{ formatDate(child.enrollment_date) }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('dateOfBirth') }}</span>
                <span class="text-sm text-gray-600">{{ formatDate(child.date_of_birth) }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('gender') }}</span>
                <span class="text-sm text-gray-600">{{ languageStore.t(child.gender) }}</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pt-3 border-t border-gray-100 flex gap-2">
              <router-link 
                :to="`/parent/children/${child.id}`" 
                class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {{ languageStore.t('viewDetails') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
              
              <router-link 
                v-if="child.status === 'active'"
                :to="`/parent/attendance?child=${child.id}`" 
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                :title="languageStore.t('viewAttendance')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </router-link>
              
              <router-link 
                v-if="child.status === 'active'"
                :to="`/parent/grades?child=${child.id}`" 
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                :title="languageStore.t('viewGrades')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="children.length === 0" class="col-span-full text-center py-16">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-gray-500 text-base">{{ languageStore.t('noChildren') }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('registerChildToGetStarted') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useParentStore } from '@/stores/parent'
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const authStore = useAuthStore()
const parentStore = useParentStore()
const languageStore = useLanguageStore()

const children = ref([])
const loading = ref(true)

const fetchChildren = async () => {
  loading.value = true
  
  try {
    await parentStore.getParentByUserId(authStore.user?.id)
    children.value = await parentStore.getChildren()
  } catch (error) {
    console.error('Error fetching children:', error)
  } finally {
    loading.value = false
  }
}

const viewChildDetails = (childId) => {
  router.push(`/parent/children/${childId}`)
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    graduated: 'bg-blue-100 text-blue-700',
    transferred: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchChildren()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>