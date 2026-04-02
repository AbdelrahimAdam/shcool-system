<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('payments') }}</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('trackYourPayments') }}</p>
    </div>

    <!-- Mobile Filter Toggle Button -->
    <div class="block lg:hidden">
      <button 
        @click="showFilters = !showFilters"
        class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-yellow-300 transition-all duration-200"
      >
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="text-sm font-medium text-gray-700">{{ languageStore.t('filterPayments') }}</span>
        </div>
        <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': showFilters }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Filters Section -->
    <div :class="['bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 transition-all duration-300', showFilters ? 'block' : 'hidden lg:block']">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('selectChild') }}</label>
          <select v-model="selectedChildId" @change="filterPayments" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
            <option :value="null">{{ languageStore.t('allChildren') }}</option>
            <option v-for="child in children" :key="child.id" :value="child.id">{{ child.full_name }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('paymentStatus') }}</label>
          <select v-model="selectedStatus" @change="filterPayments" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
            <option :value="null">{{ languageStore.t('allStatus') }}</option>
            <option value="pending">{{ languageStore.t('pending') }}</option>
            <option value="approved">{{ languageStore.t('approved') }}</option>
            <option value="rejected">{{ languageStore.t('rejected') }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">{{ languageStore.t('paymentType') }}</label>
          <select v-model="selectedType" @change="filterPayments" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
            <option :value="null">{{ languageStore.t('allTypes') }}</option>
            <option value="tuition">{{ languageStore.t('tuition') }}</option>
            <option value="exam_fees">{{ languageStore.t('examFees') }}</option>
            <option value="activity_fees">{{ languageStore.t('activityFees') }}</option>
            <option value="other">{{ languageStore.t('other') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards - Luxurious Design -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('totalPaid') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{{ formatCurrency(totalPaid) }}</p>
          </div>
          <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('pendingAmount') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ formatCurrency(pendingAmount) }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('totalPayments') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{{ filteredPayments.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ languageStore.t('paymentRate') }}</p>
            <p class="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{{ paymentRate }}%</p>
          </div>
          <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="block lg:hidden space-y-4">
      <div v-for="payment in filteredPayments" :key="payment.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100">
          <div>
            <p class="text-xs text-gray-400">{{ languageStore.t('paymentNumber') }}</p>
            <p class="font-mono text-sm font-semibold text-gray-700">{{ payment.payment_number }}</p>
          </div>
          <span :class="getStatusClass(payment.status)" class="px-2 py-1 rounded-lg text-xs font-medium">
            {{ languageStore.t(payment.status) }}
          </span>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">{{ languageStore.t('student') }}</span>
            <span class="text-sm font-medium text-gray-700">{{ payment.student?.full_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">{{ languageStore.t('amount') }}</span>
            <span class="text-lg font-bold text-primary-600">{{ formatCurrency(payment.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">{{ languageStore.t('paymentDate') }}</span>
            <span class="text-sm text-gray-600">{{ formatDate(payment.created_at) }}</span>
          </div>
          <div v-if="payment.approved_at" class="flex justify-between">
            <span class="text-sm text-gray-500">{{ languageStore.t('approvedDate') }}</span>
            <span class="text-sm text-green-600">{{ formatDate(payment.approved_at) }}</span>
          </div>
        </div>
        <button @click="viewPaymentDetails(payment)" class="w-full mt-3 py-2 bg-gray-50 hover:bg-yellow-50 rounded-lg text-sm font-medium text-gray-600 hover:text-yellow-700 transition-all duration-200">
          {{ languageStore.t('viewDetails') }}
        </button>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentNumber') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('student') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentType') }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('amount') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('status') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('paymentDate') }}</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('approvedDate') }}</th>
              <th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-mono text-xs text-gray-600">{{ payment.payment_number }}</td>
              <td class="px-5 py-3">
                <div class="font-medium text-gray-800">{{ payment.student?.full_name }}</div>
                <div class="text-xs text-gray-400">{{ payment.student?.student_number }}</div>
              </td>
              <td class="px-5 py-3 text-sm text-gray-600">{{ languageStore.t(payment.payment_type) }}</td>
              <td class="px-5 py-3 text-right font-semibold text-gray-800">{{ formatCurrency(payment.amount) }}</td>
              <td class="px-5 py-3"><span :class="getStatusClass(payment.status)">{{ languageStore.t(payment.status) }}</span></td>
              <td class="px-5 py-3 text-sm text-gray-500">{{ formatDate(payment.created_at) }}</td>
              <td class="px-5 py-3 text-sm text-gray-500">{{ payment.approved_at ? formatDate(payment.approved_at) : '-' }}</td>
              <td class="px-5 py-3 text-center">
                <button @click="viewPaymentDetails(payment)" class="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium transition-all duration-200">
                  {{ languageStore.t('view') }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="8" class="px-5 py-12 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">{{ languageStore.t('noPayments') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closePaymentModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">{{ languageStore.t('paymentDetails') }}</h3>
          <button @click="closePaymentModal" class="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Payment Number</p><p class="font-mono text-sm font-semibold">{{ selectedPayment?.payment_number }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Student</p><p class="font-medium">{{ selectedPayment?.student?.full_name }}</p><p class="text-xs text-gray-400">{{ selectedPayment?.student?.student_number }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Payment Type</p><p>{{ languageStore.t(selectedPayment?.payment_type) }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Amount</p><p class="font-bold text-xl text-primary-600">{{ formatCurrency(selectedPayment?.amount) }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Status</p><span :class="getStatusClass(selectedPayment?.status)">{{ languageStore.t(selectedPayment?.status) }}</span></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">Payment Method</p><p>{{ languageStore.t(selectedPayment?.payment_method) }}</p></div>
          </div>
          <div class="border-t border-gray-100 pt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Date Information</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-xl p-3"><p class="text-xs text-blue-600 font-semibold">Payment Created</p><p class="font-medium text-sm">{{ formatDate(selectedPayment?.created_at) }}</p><p class="text-xs text-gray-500">{{ formatTime(selectedPayment?.created_at) }}</p><p class="text-xs text-blue-600 mt-1">When admin added payment</p></div>
              <div class="bg-green-50 rounded-xl p-3"><p class="text-xs text-green-600 font-semibold">Approved Date</p><div v-if="selectedPayment?.approved_at"><p class="font-medium text-sm">{{ formatDate(selectedPayment.approved_at) }}</p><p class="text-xs text-gray-500">{{ formatTime(selectedPayment.approved_at) }}</p><p class="text-xs text-green-600 mt-1">When accountant approved</p></div><p v-else class="text-gray-400 text-sm">Not approved yet</p></div>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button @click="closePaymentModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">{{ languageStore.t('close') }}</button>
          <button v-if="selectedPayment?.proof_image_url" @click="downloadReceipt" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors">Download Receipt</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const children = ref([])
const payments = ref([])
const selectedChildId = ref(null)
const selectedStatus = ref(null)
const selectedType = ref(null)
const showPaymentModal = ref(false)
const selectedPayment = ref(null)
const showFilters = ref(false)

const filteredPayments = computed(() => {
  let filtered = payments.value
  if (selectedChildId.value) filtered = filtered.filter(p => p.student_id === selectedChildId.value)
  if (selectedStatus.value) filtered = filtered.filter(p => p.status === selectedStatus.value)
  if (selectedType.value) filtered = filtered.filter(p => p.payment_type === selectedType.value)
  return filtered
})

const totalPaid = computed(() => filteredPayments.value.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0))
const pendingAmount = computed(() => filteredPayments.value.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0))
const paymentRate = computed(() => {
  const total = filteredPayments.value.length
  if (total === 0) return 0
  return Math.round((filteredPayments.value.filter(p => p.status === 'approved').length / total) * 100)
})

const loadChildren = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) return
    const { data: parent } = await supabase.from('parents').select('id').eq('user_id', userId).maybeSingle()
    if (!parent) return
    const { data } = await supabase.from('students').select('id, full_name, student_number').eq('parent_id', parent.id).eq('status', 'active').order('full_name')
    children.value = data || []
    await loadPayments(parent.id)
  } catch (error) { console.error('Error loading children:', error) }
}

