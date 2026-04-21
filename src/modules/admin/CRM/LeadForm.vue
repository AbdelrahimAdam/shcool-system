<template>
  <div class="max-w-2xl mx-auto">
    <div class="card p-6">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit ? languageStore.t('edit') : languageStore.t('add') }} {{ languageStore.t('lead') }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="label">{{ languageStore.t('fullName') }}</label>
            <input v-model="form.full_name" type="text" required class="input-field" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('email') }}</label>
              <input v-model="form.email" type="email" class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('phone') }}</label>
              <input v-model="form.phone" type="tel" required class="input-field" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ languageStore.t('studentName') }}</label>
              <input v-model="form.student_name" type="text" class="input-field" />
            </div>
            <div>
              <label class="label">{{ languageStore.t('studentGrade') }}</label>
              <input v-model.number="form.student_grade" type="number" min="1" max="12" class="input-field" />
            </div>
          </div>

          <div>
            <label class="label">{{ languageStore.t('interestedProgram') }}</label>
            <input v-model="form.interested_program" type="text" class="input-field" />
          </div>

          <div>
            <label class="label">{{ languageStore.t('status') }}</label>
            <select v-model="form.status" class="input-field">
              <option value="new">{{ languageStore.t('new') }}</option>
              <option value="contacted">{{ languageStore.t('contacted') }}</option>
              <option value="enrolled">{{ languageStore.t('enrolled') }}</option>
              <option value="lost">{{ languageStore.t('lost') }}</option>
            </select>
          </div>

          <div>
            <label class="label">{{ languageStore.t('notes') }}</label>
            <textarea v-model="form.notes" rows="3" class="input-field"></textarea>
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
import { useCRMStore } from '../../../stores/crm'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const route = useRoute()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

const isEdit = ref(!!route.params.id)
const isLoading = ref(false)

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  student_name: '',
  student_grade: null,
  interested_program: '',
  status: 'new',
  notes: ''
})

const loadLead = async () => {
  if (isEdit.value) {
    const lead = await crmStore.getLeadById(route.params.id)
    if (lead) {
      form.value = { ...lead }
    }
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  let result
  if (isEdit.value) {
    result = await crmStore.updateLead(route.params.id, form.value)
  } else {
    result = await crmStore.createLead(form.value)
  }
  isLoading.value = false
  if (result.success) {
    router.push('/admin/crm')
  } else {
    alert(result.error || languageStore.t('saveFailed'))
  }
}

onMounted(() => {
  loadLead()
})
</script>

<style scoped>
/* Reuse existing modal styles from your admin dashboard if needed */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  max-width: 28rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>