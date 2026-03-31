<template>
  <div class="data-table-container">
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <!-- Search and Filters -->
      <div class="mb-4 flex flex-wrap gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          @input="debouncedSearch"
        />
        
        <select
          v-model="filters"
          v-for="filter in filterOptions"
          :key="filter.key"
          class="px-4 py-2 border rounded-lg"
          @change="applyFilters"
        >
          <option value="">All {{ filter.label }}</option>
          <option v-for="option in filter.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th v-for="column in columns" :key="column.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ column.label }}
              </th>
              <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="row in data" :key="row.id" class="hover:bg-gray-50">
              <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <slot :name="`column-${column.key}`" :row="row">
                  {{ formatValue(row[column.key], column.type) }}
                </slot>
              </td>
              <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :row="row">
                  <button
                    v-if="actions.includes('edit')"
                    @click="$emit('edit', row)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    v-if="actions.includes('delete')"
                    @click="$emit('delete', row)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <Pagination
        v-if="total > pageSize"
        :current-page="currentPage"
        :total-pages="Math.ceil(total / pageSize)"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  actions: {
    type: Array,
    default: () => ['edit', 'delete']
  },
  filterOptions: {
    type: Array,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['edit', 'delete', 'search', 'filter', 'page-change'])

const searchQuery = ref('')
const currentPage = ref(1)
const filters = ref({})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 500)
}

const applyFilters = () => {
  emit('filter', filters.value)
}

const changePage = (page) => {
  currentPage.value = page
  emit('page-change', page)
}

const formatValue = (value, type) => {
  if (!value) return '-'
  
  switch(type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'currency':
      return `$${value.toLocaleString()}`
    case 'status':
      const statusColors = {
        active: 'text-green-600',
        pending: 'text-yellow-600',
        approved: 'text-green-600',
        rejected: 'text-red-600'
      }
      return `<span class="${statusColors[value]}">${value}</span>`
    default:
      return value
  }
}
</script>