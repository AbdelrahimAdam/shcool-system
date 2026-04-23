<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6">
    <div class="card bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
      <h1 class="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('students') }}
      </h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Basic Information -->
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('fullName') }} *</label>
            <input v-model="form.full_name" type="text" required class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('arabicName') }}</label>
            <input v-model="form.arabic_name" type="text" class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" dir="rtl" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('dateOfBirth') }} *</label>
              <input v-model="form.date_of_birth" type="date" required class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            
            <div>
              <label class="form-label dark:text-gray-300">{{ languageStore.t('gender') }} *</label>
              <select v-model="form.gender" required class="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="male">{{ languageStore.t('male') }}</option>
                <option value="female">{{ languageStore.t('female') }}</option>
              </select>
            </div>
          </div>
          
          <!-- Class with autocomplete search -->
          <div class="relative">
            <label class="form-label dark:text-gray-300">{{ languageStore.t('class') }} *</label>
            <input
              type="text"
              v-model="classSearchQuery"
              @input="filterClasses"
              @focus="showClassDropdown = true"
              @blur="closeClassDropdown"
              :placeholder="languageStore.t('searchClassByName')"
              class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <!-- Dropdown for classes -->
            <div v-if="showClassDropdown && filteredClassesList.length" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div
                v-for="cls in filteredClassesList"
                :key="cls.id"
                @click="selectClass(cls)"
                class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                {{ cls.name }}
              </div>
            </div>
            <!-- Hidden select to store selected class name display -->
            <input type="hidden" v-model="form.class_id" />
            <div v-if="selectedClassName" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ languageStore.t('selected') }}: {{ selectedClassName }}
            </div>
          </div>
          
          <!-- Parent with autocomplete search -->
          <div class="relative">
            <label class="form-label dark:text-gray-300">{{ languageStore.t('parent') }}</label>
            <input
              type="text"
              v-model="parentSearchQuery"
              @input="filterParents"
              @focus="showParentDropdown = true"
              @blur="closeParentDropdown"
              :placeholder="languageStore.t('searchParentByNameOrPhone')"
              class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <!-- Dropdown for parents -->
            <div v-if="showParentDropdown && filteredParentsList.length" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div
                v-for="parent in filteredParentsList"
                :key="parent.id"
                @click="selectParent(parent)"
                class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                {{ parent.full_name }} <span class="text-xs text-gray-500 dark:text-gray-400">({{ parent.phone || parent.email }})</span>
              </div>
            </div>
            <div v-if="selectedParentName" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ languageStore.t('selected') }}: {{ selectedParentName }}
            </div>
          </div>
          
          <!-- Contact Information -->
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('phone') }}</label>
            <input v-model="form.phone" type="tel" class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="3" class="form-textarea dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>
          
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('medicalInfo') }}</label>
            <textarea v-model="form.medical_info" rows="2" class="form-textarea dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>
          
          <div>
            <label class="form-label dark:text-gray-300">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="active">{{ languageStore.t('active') }}</option>
              <option value="graduated">{{ languageStore.t('graduated') }}</option>
              <option value="transferred">{{ languageStore.t('transferred') }}</option>
              <option value="suspended">{{ languageStore.t('suspended') }}</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="$router.back()" class="btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              {{ languageStore.t('cancel') }}
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50">
              {{ isLoading ? languageStore.t('loading') : languageStore.t('save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'

const router = useRouter()
const route = useRoute()
const studentStore = useStudentStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)
const classes = ref([])
const parents = ref([])

// Autocomplete state for class
const classSearchQuery = ref('')
const showClassDropdown = ref(false)
const filteredClassesList = ref([])
const selectedClassName = ref('')

// Autocomplete state for parent
const parentSearchQuery = ref('')
const showParentDropdown = ref(false)
const filteredParentsList = ref([])
const selectedParentName = ref('')

const form = ref({
  full_name: '',
  arabic_name: '',
  date_of_birth: '',
  gender: 'male',
  class_id: null,
  parent_id: null,
  phone: '',
  address: '',
  medical_info: '',
  status: 'active'
})

// Filter classes based on query
const filterClasses = () => {
  const query = classSearchQuery.value.toLowerCase()
  if (!query) {
    filteredClassesList.value = classes.value
  } else {
    filteredClassesList.value = classes.value.filter(cls => 
      cls.name.toLowerCase().includes(query)
    )
  }
}

// Select class
const selectClass = (cls) => {
  form.value.class_id = cls.id
  selectedClassName.value = cls.name
  classSearchQuery.value = cls.name
  showClassDropdown.value = false
}

// Close class dropdown with delay to allow click
let classTimeout
const closeClassDropdown = () => {
  classTimeout = setTimeout(() => {
    showClassDropdown.value = false
  }, 200)
}
// Filter parents
const filterParents = () => {
  const query = parentSearchQuery.value.toLowerCase()
  if (!query) {
    filteredParentsList.value = parents.value
  } else {
    filteredParentsList.value = parents.value.filter(parent => 
      parent.full_name.toLowerCase().includes(query) ||
      (parent.phone && parent.phone.includes(query))
    )
  }
}

// Select parent
const selectParent = (parent) => {
  form.value.parent_id = parent.id
  selectedParentName.value = `${parent.full_name} (${parent.phone || parent.email})`
  parentSearchQuery.value = selectedParentName.value
  showParentDropdown.value = false
}

const closeParentDropdown = () => {
  setTimeout(() => {
    showParentDropdown.value = false
  }, 200)
}

const loadClasses = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  const { data, error } = await supabase
    .from('classes')
    .select('id, name')
    .eq('school_id', schoolId)
    .order('name')
  if (!error) {
    classes.value = data || []
    filteredClassesList.value = classes.value
  }
}

const loadParents = async () => {
  const schoolId = authStore.profile?.school_id
  if (!schoolId) return
  const { data, error } = await supabase
    .from('parents')
    .select('id, full_name, phone, email')
    .eq('school_id', schoolId)
    .order('full_name')
  if (!error) {
    parents.value = data || []
    filteredParentsList.value = parents.value
  }
}

const loadStudent = async () => {
  if (isEdit.value) {
    const student = await studentStore.getStudentById(route.params.id)
    if (student) {
      form.value = {
        full_name: student.full_name || '',
        arabic_name: student.arabic_name || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || 'male',
        class_id: student.class_id || null,
        parent_id: student.parent_id || null,
        phone: student.phone || '',
        address: student.address || '',
        medical_info: student.medical_info || '',
        status: student.status || 'active'
      }
      // Set class name for display
      if (form.value.class_id) {
        const cls = classes.value.find(c => c.id === form.value.class_id)
        if (cls) {
          selectedClassName.value = cls.name
          classSearchQuery.value = cls.name
        }
      }
      // Set parent name for display
      if (form.value.parent_id) {
        const parent = parents.value.find(p => p.id === form.value.parent_id)
        if (parent) {
          selectedParentName.value = `${parent.full_name} (${parent.phone || parent.email})`
          parentSearchQuery.value = selectedParentName.value
        }
      }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  
  const createdBy = authStore.user?.id
  if (!createdBy) {
    alert(languageStore.t('loginRequired'))
    isLoading.value = false
    return
  }
  
  // Generate student number
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const studentNumber = `STU-${year}-${randomNum}`
  
  const studentData = {
    school_id: authStore.profile?.school_id,
    student_number: studentNumber,
    full_name: form.value.full_name,
    arabic_name: form.value.arabic_name,
    date_of_birth: form.value.date_of_birth,
    gender: form.value.gender,
    class_id: form.value.class_id,
    parent_id: form.value.parent_id,
    phone: form.value.phone,
    address: form.value.address,
    medical_info: form.value.medical_info,
    status: form.value.status,
    created_by: createdBy
  }
  
  let result
  if (isEdit.value) {
    result = await studentStore.updateStudent(route.params.id, studentData)
  } else {
    result = await studentStore.createStudent(studentData)
  }
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/admin/students')
  } else {
    alert(result.error || languageStore.t('errorOccurred'))
  }
}

onMounted(() => {
  Promise.all([loadClasses(), loadParents()]).then(() => {
    loadStudent()
  })
})
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
</style>