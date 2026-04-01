<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ languageStore.t('attendanceReport') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ languageStore.t('viewAndExportAttendance') }}</p>
      </div>
      <button @click="exportReport" class="btn-secondary" :disabled="reportData.length === 0">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {{ languageStore.t('export') }}
      </button>
    </div>

    <div class="card p-4 md:p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="form-label">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClassId" class="form-select">
            <option :value="null">{{ languageStore.t('allClasses') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">{{ languageStore.t('startDate') }}</label>
          <input v-model="startDate" type="date" class="form-input" />
        </div>

        <div>
          <label class="form-label">{{ languageStore.t('endDate') }}</label>
          <input v-model="endDate" type="date" class="form-input" />
        </div>
      </div>

      <div class="flex justify-end mb-6">
        <button @click="generateReport" :disabled="isLoading" class="btn-primary">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? languageStore.t('loading') : languageStore.t('generateReport') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>

      <!-- Report Table -->
      <div v-else-if="reportData.length > 0" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">{{ languageStore.t('studentName') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('present') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('absent') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('late') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('excused') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('attendanceRate') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in reportData" :key="row.student_id" class="border-t hover:bg-gray-50">
              <td class="px-3 py-2 font-medium">{{ row.student_name }}</td>
              <td class="px-3 py-2 text-center">{{ row.present }}</td>
              <td class="px-3 py-2 text-center">{{ row.absent }}</td>
              <td class="px-3 py-2 text-center">{{ row.late }}</td>
              <td class="px-3 py-2 text-center">{{ row.excused }}</td>
              <td class="px-3 py-2 text-center">
                <span :class="getRateColor(row.rate)" class="font-bold">
                  {{ row.rate }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Summary Stats -->
        <div class="mt-6 pt-4 border-t">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ totalStats.present }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('present') }}</p>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
              <p class="text-2xl font-bold text-red-600">{{ totalStats.absent }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('absent') }}</p>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600">{{ totalStats.late }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('late') }}</p>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ totalStats.excused }}</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('excused') }}</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold text-gray-600">{{ overallRate }}%</p>
              <p class="text-xs text-gray-600">{{ languageStore.t('attendanceRate') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="generated && !reportData.length && !isLoading" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500">{{ languageStore.t('noAttendanceRecords') }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ languageStore.t('tryDifferentFilters') }}</p>
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

const classes = ref([])
const selectedClassId = ref(null)
const startDate = ref(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])
const isLoading = ref(false)
const generated = ref(false)
const reportData = ref([])

// Computed totals
const totalStats = computed(() => {
  const stats = { present: 0, absent: 0, late: 0, excused: 0 }
  reportData.value.forEach(row => {
    stats.present += row.present
    stats.absent += row.absent
    stats.late += row.late
    stats.excused += row.excused
  })
  return stats
})

const overallRate = computed(() => {
  const total = totalStats.value.present + totalStats.value.absent + totalStats.value.late + totalStats.value.excused
  if (total === 0) return 0
  const present = totalStats.value.present + totalStats.value.late
  return Math.round((present / total) * 100)
})

const loadClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('id, name')
      .eq('school_id', authStore.profile?.school_id)
      .order('grade_level')
    
    if (error) throw error
    classes.value = data || []
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const generateReport = async () => {
  isLoading.value = true
  generated.value = true

  try {
    let query = supabase
      .from('attendance')
      .select(`
        student_id,
        status,
        students (full_name)
      `)
      .eq('school_id', authStore.profile?.school_id)
      .gte('date', startDate.value)
      .lte('date', endDate.value)

    if (selectedClassId.value) {
      query = query.eq('class_id', selectedClassId.value)
    }

    const { data, error } = await query
    if (error) throw error

    // Aggregate per student
    const map = new Map()
    data?.forEach(rec => {
      const studentId = rec.student_id
      if (!map.has(studentId)) {
        map.set(studentId, {
          student_id: studentId,
          student_name: rec.students?.full_name || 'Unknown',
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0
        })
      }
      const stats = map.get(studentId)
      stats[rec.status]++
      stats.total++
    })

    reportData.value = Array.from(map.values()).map(s => ({
      ...s,
      rate: s.total ? ((s.present + s.late) / s.total * 100).toFixed(1) : 0
    }))
  } catch (error) {
    console.error('Error generating report:', error)
  } finally {
    isLoading.value = false
  }
}

const getRateColor = (rate) => {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 75) return 'text-blue-600'
  if (rate >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const exportReport = () => {
  if (reportData.value.length === 0) return

  // Prepare CSV data
  const headers = ['Student Name', 'Present', 'Absent', 'Late', 'Excused', 'Attendance Rate (%)']
  const rows = reportData.value.map(row => [
    row.student_name,
    row.present,
    row.absent,
    row.late,
    row.excused,
    row.rate
  ])

  // Add summary row
  rows.push(['', '', '', '', '', ''])
  rows.push(['SUMMARY', '', '', '', '', ''])
  rows.push(['Total Present', totalStats.value.present, '', '', '', ''])
  rows.push(['Total Absent', totalStats.value.absent, '', '', '', ''])
  rows.push(['Total Late', totalStats.value.late, '', '', '', ''])
  rows.push(['Total Excused', totalStats.value.excused, '', '', '', ''])
  rows.push(['Overall Attendance Rate', `${overallRate.value}%`, '', '', '', ''])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadClasses()
})
</script>