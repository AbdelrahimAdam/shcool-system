<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ languageStore.t('reports') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Performance Report Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('performanceReport') }}</h2>
        <p class="text-gray-600 mb-4">View student performance across subjects</p>
        <button @click="generateReport('performance')" class="btn-primary">
          {{ languageStore.t('generate') }}
        </button>
      </div>
      
      <!-- Attendance Report Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('attendanceReport') }}</h2>
        <p class="text-gray-600 mb-4">View attendance statistics by class</p>
        <button @click="generateReport('attendance')" class="btn-primary">
          {{ languageStore.t('generate') }}
        </button>
      </div>
      
      <!-- Revenue Report Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('revenueReport') }}</h2>
        <p class="text-gray-600 mb-4">View revenue and payment statistics</p>
        <button @click="generateReport('revenue')" class="btn-primary">
          {{ languageStore.t('generate') }}
        </button>
      </div>
      
      <!-- Pending Payments Report Card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4">{{ languageStore.t('pendingPaymentsReport') }}</h2>
        <p class="text-gray-600 mb-4">View all pending payments</p>
        <button @click="generateReport('pending')" class="btn-primary">
          {{ languageStore.t('generate') }}
        </button>
      </div>
    </div>
    
    <!-- Report Display Area -->
    <div v-if="reportData" class="card p-6 mt-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ currentReportTitle }}</h2>
        <button @click="exportReport" class="btn-secondary text-sm">
          {{ languageStore.t('export') }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <pre class="text-sm">{{ reportData }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const reportData = ref(null)
const currentReportTitle = ref('')

const generateReport = async (type) => {
  const schoolId = authStore.profile?.school_id
  
  if (type === 'performance') {
    currentReportTitle.value = languageStore.t('performanceReport')
    const { data } = await supabase
      .from('grades')
      .select(`
        *,
        student:students(full_name),
        exam:exams(subject, exam_type)
      `)
      .eq('school_id', schoolId)
    reportData.value = data
  } 
  else if (type === 'attendance') {
    currentReportTitle.value = languageStore.t('attendanceReport')
    const { data } = await supabase
      .from('attendance')
      .select(`
        *,
        student:students(full_name),
        class:classes(name)
      `)
      .eq('school_id', schoolId)
    reportData.value = data
  }
  else if (type === 'revenue') {
    currentReportTitle.value = languageStore.t('revenueReport')
    const { data } = await supabase
      .from('payments')
      .select('amount, status, payment_method, created_at')
      .eq('school_id', schoolId)
    reportData.value = data
  }
  else if (type === 'pending') {
    currentReportTitle.value = languageStore.t('pendingPaymentsReport')
    const { data } = await supabase
      .from('payments')
      .select('*, student:students(full_name)')
      .eq('school_id', schoolId)
      .eq('status', 'pending')
    reportData.value = data
  }
}

const exportReport = () => {
  const dataStr = JSON.stringify(reportData.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = `${currentReportTitle.value}_${new Date().toISOString()}.json`
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}
</script>