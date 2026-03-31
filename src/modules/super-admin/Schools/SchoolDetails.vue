<template>
  <div class="max-w-4xl mx-auto">
    <div class="card p-6">
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-2xl font-bold">{{ school?.name }}</h1>
        <router-link to="/super-admin/schools" class="btn-secondary">{{ languageStore.t('back') }}</router-link>
      </div>

      <div v-if="school" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('email') }}</p>
            <p class="font-medium">{{ school.email || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('phone') }}</p>
            <p class="font-medium">{{ school.phone || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('status') }}</p>
            <p><span :class="getStatusClass(school.status)">{{ school.status }}</span></p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('subscriptionPlan') }}</p>
            <p class="font-medium">{{ school.subscription_plan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('subscriptionEndDate') }}</p>
            <p class="font-medium">{{ formatDate(school.subscription_end_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('createdAt') }}</p>
            <p class="font-medium">{{ formatDate(school.created_at) }}</p>
          </div>
        </div>

        <div>
          <p class="text-sm text-gray-500">{{ languageStore.t('address') }}</p>
          <p class="font-medium">{{ school.address || '-' }}</p>
        </div>

        <div class="border-t pt-4">
          <h2 class="text-lg font-semibold mb-3">{{ languageStore.t('statistics') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm text-gray-500">{{ languageStore.t('students') }}</p>
              <p class="text-2xl font-bold">{{ stats.students }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm text-gray-500">{{ languageStore.t('teachers') }}</p>
              <p class="text-2xl font-bold">{{ stats.teachers }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm text-gray-500">{{ languageStore.t('revenue') }}</p>
              <p class="text-2xl font-bold">{{ formatCurrency(stats.revenue) }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link :to="`/super-admin/schools/${school.id}/edit`" class="btn-primary">
            {{ languageStore.t('edit') }}
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-8">{{ languageStore.t('loading') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'

const route = useRoute()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const school = ref(null)
const stats = ref({ students: 0, teachers: 0, revenue: 0 })

const loadSchool = async () => {
  const id = route.params.id
  school.value = await schoolStore.getSchoolById(id)
  if (school.value) {
    stats.value = await schoolStore.getSchoolStats(id)
  }
}

const getStatusClass = (status) => {
  const map = {
    active: 'text-green-600',
    suspended: 'text-red-600',
    pending: 'text-yellow-600'
  }
  return map[status] || ''
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'
const formatCurrency = (value) => `SDG ${value?.toLocaleString()}`

onMounted(() => {
  loadSchool()
})
</script>