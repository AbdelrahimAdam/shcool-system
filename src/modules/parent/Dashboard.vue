<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ languageStore.t('parentDashboard') }}</h1>
    </div>
    
    <!-- Pending Approval Message -->
    <div v-if="!parentApproved" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            {{ languageStore.t('pendingApprovalMessage') }}
          </p>
          <p class="text-xs text-yellow-600 mt-1">
            {{ languageStore.t('contactSchoolAdminForActivation') }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards - Only show if approved -->
    <div v-if="parentApproved" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('myChildren') }}</p>
            <p class="text-3xl font-bold">{{ children.length }}</p>
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
            <p class="text-gray-500 text-sm">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-3xl font-bold">{{ pendingPayments }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 text-sm">{{ languageStore.t('attendanceRate') }}</p>
            <p class="text-3xl font-bold">{{ averageAttendance }}%</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Children List - Only show if approved -->
    <div v-if="parentApproved" class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ languageStore.t('myChildren') }}</h2>
        <button @click="showRegisterChild = true" class="btn-primary text-sm">
          + {{ languageStore.t('registerChild') }}
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="child in children" :key="child.id" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg">{{ child.full_name }}</h3>
              <p class="text-sm text-gray-600">{{ languageStore.t('studentNumber') }}: {{ child.student_number }}</p>
              <p class="text-sm text-gray-600">{{ languageStore.t('class') }}: {{ child.class?.name || '-' }}</p>
            </div>
            <span :class="getStatusClass(child.status)" class="text-xs px-2 py-1 rounded-full">
              {{ child.status === 'pending' ? languageStore.t('pending') : languageStore.t(child.status) }}
            </span>
          </div>
          <div class="mt-3">
            <router-link 
              v-if="child.status === 'active'" 
              :to="`/parent/children/${child.id}`" 
              class="text-primary-600 text-sm hover:underline"
            >
              {{ languageStore.t('viewDetails') }}
            </router-link>
            <span v-else class="text-gray-400 text-sm">
              {{ languageStore.t('awaitingApproval') }}
            </span>
          </div>
        </div>
        <div v-if="children.length === 0" class="col-span-2 text-center py-8 text-gray-500">
          {{ languageStore.t('noChildren') }}
        </div>
      </div>
    </div>
    
    <!-- Register Child Modal -->
    <div v-if="showRegisterChild && parentApproved" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ languageStore.t('registerChild') }}</h2>
        <form @submit.prevent="registerChild">
          <div class="space-y-4">
            <div>
              <label class="form-label">{{ languageStore.t('fullName') }} *</label>
              <input v-model="newChild.full_name" type="text" required class="form-input" />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('arabicName') }}</label>
              <input v-model="newChild.arabic_name" type="text" class="form-input" dir="rtl" />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('dateOfBirth') }} *</label>
              <input v-model="newChild.date_of_birth" type="date" required class="form-input" />
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('gender') }} *</label>
              <select v-model="newChild.gender" required class="form-select">
                <option value="male">{{ languageStore.t('male') }}</option>
                <option value="female">{{ languageStore.t('female') }}</option>
              </select>
            </div>
            
            <div>
              <label class="form-label">{{ languageStore.t('medicalInfo') }}</label>
              <textarea v-model="newChild.medical_info" rows="2" class="form-textarea"></textarea>
            </div>
            
            <div class="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              {{ languageStore.t('childRegistrationNote') }}
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showRegisterChild = false" class="btn-secondary">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary">
              {{ isSubmitting ? languageStore.t('submitting') : languageStore.t('submitForApproval') }}
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

const children = ref([])
const pendingPayments = ref(0)
const averageAttendance = ref(0)
const showRegisterChild = ref(false)
const isSubmitting = ref(false)
const parentApproved = ref(false)

const newChild = ref({
  full_name: '',
  arabic_name: '',
  date_of_birth: '',
  gender: 'male',
  medical_info: ''
})

const fetchParentAndChildren = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) return
    
    // Get parent record with school_id and status
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id, school_id, status')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (parentError) {
      console.error('Error fetching parent:', parentError)
      return
    }
    
    if (!parent) {
      console.log('Parent record not found')
      return
    }
    
    // Check if parent is approved (status active AND has school_id)
    parentApproved.value = parent.status === 'active' && parent.school_id !== null
    console.log('Parent approved:', parentApproved.value, 'School ID:', parent.school_id)
    
    if (!parentApproved.value) {
      console.log('Parent not approved yet')
      return
    }
    
    // Get children
    const { data: students } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(name)
      `)
      .eq('parent_id', parent.id)
      .order('created_at', { ascending: false })
    
    children.value = students || []
    
    // Calculate stats for active children only
    const activeChildren = children.value.filter(c => c.status === 'active')
    
    if (activeChildren.length > 0) {
      // Get pending payments
      const { data: payments } = await supabase
        .from('payments')
        .select('id')
        .in('student_id', activeChildren.map(c => c.id))
        .eq('status', 'pending')
      pendingPayments.value = payments?.length || 0
      
      // Calculate attendance rate for last 30 days
      let totalAttendance = 0
      let attendanceCount = 0
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      for (const child of activeChildren) {
        const { data: attendance } = await supabase
          .from('attendance')
          .select('status')
          .eq('student_id', child.id)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        
        if (attendance && attendance.length > 0) {
          const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length
          totalAttendance += (present / attendance.length) * 100
          attendanceCount++
        }
      }
      
      averageAttendance.value = attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0
    }
  } catch (error) {
    console.error('Error fetching parent data:', error)
  }
}

const registerChild = async () => {
  isSubmitting.value = true
  
  try {
    // Get parent record with school_id
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id, school_id, status')
      .eq('user_id', authStore.user?.id)
      .maybeSingle()
    
    if (parentError || !parent) {
      alert(languageStore.t('parentNotFound'))
      isSubmitting.value = false
      return
    }
    
    if (parent.status !== 'active') {
      alert(languageStore.t('parentNotApproved'))
      isSubmitting.value = false
      return
    }
    
    if (!parent.school_id) {
      alert(languageStore.t('parentNoSchool'))
      isSubmitting.value = false
      return
    }
    
    // Generate temporary student number
    const tempNumber = `TEMP-${Date.now()}`
    
    // Create student with pending status
    const { error: insertError } = await supabase
      .from('students')
      .insert([{
        school_id: parent.school_id,
        student_number: tempNumber,
        full_name: newChild.value.full_name,
        arabic_name: newChild.value.arabic_name || null,
        date_of_birth: newChild.value.date_of_birth,
        gender: newChild.value.gender,
        parent_id: parent.id,
        medical_info: newChild.value.medical_info || null,
        status: 'pending'  // 'pending' is now allowed in the database
      }])
    
    if (insertError) {
      console.error('Error registering child:', insertError)
      alert(insertError.message || languageStore.t('registrationFailed'))
    } else {
      alert(languageStore.t('childRegistrationSubmitted'))
      showRegisterChild.value = false
      newChild.value = {
        full_name: '',
        arabic_name: '',
        date_of_birth: '',
        gender: 'male',
        medical_info: ''
      }
      await fetchParentAndChildren()
    }
  } catch (error) {
    console.error('Error in registerChild:', error)
    alert(languageStore.t('registrationFailed'))
  } finally {
    isSubmitting.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    graduated: 'text-blue-600 bg-blue-100',
    transferred: 'text-orange-600 bg-orange-100',
    suspended: 'text-red-600 bg-red-100'
  }
  return classes[status] || 'text-gray-600 bg-gray-100'
}

onMounted(() => {
  fetchParentAndChildren()
})
</script>