<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">{{ languageStore.t('userManagement') }}</h1>
      <button @click="showCreateModal = true" class="btn-primary inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ languageStore.t('addUser') }}
      </button>
    </div>

    <div class="card p-6">
      <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="languageStore.t('searchUsers')"
          class="input-field max-w-sm"
          @input="debouncedSearch"
        />
        <select v-model="roleFilter" class="input-field w-40" @change="applyFilters">
          <option value="">{{ languageStore.t('allRoles') }}</option>
          <option value="admin">{{ languageStore.t('admin') }}</option>
          <option value="teacher">{{ languageStore.t('teacher') }}</option>
          <option value="accountant">{{ languageStore.t('accountant') }}</option>
          <option value="parent">{{ languageStore.t('parent') }}</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">{{ languageStore.t('fullName') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('email') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('role') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('school') }}</th>
              <th class="px-4 py-2 text-left">{{ languageStore.t('status') }}</th>
              <th class="px-4 py-2 text-center">{{ languageStore.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t">
              <td class="px-4 py-2">{{ user.full_name }}</td>
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">
                <span :class="getRoleBadgeClass(user.role)">
                  {{ languageStore.t(user.role) }}
                </span>
              </td>
              <td class="px-4 py-2">{{ user.schools?.name || '-' }}</td>
              <td class="px-4 py-2">
                <span :class="user.is_active ? 'text-green-600' : 'text-red-600'">
                  {{ user.is_active ? languageStore.t('active') : languageStore.t('inactive') }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <button @click="editUser(user)" class="text-primary-600 hover:text-primary-800 mr-2">
                  {{ languageStore.t('edit') }}
                </button>
                <button @click="toggleStatus(user)" class="text-yellow-600 hover:text-yellow-800 mr-2">
                  {{ user.is_active ? languageStore.t('deactivate') : languageStore.t('activate') }}
                </button>
                <button @click="deleteUser(user)" class="text-red-600 hover:text-red-800">
                  {{ languageStore.t('delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        v-if="total > pageSize"
        :current-page="currentPage"
        :total-pages="Math.ceil(total / pageSize)"
        @page-change="handlePageChange"
        class="mt-4"
      />
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingUser ? languageStore.t('editUser') : languageStore.t('addUser') }}</h2>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="label">{{ languageStore.t('fullName') }} *</label>
              <input v-model="userForm.full_name" type="text" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('email') }} *</label>
              <input v-model="userForm.email" type="email" required class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('phone') }}</label>
              <input v-model="userForm.phone" type="tel" class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('role') }} *</label>
              <select v-model="userForm.role" required class="input-field">
                <option value="admin">{{ languageStore.t('admin') }}</option>
                <option value="teacher">{{ languageStore.t('teacher') }}</option>
                <option value="accountant">{{ languageStore.t('accountant') }}</option>
                <option value="parent">{{ languageStore.t('parent') }}</option>
              </select>
            </div>
            <div>
              <label class="label">{{ languageStore.t('school') }}</label>
              <select v-model="userForm.school_id" class="input-field">
                <option :value="null">{{ languageStore.t('selectSchool') }}</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
            </div>
            <div v-if="!editingUser">
              <label class="label">{{ languageStore.t('password') }} *</label>
              <input v-model="userForm.password" type="password" required class="input-field" />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isSubmitting" class="btn-primary">
              {{ isSubmitting ? languageStore.t('saving') : languageStore.t('save') }}
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
let searchTimeout = null

const userForm = ref({
  full_name: '',
  email: '',
  phone: '',
  role: 'teacher',
  school_id: null,
  password: ''
})

const fetchUsers = async () => {
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
  }
}

const fetchSchools = async () => {
  const { data } = await supabase
    .from('schools')
    .select('id, name')
    .eq('status', 'active')
  schools.value = data || []
}

const saveUser = async () => {
  isSubmitting.value = true
  
  try {
    if (editingUser.value) {
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          full_name: userForm.value.full_name,
          phone: userForm.value.phone,
          role: userForm.value.role,
          school_id: userForm.value.school_id
        })
        .eq('id', editingUser.value.id)
      
      if (error) throw error
    } else {
      // Create new user
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userForm.value.email,
        password: userForm.value.password,
        options: {
          data: {
            full_name: userForm.value.full_name,
            role: userForm.value.role,
            phone: userForm.value.phone
          }
        }
      })
      
      if (authError) throw authError
      
      // Then update the public users table with the correct role and school
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: userForm.value.role,
          school_id: userForm.value.school_id,
          is_active: true
        })
        .eq('id', authData.user.id)
      
      if (updateError) throw updateError
    }
    
    closeModal()
    await fetchUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    school_id: user.school_id,
    password: ''
  }
  showCreateModal.value = true
}

const toggleStatus = async (user) => {
  const { error } = await supabase
    .from('users')
    .update({ is_active: !user.is_active })
    .eq('id', user.id)
  
  if (!error) {
    await fetchUsers()
  }
}

const deleteUser = async (user) => {
  if (confirm(languageStore.t('confirmDelete'))) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)
    
    if (!error) {
      await fetchUsers()
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
    admin: 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs',
    teacher: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs',
    accountant: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    parent: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    super_admin: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
}

onMounted(() => {
  fetchUsers()
  fetchSchools()
})
</script>