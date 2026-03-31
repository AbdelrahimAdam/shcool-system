<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('payment') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Student Selection -->
          <div>
            <label class="label">{{ languageStore.t('student') }}</label>
            
            <!-- Toggle between Select and Manual Entry -->
            <div class="flex gap-2 mb-3">
              <button 
                type="button"
                @click="studentInputMode = 'select'"
                class="px-3 py-1 text-sm rounded-lg"
                :class="studentInputMode === 'select' ? 'btn-primary' : 'btn-secondary'"
              >
                {{ languageStore.t('selectFromList') }}
              </button>
              <button 
                type="button"
                @click="studentInputMode = 'manual'"
                class="px-3 py-1 text-sm rounded-lg"
                :class="studentInputMode === 'manual' ? 'btn-primary' : 'btn-secondary'"
              >
                {{ languageStore.t('manualEntry') }}
              </button>
            </div>
            
            <!-- Searchable Student Select -->
            <div v-if="studentInputMode === 'select'">
              <div class="relative">
                <input 
                  v-model="studentSearch" 
                  type="text" 
                  :placeholder="languageStore.t('searchStudentsByNameClassPhone')"
                  class="input-field w-full mb-2"
                  @input="filterStudents"
                />
                <div class="max-h-60 overflow-y-auto border rounded-lg">
                  <div 
                    v-for="student in filteredStudents" 
                    :key="student.id"
                    @click="selectStudent(student)"
                    class="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                    :class="{ 'bg-primary-50': selectedStudentId === student.id }"
                  >
                    <div class="font-medium">{{ student.full_name }}</div>
                    <div class="text-sm text-gray-500">
                      {{ languageStore.t('studentNumber') }}: {{ student.student_number }} | 
                      {{ languageStore.t('class') }}: {{ student.class_name || '-' }} | 
                      {{ languageStore.t('phone') }}: {{ student.phone || '-' }}
                    </div>
                  </div>
                  <div v-if="filteredStudents.length === 0 && studentSearch" class="p-3 text-center text-gray-500">
                    {{ languageStore.t('noStudentsFound') }}
                  </div>
                </div>
              </div>
              <div v-if="selectedStudent" class="mt-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ selectedStudent.full_name }}</p>
                    <p class="text-sm text-gray-500">{{ languageStore.t('studentNumber') }}: {{ selectedStudent.student_number }}</p>
                    <p class="text-sm text-gray-500">{{ languageStore.t('class') }}: {{ selectedStudent.class_name || '-' }}</p>
                    <p class="text-sm text-gray-500">{{ languageStore.t('phone') }}: {{ selectedStudent.phone || '-' }}</p>
                  </div>
                  <button 
                    type="button"
                    @click="clearSelectedStudent"
                    class="text-red-500 hover:text-red-700"
                  >
                    {{ languageStore.t('change') }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Manual Student Entry -->
            <div v-if="studentInputMode === 'manual'" class="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="label text-sm">{{ languageStore.t('fullName') }} *</label>
                  <input v-model="manualStudent.full_name" type="text" required class="input-field" />
                </div>
                <div>
                  <label class="label text-sm">{{ languageStore.t('studentNumber') }} *</label>
                  <input v-model="manualStudent.student_number" type="text" required class="input-field" />
                </div>
                <div>
                  <label class="label text-sm">{{ languageStore.t('class') }}</label>
                  <input v-model="manualStudent.class_name" type="text" class="input-field" />
                </div>
                <div>
                  <label class="label text-sm">{{ languageStore.t('phone') }}</label>
                  <input v-model="manualStudent.phone" type="tel" class="input-field" />
                </div>
                <div>
                  <label class="label text-sm">{{ languageStore.t('parentName') }}</label>
                  <input v-model="manualStudent.parent_name" type="text" class="input-field" />
                </div>
                <div>
                  <label class="label text-sm">{{ languageStore.t('parentPhone') }}</label>
                  <input v-model="manualStudent.parent_phone" type="tel" class="input-field" />
                </div>
              </div>
              <div class="text-xs text-gray-500">
                {{ languageStore.t('manualEntryNote') }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('amount') }}</label>
              <input v-model.number="form.amount" type="number" step="0.01" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('paymentType') }}</label>
              <select v-model="form.payment_type" required class="input-field">
                <option value="tuition">{{ languageStore.t('tuition') }}</option>
                <option value="exam_fees">{{ languageStore.t('examFees') }}</option>
                <option value="activity_fees">{{ languageStore.t('activityFees') }}</option>
                <option value="other">{{ languageStore.t('other') }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('paymentMethod') }}</label>
              <select v-model="form.payment_method" required class="input-field">
                <option value="cash">{{ languageStore.t('cash') }}</option>
                <option value="bankak">{{ languageStore.t('bankak') }}</option>
              </select>
            </div>
            <div>
              <label class="label">{{ languageStore.t('dueDate') }}</label>
              <input v-model="form.due_date" type="date" required class="input-field" />
            </div>
          </div>

          <div v-if="form.payment_method === 'bankak'">
            <label class="label">{{ languageStore.t('bankakNumber') }}</label>
            <input v-model="form.bankak_number" type="text" class="input-field" />
          </div>

          <div>
            <label class="label">{{ languageStore.t('proofImage') }}</label>
            <FileUploader
              v-model="proofFile"
              accepted-types="image/*"
              :max-size="5"
              @upload="handleUpload"
            />
            <p v-if="form.proof_image_url" class="text-xs text-gray-500 mt-1">
              {{ languageStore.t('currentFile') }}: <a :href="form.proof_image_url" target="_blank" class="text-primary-600">{{ languageStore.t('view') }}</a>
            </p>
          </div>

          <div>
            <label class="label">{{ languageStore.t('notes') }}</label>
            <textarea v-model="form.notes" rows="3" class="input-field"></textarea>
          </div>

          <div class="flex justify-end space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button type="button" @click="$router.back()" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
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
import FileUploader from '@/components/forms/FileUploader.vue'

