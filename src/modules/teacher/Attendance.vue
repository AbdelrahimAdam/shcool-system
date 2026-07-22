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
      <div v-else-if="students.length > 0" class="attendance-table-container">
        <div class="table-scroll-wrapper">
          <table class="attendance-table">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="sticky-col px-3 py-2 text-left text-gray-700 dark:text-gray-200">{{ languageStore.t('studentName') }}</th>
                <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('present') }}</th>
                <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('absent') }}</th>
                <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('late') }}</th>
                <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200">{{ languageStore.t('excused') }}</th>
                <th class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ languageStore.t('notes') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="sticky-col px-3 py-2 font-medium text-gray-900 dark:text-white">{{ student.full_name }}</td>
                <td class="px-3 py-2 text-center">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="present" 
                      :checked="getAttendanceStatus(student.id) === 'present'"
                      @change="updateAttendanceStatus(student.id, 'present')"
                      class="radio-input radio-present"
                    />
                    <span class="radio-custom"></span>
                  </label>
                </td>
                <td class="px-3 py-2 text-center">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="absent" 
                      :checked="getAttendanceStatus(student.id) === 'absent'"
                      @change="updateAttendanceStatus(student.id, 'absent')"
                      class="radio-input radio-absent"
                    />
                    <span class="radio-custom"></span>
                  </label>
                </td>
                <td class="px-3 py-2 text-center">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="late" 
                      :checked="getAttendanceStatus(student.id) === 'late'"
                      @change="updateAttendanceStatus(student.id, 'late')"
                      class="radio-input radio-late"
                    />
                    <span class="radio-custom"></span>
                  </label>
                </td>
                <td class="px-3 py-2 text-center">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="excused" 
                      :checked="getAttendanceStatus(student.id) === 'excused'"
                      @change="updateAttendanceStatus(student.id, 'excused')"
                      class="radio-input radio-excused"
                    />
                    <span class="radio-custom"></span>
                  </label>
                </td>
                <td class="px-3 py-2">
                  <input 
                    :value="getAttendanceNotes(student.id)"
                    @input="updateAttendanceNotes(student.id, $event.target.value)"
                    type="text" 
                    class="form-input text-sm w-full min-w-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    :placeholder="languageStore.t('notes')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

/* Mobile-friendly attendance table styles */
.attendance-table-container {
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  .attendance-table-container {
    border-color: #374151;
  }
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.table-scroll-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

@media (prefers-color-scheme: dark) {
  .table-scroll-wrapper::-webkit-scrollbar-track {
    background: #374151;
  }
  .table-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
}

.attendance-table {
  min-width: 600px;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}

/* Sticky column for student name */
.sticky-col {
  position: sticky;
  left: 0;
  z-index: 10;
  background-color: #f9fafb;
  min-width: 120px;
  max-width: 160px;
}

@media (prefers-color-scheme: dark) {
  .sticky-col {
    background-color: #1f2937;
  }
}

/* Radio button styling for better mobile touch */
.radio-label {
  position: relative;
  display: inline-block;
  cursor: pointer;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;
}

.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.radio-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  .radio-custom {
    border-color: #4b5563;
    background-color: #1f2937;
  }
}

.radio-input:checked + .radio-custom {
  border-width: 6px;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
}

/* Status-specific colors */
.radio-present:checked + .radio-custom {
  border-color: #2563eb;
}

.radio-absent:checked + .radio-custom {
  border-color: #dc2626;
}

.radio-late:checked + .radio-custom {
  border-color: #d97706;
}

.radio-excused:checked + .radio-custom {
  border-color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  .radio-present:checked + .radio-custom {
    border-color: #60a5fa;
  }
  .radio-absent:checked + .radio-custom {
    border-color: #f87171;
  }
  .radio-late:checked + .radio-custom {
    border-color: #fbbf24;
  }
  .radio-excused:checked + .radio-custom {
    border-color: #60a5fa;
  }
}

/* Hover and focus states */
.radio-label:hover .radio-custom {
  border-color: #9ca3af;
  transform: scale(1.05);
}

.radio-input:focus + .radio-custom {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

@media (prefers-color-scheme: dark) {
  .radio-label:hover .radio-custom {
    border-color: #6b7280;
  }
}

/* Table cells spacing optimization */
.attendance-table td,
.attendance-table th {
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
}

.attendance-table td:last-child {
  min-width: 100px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .attendance-table {
    font-size: 0.75rem;
  }
  
  .attendance-table td,
  .attendance-table th {
    padding: 0.375rem 0.5rem;
  }
  
  .sticky-col {
    min-width: 80px;
    max-width: 120px;
  }
  
  .radio-custom {
    width: 18px;
    height: 18px;
  }
  
  .attendance-table td:last-child {
    min-width: 80px;
  }
}
</style>