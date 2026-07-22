<template>
  <div class="p-3 sm:p-4 md:p-6">
    <!-- Header with refresh button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ languageStore.t('dashboard') }}</h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{{ languageStore.t('welcomeBack') }}, {{ authStore.profile?.full_name }}</p>
      </div>
      <button 
        @click="refreshData" 
        class="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors text-gray-700 dark:text-gray-200"
        title="Refresh"
      >
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ languageStore.t('refresh') }}
      </button>
    </div>

    <!-- Stats Cards – 2 columns on mobile, 5 on desktop -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      <!-- Total Students -->
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="min-w-0">
            <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{{ languageStore.t('totalStudents') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalStudents }}</p>
          </div>
          <div class="bg-primary-100 dark:bg-primary-900/30 rounded-full p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pending Parents -->
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="min-w-0">
            <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{{ languageStore.t('pendingParents') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingParents.length }}</p>
          </div>
          <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pending Students -->
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="min-w-0">
            <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{{ languageStore.t('pendingStudents') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">{{ pendingStudents.length }}</p>
          </div>
          <div class="bg-orange-100 dark:bg-orange-900/30 rounded-full p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pending Payments -->
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="min-w-0">
            <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{{ languageStore.t('pendingPayments') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">{{ stats.pendingPayments }}</p>
          </div>
          <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- New Leads (CRM) -->
      <div class="card bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="min-w-0">
            <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{{ languageStore.t('newLeads') }}</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{{ newLeadsCount }}</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <div class="mt-1 sm:mt-2">
          <router-link to="/admin/crm" class="text-[10px] sm:text-xs md:text-sm text-primary-600 dark:text-primary-400 hover:underline">
            {{ languageStore.t('viewAllLeads') }} →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Pending Parents Section -->
    <div v-if="pendingParents.length > 0" class="card bg-white dark:bg-gray-800 mb-4 sm:mb-6 overflow-hidden rounded-xl shadow-sm">
      <div class="card-header border-b border-gray-100 dark:border-gray-700 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('pendingParentRegistrations') }}</h2>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ languageStore.t('reviewAndApproveParents') }}</p>
          </div>
          <span class="badge-warning bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium self-start sm:self-auto">{{ pendingParents.length }} {{ languageStore.t('pending') }}</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('fullName') }}</th>
              <th class="hidden sm:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('email') }}</th>
              <th class="hidden md:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('phone') }}</th>
              <th class="hidden lg:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('relationship') }}</th>
              <th class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-right text-gray-700 dark:text-gray-300">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parent in pendingParents" :key="parent.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 font-medium text-gray-900 dark:text-white">{{ parent.full_name }}</td>
              <td class="hidden sm:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-gray-500 dark:text-gray-400">{{ parent.email }}</td>
              <td class="hidden md:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-gray-500 dark:text-gray-400">{{ parent.phone }}</td>
              <td class="hidden lg:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-gray-500 dark:text-gray-400">{{ languageStore.t(parent.relationship || 'guardian') }}</td>
              <td class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-right">
                <div class="flex items-center justify-end gap-1 sm:gap-2">
                  <button 
                    @click="showApproveParentModal(parent)" 
                    class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
                  >
                    {{ languageStore.t('approve') }}
                  </button>
                  <button 
                    @click="rejectParent(parent)" 
                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
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
    <div v-if="pendingStudents.length > 0" class="card bg-white dark:bg-gray-800 mb-4 sm:mb-6 overflow-hidden rounded-xl shadow-sm">
      <div class="card-header border-b border-gray-100 dark:border-gray-700 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ languageStore.t('pendingStudentRegistrations') }}</h2>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ languageStore.t('reviewStudentRegistrations') }}</p>
          </div>
          <span class="badge-warning bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium self-start sm:self-auto">{{ pendingStudents.length }} {{ languageStore.t('pending') }}</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('studentName') }}</th>
              <th class="hidden sm:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('parentName') }}</th>
              <th class="hidden md:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-left text-gray-700 dark:text-gray-300">{{ languageStore.t('dateOfBirth') }}</th>
              <th class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-right text-gray-700 dark:text-gray-300">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in pendingStudents" :key="student.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 font-medium text-gray-900 dark:text-white">{{ student.full_name }}</td>
              <td class="hidden sm:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-gray-500 dark:text-gray-400">{{ student.parent?.full_name || '-' }}</td>
              <td class="hidden md:table-cell px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-gray-500 dark:text-gray-400">{{ formatDate(student.date_of_birth) }}</td>
              <td class="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-right">
                <div class="flex items-center justify-end gap-1 sm:gap-2">
                  <button 
                    @click="showApproveStudentModal(student)" 
                    class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
                  >
                    {{ languageStore.t('approve') }}
                  </button>
                  <button 
                    @click="rejectStudent(student)" 
                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-[10px] sm:text-xs md:text-sm"
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
    <div v-if="showParentModal" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4" @click.self="closeParentModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ languageStore.t('approveParentRegistration') }}</h3>
        </div>
        <form @submit.prevent="confirmApproveParent">
          <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('parentName') }}</label>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded">{{ selectedParent?.full_name }}</p>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('email') }}</label>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded">{{ selectedParent?.email }}</p>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('phone') }}</label>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded">{{ selectedParent?.phone }}</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/30 p-2.5 sm:p-3 rounded-lg">
              <p class="text-xs sm:text-sm text-green-800 dark:text-green-300">{{ languageStore.t('approveParentNote') }}</p>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button type="button" @click="closeParentModal" class="btn-secondary w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 order-2 sm:order-1">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 order-1 sm:order-2">{{ isSubmitting ? languageStore.t('processing') : languageStore.t('approveParent') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Approve Student Modal -->
    <div v-if="showStudentModal" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4" @click.self="closeStudentModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ languageStore.t('approveStudentRegistration') }}</h3>
        </div>
        <form @submit.prevent="confirmApproveStudent">
          <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('studentName') }}</label>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded">{{ selectedStudent?.full_name }}</p>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('studentNumber') }} *</label>
              <input v-model="studentForm.student_number" type="text" required class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="STU-2024-000001" />
              <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">{{ languageStore.t('studentNumberHelp') }}</p>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('class') }} *</label>
              <select v-model="studentForm.class_id" required class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option :value="null">{{ languageStore.t('selectClass') }}</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }} ({{ languageStore.t('grade') }} {{ cls.grade_level }})</option>
              </select>
            </div>

            <div class="border-t pt-3 border-gray-100 dark:border-gray-700">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="studentForm.create_account" class="w-4 h-4 dark:bg-gray-700" />
                <span class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('createStudentAccount') }}</span>
              </label>
            </div>

            <div v-if="studentForm.create_account" class="space-y-3 pl-3 sm:pl-4 border-l-2 border-primary-200 dark:border-primary-800">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('email') }} *</label>
                <input v-model="studentForm.email" type="email" required class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ languageStore.t('password') }} *</label>
                <input v-model="studentForm.password" type="password" required class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
                <p class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
              </div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-2.5 sm:p-3 rounded-lg">
              <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">{{ languageStore.t('approveStudentNote') }}</p>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button type="button" @click="closeStudentModal" class="btn-secondary w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 order-2 sm:order-1">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 order-1 sm:order-2">{{ isSubmitting ? languageStore.t('processing') : languageStore.t('approveAndRegister') }}</button>
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
const newLeadsCount = ref(0)

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

  const { data: parents } = await supabase
    .from('parents')
    .select('*')
    .eq('status', 'pending')
    .eq('school_id', schoolId)
  pendingParents.value = parents || []

  const { data: students } = await supabase
    .from('students')
    .select(`
      *,
      parent:parents(full_name, phone, email)
    `)
    .eq('status', 'pending')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
  pendingStudents.value = students || []

  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'active')
  stats.value.totalStudents = studentCount || 0

  const { count: paymentCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'pending')
  stats.value.pendingPayments = paymentCount || 0

  const { count: leadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('status', 'new')
  newLeadsCount.value = leadCount || 0
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
    const { error: parentError } = await supabase
      .from('parents')
      .update({ 
        school_id: schoolId,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedParent.value.id)
    if (parentError) throw parentError

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
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'leads', filter: `school_id=eq.${schoolId}` },
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
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
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

/* Dark mode overrides for buttons */
.dark .btn-secondary {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
.dark .btn-secondary:hover {
  background-color: #4b5563;
}

/* Mobile-specific improvements */
@media (max-width: 480px) {
  .card {
    padding: 0.75rem;
  }
  .btn-primary, .btn-secondary {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* Modal button order on mobile */
@media (max-width: 640px) {
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
}
</style>