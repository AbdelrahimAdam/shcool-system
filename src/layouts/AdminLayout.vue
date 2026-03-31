<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 h-16">
      <div class="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <!-- Left section -->
        <div class="flex items-center gap-3">
          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu" 
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-lg font-semibold text-gray-800 hidden sm:inline">{{ schoolName }}</span>
          </div>
        </div>
        
        <!-- Right section - AppHeader -->
        <AppHeader />
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="closeMobileMenu"
    ></div>
    
    <!-- Sidebar - Desktop: static, Mobile: overlay -->
    <aside 
      class="fixed top-16 left-0 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto"
      :class="[
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        'h-[calc(100vh-4rem)]'
      ]"
    >
      <!-- Navigation -->
      <nav class="py-4 pb-32">
        <div class="px-3 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute(item.path)
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
            ]"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 mr-3 flex-shrink-0 transition-colors"
              :class="isActiveRoute(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'"
            />
            <span class="flex-1">{{ languageStore.t(item.label) }}</span>
            <span 
              v-if="item.badge" 
              class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </div>
      </nav>
      
      <!-- Sidebar Footer (User Info) - Fixed at bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span class="text-sm font-medium text-yellow-400">{{ userInitials }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-200 truncate">{{ userFullName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userRole }}</p>
          </div>
          <button 
            @click="handleLogout" 
            class="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            title="Logout"
          >
            <svg class="w-4 h-4 text-gray-400 hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="lg:pl-64 pt-16">
      <div class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import AppHeader from '@/components/common/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const mobileMenuOpen = ref(false)

// Computed properties
const schoolName = computed(() => authStore.school?.name || 'School Management')
const userFullName = computed(() => authStore.profile?.full_name || 'User')
const userRole = computed(() => {
  const roleMap = {
    super_admin: 'Super Admin',
    admin: 'School Admin',
    teacher: 'Teacher',
    accountant: 'Accountant',
    parent: 'Parent',
    student: 'Student'
  }
  return roleMap[authStore.role] || authStore.role
})

const userInitials = computed(() => {
  if (!userFullName.value) return 'U'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

// Menu items
const menuItems = computed(() => {
  const items = [
    { path: '/admin', label: 'dashboard', icon: 'DashboardIcon' },
    { path: '/admin/students', label: 'students', icon: 'StudentsIcon' },
    { path: '/admin/teachers', label: 'teachers', icon: 'TeachersIcon' },
    { path: '/admin/classes', label: 'classes', icon: 'ClassesIcon' },
    { path: '/admin/attendance', label: 'attendance', icon: 'AttendanceIcon' },
    { path: '/admin/payments', label: 'payments', icon: 'PaymentsIcon' },
    { path: '/admin/crm', label: 'crm', icon: 'CRMIcon' },
    { path: '/admin/reports', label: 'reports', icon: 'ReportsIcon' }
  ]
  return items
})

// Check if route is active
const isActiveRoute = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Handle window resize - close mobile menu on desktop
const handleResize = () => {
  if (window.innerWidth >= 1024 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Icons
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
/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Fade animation for route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: #1f2937;
}

aside::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>