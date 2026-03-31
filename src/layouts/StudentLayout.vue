<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />
    <div class="flex">
      <StudentSidebar />
      <main class="flex-1 p-4 md:p-6 mt-16 md:ml-64">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/common/AppHeader.vue'
import StudentSidebar from '../components/student/StudentSidebar.vue'
</script>