<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('childrenAttendance') }}</h1>
    </div>
    
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="form-label">{{ languageStore.t('selectChild') }}</label>
          <select v-model="selectedChildId" class="form-select" @change="loadAttendance">
            <option :value="null">{{ languageStore.t('selectChild') }}</option>
            <option v-for="child in children" :key="child.id" :value="child.id">
              {{ child.full_name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="form-label">{{ languageStore.t('startDate') }}</label>
          <input v-model="startDate" type="date" class="form-input" @change="loadAttendance" />
        </div>
        
        <div>
          <label class="form-label">{{ languageStore.t('endDate') }}</label>
          <input v-model="endDate" type="date" class="form-input" @change="loadAttendance" />
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
      
      <div v-else-if="selectedChild && attendanceRecords.length > 0" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ summary.present }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('present') }}</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-red-600">{{ summary.absent }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('absent') }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-yellow-600">{{ summary.late }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('late') }}</p>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ summary.excused }}</p>
            <p class="text-sm text-gray-600">{{ languageStore.t('excused') }}</p>
          </div>
        </div>
        
        <!-- Attendance Rate Progress Bar -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">{{ languageStore.t('attendanceRate') }}</span>
            <span class="text-sm font-bold" :class="getRateColor(attendanceRate)">
              {{ attendanceRate }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="rounded-full h-2 transition-all duration-500"
              :class="getProgressBarColor(attendanceRate)"
              :style="{ width: `${attendanceRate}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Attendance Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">{{ languageStore.t('date') }}</th>
                <th class="px-4 py-2 text-center">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('checkIn') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('checkOut') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in attendanceRecords" :key="record.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 font-medium">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-2 text-center">
                  <span :class="getStatusBadgeClass(record.status)">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ record.check_in_time || '-' }}</td>
                <td class="px-4 py-2">{{ record.check_out_time || '-' }}</td>
                <td class="px-4 py-2">{{ record.notes || '-' }}</td>
              </tr>
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500">
                  {{ languageStore.t('noAttendanceRecords') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="selectedChild && !loading && attendanceRecords.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500">{{ languageStore.t('noAttendanceRecords') }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('tryDifferentFilters') }}</p>
      </div>
      
      <div v-else-if="!selectedChild && !loading" class="text-center py-12 text-gray-500">
        {{ languageStore.t('selectChildToViewAttendance') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const children = ref([])
const selectedChildId = ref(null)
const selectedChild = ref(null)
const attendanceRecords = ref([])
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)

const summary = computed(() => {
  const stats = { present: 0, absent: 0, late: 0, excused: 0 }
  attendanceRecords.value.forEach(record => {
    if (stats[record.status] !== undefined) {
      stats[record.status]++
    }
  })
  return stats
})

const attendanceRate = computed(() => {
  if (attendanceRecords.value.length === 0) return 0
  const presentCount = attendanceRecords.value.filter(r => r.status === 'present' || r.status === 'late').length
  return Math.round((presentCount / attendanceRecords.value.length) * 100)
})

const loadChildren = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) return
    
    // Get parent record
    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (!parent) return
    
    // Get children
    const { data } = await supabase
      .from('students')
      .select('id, full_name, student_number')
      .eq('parent_id', parent.id)
      .eq('status', 'active')
      .order('full_name')
    
    children.value = data || []
  } catch (error) {
    console.error('Error loading children:', error)
  }
}

const loadAttendance = async () => {
  if (!selectedChildId.value) return
  
  loading.value = true
  
  try {
    // Get selected child details
    selectedChild.value = children.value.find(c => c.id === selectedChildId.value)
    
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('student_id', selectedChildId.value)
      .order('date', { ascending: false })
    
    if (startDate.value) {
      query = query.gte('date', startDate.value)
    }
    if (endDate.value) {
      query = query.lte('date', endDate.value)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    attendanceRecords.value = data || []
  } catch (error) {
    console.error('Error loading attendance:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
    absent: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium',
    late: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium',
    excused: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'
}

const getRateColor = (rate) => {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 75) return 'text-blue-600'
  if (rate >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getProgressBarColor = (rate) => {
  if (rate >= 90) return 'bg-green-600'
  if (rate >= 75) return 'bg-blue-600'
  if (rate >= 60) return 'bg-yellow-600'
  return 'bg-red-600'
}

onMounted(() => {
  loadChildren()
})
</script>