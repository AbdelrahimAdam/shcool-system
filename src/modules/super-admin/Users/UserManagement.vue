<template>
  <div class="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageStore.t('userManagement') }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ languageStore.t('totalUsers') }}: {{ total }}
        </p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addUser') }}
      </button>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="relative flex-1 max-w-sm">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="languageStore.t('searchUsers')"
            class="form-input w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select v-model="roleFilter" class="form-select w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" @change="applyFilters">
          <option value="">{{ languageStore.t('allRoles') }}</option>
          <option value="super_admin">{{ languageStore.t('superAdmin') }}</option>
          <option value="admin">{{ languageStore.t('admin') }}</option>
          <option value="teacher">{{ languageStore.t('teacher') }}</option>
          <option value="accountant">{{ languageStore.t('accountant') }}</option>
          <option value="parent">{{ languageStore.t('parent') }}</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('fullName') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('email') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('role') }}</th>
              <th class="hidden lg:table-cell px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('school') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-left dark:text-gray-300">{{ languageStore.t('status') }}</th>
              <th class="px-3 py-2.5 sm:px-4 text-center dark:text-gray-300">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-3 py-2 sm:px-4 font-medium text-gray-900 dark:text-white">{{ user.full_name }}</td>
              <td class="px-3 py-2 sm:px-4 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
              <td class="px-3 py-2 sm:px-4">
                <span :class="getRoleBadgeClass(user.role)">
                  {{ languageStore.t(user.role) }}
                </span>
              </td>
              <td class="hidden lg:table-cell px-3 py-2 sm:px-4 text-gray-600 dark:text-gray-300">{{ user.schools?.name || '-' }}</td>
              <td class="px-3 py-2 sm:px-4">
                <span :class="user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-medium">
                  {{ user.is_active ? languageStore.t('active') : languageStore.t('inactive') }}
                </span>
              </td>
              <td class="px-3 py-2 sm:px-4 text-center">
                <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                  <button @click="editUser(user)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm font-medium">
                    {{ languageStore.t('edit') }}
                  </button>
                  <button @click="toggleStatus(user)" class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 text-xs sm:text-sm font-medium">
                    {{ user.is_active ? languageStore.t('deactivate') : languageStore.t('activate') }}
                  </button>
                  <button @click="deleteUser(user)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs sm:text-sm font-medium">
                    {{ languageStore.t('delete') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500 dark:text-gray-400">
                {{ languageStore.t('noUsersFound') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          v-if="total > pageSize"
          :current-page="currentPage"
          :total-pages="Math.ceil(total / pageSize)"
          :total="total"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <!-- Mobile Search & Filter -->
      <div class="flex flex-col gap-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="languageStore.t('searchUsers')"
            class="form-input w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select v-model="roleFilter" class="form-select w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white" @change="applyFilters">
          <option value="">{{ languageStore.t('allRoles') }}</option>
          <option value="super_admin">{{ languageStore.t('superAdmin') }}</option>
          <option value="admin">{{ languageStore.t('admin') }}</option>
          <option value="teacher">{{ languageStore.t('teacher') }}</option>
          <option value="accountant">{{ languageStore.t('accountant') }}</option>
          <option value="parent">{{ languageStore.t('parent') }}</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && users.length === 0" class="flex justify-center py-8">
        <div class="spinner dark:border-gray-600 dark:border-t-blue-400"></div>
      </div>

      <!-- User Cards -->
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
      >
        <!-- User Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ user.full_name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user.email }}
            </p>
          </div>
          <span :class="getRoleBadgeClass(user.role)" class="flex-shrink-0 ml-2">
            {{ languageStore.t(user.role) }}
          </span>
        </div>

        <!-- User Details -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('school') }}:</span>
            <span class="font-medium text-gray-700 dark:text-gray-300 ml-1">
              {{ user.schools?.name || '-' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ languageStore.t('status') }}:</span>
            <span :class="user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-medium ml-1">
              {{ user.is_active ? languageStore.t('active') : languageStore.t('inactive') }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="editUser(user)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ languageStore.t('edit') }}
          </button>
          <button 
            @click="toggleStatus(user)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
          >
            {{ user.is_active ? languageStore.t('deactivate') : languageStore.t('activate') }}
          </button>
          <button 
            @click="deleteUser(user)"
            class="flex-1 min-w-[40px] text-center px-2 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            {{ languageStore.t('delete') }}
          </button>
        </div>
      </div>

      <!-- Pagination (mobile) -->
      <div v-if="total > pageSize" class="flex justify-between items-center mt-4">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('previous') }}
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ currentPage }} / {{ Math.ceil(total / pageSize) }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage >= Math.ceil(total / pageSize)"
          class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          {{ languageStore.t('next') }}
        </button>
      </div>
    </div>

    <!-- Create/Edit User Modal (Mobile Optimized) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingUser ? languageStore.t('editUser') : languageStore.t('addUser') }}
          </h2>
        </div>

        <form @submit.prevent="saveUser" class="p-4 sm:p-6">
          <!-- Warning for super admin creation -->
          <div v-if="userForm.role === 'super_admin'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-xs sm:text-sm text-red-700 dark:text-red-300">
            ⚠️ {{ languageStore.t('superAdminWarning') }}
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('fullName') }} *</label>
              <input 
                v-model="userForm.full_name" 
                type="text" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterFullName')"
              />
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('email') }} *</label>
              <input 
                v-model="userForm.email" 
                type="email" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterEmail')"
              />
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('phone') }}</label>
              <input 
                v-model="userForm.phone" 
                type="tel" 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterPhone')"
              />
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('role') }} *</label>
              <select 
                v-model="userForm.role" 
                required 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="super_admin">{{ languageStore.t('superAdmin') }}</option>
                <option value="admin">{{ languageStore.t('admin') }}</option>
                <option value="teacher">{{ languageStore.t('teacher') }}</option>
                <option value="accountant">{{ languageStore.t('accountant') }}</option>
                <option value="parent">{{ languageStore.t('parent') }}</option>
              </select>
            </div>
            <div>
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('school') }}</label>
              <select 
                v-model="userForm.school_id" 
                class="form-select w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :disabled="userForm.role === 'super_admin'"
              >
                <option :value="null">{{ languageStore.t('selectSchool') }}</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
              <p v-if="userForm.role === 'super_admin'" class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ languageStore.t('superAdminNoSchool') }}
              </p>
            </div>
            <div v-if="!editingUser">
              <label class="form-label text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ languageStore.t('password') }} *</label>
              <input 
                v-model="userForm.password" 
                type="password" 
                required 
                class="form-input w-full mt-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                :placeholder="languageStore.t('enterPassword')"
              />
              <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{{ languageStore.t('passwordRequirements') }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="closeModal" class="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center">
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? languageStore.t('saving') : languageStore.t('saveUser') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useLanguageStore } from '@/stores/language'
import Pagination from '@/components/common/Pagination.vue'

