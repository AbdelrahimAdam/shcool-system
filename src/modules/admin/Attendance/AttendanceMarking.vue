<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">{{ languageStore.t('attendance') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="form-label">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClassId" @change="loadStudents" class="form-select">
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

        <div>
          <label class="form-label">&nbsp;</label>
          <button
            @click="saveAttendance"
            :disabled="!selectedClassId || isLoading"
            class="btn-primary w-full"
          >
            {{ isLoading ? languageStore.t('saving') : languageStore.t('save') }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>

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
                  :name="'status-' + student.id"
                  :value="'present'"
                  :checked="getAttendanceStatus(student.id) === 'present'"
                  @change="updateAttendanceStatus(student.id, 'present')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input
                  type="radio"
                  :name="'status-' + student.id"
                  :value="'absent'"
                  :checked="getAttendanceStatus(student.id) === 'absent'"
                  @change="updateAttendanceStatus(student.id, 'absent')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input
                  type="radio"
                  :name="'status-' + student.id"
                  :value="'late'"
                  :checked="getAttendanceStatus(student.id) === 'late'"
                  @change="updateAttendanceStatus(student.id, 'late')"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input
                  type="radio"
                  :name="'status-' + student.id"
                  :value="'excused'"
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
      </div>

      <div v-else-if="selectedClassId && !students.length && !isLoading" class="text-center py-8 text-gray-500">
        {{ languageStore.t('noStudentsInClass') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const classes = ref([])
const students = ref([])
const selectedClassId = ref(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceData = ref({})
const isLoading = ref(false)

const getAttendanceStatus = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  return attendanceData.value[studentId].status
}

const getAttendanceNotes = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  return attendanceData.value[studentId].notes
}

const updateAttendanceStatus = (studentId, status) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  attendanceData.value[studentId].status = status
}

const updateAttendanceNotes = (studentId, notes) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = {
      status: 'present',
      notes: ''
    }
  }
  attendanceData.value[studentId].notes = notes
}

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

const loadStudents = async () => {
  if (!selectedClassId.value) return
  
  isLoading.value = true
  
  try {
    const { data: studentList, error: studentError } = await supabase
      .from('students')
      .select('id, full_name')
      .eq('class_id', selectedClassId.value)
      .eq('status', 'active')
      .order('full_name')
    
    if (studentError) throw studentError
    students.value = studentList || []

    const { data: existing, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status, notes')
      .eq('class_id', selectedClassId.value)
      .eq('date', attendanceDate.value)
    
    if (attendanceError) throw attendanceError

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

const saveAttendance = async () => {
  if (!selectedClassId.value || students.value.length === 0) {
    alert('Please select a class with students')
    return
  }
  
  isLoading.value = true
  const schoolId = authStore.profile?.school_id
  const userId = authStore.user?.id

  const records = students.value.map(student => ({
    school_id: schoolId,
    student_id: student.id,
    class_id: selectedClassId.value,
    date: attendanceDate.value,
    status: attendanceData.value[student.id]?.status || 'present',
    notes: attendanceData.value[student.id]?.notes || '',
    marked_by: userId
  }))

  try {
    const { error: deleteError } = await supabase
      .from('attendance')
      .delete()
      .eq('class_id', selectedClassId.value)
      .eq('date', attendanceDate.value)

    if (deleteError) throw deleteError

    const { error: insertError } = await supabase
      .from('attendance')
      .insert(records)

    if (insertError) throw insertError
    
    alert('Attendance saved successfully!')
  } catch (error) {
    console.error('Error saving attendance:', error)
    alert('Error saving attendance: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

watch(attendanceDate, () => {
  if (selectedClassId.value) {
    loadStudents()
  }
})

onMounted(() => {
  loadClasses()
})
</script>