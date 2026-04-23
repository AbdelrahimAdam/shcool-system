<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <div class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('payment') }}
      </h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Student Selection Toggle -->
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('student') }}</label>
            <div class="flex gap-2 mb-3">
              <button 
                type="button"
                @click="studentInputMode = 'select'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="studentInputMode === 'select' 
                  ? 'bg-primary-600 text-white dark:bg-primary-500' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              >
                {{ languageStore.t('selectFromList') }}
              </button>
              <button 
                type="button"
                @click="studentInputMode = 'manual'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="studentInputMode === 'manual' 
                  ? 'bg-primary-600 text-white dark:bg-primary-500' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              >
                {{ languageStore.t('manualEntry') }}
              </button>
            </div>

            <!-- Select from existing students -->
            <div v-if="studentInputMode === 'select'">
              <div class="relative">
                <input 
                  v-model="studentSearch" 
                  type="text" 
                  :placeholder="languageStore.t('searchStudentsByNameClassPhone')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-2"
                  @input="filterStudents"
                />
                <div class="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <div 
                    v-for="student in filteredStudents" 
                    :key="student.id"
                    @click="selectStudent(student)"
                    class="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                    :class="{ 'bg-primary-50 dark:bg-primary-900/30': selectedStudentId === student.id }"
                  >
                    <div class="font-medium text-gray-900 dark:text-white">{{ student.full_name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ languageStore.t('studentNumber') }}: {{ student.student_number }} | 
                      {{ languageStore.t('class') }}: {{ student.class_name || '-' }} | 
                      {{ languageStore.t('phone') }}: {{ student.phone || '-' }}
                    </div>
                  </div>
                  <div v-if="filteredStudents.length === 0 && studentSearch" class="p-3 text-center text-gray-500 dark:text-gray-400">
                    {{ languageStore.t('noStudentsFound') }}
                  </div>
                </div>
              </div>
              <div v-if="selectedStudent" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedStudent.full_name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('studentNumber') }}: {{ selectedStudent.student_number }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('class') }}: {{ selectedStudent.class_name || '-' }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ languageStore.t('phone') }}: {{ selectedStudent.phone || '-' }}</p>
                  </div>
                  <button 
                    type="button"
                    @click="clearSelectedStudent"
                    class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    {{ languageStore.t('change') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Manual Student Entry (information stored with payment, no student record created) -->
            <div v-if="studentInputMode === 'manual'" class="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('fullName') }} *</label>
                  <input v-model="manualStudent.full_name" type="text" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('studentNumber') }} *</label>
                  <input v-model="manualStudent.student_number" type="text" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('class') }}</label>
                  <input v-model="manualStudent.class_name" type="text" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('phone') }}</label>
                  <input v-model="manualStudent.phone" type="tel" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('parentName') }}</label>
                  <input v-model="manualStudent.parent_name" type="text" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="form-label text-sm dark:text-gray-300">{{ languageStore.t('parentPhone') }}</label>
                  <input v-model="manualStudent.parent_phone" type="tel" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ languageStore.t('manualEntryNote') }}
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('amount') }} *</label>
              <input v-model.number="form.amount" type="number" step="0.01" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('paymentType') }} *</label>
              <select v-model="form.payment_type" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <option value="tuition">{{ languageStore.t('tuition') }}</option>
                <option value="exam_fees">{{ languageStore.t('examFees') }}</option>
                <option value="activity_fees">{{ languageStore.t('activityFees') }}</option>
                <option value="other">{{ languageStore.t('other') }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('paymentMethod') }} *</label>
              <select v-model="form.payment_method" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <option value="cash">{{ languageStore.t('cash') }}</option>
                <option value="bankak">{{ languageStore.t('bankak') }}</option>
              </select>
            </div>
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('dueDate') }} *</label>
              <input v-model="form.due_date" type="date" required class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <!-- Bankak Number (only if bankak selected) -->
          <div v-if="form.payment_method === 'bankak'">
            <label class="form-label dark:text-gray-300">{{ languageStore.t('bankakNumber') }}</label>
            <input v-model="form.bankak_number" type="text" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
          </div>

          <!-- Notes -->
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('notes') }}</label>
            <textarea v-model="form.notes" rows="3" class="input-field dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="$router.back()" class="btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50">
              {{ isLoading ? languageStore.t('loading') : languageStore.t('save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'

const router = useRouter()
const route = useRoute()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const students = ref([])
const studentSearch = ref('')
const selectedStudentId = ref(null)
const selectedStudent = ref(null)
const studentInputMode = ref('select') // 'select' or 'manual'

// Manual student data (stored with payment as JSON or separate fields)
const manualStudent = ref({
  full_name: '',
  student_number: '',
  class_name: '',
  phone: '',
  parent_name: '',
  parent_phone: ''
})

const form = ref({
  student_id: null,
  amount: '',
  payment_type: 'tuition',
  payment_method: 'cash',
  due_date: new Date().toISOString().split('T')[0],
  bankak_number: '',
  notes: '',
  // For manual entries, we'll store student details as JSON in a separate column (if your schema supports it)
  // Alternatively, we keep student_id = null and add a manual_student_data field
  manual_student_data: null
})

// Filter students based on search
const filteredStudents = computed(() => {
  if (!studentSearch.value) return students.value
  const search = studentSearch.value.toLowerCase()
  return students.value.filter(student => 
    student.full_name.toLowerCase().includes(search) ||
    student.student_number.toLowerCase().includes(search) ||
    (student.class_name && student.class_name.toLowerCase().includes(search)) ||
    (student.phone && student.phone.includes(search))
  )
})

// Load students with class information
const loadStudents = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  const { data } = await supabase
    .from('students')
    .select(`
      id, 
      full_name, 
      student_number, 
      phone,
      class:classes(name)
    `)
    .eq('school_id', schoolId)
    .eq('status', 'active')
    .order('full_name')
  
  students.value = (data || []).map(student => ({
    ...student,
    class_name: student.class?.name || null
  }))
}

const selectStudent = (student) => {
  selectedStudentId.value = student.id
  selectedStudent.value = student
  form.value.student_id = student.id
  form.value.manual_student_data = null // Clear manual data
}

const clearSelectedStudent = () => {
  selectedStudentId.value = null
  selectedStudent.value = null
  form.value.student_id = null
  studentSearch.value = ''
}

const filterStudents = () => {
  // Triggers computed
}

const loadPayment = async () => {
  if (isEdit.value) {
    const payment = await paymentStore.getPaymentById(route.params.id)
    if (payment) {
      form.value = { ...payment }
      if (payment.student_id) {
        // It's a linked student
        selectedStudentId.value = payment.student_id
        const student = students.value.find(s => s.id === payment.student_id)
        if (student) {
          selectedStudent.value = student
          studentInputMode.value = 'select'
        }
      } else if (payment.manual_student_data) {
        // Manual entry payment
        studentInputMode.value = 'manual'
        manualStudent.value = payment.manual_student_data
      }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true

  try {
    // Validate required fields
    if (!form.value.amount || form.value.amount <= 0) {
      alert(languageStore.t('validAmountRequired'))
      isLoading.value = false
      return
    }

    let paymentData = {
      amount: parseFloat(form.value.amount),
      payment_type: form.value.payment_type,
      payment_method: form.value.payment_method,
      due_date: form.value.due_date,
      bankak_number: form.value.bankak_number || null,
      notes: form.value.notes || null,
      school_id: authStore.profile?.school_id
    }

    // Handle student assignment
    if (studentInputMode.value === 'select') {
      if (!selectedStudent.value) {
        alert(languageStore.t('pleaseSelectStudent'))
        isLoading.value = false
        return
      }
      paymentData.student_id = selectedStudent.value.id
      paymentData.manual_student_data = null
    } else {
      // Manual entry – validate required fields
      if (!manualStudent.value.full_name || !manualStudent.value.student_number) {
        alert(languageStore.t('manualStudentRequired'))
        isLoading.value = false
        return
      }
      paymentData.student_id = null
      paymentData.manual_student_data = { ...manualStudent.value }
    }

    let result
    if (isEdit.value) {
      result = await paymentStore.updatePayment(route.params.id, paymentData)
    } else {
      result = await paymentStore.createPayment(paymentData, null) // No file upload
    }

    if (result.success) {
      router.push('/admin/payments')
    } else {
      alert(result.error || languageStore.t('errorOccurred'))
    }
  } catch (error) {
    console.error('Error saving payment:', error)
    alert(error.message || languageStore.t('errorOccurred'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStudents()
  loadPayment()
})
</script>

<style scoped>
/* Base form styles (already covered by Tailwind, but keep for custom classes) */
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  background-color: white;
}
.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
/* Dark mode overrides */
.dark .input-field {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #f3f4f6;
}
.dark .input-field:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96,165,250,0.2);
}
</style>