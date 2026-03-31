<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('school') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">{{ languageStore.t('schoolName') }}</label>
            <input v-model="form.name" type="text" required class="input-field" />
          </div>

          <div>
            <label class="label">{{ languageStore.t('slug') }}</label>
            <input v-model="form.slug" type="text" required class="input-field" />
            <p class="text-xs text-gray-500 mt-1">{{ languageStore.t('slugHelp') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('email') }}</label>
              <input v-model="form.email" type="email" class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('phone') }}</label>
              <input v-model="form.phone" type="tel" class="input-field" />
            </div>
          </div>

          <div>
            <label class="label">{{ languageStore.t('address') }}</label>
            <textarea v-model="form.address" rows="3" class="input-field"></textarea>
          </div>

          <div>
            <label class="label">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="input-field">
              <option value="active">{{ languageStore.t('active') }}</option>
              <option value="suspended">{{ languageStore.t('suspended') }}</option>
              <option value="pending">{{ languageStore.t('pending') }}</option>
            </select>
          </div>

          <div>
            <label class="label">{{ languageStore.t('subscriptionPlan') }}</label>
            <select v-model="form.subscription_plan" class="input-field">
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label class="label">{{ languageStore.t('subscriptionEndDate') }}</label>
            <input v-model="form.subscription_end_date" type="date" class="input-field" />
          </div>

          <div class="flex justify-end space-x-3" :class="{ 'space-x-reverse': languageStore.isRTL }">
            <button type="button" @click="$router.back()" class="btn-secondary">{{ languageStore.t('cancel') }}</button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? languageStore.t('loading') : languageStore.t('save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSchoolStore } from '../../../stores/school'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const schoolStore = useSchoolStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)

const form = ref({
  name: '',
  slug: '',
  email: '',
  phone: '',
  address: '',
  status: 'pending',
  subscription_plan: 'basic',
  subscription_end_date: ''
})

const loadSchool = async () => {
  if (isEdit.value) {
    const school = await schoolStore.getSchoolById(route.params.id)
    if (school) {
      form.value = { ...school }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  let result
  if (isEdit.value) {
    result = await schoolStore.updateSchool(route.params.id, form.value)
  } else {
    result = await schoolStore.createSchool(form.value)
  }
  isLoading.value = false
  if (result.success) {
    router.push('/super-admin/schools')
  }
}

onMounted(() => {
  loadSchool()
})
</script>