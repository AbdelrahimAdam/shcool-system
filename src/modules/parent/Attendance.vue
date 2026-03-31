<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('attendance') }}</h1>
    
    <div class="card p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <label class="label">{{ languageStore.t('selectChild') }}</label>
          <select v-model="selectedChildId" class="input-field" @change="loadAttendance">
            <option :value="null">{{ languageStore.t('selectChild') }}</option>
            <option v-for="child in children" :key="child.id" :value="child.id">
              {{ child.full_name }}
            </option>
          </select>
        </div>
        
        <div class="flex-1 min-w-[150px]">
          <label class="label">{{ languageStore.t('startDate') }}</label>
          <input v-model="startDate" type="date" class="input-field" @change="loadAttendance" />
        </div>
        
        <div class="flex-1 min-w-[150px]">
          <label class="label">{{ languageStore.t('endDate') }}</label>
          <input v-model="endDate" type="date" class="input-field" @change="loadAttendance" />
        </div>
      </div>
      
      <div v-if="selectedChild && !loading" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        
        <!-- Attendance Rate -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">{{ languageStore.t('attendanceRate') }}</span>
            <span class="text-sm font-bold text-primary-600">{{ attendanceRate }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-600 rounded-full h-2 transition-all"
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
                <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('checkIn') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('checkOut') }}</th>
                <th class="px-4 py-2 text-left">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in attendanceRecords" :key="record.id" class="border-t hover:bg-gray-50">
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
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500">
                  {{ languageStore.t('noAttendance') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="!loading && !selectedChild" class="text-center py-12 text-gray-500">
        {{ languageStore.t('selectChildToViewAttendance') }}
      </div>
      
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

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
    stats[record.status]++
  })
  return stats
})

const attendanceRate = computed(() => {
  if (attendanceRecords.value.length === 0) return 0
  const present = attendanceRecords.value.filter(r => r.status === 'present' || r.status === 'late').length
  return Math.round((present / attendanceRecords.value.length) * 100)
})

const loadChildren = async () => {
  const parentId = authStore.profile?.id
  
  if (!parentId) return
  
  const { data } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('parent_id', parentId)
  
  children.value = data || []
}

const loadAttendance = async () => {
  if (!selectedChildId.value) return
  
  loading.value = true
  
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
  
  const { data } = await query
  attendanceRecords.value = data || []
  loading.value = false
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

onMounted(() => {
  loadChildren()
})
</script>