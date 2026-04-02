<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('parentDashboard') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('welcomeBack') }}, {{ authStore.profile?.full_name }}</p>
    </div>
    
    <!-- Pending Approval Message -->
    <div v-if="!parentApproved" class="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow-sm">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-700">
            {{ languageStore.t('pendingApprovalMessage') }}
          </p>
          <p class="text-xs text-yellow-600 mt-1">
            {{ languageStore.t('contactSchoolAdminForActivation') }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards - 2 columns on mobile, 3 on desktop -->
    <div v-if="parentApproved" class="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('myChildren') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{{ children.length }}</p>
          </div>
          <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ pendingPayments }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 group col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('attendanceRate') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{{ averageAttendance }}%</p>
          </div>
          <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Children List Section -->
    <div v-if="parentApproved" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-base font-semibold text-gray-800">{{ languageStore.t('myChildren') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('manageYourChildren') }}</p>
        </div>
        <button @click="showRegisterChild = true" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
          + {{ languageStore.t('registerChild') }}
        </button>
      </div>
      
      <!-- Children Cards - 2 columns on mobile, 2 on tablet, 3 on desktop -->
      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="child in children" :key="child.id" class="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 group">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 text-base">{{ child.full_name }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ languageStore.t('studentNumber') }}: {{ child.student_number }}</p>
                <p class="text-xs text-gray-500">{{ languageStore.t('class') }}: {{ child.class?.name || '-' }}</p>
              </div>
              <span :class="getStatusClass(child.status)" class="text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap ml-2">
                {{ child.status === 'pending' ? languageStore.t('pending') : languageStore.t(child.status) }}
              </span>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200">
              <router-link 
                v-if="child.status === 'active'" 
                :to="`/parent/children/${child.id}`" 
                class="inline-flex items-center text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
              >
                {{ languageStore.t('viewDetails') }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
              <span v-else class="text-gray-400 text-sm">
                {{ languageStore.t('awaitingApproval') }}
              </span>
            </div>
          </div>
          
          <div v-if="children.length === 0" class="col-span-full text-center py-12">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="text-gray-500">{{ languageStore.t('noChildren') }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ languageStore.t('clickRegisterToAddChild') }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Register Child Modal - Responsive -->
    <div v-if="showRegisterChild && parentApproved" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showRegisterChild = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ languageStore.t('registerChild') }}</h2>
        </div>
        
        <form @submit.prevent="registerChild">
          <div class="p-6 space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('fullName') }} *</label>
              <input v-model="newChild.full_name" type="text" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
            </div>
            
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('arabicName') }}</label>
              <input v-model="newChild.arabic_name" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" dir="rtl" />
            </div>
            
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('dateOfBirth') }} *</label>
              <input v-model="newChild.date_of_birth" type="date" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
            </div>
            
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('gender') }} *</label>
              <select v-model="newChild.gender" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
                <option value="male">{{ languageStore.t('male') }}</option>
                <option value="female">{{ languageStore.t('female') }}</option>
              </select>
            </div>
            
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('medicalInfo') }}</label>
              <textarea v-model="newChild.medical_info" rows="2" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"></textarea>
            </div>
            
            <div class="bg-blue-50 rounded-xl p-3">
              <p class="text-xs text-blue-800">{{ languageStore.t('childRegistrationNote') }}</p>
            </div>
          </div>
          
          <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
            <button type="button" @click="showRegisterChild = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
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
    
    parentApproved.value = parent.status === 'active' && parent.school_id !== null
    
    if (!parentApproved.value) {
      console.log('Parent not approved yet')
      return
    }
    
    const { data: students } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(name)
      `)
      .eq('parent_id', parent.id)
      .order('created_at', { ascending: false })
    
    children.value = students || []
    
    const activeChildren = children.value.filter(c => c.status === 'active')
    
    if (activeChildren.length > 0) {
      const { data: payments } = await supabase
        .from('payments')
        .select('id')
        .in('student_id', activeChildren.map(c => c.id))
        .eq('status', 'pending')
      pendingPayments.value = payments?.length || 0
      
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
    
    const tempNumber = `TEMP-${Date.now()}`
    
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
        status: 'pending'
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
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    graduated: 'bg-blue-100 text-blue-700',
    transferred: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

onMounted(() => {
  fetchParentAndChildren()
})
</script>