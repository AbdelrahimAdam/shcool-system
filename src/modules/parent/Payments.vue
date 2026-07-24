<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ languageStore.t('payments') }}</h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">{{ languageStore.t('trackAndManagePayments') }}</p>
      </div>
      <button 
        @click="openRequestModal" 
        class="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('requestPayment') }}
      </button>
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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

    <!-- Stats Cards -->
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

    <!-- Request Payment Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeRequestModal">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">{{ languageStore.t('requestPayment') }}</h3>
          <button @click="closeRequestModal" class="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitPaymentRequest" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('selectChild') }} *</label>
            <select 
              v-model="paymentRequest.student_id" 
              required 
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            >
              <option :value="null">{{ languageStore.t('selectChild') }}</option>
              <option v-for="child in children" :key="child.id" :value="child.id">{{ child.full_name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('amount') }} *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">SDG</span>
              <input 
                v-model.number="paymentRequest.amount" 
                type="number" 
                required 
                min="1"
                class="w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                :placeholder="languageStore.t('enterAmount')"
                @input="updateWhatsAppMessage"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('paymentType') }}</label>
            <select 
              v-model="paymentRequest.payment_type" 
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              @change="updateWhatsAppMessage"
            >
              <option value="tuition">{{ languageStore.t('tuition') }}</option>
              <option value="exam_fees">{{ languageStore.t('examFees') }}</option>
              <option value="activity_fees">{{ languageStore.t('activityFees') }}</option>
              <option value="other">{{ languageStore.t('other') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ languageStore.t('notes') }}</label>
            <textarea 
              v-model="paymentRequest.notes" 
              rows="2" 
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              :placeholder="languageStore.t('enterNotes')"
              @input="updateWhatsAppMessage"
            ></textarea>
          </div>

          <!-- School Bankak Account Details -->
          <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-sm font-semibold text-blue-800">{{ languageStore.t('schoolBankakDetails') }}</h4>
            </div>
            <div v-if="schoolBankak && schoolBankak.accountNumber" class="space-y-1.5 text-sm">
              <p class="text-blue-700"><span class="font-medium">{{ languageStore.t('accountNumber') }}:</span> <span class="font-mono">{{ schoolBankak.accountNumber }}</span></p>
              <p class="text-blue-700"><span class="font-medium">{{ languageStore.t('accountName') }}:</span> {{ schoolBankak.accountName }}</p>
              <p v-if="schoolBankak.phone" class="text-blue-700"><span class="font-medium">{{ languageStore.t('phone') }}:</span> <a :href="`tel:${schoolBankak.phone}`" class="text-blue-600 hover:underline">{{ schoolBankak.phone }}</a></p>
              <p v-if="schoolBankak.reference" class="text-blue-700"><span class="font-medium">{{ languageStore.t('reference') }}:</span> <span class="font-mono text-xs">{{ schoolBankak.reference }}</span></p>
            </div>
            <div v-else class="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-medium">{{ languageStore.t('bankakDetailsNotAvailable') }}</p>
              </div>
              <p class="mt-1 text-xs">{{ languageStore.t('bankakDetailsNotAvailableNote') }}</p>
            </div>
          </div>

          <!-- WhatsApp Payment Confirmation -->
          <div v-if="schoolBankak && schoolBankak.accountNumber" class="bg-green-50 rounded-xl p-4 border border-green-100">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <h4 class="text-sm font-semibold text-green-800">{{ languageStore.t('whatsappConfirmation') }}</h4>
            </div>
            <p class="text-xs text-green-700 mb-2">{{ languageStore.t('whatsappConfirmationNote') }}</p>
            <div class="flex flex-col sm:flex-row gap-2">
              <a 
                :href="whatsappLink" 
                target="_blank"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {{ languageStore.t('sendWhatsApp') }}
              </a>
              <button 
                type="button"
                @click="copyWhatsAppMessage"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {{ languageStore.t('copyMessage') }}
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-3 border-t border-gray-100">
            <button type="button" @click="closeRequestModal" class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              {{ languageStore.t('cancel') }}
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting || !schoolBankak?.accountNumber"
              class="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              </svg>
              {{ isSubmitting ? languageStore.t('submitting') : languageStore.t('submitRequest') }}
            </button>
          </div>
        </form>
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
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('paymentNumber') }}</p><p class="font-mono text-sm font-semibold">{{ selectedPayment?.payment_number }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('student') }}</p><p class="font-medium">{{ selectedPayment?.student?.full_name }}</p><p class="text-xs text-gray-400">{{ selectedPayment?.student?.student_number }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('paymentType') }}</p><p>{{ languageStore.t(selectedPayment?.payment_type) }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('amount') }}</p><p class="font-bold text-xl text-primary-600">{{ formatCurrency(selectedPayment?.amount) }}</p></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('status') }}</p><span :class="getStatusClass(selectedPayment?.status)">{{ languageStore.t(selectedPayment?.status) }}</span></div>
            <div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-500">{{ languageStore.t('paymentMethod') }}</p><p>{{ languageStore.t(selectedPayment?.payment_method) }}</p></div>
          </div>
          <div class="border-t border-gray-100 pt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ languageStore.t('dateInformation') }}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-xl p-3"><p class="text-xs text-blue-600 font-semibold">{{ languageStore.t('paymentCreated') }}</p><p class="font-medium text-sm">{{ formatDate(selectedPayment?.created_at) }}</p><p class="text-xs text-gray-500">{{ formatTime(selectedPayment?.created_at) }}</p><p class="text-xs text-blue-600 mt-1">{{ languageStore.t('whenAdminAddedPayment') }}</p></div>
              <div class="bg-green-50 rounded-xl p-3"><p class="text-xs text-green-600 font-semibold">{{ languageStore.t('approvedDate') }}</p><div v-if="selectedPayment?.approved_at"><p class="font-medium text-sm">{{ formatDate(selectedPayment.approved_at) }}</p><p class="text-xs text-gray-500">{{ formatTime(selectedPayment.approved_at) }}</p><p class="text-xs text-green-600 mt-1">{{ languageStore.t('whenAccountantApproved') }}</p></div><p v-else class="text-gray-400 text-sm">{{ languageStore.t('notApprovedYet') }}</p></div>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button @click="closePaymentModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">{{ languageStore.t('close') }}</button>
          <button v-if="selectedPayment?.proof_image_url" @click="downloadReceipt" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors">{{ languageStore.t('downloadReceipt') }}</button>
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
import { usePaymentStore } from '@/stores/payment'

