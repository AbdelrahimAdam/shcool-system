import { ref } from 'vue'

export function useTable(fetchFunction, options = {}) {
  const data = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = options.pageSize || 20
  const filters = ref({})

  const load = async () => {
    loading.value = true
    const result = await fetchFunction(currentPage.value, filters.value)
    data.value = result.data || []
    total.value = result.count || 0
    loading.value = false
  }

  const changePage = (page) => {
    currentPage.value = page
    load()
  }

  const applyFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
    load()
  }

  const resetFilters = () => {
    filters.value = {}
    currentPage.value = 1
    load()
  }

  return {
    data,
    total,
    loading,
    currentPage,
    pageSize,
    filters,
    load,
    changePage,
    applyFilters,
    resetFilters
  }
}