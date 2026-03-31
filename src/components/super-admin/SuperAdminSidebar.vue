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
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()

const menuItems = [
  { path: '/super-admin', label: 'dashboard', icon: 'DashboardIcon' },
  { path: '/super-admin/schools', label: 'schools', icon: 'SchoolsIcon' },
  { path: '/super-admin/users', label: 'userManagement', icon: 'UsersIcon' },
  { path: '/super-admin/analytics', label: 'analytics', icon: 'AnalyticsIcon' }
]

// Icons (simplified)
const DashboardIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const SchoolsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /></svg>' }
const UsersIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' }
const AnalyticsIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    document.querySelector('.sidebar')?.classList.remove('open')
  }
}
</script>