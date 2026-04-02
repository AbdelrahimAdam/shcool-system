<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <AppHeader />
    <div class="flex">
      <TeacherSidebar />
      <main class="flex-1 p-4 sm:p-6 lg:p-8 mt-16 lg:ml-72">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/common/AppHeader.vue'
import TeacherSidebar from '../components/teacher/TeacherSidebar.vue'
</script>

<style scoped>
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
</style>