const languageStore = useLanguageStore()
const users = ref([])
const schools = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20
const searchQuery = ref('')
const roleFilter = ref('')
const showCreateModal = ref(false)
const editingUser = ref(null)
const isSubmitting = ref(false)
const isLoading = ref(false)
let searchTimeout = null

const userForm = ref({
  full_name: '',
  email: '',
  phone: '',
  role: 'teacher',
  school_id: null,
  password: ''
})

const totalPages = computed(() => Math.ceil(total.value / pageSize))

watch(() => userForm.value.role, (newRole) => {
  if (newRole === 'super_admin') {
    userForm.value.school_id = null
  }
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    let query = supabase
      .from('users')
      .select('*, schools(name)', { count: 'exact' })
      .range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1)
      .order('created_at', { ascending: false })

    if (searchQuery.value) {
      query = query.or(`full_name.ilike.%${searchQuery.value}%,email.ilike.%${searchQuery.value}%`)
    }
    if (roleFilter.value) {
      query = query.eq('role', roleFilter.value)
    }

    const { data, error, count } = await query
    if (!error) {
      users.value = data || []
      total.value = count || 0
    } else {
      console.error('Error fetching users:', error)
    }
  } catch (error) {
    console.error('Error in fetchUsers:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchSchools = async () => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('id, name')
      .eq('status', 'active')
    if (!error) {
      schools.value = data || []
    }
  } catch (error) {
    console.error('Error fetching schools:', error)
  }
}

