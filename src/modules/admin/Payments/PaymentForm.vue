<template>
  <div class="max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-0">
    <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? languageStore.t('editPayment') : languageStore.t('addPayment') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ isEdit ? languageStore.t('editPaymentDescription') : languageStore.t('addPaymentDescription') }}
            </p>
          </div>
          <span v-if="isEdit" class="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full self-start sm:self-auto">
            {{ languageStore.t('editMode') }}
          </span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6">
        <!-- Student Selection -->
        <div class="space-y-3">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {{ languageStore.t('studentInformation') }}
          </h2>

          <!-- Toggle Buttons -->
          <div class="flex flex-wrap gap-2">
            <button 
              type="button"
              @click="studentInputMode = 'select'"
              class="flex-1 min-w-[80px] px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors"
              :class="studentInputMode === 'select' 
                ? 'bg-primary-600 text-white dark:bg-primary-500' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              {{ languageStore.t('selectFromList') }}
            </button>
            <button 
              type="button"
              @click="studentInputMode = 'manual'"
              class="flex-1 min-w-[80px] px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors"
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
                class="form-input w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white pl-9"
                @input="filterStudents"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="max-h-48 sm:max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mt-2">
              <div 
                v-for="student in filteredStudents" 
                :key="student.id"
                @click="selectStudent(student)"
                class="p-2 sm:p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 border-gray-100 dark:border-gray-700 transition-colors"
                :class="{ 'bg-primary-50 dark:bg-primary-900/30': selectedStudentId === student.id }"
              >
                <div class="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{{ student.full_name }}</div>
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-mono">{{ student.student_number || '-' }}</span>
                  <span class="mx-1">|</span>
                  {{ student.class_name || '-' }}
                  <span v-if="student.phone" class="hidden sm:inline">
                    <span class="mx-1">|</span>
                    {{ student.phone }}
                  </span>
                </div>
              </div>
              <div v-if="filteredStudents.length === 0 && studentSearch" class="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                {{ languageStore.t('noStudentsFound') }}
              </div>
              <div v-if="filteredStudents.length === 0 && !studentSearch" class="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                {{ languageStore.t('typeToSearchStudents') }}
              </div>
            </div>

            <!-- Selected Student Display -->
            <div v-if="selectedStudent" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-green-200 dark:border-green-800">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {{ selectedStudent.full_name }}
                  </p>
                  <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ languageStore.t('studentNumber') }}: <span class="font-mono">{{ selectedStudent.student_number || '-' }}</span></span>
                    <span>{{ languageStore.t('class') }}: {{ selectedStudent.class_name || '-' }}</span>
                    <span v-if="selectedStudent.phone" class="hidden sm:inline">{{ languageStore.t('phone') }}: {{ selectedStudent.phone }}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="clearSelectedStudent"
                  class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm font-medium flex-shrink-0"
                >
                  {{ languageStore.t('change') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Manual Student Entry -->
          <div v-if="studentInputMode === 'manual'" class="space-y-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ languageStore.t('manualEntryNote') }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('fullName') }} *</label>
                <input 
                  v-model="manualStudent.full_name" 
                  type="text" 
                  required 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterFullName')"
                />
              </div>
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('studentNumber') }} *</label>
                <input 
                  v-model="manualStudent.student_number" 
                  type="text" 
                  required 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterStudentNumber')"
                />
              </div>
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('class') }}</label>
                <input 
                  v-model="manualStudent.class_name" 
                  type="text" 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterClass')"
                />
              </div>
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('phone') }}</label>
                <input 
                  v-model="manualStudent.phone" 
                  type="tel" 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterPhone')"
                />
              </div>
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('parentName') }}</label>
                <input 
                  v-model="manualStudent.parent_name" 
                  type="text" 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterParentName')"
                />
              </div>
              <div>
                <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('parentPhone') }}</label>
                <input 
                  v-model="manualStudent.parent_phone" 
                  type="tel" 
                  class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterParentPhone')"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="space-y-3">
          <h2 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ languageStore.t('paymentDetails') }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('amount') }} *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">SDG</span>
                <input 
                  v-model.number="form.amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  class="form-input w-full mt-1 pl-12 pr-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="languageStore.t('enterAmount')"
                />
              </div>
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('paymentType') }} *</label>
              <select 
                v-model="form.payment_type" 
                required 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="tuition">{{ languageStore.t('tuition') }}</option>
                <option value="exam_fees">{{ languageStore.t('examFees') }}</option>
                <option value="activity_fees">{{ languageStore.t('activityFees') }}</option>
                <option value="other">{{ languageStore.t('other') }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('paymentMethod') }} *</label>
              <select 
                v-model="form.payment_method" 
                required 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="cash">{{ languageStore.t('cash') }}</option>
                <option value="bankak">{{ languageStore.t('bankak') }}</option>
              </select>
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('dueDate') }} *</label>
              <input 
                v-model="form.due_date" 
                type="date" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Bankak Number -->
          <div v-if="form.payment_method === 'bankak'">
            <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('bankakNumber') }}</label>
            <input 
              v-model="form.bankak_number" 
              type="text" 
              class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :placeholder="languageStore.t('enterBankakNumber')"
            />
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('notes') }}</label>
          <textarea 
            v-model="form.notes" 
            rows="3" 
            class="form-textarea w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            :placeholder="languageStore.t('enterNotes')"
          ></textarea>
        </div>

        <!-- Info Note -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
              {{ isEdit ? languageStore.t('editPaymentNote') : languageStore.t('createPaymentNote') }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="$router.back()" class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1">
            {{ languageStore.t('cancel') }}
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? languageStore.t('saving') : languageStore.t('savePayment') }}
          </button>
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
const studentInputMode = ref('select')

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
  manual_student_data: null
})

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
  form.value.manual_student_data = null
  studentSearch.value = ''
}

const clearSelectedStudent = () => {
  selectedStudentId.value = null
  selectedStudent.value = null
  form.value.student_id = null
  studentSearch.value = ''
}

const filterStudents = () => {}

const loadPayment = async () => {
  if (isEdit.value) {
    const payment = await paymentStore.getPaymentById(route.params.id)
    if (payment) {
      form.value = { ...payment }
      if (payment.student_id) {
        selectedStudentId.value = payment.student_id
        const student = students.value.find(s => s.id === payment.student_id)
        if (student) {
          selectedStudent.value = student
          studentInputMode.value = 'select'
        }
      } else if (payment.manual_student_data) {
        studentInputMode.value = 'manual'
        manualStudent.value = payment.manual_student_data
      }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true

  try {
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

    if (studentInputMode.value === 'select') {
      if (!selectedStudent.value) {
        alert(languageStore.t('pleaseSelectStudent'))
        isLoading.value = false
        return
      }
      paymentData.student_id = selectedStudent.value.id
      paymentData.manual_student_data = null
    } else {
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
      result = await paymentStore.createPayment(paymentData, null)
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
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dark .card {
  background-color: #1f2937;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background-color: white;
  color: #1f2937;
}

.dark .form-input,
.dark .form-select,
.dark .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #f9fafb;
}

.dark .btn-secondary {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
.dark .btn-secondary:hover {
  background-color: #4b5563;
}
</style>