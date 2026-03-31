<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('attendance') }}</h1>
    
    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ languageStore.t('attendanceSummary') }}</h2>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm">{{ languageStore.t('present') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span class="text-sm">{{ languageStore.t('absent') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-sm">{{ languageStore.t('late') }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-sm">{{ languageStore.t('excused') }}</span>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('checkIn') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('checkOut') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('notes') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in attendance" :key="record.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2">{{ formatDate(record.date) }}</td>
              <td class="px-4 py-2">
                <span :class="getStatusBadgeClass(record.status)">
                  {{ languageStore.t(record.status) }}
                </span>
              </td>
              <td class="px-4 py-2">{{ record.check_in_time || '-' }}</td>
              <td class="px-4 py-2">{{ record.check_out_time || '-' }}</td>
              <td class="px-4 py-2">{{ record.notes || '-' }}</td>
            </tr>
            <tr v-if="attendance.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-500">{{ languageStore.t('noAttendanceData') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Pagination
        v-if="total > pageSize"
        :current-page="currentPage"
        :total-pages="Math.ceil(total / pageSize)"
        @page-change="handlePageChange"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import Pagination from '@/components/common/Pagination.vue'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const attendance = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20

const fetchAttendance = async () => {
  const studentId = authStore.profile?.id
  
  if (!studentId) return
  
  const { data, error, count } = await supabase
    .from('attendance')
    .select('*', { count: 'exact' })
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1)
  
  if (!error) {
    attendance.value = data || []
    total.value = count || 0
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    present: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs',
    absent: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs',
    late: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs',
    excused: 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs'
  }
  return classes[status] || ''
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchAttendance()
}

onMounted(() => {
  fetchAttendance()
})
</script>