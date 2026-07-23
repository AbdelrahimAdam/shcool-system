<template>
  <aside 
    class="sidebar fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto lg:translate-x-0 lg:top-16 lg:z-40"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Close Button (Mobile only) -->
    <button 
      @click="closeSidebar"
      class="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors z-20"
      aria-label="Close menu"
    >
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Sidebar Header -->
    <div class="p-5 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="font-bold text-white text-lg truncate block">{{ languageStore.t('teacherPortal') }}</span>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ languageStore.t('manageYourClasses') }}</p>
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="p-5 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border-2 border-yellow-500/30">
            <span class="text-base font-bold text-yellow-400">{{ userInitials }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ languageStore.t('teacher') }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="py-6 pb-40">
      <div class="px-4 space-y-1.5">
        <!-- Dashboard -->
        <router-link
          to="/teacher"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('dashboard') }}</span>
        </router-link>

        <!-- My Classes -->
        <router-link
          to="/teacher/classes"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/classes'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/classes' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('myClasses') }}</span>
        </router-link>

        <!-- My Students -->
        <router-link
          to="/teacher/students"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/students'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/students' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('myStudents') }}</span>
        </router-link>

        <!-- Attendance -->
        <router-link
          to="/teacher/attendance"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/attendance'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/attendance' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('attendance') }}</span>
        </router-link>

        <!-- Grades -->
        <router-link
          to="/teacher/grades"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/grades'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/grades' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('grades') }}</span>
        </router-link>

        <!-- Exams -->
        <router-link
          to="/teacher/exams"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/exams'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/exams' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('exams') }}</span>
        </router-link>

        <!-- Profile -->
        <router-link
          to="/teacher/profile"
          class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            $route.path === '/teacher/profile'
              ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          ]"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/teacher/profile' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="flex-1 truncate">{{ languageStore.t('myProfile') }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer (Logout) -->
    <div class="sidebar-footer absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
      <button 
        @click="handleLogout" 
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
      >
        <svg class="w-5 h-5 transition-colors group-hover:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="truncate">{{ languageStore.t('logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const userFullName = computed(() => authStore.profile?.full_name || 'Teacher')
const userInitials = computed(() => {
  if (!userFullName.value) return 'T'
  const parts = userFullName.value.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    emit('close')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// ✅ FIX: Watch for route changes and close sidebar on mobile
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    emit('close')
  }
}, { immediate: false })

// ✅ FIX: Remove body overflow manipulation - this was causing the scroll freeze
// The overlay already handles the backdrop, and the sidebar doesn't need to lock body scroll
// watch(() => props.isOpen, (isOpen) => {
//   if (isOpen && window.innerWidth < 1024) {
//     document.body.style.overflow = 'hidden'
//   } else {
//     document.body.style.overflow = ''
//   }
// }, { immediate: true })
</script>

<style scoped>
.sidebar::-webkit-scrollbar {
  width: 4px;
}
.sidebar::-webkit-scrollbar-track {
  background: #1f2937;
}
.sidebar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
.sidebar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Mobile styles - sidebar covers everything */
@media (max-width: 1023px) {
  .sidebar {
    top: 0 !important;
    z-index: 50 !important;
    height: 100vh !important;
    height: 100dvh !important;
    padding-bottom: 5rem !important;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .sidebar.translate-x-0 {
    transform: translateX(0) !important;
  }
  
  .sidebar-footer {
    bottom: 5rem !important;
  }
}

/* Desktop styles - sidebar below header */
@media (min-width: 1024px) {
  .sidebar {
    top: 4rem !important;
    z-index: 40 !important;
    height: calc(100vh - 4rem) !important;
    height: calc(100dvh - 4rem) !important;
    transform: translateX(0) !important;
  }
  
  .sidebar-footer {
    bottom: 0 !important;
  }
}
</style>