const authStore = useAuthStore()
const languageStore = useLanguageStore()
const paymentStore = usePaymentStore()

const children = ref([])
const payments = ref([])
const selectedChildId = ref(null)
const selectedStatus = ref(null)
const selectedType = ref(null)
const showPaymentModal = ref(false)
const selectedPayment = ref(null)
const showFilters = ref(false)
const showRequestModal = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)

const paymentRequest = ref({
  student_id: null,
  amount: '',
  payment_type: 'tuition',
  notes: '',
  payment_method: 'bankak'
})

const schoolBankak = ref(null)

const whatsappMessage = ref('')

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

const whatsappLink = computed(() => {
  if (!schoolBankak.value?.phone) return '#'
  const phone = schoolBankak.value.phone.replace('+', '').replace(/\s/g, '')
  return `https://wa.me/${phone}?text=${whatsappMessage.value}`
})

const updateWhatsAppMessage = () => {
  const selectedChild = children.value.find(c => c.id === paymentRequest.value.student_id)
  const studentName = selectedChild?.full_name || 'الطالب'
  const amount = paymentRequest.value.amount || '0'
  const paymentType = languageStore.t(paymentRequest.value.payment_type || 'tuition')
  const notes = paymentRequest.value.notes || ''
  
  whatsappMessage.value = `*${languageStore.t('paymentNotification')}*%0A%0A` +
    `${languageStore.t('studentName')}: ${studentName}%0A` +
    `${languageStore.t('amount')}: SDG ${amount}%0A` +
    `${languageStore.t('paymentType')}: ${paymentType}%0A` +
    `${languageStore.t('bankakAccount')}: ${schoolBankak.value?.accountNumber || ''}%0A` +
    `${languageStore.t('accountName')}: ${schoolBankak.value?.accountName || ''}%0A` +
    `${languageStore.t('reference')}: ${schoolBankak.value?.reference || ''}%0A` +
    `${notes ? '%0A' + languageStore.t('notes') + ': ' + notes : ''}%0A%0A` +
    `${languageStore.t('thanksForPayment')}`
}

