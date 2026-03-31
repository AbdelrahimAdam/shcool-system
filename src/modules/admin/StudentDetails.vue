<template>
  <div class="max-w-4xl mx-auto">
    <div class="card p-6">
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-2xl font-bold">{{ student?.full_name }}</h1>
        <div class="space-x-2" :class="{ 'space-x-reverse': languageStore.isRTL }">
          <router-link :to="`/admin/students/${student?.id}/edit`" class="btn-primary">
            {{ languageStore.t('edit') }}
          </router-link>
          <button @click="deleteStudent" class="btn-danger">{{ languageStore.t('delete') }}</button>
        </div>
      </div>

      <div v-if="student" class="space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('studentNumber') }}</p>
            <p class="font-medium">{{ student.student_number }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('fullName') }}</p>
            <p class="font-medium">{{ student.full_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('arabicName') }}</p>
            <p class="font-medium">{{ student.arabic_name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('dateOfBirth') }}</p>
            <p class="font-medium">{{ formatDate(student.date_of_birth) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('gender') }}</p>
            <p class="font-medium">{{ languageStore.t(student.gender) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('class') }}</p>
            <p class="font-medium">{{ student.class?.name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('enrollmentDate') }}</p>
            <p class="font-medium">{{ formatDate(student.enrollment_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ languageStore.t('status') }}</p>
            <span :class="getStatusClass(student.status)">{{ languageStore.t(student.status) }}</span>
          </div>
        </div>

        <!-- Contact -->
        <div class="border-t pt-4">
          <h2 class="text-lg font-semibold mb-3">{{ languageStore.t('contactInfo') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">{{ languageStore.t('phone') }}</p>
              <p class="font-medium">{{ student.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ languageStore.t('address') }}</p>
              <p class="font-medium">{{ student.address || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Parent -->
        <div v-if="student.parent" class="border-t pt-4">
          <h2 class="text-lg font-semibold mb-3">{{ languageStore.t('parent') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">{{ languageStore.t('fullName') }}</p>
              <p class="font-medium">{{ student.parent.full_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ languageStore.t('phone') }}</p>
              <p class="font-medium">{{ student.parent.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Payments -->
        <div class="border-t pt-4">
          <h2 class="text-lg font-semibold mb-3">{{ languageStore.t('payments') }}</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('paymentNumber') }}</th>
                  <th class="px-3 py-2 text-right">{{ languageStore.t('amount') }}</th>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('paymentMethod') }}</th>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('status') }}</th>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('dueDate') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in student.payments" :key="payment.id" class="border-t">
                  <td class="px-3 py-2">{{ payment.payment_number }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(payment.amount) }}</td>
                  <td class="px-3 py-2">{{ languageStore.t(payment.payment_method) }}</td>
                  <td class="px-3 py-2">
                    <span :class="getPaymentStatusClass(payment.status)">{{ languageStore.t(payment.status) }}</span>
                  </td>
                  <td class="px-3 py-2">{{ formatDate(payment.due_date) }}</td>
                </tr>
                <tr v-if="!student.payments?.length">
                  <td colspan="5" class="text-center py-4 text-gray-500">{{ languageStore.t('noPayments') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Grades -->
        <div class="border-t pt-4">
          <h2 class="text-lg font-semibold mb-3">{{ languageStore.t('grades') }}</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('subject') }}</th>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('examType') }}</th>
                  <th class="px-3 py-2 text-right">{{ languageStore.t('score') }}</th>
                  <th class="px-3 py-2 text-right">{{ languageStore.t('percentage') }}%</th>
                  <th class="px-3 py-2 text-left">{{ languageStore.t('grade') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="grade in student.grades" :key="grade.id" class="border-t">
                  <td class="px-3 py-2">{{ grade.exam?.subject }}</td>
                  <td class="px-3 py-2">{{ languageStore.t(grade.exam?.exam_type) }}</td>
                  <td class="px-3 py-2 text-right">{{ grade.score }}</td>
                  <td class="px-3 py-2 text-right">{{ grade.percentage }}</td>
                  <td class="px-3 py-2">{{ grade.grade }}</td>
                </tr>
                <tr v-if="!student.grades?.length">
                  <td colspan="5" class="text-center py-4 text-gray-500">{{ languageStore.t('noGrades') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">{{ languageStore.t('loading') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '../../../stores/student'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const studentStore = useStudentStore()
const languageStore = useLanguageStore()

const student = ref(null)

const loadStudent = async () => {
  student.value = await studentStore.getStudentById(route.params.id)
}

const deleteStudent = async () => {
  if (confirm(languageStore.t('confirmDelete'))) {
    await studentStore.deleteStudent(route.params.id)
    router.push('/admin/students')
  }
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'
const formatCurrency = (value) => `SDG ${value?.toLocaleString()}`

const getStatusClass = (status) => {
  const map = {
    active: 'text-green-600',
    graduated: 'text-blue-600',
    transferred: 'text-yellow-600',
    suspended: 'text-red-600'
  }
  return map[status] || ''
}

const getPaymentStatusClass = (status) => {
  const map = {
    pending: 'text-yellow-600',
    approved: 'text-green-600',
    rejected: 'text-red-600'
  }
  return map[status] || ''
}

onMounted(() => {
  loadStudent()
})
</script>