const saveUser = async () => {
  isSubmitting.value = true
  
  try {
    if (editingUser.value) {
      // Update existing user
      const updateData = {
        full_name: userForm.value.full_name,
        phone: userForm.value.phone || null,
        role: userForm.value.role,
        school_id: userForm.value.role === 'super_admin' ? null : userForm.value.school_id,
        updated_at: new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', editingUser.value.id)
      
      if (error) throw error
      
      // Update auth user metadata if role changed
      if (editingUser.value.role !== userForm.value.role) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { role: userForm.value.role }
        })
        if (authError) console.warn('Failed to update auth metadata:', authError)
      }
    } else {
      // Create new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userForm.value.email,
        password: userForm.value.password,
        options: {
          data: {
            full_name: userForm.value.full_name,
            role: userForm.value.role,
            phone: userForm.value.phone || null,
            school_id: userForm.value.role === 'super_admin' ? null : userForm.value.school_id
          }
        }
      })
      
      if (authError) throw authError
      
      // Update the public users table with the correct data
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: userForm.value.role,
          school_id: userForm.value.role === 'super_admin' ? null : userForm.value.school_id,
          is_active: true,
          phone: userForm.value.phone || null
        })
        .eq('id', authData.user.id)
      
      if (updateError) throw updateError
    }
    
    closeModal()
    await fetchUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    alert(error.message || languageStore.t('errorOccurred'))
  } finally {
    isSubmitting.value = false
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'teacher',
    school_id: user.school_id || null,
    password: ''
  }
  showCreateModal.value = true
}

const toggleStatus = async (user) => {
  try {
    const newStatus = !user.is_active
    const { error } = await supabase
      .from('users')
      .update({ 
        is_active: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    if (error) throw error
    
    await fetchUsers()
  } catch (error) {
    console.error('Error toggling user status:', error)
    alert(error.message || languageStore.t('errorOccurred'))
  }
}

const deleteUser = async (user) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    try {
      // Check for related records based on role
      if (user.role === 'teacher') {
        const { data: teacherData, error: teacherFetchError } = await supabase
          .from('teachers')
          .select('id')
          .eq('user_id', user.id)
        
        if (teacherFetchError) throw teacherFetchError
        
        if (teacherData && teacherData.length > 0) {
          const { error: teacherDeleteError } = await supabase
            .from('teachers')
            .delete()
            .eq('user_id', user.id)
          
          if (teacherDeleteError) throw teacherDeleteError
        }
      } else if (user.role === 'parent') {
        const { data: parentData, error: parentFetchError } = await supabase
          .from('parents')
          .select('id')
          .eq('user_id', user.id)
        
        if (parentFetchError) throw parentFetchError
        
        if (parentData && parentData.length > 0) {
          const { error: parentDeleteError } = await supabase
            .from('parents')
            .delete()
            .eq('user_id', user.id)
          
          if (parentDeleteError) throw parentDeleteError
        }
      } else if (user.role === 'student') {
        const { data: studentData, error: studentFetchError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
        
        if (studentFetchError) throw studentFetchError
        
        if (studentData && studentData.length > 0) {
          const { error: studentDeleteError } = await supabase
            .from('students')
            .delete()
            .eq('user_id', user.id)
          
          if (studentDeleteError) throw studentDeleteError
        }
      }
      
      // Then delete the user from public.users
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)
      
      if (error) throw error
      
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(error.message || languageStore.t('errorOccurred'))
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  userForm.value = {
    full_name: '',
    email: '',
    phone: '',
    role: 'teacher',
    school_id: null,
    password: ''
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 500)
}

const applyFilters = () => {
  currentPage.value = 1
  fetchUsers()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const getRoleBadgeClass = (role) => {
  const classes = {
    super_admin: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    teacher: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    accountant: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
    parent: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
  }
  return classes[role] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
}

onMounted(() => {
  fetchUsers()
  fetchSchools()
})
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #4b5563;
    border-top-color: #60a5fa;
  }
}

.card {
  transition: box-shadow 0.2s ease;
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

.form-input, .form-select {
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
.dark .form-select {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-input:focus, .form-select:focus {
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