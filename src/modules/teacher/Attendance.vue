<template>
  <div class="flex flex-col h-full min-h-0">
    <div class="card bg-white dark:bg-gray-800 p-4 md:p-6 transition-colors duration-200 flex flex-col flex-1 min-h-0">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex-shrink-0">{{ languageStore.t('attendance') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
        <div>
          <label class="form-label text-gray-700 dark:text-gray-300">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClass" @change="onClassChange" class="form-select w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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

      <div class="flex flex-col sm:flex-row gap-3 mb-6 flex-shrink-0">
        <button 
          @click="loadStudents" 
          :disabled="!selectedClass || isLoading" 
          class="btn-primary w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          {{ isLoading ? languageStore.t('loading') : languageStore.t('loadStudents') }}
        </button>
      </div>

      <!-- Scrollable Table Area -->
      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="spinner dark:border-gray-600 dark:border-t-primary-400"></div>
        </div>

        <!-- Attendance Table -->
        <div v-else-if="students.length > 0">
          <div class="border dark:border-gray-700 rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-200 min-w-[120px]">{{ languageStore.t('studentName') }}</th>
                  <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200 min-w-[80px]">{{ languageStore.t('present') }}</th>
                  <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200 min-w-[80px]">{{ languageStore.t('absent') }}</th>
                  <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200 min-w-[80px]">{{ languageStore.t('late') }}</th>
                  <th class="px-3 py-2 text-center text-gray-700 dark:text-gray-200 min-w-[80px]">{{ languageStore.t('excused') }}</th>
                  <th class="px-3 py-2 text-gray-700 dark:text-gray-200 min-w-[140px]">{{ languageStore.t('notes') }}</th>
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
                      class="w-5 h-5 accent-primary-600 dark:accent-primary-400 cursor-pointer"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="absent" 
                      :checked="getAttendanceStatus(student.id) === 'absent'"
                      @change="updateAttendanceStatus(student.id, 'absent')"
                      class="w-5 h-5 accent-red-600 dark:accent-red-400 cursor-pointer"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="late" 
                      :checked="getAttendanceStatus(student.id) === 'late'"
                      @change="updateAttendanceStatus(student.id, 'late')"
                      class="w-5 h-5 accent-yellow-600 dark:accent-yellow-400 cursor-pointer"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <input 
                      type="radio" 
                      :name="`status-${student.id}`" 
                      value="excused" 
                      :checked="getAttendanceStatus(student.id) === 'excused'"
                      @change="updateAttendanceStatus(student.id, 'excused')"
                      class="w-5 h-5 accent-blue-600 dark:accent-blue-400 cursor-pointer"
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
          </div>
        </div>

        <div v-else-if="selectedClass && !students.length && !isLoading" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('noStudentsInClass') }}
        </div>
        
        <div v-else-if="!selectedClass" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ languageStore.t('selectClassToViewStudents') }}
        </div>
      </div>

      <!-- Action Buttons - Always visible at bottom -->
      <div v-if="students.length > 0" class="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-4 border-t dark:border-gray-700 flex-shrink-0">
        <button @click="resetForm" class="btn-secondary w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
          {{ languageStore.t('cancel') }}
        </button>
        <button @click="saveAttendance" :disabled="isSaving" class="btn-primary w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700">
          {{ isSaving ? languageStore.t('saving') : languageStore.t('saveAttendance') }}
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <div v-if="showSuccess" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        {{ languageStore.t('attendanceSaved') }}
      </div>
    </transition>
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
const selectedClass = ref(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceData = ref({})
const isLoading = ref(false)
const isSaving = ref(false)
const showSuccess = ref(false)
const dateError = ref('')

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
  try {
    // Get teacher ID from auth store
    const teacherId = authStore.teacherId || authStore.profile?.teacher_id
    
    if (!teacherId) {
      console.warn('No teacher ID found')
      classes.value = []
      return
    }

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_level')
      .eq('teacher_id', teacherId)
      .order('grade_level', { ascending: true })
      
    if (error) {
      console.error('Error loading classes:', error)
      throw error
    }
    
    classes.value = data || []
    
    // Auto-select first class if available
    if (classes.value.length > 0 && !selectedClass.value) {
      selectedClass.value = classes.value[0].id
      await loadStudents()
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const onClassChange = () => {
  // Clear students when class changes
  students.value = []
  attendanceData.value = {}
  if (selectedClass.value) {
    loadStudents()
  }
}

const loadStudents = async () => {
  if (!selectedClass.value) {
    students.value = []
    attendanceData.value = {}
    return
  }
  
  if (!validateDate()) {
    alert(dateError.value)
    return
  }

  isLoading.value = true
  try {
    // Load students for the selected class
    const { data: studentList, error: studentError } = await supabase
      .from('students')
      .select('id, full_name')
      .eq('class_id', selectedClass.value)
      .eq('status', 'active')
      .order('full_name')
      
    if (studentError) {
      console.error('Error loading students:', studentError)
      throw studentError
    }
    
    students.value = studentList || []
    
    // If no students found, clear attendance data
    if (students.value.length === 0) {
      attendanceData.value = {}
      isLoading.value = false
      return
    }

    // Load existing attendance records
    const { data: existing, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status, notes')
      .eq('class_id', selectedClass.value)
      .eq('date', attendanceDate.value)
      
    if (attendanceError) {
      console.error('Error loading attendance:', attendanceError)
      throw attendanceError
    }

    // Initialize attendance data for each student
    attendanceData.value = {}
    students.value.forEach(student => {
      const existingRec = existing?.find(e => e.student_id === student.id)
      attendanceData.value[student.id] = {
        status: existingRec?.status || 'present',
        notes: existingRec?.notes || ''
      }
    })
    
  } catch (error) {
    console.error('Error in loadStudents:', error)
    students.value = []
    attendanceData.value = {}
  } finally {
    isLoading.value = false
  }
}

const saveAttendance = async () => {
  if (!selectedClass.value || students.value.length === 0) {
    alert(languageStore.t('noStudentsToSave'))
    return
  }
  
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
      
    if (deleteError) {
      console.error('Delete error:', deleteError)
      throw deleteError
    }

    // Insert new records
    const { error: insertError } = await supabase
      .from('attendance')
      .insert(records)
      
    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 3000)

    // Reset form after successful save
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
  
  // Reload classes and auto-select first
  loadClasses()
}

onMounted(async () => {
  await loadClasses()
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

/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
  .form-input, .form-select {
    font-size: 14px;
  }
  .card {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  td, th {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 12px;
  }
  
  input[type="radio"] {
    width: 20px !important;
    height: 20px !important;
  }
}

@media (max-width: 480px) {
  td, th {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
    font-size: 11px;
  }
  
  .form-input {
    font-size: 12px;
    padding: 0.25rem 0.5rem;
  }
  
  input[type="radio"] {
    width: 18px !important;
    height: 18px !important;
  }
}

/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar,
.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track,
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb,
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover,
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (prefers-color-scheme: dark) {
  .overflow-y-auto::-webkit-scrollbar-track,
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb,
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover,
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}

/* Sticky header in table */
.sticky {
  position: sticky;
}

.form-input {
  max-width: 100%;
}

@media (max-width: 640px) {
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
  }
}

.rounded-lg {
  border-radius: 0.5rem;
}

.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

@media (max-width: 640px) {
  .form-input[type="text"] {
    min-height: 36px;
  }
  
  select.form-select {
    min-height: 42px;
  }
  
  input[type="radio"] {
    cursor: pointer;
    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>