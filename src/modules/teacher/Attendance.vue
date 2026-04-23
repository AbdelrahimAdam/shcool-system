<template>
  <div class="space-y-6">
    <div class="card bg-white dark:bg-gray-800 p-4 md:p-6 transition-colors duration-200">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ languageStore.t('attendance') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="form-label text-gray-700 dark:text-gray-300">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClass" @change="loadStudents" class="form-select w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option :value="null">{{ languageStore.t('selectClass') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label text-gray-700 dark:text-gray-300">{{ languageStore.t('date') }}</label>
          <input v-model="attendanceDate" type="date" class="form-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <p v-if="dateError" class="text-red-500 dark:text-red-400 text-xs mt-1">{{ dateError }}</p>
        </div>
      </div>

      <button 
        @click="loadStudents" 
        :disabled="!selectedClass || isLoading" 
        class="btn-primary w-full md:w-auto mb-6 dark:bg-primary-600 dark:hover:bg-primary-700"
      >
        {{ isLoading ? languageStore.t('loading') : languageStore.t('loadStudents') }}
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-primary-400"></div>
      </div>

      <!-- Attendance Table -->
      <div v-else-if="students.length > 0" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-200">{{ languageStore.t('studentName') }}</th>
              <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('present') }}</th>
              <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('absent') }}</th>
              <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('late') }}</th>
              <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('excused') }}</th>
              <th class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ languageStore.t('notes') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ student.full_name }}</td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="present" 
                  :checked="getAttendanceStatus(student.id) === 'present'"
                  @change="updateAttendanceStatus(student.id, 'present')"
                  class="w-4 h-4 accent-primary-600 dark:accent-primary-400"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="absent" 
                  :checked="getAttendanceStatus(student.id) === 'absent'"
                  @change="updateAttendanceStatus(student.id, 'absent')"
                  class="w-4 h-4 accent-red-600 dark:accent-red-400"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="late" 
                  :checked="getAttendanceStatus(student.id) === 'late'"
                  @change="updateAttendanceStatus(student.id, 'late')"
                  class="w-4 h-4 accent-yellow-600 dark:accent-yellow-400"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="excused" 
                  :checked="getAttendanceStatus(student.id) === 'excused'"
                  @change="updateAttendanceStatus(student.id, 'excused')"
                  class="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                />
              </td>
              <td class="px-3 py-2">
                <input 
                  :value="getAttendanceNotes(student.id)"
                  @input="updateAttendanceNotes(student.id, $event.target.value)"
                  type="text" 
                  class="form-input text-sm w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  :placeholder="languageStore.t('notes')"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button @click="resetForm" class="btn-secondary w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            {{ languageStore.t('cancel') }}
          </button>
          <button @click="saveAttendance" :disabled="isSaving" class="btn-primary w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700">
            {{ isSaving ? languageStore.t('saving') : languageStore.t('saveAttendance') }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedClass && !students.length && !isLoading" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ languageStore.t('noStudentsInClass') }}
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300">
      {{ languageStore.t('attendanceSaved') }}
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
const showSuccess = ref(false)
const dateError = ref('')

// Validate date (cannot be in the future)
const validateDate = () => {
  const today = new Date().toISOString().split('T')[0]
  if (attendanceDate.value > today) {
    dateError.value = languageStore.t('cannotMarkFutureAttendance')
    return false
  }
  dateError.value = ''
  return true
}

watch(attendanceDate, () => {
  validateDate()
  if (selectedClass.value) {
    loadStudents()
  }
})

const getAttendanceStatus = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = { status: 'present', notes: '' }
  }
  return attendanceData.value[studentId].status
}

const getAttendanceNotes = (studentId) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = { status: 'present', notes: '' }
  }
  return attendanceData.value[studentId].notes
}

const updateAttendanceStatus = (studentId, status) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = { status: 'present', notes: '' }
  }
  attendanceData.value[studentId].status = status
}

const updateAttendanceNotes = (studentId, notes) => {
  if (!attendanceData.value[studentId]) {
    attendanceData.value[studentId] = { status: 'present', notes: '' }
  }
  attendanceData.value[studentId].notes = notes
}

const loadClasses = async () => {
  isLoading.value = true
  try {
    const teacherId = authStore.teacherId
    if (!teacherId) {
      classes.value = []
      return
    }
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_level')
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })
    if (error) throw error
    classes.value = data || []
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    isLoading.value = false
  }
}

const loadStudents = async () => {
  if (!selectedClass.value) return
  if (!validateDate()) return

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

    const { data: existing, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status, notes')
      .eq('class_id', selectedClass.value)
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
  if (!selectedClass.value || students.value.length === 0) return
  if (!validateDate()) {
    alert(dateError.value)
    return
  }

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

    // Show success message
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 3000)

    // Reset form
    resetForm()
  } catch (error) {
    console.error('Error saving attendance:', error)
    alert(languageStore.t('errorSavingAttendance'))
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  selectedClass.value = null
  students.value = []
  attendanceData.value = {}
  attendanceDate.value = new Date().toISOString().split('T')[0]
  dateError.value = ''
}

onMounted(() => {
  loadClasses()
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}
</style>