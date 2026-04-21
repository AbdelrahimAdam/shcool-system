<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ languageStore.t('pipeline') }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="stage in stages" :key="stage.key" class="card">
        <div class="p-4 border-b bg-gray-50">
          <h2 class="font-semibold">{{ stage.label }}</h2>
          <span class="text-sm text-gray-500">{{ stage.leads.length }} leads</span>
        </div>
        <div class="p-2 space-y-2">
          <div
            v-for="lead in stage.leads"
            :key="lead.id"
            class="bg-white p-3 rounded shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
            @click="editLead(lead.id)"
          >
            <p class="font-medium">{{ lead.full_name }}</p>
            <p class="text-sm text-gray-600">{{ lead.phone }}</p>
            <p class="text-xs text-gray-500">{{ lead.student_name || '-' }}</p>
          </div>
          <div v-if="!stage.leads.length" class="text-center py-4 text-gray-400 text-sm">
            {{ languageStore.t('noLeads') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useCRMStore } from '../../../stores/crm'
import { useLanguageStore } from '../../../stores/language'

const router = useRouter()
const crmStore = useCRMStore()
const languageStore = useLanguageStore()

let realtimeSubscription = null

const stages = computed(() => [
  { key: 'new', label: languageStore.t('new'), leads: crmStore.leads.filter(l => l.status === 'new') },
  { key: 'contacted', label: languageStore.t('contacted'), leads: crmStore.leads.filter(l => l.status === 'contacted') },
  { key: 'enrolled', label: languageStore.t('enrolled'), leads: crmStore.leads.filter(l => l.status === 'enrolled') },
  { key: 'lost', label: languageStore.t('lost'), leads: crmStore.leads.filter(l => l.status === 'lost') }
])

const editLead = (id) => {
  router.push(`/admin/crm/${id}`)
}

const refreshPipeline = () => {
  crmStore.fetchLeads(crmStore.currentPage, crmStore.filters)
}

onMounted(() => {
  crmStore.fetchLeads(1)
  realtimeSubscription = crmStore.subscribeToLeadChanges(() => {
    refreshPipeline()
  })
})

onUnmounted(() => {
  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription)
  }
})
</script>