const copyWhatsAppMessage = async () => {
  const text = decodeURIComponent(whatsappMessage.value)
  try {
    await navigator.clipboard.writeText(text)
    alert(languageStore.t('messageCopied'))
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert(languageStore.t('messageCopied'))
  }
}

const loadSchoolBankakDetails = async () => {
  try {
    const schoolId = authStore.profile?.school_id || authStore.schoolId
    if (!schoolId) {
      schoolBankak.value = null
      return
    }
    
    const { data, error } = await supabase
      .from('schools')
      .select('bankak_account_number, bankak_account_name, bankak_phone, bankak_reference_prefix')
      .eq('id', schoolId)
      .single()
    
    if (error) throw error
    
    if (data && data.bankak_account_number && data.bankak_account_name) {
      schoolBankak.value = {
        accountNumber: data.bankak_account_number,
        accountName: data.bankak_account_name,
        phone: data.bankak_phone || '',
        reference: data.bankak_reference_prefix 
          ? `${data.bankak_reference_prefix}-${new Date().getFullYear()}`
          : ''
      }
    } else {
      schoolBankak.value = null
    }
  } catch (error) {
    console.error('Error loading school Bankak details:', error)
    schoolBankak.value = null
  }
}

const loadChildren = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) return
    
    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (!parent) return
    
    const { data } = await supabase
      .from('students')
      .select('id, full_name, student_number')
      .eq('parent_id', parent.id)
      .eq('status', 'active')
      .order('full_name')
    
    children.value = data || []
    await loadPayments(parent.id)
  } catch (error) {
    console.error('Error loading children:', error)
  } finally {
    isLoading.value = false
  }
}

const loadPayments = async (parentId = null) => {
  try {
    let childIds = []
    if (parentId) {
      const { data: childrenData } = await supabase
        .from('students')
        .select('id')
        .eq('parent_id', parentId)
      childIds = childrenData?.map(c => c.id) || []
    } else {
      childIds = children.value.map(c => c.id)
    }
    
    if (childIds.length === 0) {
      payments.value = []
      return
    }
    
    const { data } = await supabase
      .from('payments')
      .select('*, student:students(id, full_name, student_number, class:classes(name))')
      .in('student_id', childIds)
      .order('created_at', { ascending: false })
    
    payments.value = data || []
  } catch (error) {
    console.error('Error loading payments:', error)
    payments.value = []
  }
}

const openRequestModal = () => {
  if (!schoolBankak.value?.accountNumber) {
    alert(languageStore.t('bankakDetailsNotAvailableNote'))
    return
  }
  showRequestModal.value = true
}

const submitPaymentRequest = async () => {
  if (!paymentRequest.value.student_id || !paymentRequest.value.amount) {
    alert(languageStore.t('pleaseFillRequiredFields'))
    return
  }

  if (!schoolBankak.value?.accountNumber) {
    alert(languageStore.t('bankakDetailsNotAvailableNote'))
    return
  }

  isSubmitting.value = true

  try {
    const result = await paymentStore.createParentPaymentRequest({
      student_id: paymentRequest.value.student_id,
      amount: paymentRequest.value.amount,
      payment_type: paymentRequest.value.payment_type || 'tuition',
      payment_method: 'bankak',
      notes: paymentRequest.value.notes || `Payment requested by parent`
    })

    if (result.success) {
      alert(languageStore.t('paymentRequestSubmitted'))
      closeRequestModal()
      await loadPayments()
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error submitting payment:', error)
    alert(error.message || languageStore.t('operationFailed'))
  } finally {
    isSubmitting.value = false
  }
}

const filterPayments = () => {}

const viewPaymentDetails = (payment) => {
  selectedPayment.value = payment
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

const closeRequestModal = () => {
  showRequestModal.value = false
  paymentRequest.value = {
    student_id: null,
    amount: '',
    payment_type: 'tuition',
    notes: '',
    payment_method: 'bankak'
  }
  whatsappMessage.value = ''
}

const downloadReceipt = () => {
  if (selectedPayment.value?.proof_image_url) {
    window.open(selectedPayment.value.proof_image_url, '_blank')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium',
    approved: 'px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium',
    rejected: 'px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium'
  }
  return classes[status] || 'px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium'
}

onMounted(async () => {
  await loadSchoolBankakDetails()
  await loadChildren()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>