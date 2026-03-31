<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900">{{ languageStore.t('dashboard') }}</h1>
        <p class="text-sm text-secondary-500 mt-1">{{ languageStore.t('welcomeBack') }}, {{ authStore.profile?.full_name }}</p>
      </div>
    </div>
    
    <!-- Stats Cards -->
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
    
    <!-- Pending Parents Section -->
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
    
    <!-- Pending Students Section -->
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
    
    <!-- Approve Parent Modal -->
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
    
    <!-- Approve Student Modal -->
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
              <input v-model="studentForm.student_number" type="text" required class="form-input" />
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
import { ref, onMounted } from 'vue'
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
  class_id: null
})

const fetchDashboardData = async () => {
  const schoolId = authStore.profile?.school_id
  
  if (!schoolId) return
  
  // Get pending parents (status = 'pending' and school_id is null)
  const { data: parents } = await supabase
    .from('parents')
    .select('*')
    .eq('status', 'pending')
    .is('school_id', null)
  
  pendingParents.value = parents || []
  
  // Get pending students (status = 'pending')
  const { data: students } = await supabase
    .from('students')
    .select(`
      *,
      parent:parents(full_name, phone, email)
    `)
    .eq('status', 'pending')
  
  pendingStudents.value = students || []
  
  // Get active students count
  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'active')
  
  stats.value.totalStudents = studentCount || 0
  
  // Get pending payments count
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
    // Update parent record with school_id and status
    const { error: parentError } = await supabase
      .from('parents')
      .update({ 
        school_id: schoolId,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedParent.value.id)
    
    if (parentError) throw parentError
    
    // Update user record with school_id
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
    await fetchDashboardData()
    
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
      await fetchDashboardData()
    }
  }
}

const showApproveStudentModal = (student) => {
  selectedStudent.value = student
  const year = new Date().getFullYear()
  studentForm.value.student_number = `STU-${year}-${Date.now().toString().slice(-6)}`
  studentForm.value.class_id = null
  showStudentModal.value = true
}

const confirmApproveStudent = async () => {
  isSubmitting.value = true
  const schoolId = authStore.profile?.school_id
  
  const { error } = await supabase
    .from('students')
    .update({
      school_id: schoolId,
      student_number: studentForm.value.student_number,
      class_id: studentForm.value.class_id,
      status: 'active'
    })
    .eq('id', selectedStudent.value.id)
  
  if (error) {
    alert('Error approving student')
  } else {
    alert('Student approved successfully!')
    closeStudentModal()
    await fetchDashboardData()
  }
  
  isSubmitting.value = false
}

const rejectStudent = async (student) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    await supabase.from('students').delete().eq('id', student.id)
    alert('Student rejected and removed')
    await fetchDashboardData()
  }
}

const closeParentModal = () => {
  showParentModal.value = false
  selectedParent.value = null
}

const closeStudentModal = () => {
  showStudentModal.value = false
  selectedStudent.value = null
  studentForm.value = { student_number: '', class_id: null }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchDashboardData()
  fetchClasses()
})
</script>