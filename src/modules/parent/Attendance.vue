<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('childrenAttendance') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('trackYourChildrenAttendance') }}</p>
    </div>
    
    <!-- Filters Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('selectChild') }}</label>
            <select v-model="selectedChildId" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" @change="loadAttendance">
              <option :value="null">{{ languageStore.t('selectChild') }}</option>
              <option v-for="child in children" :key="child.id" :value="child.id">
                {{ child.full_name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('startDate') }}</label>
            <input v-model="startDate" type="date" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" @change="loadAttendance" />
          </div>
          
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('endDate') }}</label>
            <input v-model="endDate" type="date" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" @change="loadAttendance" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Attendance Content -->
    <div v-else-if="selectedChild && attendanceRecords.length > 0" class="space-y-6">
      <!-- Summary Cards - 2 columns on mobile, 4 on desktop -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-green-600 uppercase tracking-wider">{{ languageStore.t('present') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-green-700 mt-1">{{ summary.present }}</p>
            </div>
            <div class="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-red-600 uppercase tracking-wider">{{ languageStore.t('absent') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-red-700 mt-1">{{ summary.absent }}</p>
            </div>
            <div class="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-yellow-600 uppercase tracking-wider">{{ languageStore.t('late') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-yellow-700 mt-1">{{ summary.late }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-blue-600 uppercase tracking-wider">{{ languageStore.t('excused') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">{{ summary.excused }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Attendance Rate Progress Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-semibold text-gray-700">{{ languageStore.t('attendanceRate') }}</span>
          <span class="text-lg font-bold" :class="getRateColor(attendanceRate)">
            {{ attendanceRate }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="rounded-full h-3 transition-all duration-500"
            :class="getProgressBarColor(attendanceRate)"
            :style="{ width: `${attendanceRate}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
      
      <!-- Mobile Card View (visible on mobile) -->
      <div class="block lg:hidden space-y-4">
        <div v-for="record in attendanceRecords" :key="record.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
          <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-400">{{ languageStore.t('date') }}</p>
              <p class="font-semibold text-gray-800">{{ formatDate(record.date) }}</p>
            </div>
            <span :class="getStatusBadgeClass(record.status)" class="px-2 py-1 rounded-lg text-xs font-medium">
              {{ languageStore.t(record.status) }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">{{ languageStore.t('checkIn') }}</span>
              <span class="text-sm font-medium text-gray-700">{{ record.check_in_time || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">{{ languageStore.t('checkOut') }}</span>
              <span class="text-sm font-medium text-gray-700">{{ record.check_out_time || '-' }}</span>
            </div>
            <div v-if="record.notes" class="flex justify-between">
              <span class="text-sm text-gray-500">{{ languageStore.t('notes') }}</span>
              <span class="text-sm text-gray-600">{{ record.notes }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('date') }}</th>
                <th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('checkIn') }}</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('checkOut') }}</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3 font-medium text-gray-800">{{ formatDate(record.date) }}</td>
                <td class="px-5 py-3 text-center">
                  <span :class="getStatusBadgeClass(record.status)" class="inline-block px-2 py-1 rounded-lg text-xs font-medium">
                    {{ languageStore.t(record.status) }}
                  </span>
                </td>
                <td class="px-5 py-3 text-gray-600">{{ record.check_in_time || '-' }}</td>
                <td class="px-5 py-3 text-gray-600">{{ record.check_out_time || '-' }}</td>
                <td class="px-5 py-3 text-gray-500">{{ record.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Empty State with no records -->
    <div v-else-if="selectedChild && !loading && attendanceRecords.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 text-base">{{ languageStore.t('noAttendanceRecords') }}</p>
      <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('tryDifferentFilters') }}</p>
    </div>
    
    <!-- Select Child Prompt -->
    <div v-else-if="!selectedChild && !loading && children.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p class="text-gray-500 text-base">{{ languageStore.t('selectChildToViewAttendance') }}</p>
      <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('chooseChildFromDropdown') }}</p>
    </div>
    
    <!-- No Children Found -->
    <div v-else-if="!loading && children.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p class="text-gray-500 text-base">{{ languageStore.t('noChildrenFound') }}</p>
      <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('registerChildToTrackAttendance') }}</p>
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
    
    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (!parent) return
    
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
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    excused: 'bg-blue-100 text-blue-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
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

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>