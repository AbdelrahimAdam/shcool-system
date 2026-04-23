<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Header with toggle event listener -->
    <AppHeader @toggle-sidebar="toggleMobileMenu" />

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
        @click="closeMobileMenu"
      ></div>
    </transition>
    
    <!-- Sidebar (dark theme remains) -->
    <aside 
      class="fixed top-16 left-0 w-72 bg-gray-900 dark:bg-gray-950 shadow-2xl border-r border-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      style="height: calc(100vh - 4rem);"
    >
      <!-- Navigation (class adjustments for dark mode) -->
      <nav class="py-6 pb-32">
        <div class="px-4 space-y-1.5">
          <router-link
            to="/admin"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="flex-1">{{ languageStore.t('dashboard') }}</span>
          </router-link>

          <!-- Students Link -->
          <router-link
            to="/admin/students"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/students')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/students') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('students') }}</span>
          </router-link>

          <!-- Teachers Link -->
          <router-link
            to="/admin/teachers"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/teachers')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/teachers') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('teachers') }}</span>
          </router-link>

          <!-- Classes Link -->
          <router-link
            to="/admin/classes"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/classes')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/classes') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('classes') }}</span>
          </router-link>

          <!-- Attendance Link -->
          <router-link
            to="/admin/attendance"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/attendance')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/attendance') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('attendance') }}</span>
          </router-link>

          <!-- Payments Link -->
          <router-link
            to="/admin/payments"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/payments')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/payments') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('payments') }}</span>
          </router-link>

          <!-- CRM Link -->
          <router-link
            to="/admin/crm"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/crm')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/crm') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('crm') }}</span>
          </router-link>

          <!-- Reports Link -->
          <router-link
            to="/admin/reports"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/reports')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/reports') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('reports') }}</span>
          </router-link>

          <!-- Parents Link -->
          <router-link
            to="/admin/parents"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/parents')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/parents') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('parents') }}</span>
          </router-link>

          <!-- Profile Link -->
          <router-link
            to="/admin/profile"
            @click="closeMobileMenu"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActiveRoute('/admin/profile')
                ? 'bg-yellow-500/15 text-yellow-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-800/50 dark:hover:bg-gray-800/30 hover:text-gray-200 dark:hover:text-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0 transition-colors" :class="isActiveRoute('/admin/profile') ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-600 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="flex-1">{{ languageStore.t('myProfile') }}</span>
          </router-link>
        </div>
      </nav>
      
      <!-- Sidebar Footer (User Info) – dark mode compatible -->
      <div class="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-800 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
              <span class="text-sm font-semibold text-yellow-400">{{ userInitials }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-200 dark:text-gray-300 truncate">{{ userFullName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userRole }}</p>
          </div>
          <button 
            @click="handleLogout" 
            class="p-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-800/50 transition-all duration-200 group"
            title="Logout"
          >
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main Content – responsive padding, adds bottom padding for mobile to avoid bottom nav -->
    <main class="lg:pl-72 pt-16 pb-16 lg:pb-0">
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

    <!-- Bottom Navigation (mobile only) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const mobileMenuOpen = ref(false)

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

const isActiveRoute = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => { 
  mobileMenuOpen.value = !mobileMenuOpen.value 
}

const closeMobileMenu = () => { 
  mobileMenuOpen.value = false 
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleResize = () => {
  if (window.innerWidth >= 1024 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Fade animations */
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

/* Custom scrollbar for sidebar – dark mode compatible */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-track {
  background: #1f2937;
}
aside::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 8px;
}
aside::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>