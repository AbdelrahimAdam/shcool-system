<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ languageStore.t('parentDetails') }}</h1>
          <div class="flex gap-3">
            <router-link
              to="/admin/parents"
              class="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ languageStore.t('back') }}
            </router-link>
            <router-link
              :to="`/admin/parents/${parent?.id}`"
              class="inline-flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ languageStore.t('edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-500">{{ languageStore.t('loading') }}...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-12 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchParent" class="mt-3 text-primary-600 hover:underline">
          {{ languageStore.t('tryAgain') }}
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="parent" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('personalInformation') }}</h2>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('fullName') }}</label>
              <p class="text-gray-900 font-medium mt-1">{{ parent.full_name || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('email') }}</label>
              <p class="text-gray-900 mt-1">{{ parent.email || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('phone') }}</label>
              <p class="text-gray-900 mt-1">{{ parent.phone || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('address') }}</label>
              <p class="text-gray-900 mt-1">{{ parent.address || '-' }}</p>
            </div>
          </div>

          <!-- Account Information -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">{{ languageStore.t('accountInformation') }}</h2>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('relationship') }}</label>
              <p class="text-gray-900 mt-1">{{ languageStore.t(parent.relationship) || '-' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</label>
              <p class="mt-1">
                <span :class="getStatusClass(parent.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ languageStore.t(parent.status) }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('registeredOn') }}</label>
              <p class="text-gray-900 mt-1">{{ formatDate(parent.created_at) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ languageStore.t('lastUpdated') }}</label>
              <p class="text-gray-900 mt-1">{{ formatDate(parent.updated_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Children Section (if you want to list linked students) -->
        <div v-if="children.length" class="mt-6 pt-4 border-t border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">{{ languageStore.t('children') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="child in children" :key="child.id" class="bg-gray-50 rounded-lg p-3">
              <p class="font-medium text-gray-800">{{ child.full_name }}</p>
              <p class="text-sm text-gray-500">{{ languageStore.t('studentNumber') }}: {{ child.student_number }}</p>
              <router-link :to="`/admin/students/${child.id}`" class="text-primary-600 text-sm hover:underline">
                {{ languageStore.t('view') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const languageStore = useLanguageStore()

const parent = ref(null)
const children = ref([])
const loading = ref(true)
const error = ref('')

const fetchParent = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data, err } = await supabase
      .from('parents')
      .select('*')
      .eq('id', route.params.id)
      .single()
    if (err) throw err
    parent.value = data

    // Fetch children (students linked to this parent)
    const { data: students } = await supabase
      .from('students')
      .select('id, full_name, student_number')
      .eq('parent_id', route.params.id)
      .order('full_name')
    children.value = students || []
  } catch (err) {
    error.value = err.message || 'Failed to load parent'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

onMounted(() => {
  fetchParent()
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