<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">{{ languageStore.t('schedule') }}</h1>
    
    <div class="card p-6">
      <!-- Week Selector -->
      <div class="flex justify-between items-center mb-6">
        <button @click="previousWeek" class="btn-secondary">
          ← {{ languageStore.t('previousWeek') }}
        </button>
        <h2 class="text-lg font-semibold">{{ weekRange }}</h2>
        <button @click="nextWeek" class="btn-secondary">
          {{ languageStore.t('nextWeek') }} →
        </button>
      </div>
      
      <!-- Day Selector -->
      <div class="flex overflow-x-auto mb-6 space-x-2 pb-2">
        <button
          v-for="day in days"
          :key="day.date"
          @click="selectedDay = day.date"
          class="flex-shrink-0 px-4 py-2 rounded-lg text-center min-w-[80px] transition-colors"
          :class="selectedDay === day.date 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          <div class="text-sm font-medium">{{ day.name }}</div>
          <div class="text-xs">{{ formatDayDate(day.date) }}</div>
        </button>
      </div>
      
      <!-- Schedule Table -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="scheduleList.length > 0" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left w-24">{{ languageStore.t('time') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('subject') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('teacher') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('room') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('notes') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="classItem in scheduleList" :key="classItem.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ classItem.start_time }} - {{ classItem.end_time }}</td>
              <td class="px-4 py-3">
                <div class="font-medium">{{ classItem.subject }}</div>
                <div class="text-xs text-gray-500">{{ classItem.type }}</div>
              </td>
              <td class="px-4 py-3">{{ classItem.teacher_name || '-' }}</td>
              <td class="px-4 py-3">{{ classItem.room || '-' }}</td>
              <td class="px-4 py-3">{{ classItem.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center py-12 text-gray-500">
        {{ languageStore.t('noSchedule') }}
      </div>
    </div>
    
    <!-- Legend -->
    <div class="mt-6 card p-4">
      <h3 class="text-sm font-semibold mb-2">{{ languageStore.t('legend') }}</h3>
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-100 rounded mr-2"></div>
          <span class="text-xs">{{ languageStore.t('regularClass') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-100 rounded mr-2"></div>
          <span class="text-xs">{{ languageStore.t('exam') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
          <span class="text-xs">{{ languageStore.t('activity') }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-purple-100 rounded mr-2"></div>
          <span class="text-xs">{{ languageStore.t('holiday') }}</span>
        </div>
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

const student = ref(null)
const scheduleList = ref([])
const loading = ref(false)
const currentWeekStart = ref(new Date())
const selectedDay = ref(null)

// Days of the week
const days = computed(() => {
  const weekDays = []
  const start = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    
    weekDays.push({
      name: languageStore.t(getDayName(date.getDay())),
      date: date.toISOString().split('T')[0]
    })
  }
  
  return weekDays
})

const weekRange = computed(() => {
  if (days.value.length === 0) return ''
  const start = days.value[0].date
  const end = days.value[6].date
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
})

function getDayName(dayIndex) {
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return daysMap[dayIndex]
}

async function fetchStudentInfo() {
  const userId = authStore.user?.id
  
  if (!userId) return
  
  const { data } = await supabase
    .from('students')
    .select('id, class_id')
    .eq('user_id', userId)
    .single()
  
  student.value = data
}

async function fetchSchedule() {
  if (!student.value || !selectedDay.value) return
  
  loading.value = true
  
  // Get the day of week (0-6)
  const dayOfWeek = new Date(selectedDay.value).getDay()
  const dayName = getDayName(dayOfWeek)
  
  // Fetch schedule from classes table schedule JSONB
  const { data: classData } = await supabase
    .from('classes')
    .select('schedule')
    .eq('id', student.value.class_id)
    .single()
  
  if (classData?.schedule && classData.schedule[dayName]) {
    scheduleList.value = classData.schedule[dayName]
  } else {
    // Fallback to mock data for demo
    scheduleList.value = getMockSchedule(dayName)
  }
  
  loading.value = false
}

// Mock schedule data for demonstration
function getMockSchedule(day) {
  const mockSchedule = {
    monday: [
      { id: 1, start_time: '08:00', end_time: '09:30', subject: 'Mathematics', teacher_name: 'Mr. Ahmed', room: 'Room 101', type: 'Regular Class', notes: 'Bring calculator' },
      { id: 2, start_time: '10:00', end_time: '11:30', subject: 'Science', teacher_name: 'Ms. Fatima', room: 'Lab 1', type: 'Regular Class', notes: 'Lab coat required' },
      { id: 3, start_time: '12:00', end_time: '13:30', subject: 'Arabic', teacher_name: 'Mr. Khalid', room: 'Room 103', type: 'Regular Class', notes: '' },
      { id: 4, start_time: '14:00', end_time: '15:30', subject: 'English', teacher_name: 'Ms. Sarah', room: 'Room 105', type: 'Regular Class', notes: 'Reading assignment due' }
    ],
    tuesday: [
      { id: 5, start_time: '08:00', end_time: '09:30', subject: 'Physics', teacher_name: 'Mr. Ali', room: 'Lab 2', type: 'Regular Class', notes: '' },
      { id: 6, start_time: '10:00', end_time: '11:30', subject: 'Chemistry', teacher_name: 'Ms. Nadia', room: 'Lab 1', type: 'Regular Class', notes: 'Safety goggles required' },
      { id: 7, start_time: '12:00', end_time: '13:30', subject: 'Islamic Studies', teacher_name: 'Mr. Omar', room: 'Room 107', type: 'Regular Class', notes: '' },
      { id: 8, start_time: '14:00', end_time: '15:30', subject: 'Computer Science', teacher_name: 'Ms. Lina', room: 'Computer Lab', type: 'Regular Class', notes: 'Bring laptop' }
    ],
    wednesday: [
      { id: 9, start_time: '08:00', end_time: '09:30', subject: 'Mathematics', teacher_name: 'Mr. Ahmed', room: 'Room 101', type: 'Regular Class', notes: 'Quiz tomorrow' },
      { id: 10, start_time: '10:00', end_time: '11:30', subject: 'Science', teacher_name: 'Ms. Fatima', room: 'Lab 1', type: 'Regular Class', notes: '' },
      { id: 11, start_time: '12:00', end_time: '13:30', subject: 'Arabic', teacher_name: 'Mr. Khalid', room: 'Room 103', type: 'Regular Class', notes: '' },
      { id: 12, start_time: '14:00', end_time: '15:30', subject: 'Physical Education', teacher_name: 'Mr. Hassan', room: 'Gym', type: 'Activity', notes: 'Sports uniform required' }
    ],
    thursday: [
      { id: 13, start_time: '08:00', end_time: '09:30', subject: 'Physics', teacher_name: 'Mr. Ali', room: 'Lab 2', type: 'Regular Class', notes: '' },
      { id: 14, start_time: '10:00', end_time: '11:30', subject: 'Chemistry', teacher_name: 'Ms. Nadia', room: 'Lab 1', type: 'Regular Class', notes: '' },
      { id: 15, start_time: '12:00', end_time: '13:30', subject: 'Islamic Studies', teacher_name: 'Mr. Omar', room: 'Room 107', type: 'Regular Class', notes: '' },
      { id: 16, start_time: '14:00', end_time: '15:30', subject: 'English', teacher_name: 'Ms. Sarah', room: 'Room 105', type: 'Regular Class', notes: 'Essay due next week' }
    ],
    friday: [
      { id: 17, start_time: '08:00', end_time: '09:30', subject: 'Mathematics', teacher_name: 'Mr. Ahmed', room: 'Room 101', type: 'Regular Class', notes: '' },
      { id: 18, start_time: '10:00', end_time: '11:30', subject: 'Science', teacher_name: 'Ms. Fatima', room: 'Lab 1', type: 'Regular Class', notes: '' }
    ],
    saturday: [
      { id: 19, start_time: '09:00', end_time: '12:00', subject: 'School Assembly', teacher_name: 'Administration', room: 'Auditorium', type: 'Activity', notes: 'Monthly assembly' }
    ],
    sunday: []
  }
  
  return mockSchedule[day] || []
}

function previousWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  updateSelectedDay()
  fetchSchedule()
}

function nextWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  updateSelectedDay()
  fetchSchedule()
}

function updateSelectedDay() {
  if (days.value.length > 0) {
    selectedDay.value = days.value[0].date
  }
}

function formatDayDate(dateString) {
  const date = new Date(dateString)
  return date.getDate()
}

function formatDisplayDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Watch for selected day changes
import { watch } from 'vue'
watch(selectedDay, () => {
  fetchSchedule()
})

onMounted(async () => {
  await fetchStudentInfo()
  updateSelectedDay()
  await fetchSchedule()
})
</script>