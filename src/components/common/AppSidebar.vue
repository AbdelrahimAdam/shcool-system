<template>
  <aside class="sidebar fixed top-16 left-0 w-64 h-full bg-white shadow-lg transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto">
    <nav class="p-4">
      <div class="space-y-1">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-600': $route.path === item.path }"
          @click="closeSidebarOnMobile"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="ml-3">{{ languageStore.t(item.label) }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useLanguageStore } from '../../stores/language'

const authStore = useAuthStore()
const languageStore = useLanguageStore()

const menuItems = computed(() => {
  const baseItems = [
    { path: '/admin', label: 'dashboard', icon: 'DashboardIcon' },
    { path: '/admin/students', label: 'students', icon: 'StudentsIcon' },
    { path: '/admin/teachers', label: 'teachers', icon: 'TeachersIcon' },
    { path: '/admin/classes', label: 'classes', icon: 'ClassesIcon' },
    { path: '/admin/attendance', label: 'attendance', icon: 'AttendanceIcon' }
  ]
  
  if (authStore.isAdmin || authStore.isAccountant) {
    baseItems.push({ path: '/admin/payments', label: 'payments', icon: 'PaymentsIcon' })
  }
  
  if (authStore.isAdmin) {
    baseItems.push({ path: '/admin/crm', label: 'crm', icon: 'CRMIcon' })
    baseItems.push({ path: '/admin/reports', label: 'reports', icon: 'ReportsIcon' })
  }
  
  return baseItems
})

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    const sidebar = document.querySelector('.sidebar')
    if (sidebar) {
      sidebar.classList.remove('open')
    }
  }
}

// Icons as components
const DashboardIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const StudentsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' }
const TeachersIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>' }
const ClassesIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /></svg>' }
const AttendanceIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const PaymentsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const CRMIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' }
const ReportsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }
</script>

<style scoped>
.sidebar.open {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>