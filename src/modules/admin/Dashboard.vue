<template>
  <div class="p-6">
    <!-- Header with refresh button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900">{{ languageStore.t('dashboard') }}</h1>
        <p class="text-sm text-secondary-500 mt-1">{{ languageStore.t('welcomeBack') }}, {{ authStore.profile?.full_name }}</p>
      </div>
      <button 
        @click="refreshData" 
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        title="Refresh"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ languageStore.t('refresh') }}
      </button>
    </div>
    
    <!-- Stats Cards (unchanged) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('totalStudents') }}</p>
            <p class="text-3xl font-bold">{{ stats.totalStudents }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingParents') }}</p>
            <p class="text-3xl font-bold text-yellow-600">{{ pendingParents.length }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingStudents') }}</p>
            <p class="text-3xl font-bold text-orange-600">{{ pendingStudents.length }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.pendingPayments }}</p>
          </div>
          <div class="bg-red-100 rounded-full p-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pending Parents Section (now shows parents registered for this school) -->
    <div v-if="pendingParents.length > 0" class="card mb-6">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-secondary-900">{{ languageStore.t('pendingParentRegistrations') }}</h2>
            <p class="text-xs text-secondary-500 mt-0.5">{{ languageStore.t('reviewAndApproveParents') }}</p>
          </div>
          <span class="badge-warning px-3 py-1">{{ pendingParents.length }} {{ languageStore.t('pending') }}</span>
        </div>
      </div>
      <div class="p-0 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('fullName') }}</th>
              <th class="hidden sm:table-cell px-4 py-2 text-left">{{ languageStore.t('email') }}</th>
              <th class="hidden md:table-cell px-4 py-2 text-left">{{ languageStore.t('phone') }}</th>
              <th class="hidden lg:table-cell px-4 py-2 text-left">{{ languageStore.t('relationship') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parent in pendingParents" :key="parent.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2 font-medium">{{ parent.full_name }}</td>
              <td class="hidden sm:table-cell px-4 py-2 text-secondary-500">{{ parent.email }}</td>
              <td class="hidden md:table-cell px-4 py-2 text-secondary-500">{{ parent.phone }}</td>
              <td class="hidden lg:table-cell px-4 py-2 text-secondary-500">{{ languageStore.t(parent.relationship || 'guardian') }}</td>
              <td class="px-4 py-2 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="showApproveParentModal(parent)" 
                    class="text-green-600 hover:text-green-700 px-3 py-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-sm"
                  >
                    {{ languageStore.t('approve') }}
                  </button>
                  <button 
                    @click="rejectParent(parent)" 
                    class="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm"
                  >
                    {{ languageStore.t('reject') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Pending Students Section (also filtered by school) -->
    <div v-if="pendingStudents.length > 0" class="card mb-6">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-secondary-900">{{ languageStore.t('pendingStudentRegistrations') }}</h2>
            <p class="text-xs text-secondary-500 mt-0.5">{{ languageStore.t('reviewStudentRegistrations') }}</p>
          </div>
          <span class="badge-warning px-3 py-1">{{ pendingStudents.length }} {{ languageStore.t('pending') }}</span>
        </div>
      </div>
      <div class="p-0 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('studentName') }}</th>
              <th class="hidden sm:table-cell px-4 py-2 text-left">{{ languageStore.t('parentName') }}</th>
              <th class="hidden md:table-cell px-4 py-2 text-left">{{ languageStore.t('dateOfBirth') }}</th>
              <th class="px-4 py-2 text-right">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in pendingStudents" :key="student.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2 font-medium">{{ student.full_name }}</td>
              <td class="hidden sm:table-cell px-4 py-2 text-secondary-500">{{ student.parent?.full_name || '-' }}</td>
              <td class="hidden md:table-cell px-4 py-2 text-secondary-500">{{ formatDate(student.date_of_birth) }}</td>
              <td class="px-4 py-2 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="showApproveStudentModal(student)" 
                    class="text-green-600 hover:text-green-700 px-3 py-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-sm"
                  >
                    {{ languageStore.t('approve') }}
                  </button>
                  <button 
                    @click="rejectStudent(student)" 
                    class="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm"
                  >
                    {{ languageStore.t('reject') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Approve Parent Modal (unchanged) -->
    <div v-if="showParentModal" class="modal-overlay" @click.self="closeParentModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">{{ languageStore.t('approveParentRegistration') }}</h3>
        </div>
        <form @submit.prevent="confirmApproveParent">
          <div class="modal-body space-y-4">
            <div>
              <label class="form-label">{{ languageStore.t('parentName') }}</label>
              <p class="text-secondary-700 bg-gray-50 p-2 rounded">{{ selectedParent?.full_name }}</p>
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('email') }}</label>
              <p class="text-secondary-700 bg-gray-50 p-2 rounded">{{ selectedParent?.email }}</p>
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('phone') }}</label>
              <p class="text-secondary-700 bg-gray-50 p-2 rounded">{{ selectedParent?.phone }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-sm text-green-800">{{ languageStore.t('approveParentNote') }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeParentModal" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary">
              {{ isSubmitting ? languageStore.t('processing') : languageStore.t('approveParent') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Approve Student Modal (unchanged) -->
    <div v-if="showStudentModal" class="modal-overlay" @click.self="closeStudentModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">{{ languageStore.t('approveStudentRegistration') }}</h3>
        </div>
        <form @submit.prevent="confirmApproveStudent">
          <div class="modal-body space-y-4">
            <div>
              <label class="form-label">{{ languageStore.t('studentName') }}</label>
              <p class="text-secondary-700 bg-gray-50 p-2 rounded">{{ selectedStudent?.full_name }}</p>
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('studentNumber') }} *</label>
              <input v-model="studentForm.student_number" type="text" required class="form-input" placeholder="STU-2024-000001" />
              <p class="text-xs text-secondary-400 mt-1">{{ languageStore.t('studentNumberHelp') }}</p>
            </div>
            <div>
              <label class="form-label">{{ languageStore.t('class') }} *</label>
              <select v-model="studentForm.class_id" required class="form-select">
                <option :value="null">{{ languageStore.t('selectClass') }}</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }})
                </option>
              </select>
            </div>
            
            <div class="border-t pt-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="studentForm.create_account" class="w-4 h-4" />
                <span class="text-sm font-medium">{{ languageStore.t('createStudentAccount') }}</span>
              </label>
            </div>
            
            <div v-if="studentForm.create_account" class="space-y-3 pl-6 border-l-2 border-primary-200">
              <div>
                <label class="form-label">{{ languageStore.t('email') }} *</label>
                <input v-model="studentForm.email" type="email" required class="form-input" />
              </div>
              <div>
                <label class="form-label">{{ languageStore.t('password') }} *</label>
                <input v-model="studentForm.password" type="password" required class="form-input" />
                <p class="text-xs text-gray-500 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
              </div>
            </div>
            
            <div class="bg-yellow-50 p-3 rounded-lg">
              <p class="text-sm text-yellow-800">{{ languageStore.t('approveStudentNote') }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeStudentModal" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary">
              {{ isSubmitting ? languageStore.t('processing') : languageStore.t('approveAndRegister') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const stats = ref({ totalStudents: 0, pendingPayments: 0 })
const pendingParents = ref([])
const pendingStudents = ref([])
const classes = ref([])
const selectedParent = ref(null)
const selectedStudent = ref(null)
const showParentModal = ref(false)
const showStudentModal = ref(false)
const isSubmitting = ref(false)

const studentForm = ref({
  student_number: '',
  class_id: null,
  create_account: false,
  email: '',
  password: ''
})

let realtimeSubscription = null

const fetchDashboardData = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return

  // Pending parents for THIS school (not null school_id)
  const { data: parents } = await supabase
    .from('parents')
    .select('*')
    .eq('status', 'pending')
    .eq('school_id', schoolId)   // <-- FIXED
  pendingParents.value = parents || []

  // Pending students for THIS school
  const { data: students } = await supabase
    .from('students')
    .select(`
      *,
      parent:parents(full_name, phone, email)
    `)
    .eq('status', 'pending')
    .eq('school_id', schoolId)   // <-- ADDED
    .order('created_at', { ascending: false })
  pendingStudents.value = students || []

  // Active students count
  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'active')
  stats.value.totalStudents = studentCount || 0

  // Pending payments count
  const { count: paymentCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'pending')
  stats.value.pendingPayments = paymentCount || 0
}

const fetchClasses = async () => {
  const schoolId = authStore.profile?.school_id
  const { data } = await supabase
    .from('classes')
    .select('id, name, grade_level')
    .eq('school_id', schoolId)
    .order('grade_level')
  classes.value = data || []
}

const refreshData = () => {
  fetchDashboardData()
  fetchClasses()
}

const showApproveParentModal = (parent) => {
  selectedParent.value = parent
  showParentModal.value = true
}

const confirmApproveParent = async () => {
  isSubmitting.value = true
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) {
    alert('No school found. Please contact super admin.')
    isSubmitting.value = false
    return
  }
  
  try {
    // Update parent record (school_id already correct, but we keep for safety)
    const { error: parentError } = await supabase
      .from('parents')
      .update({ 
        school_id: schoolId,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedParent.value.id)
    if (parentError) throw parentError

    // Update user record
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        school_id: schoolId,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedParent.value.user_id)
    if (userError) throw userError

    alert('Parent approved successfully!')
    closeParentModal()
    await refreshData()
  } catch (error) {
    console.error('Error approving parent:', error)
    alert('Error approving parent: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const rejectParent = async (parent) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('id', parent.id)
    if (!error) {
      alert('Parent rejected and removed')
      await refreshData()
    }
  }
}

const showApproveStudentModal = (student) => {
  selectedStudent.value = student
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  studentForm.value.student_number = `STU-${year}-${randomNum}`
  studentForm.value.class_id = null
  studentForm.value.create_account = false
  studentForm.value.email = ''
  studentForm.value.password = ''
  showStudentModal.value = true
}

const confirmApproveStudent = async () => {
  isSubmitting.value = true
  const schoolId = authStore.profile?.school_id
  
  if (!studentForm.value.class_id) {
    alert('Please select a class for the student')
    isSubmitting.value = false
    return
  }
  if (!studentForm.value.student_number?.trim()) {
    alert('Please enter a valid student number')
    isSubmitting.value = false
    return
  }
  
  let userId = null
  
  if (studentForm.value.create_account) {
    if (!studentForm.value.email || !studentForm.value.password) {
      alert('Please enter email and password for the student account')
      isSubmitting.value = false
      return
    }
    if (studentForm.value.password.length < 6) {
      alert('Password must be at least 6 characters')
      isSubmitting.value = false
      return
    }
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentForm.value.email,
        password: studentForm.value.password,
        options: {
          data: {
            full_name: selectedStudent.value.full_name,
            role: 'student',
            phone: selectedStudent.value.phone
          }
        }
      })
      if (authError) throw authError
      userId = authData.user.id
      if (schoolId) {
        await supabase.from('users').update({ school_id: schoolId }).eq('id', userId)
      }
    } catch (error) {
      console.error('Error creating student account:', error)
      alert('Failed to create student account: ' + error.message)
      isSubmitting.value = false
      return
    }
  }
  
  try {
    const { error } = await supabase
      .from('students')
      .update({
        school_id: schoolId,
        student_number: studentForm.value.student_number,
        class_id: studentForm.value.class_id,
        user_id: userId,
        status: 'active'
      })
      .eq('id', selectedStudent.value.id)
    if (error) throw error
    
    alert(studentForm.value.create_account 
      ? 'Student approved and account created successfully!'
      : 'Student approved successfully!')
    closeStudentModal()
    await refreshData()
  } catch (error) {
    console.error('Error approving student:', error)
    alert('Error approving student: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const rejectStudent = async (student) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id)
    if (!error) {
      alert('Student rejected and removed')
      await refreshData()
    }
  }
}

const closeParentModal = () => {
  showParentModal.value = false
  selectedParent.value = null
}

const closeStudentModal = () => {
  showStudentModal.value = false
  selectedStudent.value = null
  studentForm.value = { student_number: '', class_id: null, create_account: false, email: '', password: '' }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

// Realtime subscription for new pending parents/students
const subscribeToRealtime = () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return

  realtimeSubscription = supabase
    .channel('admin-dashboard')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'parents', filter: `school_id=eq.${schoolId}` },
      () => refreshData()
    )
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'students', filter: `school_id=eq.${schoolId}` },
      () => refreshData()
    )
    .subscribe()
}

onMounted(() => {
  refreshData()
  subscribeToRealtime()
})

onUnmounted(() => {
  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription)
  }
})
</script>

<style scoped>
/* (Same styles as original – unchanged) */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  max-width: 28rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}
.form-input, .form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
.form-input:focus, .form-select:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  border-color: transparent;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
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
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #f9fafb;
}
.badge-warning {
  background-color: #fef3c7;
  color: #d97706;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}
</style>