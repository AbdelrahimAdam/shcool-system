<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('myChildren') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="child in children" :key="child.id" class="card p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold">{{ child.full_name }}</h2>
          <span :class="getStatusClass(child.status)">{{ languageStore.t(child.status) }}</span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ languageStore.t('studentNumber') }}:</span>
            <span class="font-medium">{{ child.student_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ languageStore.t('class') }}:</span>
            <span class="font-medium">{{ child.class?.name || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ languageStore.t('enrollmentDate') }}:</span>
            <span class="font-medium">{{ formatDate(child.enrollment_date) }}</span>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <router-link 
            :to="`/parent/children/${child.id}`" 
            class="text-primary-600 hover:text-primary-800 text-sm"
          >
            {{ languageStore.t('viewDetails') }} →
          </router-link>
        </div>
      </div>
      
      <div v-if="children.length === 0" class="col-span-2 text-center py-8 text-gray-500">
        {{ languageStore.t('noChildren') }}
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const parentStore = useParentStore()
const languageStore = useLanguageStore()

const children = ref([])
const loading = ref(true)

const fetchChildren = async () => {
  loading.value = true
  
  await parentStore.getParentByUserId(authStore.user?.id)
  children.value = await parentStore.getChildren()
  
  loading.value = false
}

const viewChildDetails = (childId) => {
  router.push(`/parent/children/${childId}`)
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-600',
    graduated: 'text-blue-600',
    transferred: 'text-yellow-600',
    suspended: 'text-red-600'
  }
  return classes[status] || ''
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchChildren()
})
</script>