const loadPayments = async (parentId = null) => {
  try {
    let childIds = []
    if (parentId) {
      const { data: childrenData } = await supabase.from('students').select('id').eq('parent_id', parentId)
      childIds = childrenData?.map(c => c.id) || []
    } else { childIds = children.value.map(c => c.id) }
    if (childIds.length === 0) { payments.value = []; return }
    const { data } = await supabase.from('payments').select('*, student:students(id, full_name, student_number, class:classes(name))').in('student_id', childIds).order('created_at', { ascending: false })
    payments.value = data || []
  } catch (error) { console.error('Error loading payments:', error); payments.value = [] }
}

const filterPayments = () => {}
const viewPaymentDetails = (payment) => { selectedPayment.value = payment; showPaymentModal.value = true }
const closePaymentModal = () => { showPaymentModal.value = false; selectedPayment.value = null }
const downloadReceipt = () => { if (selectedPayment.value?.proof_image_url) window.open(selectedPayment.value.proof_image_url, '_blank') }
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'
const formatTime = (date) => date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
const formatCurrency = (amount) => `SDG ${amount?.toLocaleString() || 0}`
const getStatusClass = (status) => ({ pending: 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium', approved: 'px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium', rejected: 'px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium' }[status] || 'px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium')

onMounted(() => loadChildren())
</script>