<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">{{ languageStore.t('attendance') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="label">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClassId" @change="loadStudents" class="input-field">
            <option :value="null">{{ languageStore.t('selectClass') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">{{ languageStore.t('date') }}</label>
          <input v-model="attendanceDate" type="date" class="input-field" />
        </div>

        <div>
          <label class="label">&nbsp;</label>
          <button
            @click="saveAttendance"
            :disabled="!selectedClassId || isLoading"
            class="btn-primary w-full"
          >
            {{ isLoading ? languageStore.t('saving') : languageStore.t('save') }}
          </button>
        </div>
      </div>

      <div v-if="students.length" class="overflow-x-auto">
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
                  :placeholder="languageStore.t('notes')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="selectedClassId && !students.length" class="text-center py-8 text-gray-500">
        {{ languageStore.t('noStudentsInClass') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../services/supabase'
import { useAuthStore } from '../../../stores/auth'
import { useClassStore } from '../../../stores/class'
import { useLanguageStore } from '../../../stores/language'

const authStore = useAuthStore()
const classStore = useClassStore()
const languageStore = useLanguageStore()

const classes = ref([])
const students = ref([])
const selectedClassId = ref(null)
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const attendanceData = ref({})
const isLoading = ref(false)

// Load classes for the current school
const loadClasses = async () => {
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', authStore.profile?.school_id)
    .order('grade_level')
  classes.value = data || []
}

// Load students of selected class and existing attendance for the date
const loadStudents = async () => {
  if (!selectedClassId.value) return
  const { data: studentList } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('class_id', selectedClassId.value)
    .eq('status', 'active')
    .order('full_name')
  students.value = studentList || []

  // Fetch existing attendance for this class and date
  const { data: existing } = await supabase
    .from('attendance')
    .select('student_id, status, notes')
    .eq('class_id', selectedClassId.value)
    .eq('date', attendanceDate.value)

  // Initialise attendanceData
  attendanceData.value = {}
  students.value.forEach(s => {
    const existingRec = existing?.find(e => e.student_id === s.id)
    attendanceData.value[s.id] = {
      status: existingRec?.status || 'present',
      notes: existingRec?.notes || ''
    }
  })
}

const saveAttendance = async () => {
  isLoading.value = true
  const schoolId = authStore.profile?.school_id
  const userId = authStore.user?.id

  const records = students.value.map(student => ({
    school_id: schoolId,
    student_id: student.id,
    class_id: selectedClassId.value,
    date: attendanceDate.value,
    status: attendanceData.value[student.id].status,
    notes: attendanceData.value[student.id].notes,
    marked_by: userId
  }))

  // Upsert: delete existing for this date/class then insert new ones
  const { error: deleteError } = await supabase
    .from('attendance')
    .delete()
    .eq('class_id', selectedClassId.value)
    .eq('date', attendanceDate.value)

  if (!deleteError) {
    const { error } = await supabase.from('attendance').insert(records)
    if (error) console.error(error)
  }

  isLoading.value = false
}

onMounted(() => {
  loadClasses()
})
</script>