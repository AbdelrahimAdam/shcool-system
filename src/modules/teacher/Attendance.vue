<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">{{ languageStore.t('attendance') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="form-label">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClass" @change="loadStudents" class="form-select">
            <option :value="null">{{ languageStore.t('selectClass') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">{{ languageStore.t('date') }}</label>
          <input v-model="attendanceDate" type="date" class="form-input" />
        </div>
      </div>

      <button 
        @click="loadStudents" 
        :disabled="!selectedClass || isLoading" 
        class="btn-primary mb-6"
      >
        {{ isLoading ? languageStore.t('loading') : languageStore.t('loadStudents') }}
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>

      <!-- Attendance Table -->
      <div v-else-if="students.length > 0" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">{{ languageStore.t('studentName') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('present') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('absent') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('late') }}</th>
              <th class="px-3 py-2 text-center">{{ languageStore.t('excused') }}</th>
              <th class="px-3 py-2">{{ languageStore.t('notes') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-t">
              <td class="px-3 py-2">{{ student.full_name }}</td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="present" 
                  :checked="getAttendanceStatus(student.id) === 'present'"
                  @change="updateAttendanceStatus(student.id, 'present')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="absent" 
                  :checked="getAttendanceStatus(student.id) === 'absent'"
                  @change="updateAttendanceStatus(student.id, 'absent')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="late" 
                  :checked="getAttendanceStatus(student.id) === 'late'"
                  @change="updateAttendanceStatus(student.id, 'late')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="excused" 
                  :checked="getAttendanceStatus(student.id) === 'excused'"
                  @change="updateAttendanceStatus(student.id, 'excused')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2">
                <input 
                  :value="getAttendanceNotes(student.id)"
                  @input="updateAttendanceNotes(student.id, $event.target.value)"
                  type="text" 
                  class="form-input text-sm"
                  :placeholder="languageStore.t('notes')"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <button @click="saveAttendance" :disabled="isSaving" class="btn-primary">
            {{ isSaving ? languageStore.t('saving') : languageStore.t('saveAttendance') }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedClass && !students.length && !isLoading" class="text-center py-8 text-gray-500">
        {{ languageStore.t('noStudentsInClass') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useTeacherStore } from '@/stores/teacher'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const teacherStore = useTeacherStore()
const languageStore = useLanguageStore()

const classes = ref([])
const students = ref([])
const selectedClass = ref(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceData = ref({})
const isLoading = ref(false)
const isSaving = ref(false)

// Helper function to safely get attendance status
const getAttendanceStatus = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  return attendanceData.value[studentId].status
}

// Helper function to safely get attendance notes
const getAttendanceNotes = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  return attendanceData.value[studentId].notes
}

// Update attendance status
const updateAttendanceStatus = (studentId, status) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  attendanceData.value[studentId].status = status
}

// Update attendance notes
const updateAttendanceNotes = (studentId, notes) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  attendanceData.value[studentId].notes = notes
}

// Load classes for the teacher (only their assigned classes)
const loadClasses = async () => {
  isLoading.value = true
  
  try {
    const teacherId = authStore.teacherId
    
    if (!teacherId) {
      console.log('No teacher ID found')
      classes.value = []
      isLoading.value = false
      return
    }

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_level')
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })

    if (error) throw error

    classes.value = data || []
    console.log('Classes loaded:', classes.value.length)
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    isLoading.value = false
  }
}

// Load students of selected class
const loadStudents = async () => {
  if (!selectedClass.value) return
  
  isLoading.value = true
  
  try {
    const { data: studentList, error: studentError } = await supabase
      .from('students')
      .select('id, full_name')
      .eq('class_id', selectedClass.value)
      .eq('status', 'active')
      .order('full_name')

    if (studentError) throw studentError
    
    students.value = studentList || []

    // Fetch existing attendance for this class and date
    const { data: existing, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status, notes')
      .eq('class_id', selectedClass.value)
      .eq('date', attendanceDate.value)

    if (attendanceError) throw attendanceError

    // Initialize attendance data
    attendanceData.value = {}
    students.value.forEach(student => {
      const existingRec = existing?.find(e => e.student_id === student.id)
      attendanceData.value[student.id] = {
        status: existingRec?.status || 'present',
        notes: existingRec?.notes || ''
      }
    })
  } catch (error) {
    console.error('Error loading students:', error)
  } finally {
    isLoading.value = false
  }
}

// Save attendance
const saveAttendance = async () => {
  if (!selectedClass.value || students.value.length === 0) return
  
  isSaving.value = true
  const schoolId = authStore.profile?.school_id
  const userId = authStore.user?.id

  const records = students.value.map(student => ({
    school_id: schoolId,
    student_id: student.id,
    class_id: selectedClass.value,
    date: attendanceDate.value,
    status: attendanceData.value[student.id]?.status || 'present',
    notes: attendanceData.value[student.id]?.notes || '',
    marked_by: userId
  }))

  try {
    // Delete existing records for this date/class
    const { error: deleteError } = await supabase
      .from('attendance')
      .delete()
      .eq('class_id', selectedClass.value)
      .eq('date', attendanceDate.value)

    if (deleteError) throw deleteError

    // Insert new records
    const { error: insertError } = await supabase
      .from('attendance')
      .insert(records)

    if (insertError) throw insertError
    
    alert(languageStore.t('attendanceSaved'))
  } catch (error) {
    console.error('Error saving attendance:', error)
    alert(languageStore.t('errorSavingAttendance'))
  } finally {
    isSaving.value = false
  }
}

// Watch for date changes to reload attendance
watch(attendanceDate, () => {
  if (selectedClass.value) {
    loadStudents()
  }
})

onMounted(() => {
  loadClasses()
})
</script>