const router = useRouter()
const route = useRoute()
const paymentStore = usePaymentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const students = ref([])
const proofFile = ref(null)
const studentSearch = ref('')
const selectedStudentId = ref(null)
const selectedStudent = ref(null)
const studentInputMode = ref('select') // 'select' or 'manual'

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
  proof_image_url: null,
  notes: ''
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
}

const clearSelectedStudent = () => {
  selectedStudentId.value = null
  selectedStudent.value = null
  form.value.student_id = null
  studentSearch.value = ''
}

const filterStudents = () => {
  // Just triggers the computed property
}

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
        }
      }
    }
  }
}

const handleUpload = (file) => {
  // The file is already set via v-model
}

// Create student if manual entry is used
const createManualStudent = async () => {
  const schoolId = authStore.profile?.school_id
  
  // Generate a temporary student number if not provided
  const studentNumber = manualStudent.value.student_number || `TEMP-${Date.now()}`
  
  const studentData = {
    school_id: schoolId,
    full_name: manualStudent.value.full_name,
    student_number: studentNumber,
    class_id: null, // Will need to be assigned later by admin
    phone: manualStudent.value.phone || null,
    address: null,
    medical_info: null,
    status: 'pending' // Pending approval
  }
  
  const { data, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating student:', error)
    throw error
  }
  
  // Create a parent record if parent info was provided
  if (manualStudent.value.parent_name && manualStudent.value.parent_phone) {
    const parentData = {
      school_id: schoolId,
      full_name: manualStudent.value.parent_name,
      phone: manualStudent.value.parent_phone,
      relationship: 'guardian',
      address: null
    }
    
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .insert([parentData])
      .select()
      .single()
    
    if (!parentError && parent) {
      // Link student to parent
      await supabase
        .from('students')
        .update({ parent_id: parent.id })
        .eq('id', data.id)
    }
  }
  
  return data
}

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    let studentId = form.value.student_id
    
    // Validate that we have a student
    if (!studentId && studentInputMode.value === 'select' && !selectedStudent.value) {
      alert(languageStore.t('pleaseSelectStudent'))
      isLoading.value = false
      return
    }
    
    // If manual entry mode, create a new student first
    if (studentInputMode.value === 'manual') {
      if (!manualStudent.value.full_name) {
        alert(languageStore.t('manualStudentRequired'))
        isLoading.value = false
        return
      }
      
      const newStudent = await createManualStudent()
      studentId = newStudent.id
    }
    
    // Ensure we have a student ID
    if (!studentId) {
      alert(languageStore.t('pleaseSelectStudent'))
      isLoading.value = false
      return
    }
    
    // Prepare payment data - ensure amount is a number
    const paymentData = {
      student_id: studentId,
      amount: parseFloat(form.value.amount),
      payment_type: form.value.payment_type,
      payment_method: form.value.payment_method,
      due_date: form.value.due_date,
      bankak_number: form.value.bankak_number || null,
      notes: form.value.notes || null
    }
    
    console.log('Submitting payment:', paymentData)
    
    let result
    if (isEdit.value) {
      result = await paymentStore.updatePayment(route.params.id, paymentData)
    } else {
      result = await paymentStore.createPayment(paymentData, proofFile.value)
    }
    
    if (result.success) {
      router.push('/admin/payments')
    } else {
      alert(result.error || languageStore.t('errorOccurred'))
    }
  } catch (error) {
    console.error('Error creating payment:', error)
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