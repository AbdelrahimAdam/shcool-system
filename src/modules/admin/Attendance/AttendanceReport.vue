<template>
  <div class="space-y-6">
    <div class="card p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold mb-6">{{ languageStore.t('attendanceReport') }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="label">{{ languageStore.t('class') }}</label>
          <select v-model="selectedClassId" class="input-field">
            <option :value="null">{{ languageStore.t('allClasses') }}</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">{{ languageStore.t('startDate') }}</label>
          <input v-model="startDate" type="date" class="input-field" />
        </div>

        <div>
          <label class="label">{{ languageStore.t('endDate') }}</label>
          <input v-model="endDate" type="date" class="input-field" />
        </div>
      </div>

      <button @click="generateReport" :disabled="isLoading" class="btn-primary mb-6">
        {{ isLoading ? languageStore.t('loading') : languageStore.t('generateReport') }}
      </button>

      <div v-if="reportData.length" class="overflow-x-auto">
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
            <tr v-for="row in reportData" :key="row.student_id" class="border-t">
              <td class="px-3 py-2">{{ row.student_name }}</td>
              <td class="px-3 py-2 text-center">{{ row.present }}</td>
              <td class="px-3 py-2 text-center">{{ row.absent }}</td>
              <td class="px-3 py-2 text-center">{{ row.late }}</td>
              <td class="px-3 py-2 text-center">{{ row.excused }}</td>
              <td class="px-3 py-2 text-center font-medium">
                {{ row.rate }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="generated && !reportData.length" class="text-center py-8 text-gray-500">
        {{ languageStore.t('noData') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../services/supabase'
import { useAuthStore } from '../../../stores/auth'
import { useLanguageStore } from '../../../stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const classes = ref([])
const selectedClassId = ref(null)
const startDate = ref(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])
const isLoading = ref(false)
const generated = ref(false)
const reportData = ref([])

const loadClasses = async () => {
  const { data } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', authStore.profile?.school_id)
    .order('grade_level')
  classes.value = data || []
}

const generateReport = async () => {
  isLoading.value = true
  generated.value = true

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

  const { data } = await query

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

  isLoading.value = false
}

onMounted(() => {
  loadClasses()
})
</script>