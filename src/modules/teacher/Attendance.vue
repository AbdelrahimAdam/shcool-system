<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">Teacher Attendance</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="label">Select Class</label>
          <select v-model="selectedClass" class="input-field">
            <option :value="null">Select a class</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Date</label>
          <input v-model="attendanceDate" type="date" class="input-field" />
        </div>
      </div>

      <button 
        @click="loadStudents" 
        :disabled="!selectedClass" 
        class="btn-primary mb-6"
      >
        Load Students
      </button>

      <div v-if="students.length" class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">Student Name</th>
              <th class="px-3 py-2 text-center">Present</th>
              <th class="px-3 py-2 text-center">Absent</th>
              <th class="px-3 py-2 text-center">Late</th>
              <th class="px-3 py-2 text-center">Excused</th>
              <th class="px-3 py-2">Notes</th>
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
                  v-model="attendanceData[student.id].status"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="absent" 
                  v-model="attendanceData[student.id].status"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="late" 
                  v-model="attendanceData[student.id].status"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2 text-center">
                <input 
                  type="radio" 
                  :name="`status-${student.id}`" 
                  value="excused" 
                  v-model="attendanceData[student.id].status"
                  class="w-4 h-4"
                />
              </td>
              <td class="px-3 py-2">
                <input 
                  v-model="attendanceData[student.id].notes" 
                  type="text" 
                  class="input-field text-sm"
                  placeholder="Notes"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <button @click="saveAttendance" :disabled="isLoading" class="btn-primary">
            {{ isLoading ? 'Saving...' : 'Save Attendance' }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedClass && !students.length && loaded" class="text-center py-8 text-gray-500">
        No students found in this class
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../services/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const classes = ref([])
const students = ref([])
const selectedClass = ref(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceData = ref({})
const isLoading = ref(false)
const loaded = ref(false)

// Load classes for the teacher's school
const loadClasses = async () => {
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', authStore.profile?.school_id)
    .order('grade_level')
  classes.value = data || []
}

// Load students of selected class
const loadStudents = async () => {
  if (!selectedClass.value) return
  
  loaded.value = false
  const { data: studentList } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('class_id', selectedClass.value)
    .eq('status', 'active')
    .order('full_name')
  students.value = studentList || []

  // Fetch existing attendance for this class and date
  const { data: existing } = await supabase
    .from('attendance')
    .select('student_id, status, notes')
    .eq('class_id', selectedClass.value)
    .eq('date', attendanceDate.value)

  // Initialize attendance data
  attendanceData.value = {}
  students.value.forEach(s => {
    const existingRec = existing?.find(e => e.student_id === s.id)
    attendanceData.value[s.id] = {
      status: existingRec?.status || 'present',
      notes: existingRec?.notes || ''
    }
  })
  
  loaded.value = true
}

// Save attendance
const saveAttendance = async () => {
  isLoading.value = true
  const schoolId = authStore.profile?.school_id
  const userId = authStore.user?.id

  const records = students.value.map(student => ({
    school_id: schoolId,
    student_id: student.id,
    class_id: selectedClass.value,
    date: attendanceDate.value,
    status: attendanceData.value[student.id].status,
    notes: attendanceData.value[student.id].notes,
    marked_by: userId
  }))

  // Delete existing records for this date/class
  const { error: deleteError } = await supabase
    .from('attendance')
    .delete()
    .eq('class_id', selectedClass.value)
    .eq('date', attendanceDate.value)

  if (!deleteError) {
    const { error } = await supabase.from('attendance').insert(records)
    if (error) {
      console.error('Error saving attendance:', error)
      alert('Error saving attendance')
    } else {
      alert('Attendance saved successfully!')
    }
  }

  isLoading.value = false
}

onMounted(() => {
  loadClasses()
})
</script>