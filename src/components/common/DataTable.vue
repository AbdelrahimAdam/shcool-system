<template>
  <div class="data-table-container dark:bg-gray-800 rounded-lg overflow-hidden">
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <!-- Search and Filters - responsive grid -->
      <div class="p-4 flex flex-col sm:flex-row flex-wrap gap-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('search') || 'Search...'"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            @input="debouncedSearch"
          />
        </div>
        
        <div class="flex flex-wrap gap-3">
          <select
            v-for="filter in filterOptions"
            :key="filter.key"
            v-model="localFilters[filter.key]"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            @change="applyFilters"
          >
            <option value="">{{ $t('all') || 'All' }} {{ filter.label }}</option>
            <option v-for="option in filter.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Table - horizontal scroll on mobile -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th v-for="column in columns" :key="column.key" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ column.label }}
              </th>
              <th v-if="actions.length" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('actions') || 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr v-for="row in data" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td v-for="column in columns" :key="column.key" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap">
                <!-- Use slot for custom column rendering (e.g., status badges) -->
                <slot :name="`column-${column.key}`" :row="row">
                  <span v-if="column.type === 'status'" :class="getStatusClass(row[column.key])">
                    {{ formatValue(row[column.key], column.type) }}
                  </span>
                  <span v-else>
                    {{ formatValue(row[column.key], column.type) }}
                  </span>
                </slot>
              </td>
              <td v-if="actions.length" class="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <slot name="actions" :row="row">
                  <button
                    v-if="actions.includes('edit')"
                    @click="$emit('edit', row)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3"
                  >
                    {{ $t('edit') || 'Edit' }}
                  </button>
                  <button
                    v-if="actions.includes('delete')"
                    @click="$emit('delete', row)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    {{ $t('delete') || 'Delete' }}
                  </button>
                </slot>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td :colspan="columns.length + (actions.length ? 1 : 0)" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {{ $t('noData') || 'No data available' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Pagination
          v-if="total > pageSize"
          :current-page="currentPage"
          :total-pages="Math.ceil(total / pageSize)"
          @page-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
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
// Initialize localFilters object from filterOptions keys
const localFilters = ref({})
props.filterOptions.forEach(filter => {
  localFilters.value[filter.key] = ''
})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 500)
}

const applyFilters = () => {
  // Only send filters that have a value (not empty string)
  const activeFilters = {}
  Object.keys(localFilters.value).forEach(key => {
    if (localFilters.value[key]) {
      activeFilters[key] = localFilters.value[key]
    }
  })
  emit('filter', activeFilters)
}

const changePage = (page) => {
  currentPage.value = page
  emit('page-change', page)
}

const formatValue = (value, type) => {
  if (value === null || value === undefined) return '-'
  
  switch(type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'currency':
      return `$${Number(value).toLocaleString()}`
    case 'status':
      // Return the raw value; the styling is applied via getStatusClass
      return value
    default:
      return String(value)
  }
}

const getStatusClass = (status) => {
  // Dark mode compatible status badges
  const map = {
    new: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs font-medium',
    contacted: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium',
    enrolled: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium',
    lost: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium',
    active: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium',
    pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium',
    approved: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium',
    rejected: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium',
    graduated: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs font-medium',
    transferred: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full text-xs font-medium'
  }
  return map[status] || 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium'
}

// Reset page to 1 when filters or search changes
watch([searchQuery, localFilters], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    emit('page-change', 1)
  }
}, { deep: true })
</script>

<style scoped>
/* Optional: any custom styles - most styling is now handled by Tailwind classes */
.data-table-container {
  @apply w-full;
}
</style>