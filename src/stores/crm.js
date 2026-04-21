import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useCRMStore = defineStore('crm', {
  state: () => ({
    leads: [],
    currentLead: null,
    totalCount: 0,
    followUps: [],
    filters: { status: null, search: '', assigned_to: null },
    currentPage: 1,
    pipelineStats: {
      new: 0,
      contacted: 0,
      enrolled: 0,
      lost: 0
    },
    isLoading: false
  }),

  actions: {
    async fetchLeads(page = 1, customFilters = null) {
      const authStore = useAuthStore()
      this.isLoading = true
      // Merge custom filters with stored filters
      const activeFilters = customFilters !== null ? customFilters : this.filters
      this.currentPage = page
      
      try {
        let query = supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('school_id', authStore.profile?.school_id)
          .range((page - 1) * 20, page * 20 - 1)
          .order('created_at', { ascending: false })

        if (activeFilters.status) {
          query = query.eq('status', activeFilters.status)
        }
        if (activeFilters.assigned_to) {
          query = query.eq('assigned_to', activeFilters.assigned_to)
        }
        if (activeFilters.search) {
          query = query.or(`full_name.ilike.%${activeFilters.search}%,phone.ilike.%${activeFilters.search}%,email.ilike.%${activeFilters.search}%`)
        }

        const { data, error, count } = await query
        if (error) throw error

        this.leads = data
        this.totalCount = count || 0

        this.pipelineStats = {
          new: data.filter(l => l.status === 'new').length,
          contacted: data.filter(l => l.status === 'contacted').length,
          enrolled: data.filter(l => l.status === 'enrolled').length,
          lost: data.filter(l => l.status === 'lost').length
        }
        return { data, count }
      } catch (error) {
        console.error('Fetch leads error:', error)
        return { data: [], count: 0 }
      } finally {
        this.isLoading = false
      }
    },

    async getLeadById(id) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        this.currentLead = data
        return data
      } catch (error) {
        console.error('Get lead error:', error)
        return null
      }
    },

    async createLead(leadData) {
      try {
        const authStore = useAuthStore()
        const { data, error } = await supabase
          .from('leads')
          .insert([{
            ...leadData,
            school_id: authStore.profile.school_id,
            source: 'website'
          }])
          .select()
          .single()

        if (error) throw error
        cacheService.clear()
        await this.sendWhatsAppNotification(data.phone, 'lead_received')
        return { success: true, data }
      } catch (error) {
        console.error('Create lead error:', error)
        return { success: false, error: error.message }
      }
    },

    async updateLead(id, updates) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
        cacheService.clear()
        // Refresh the list after update (optional)
        await this.fetchLeads(this.currentPage, this.filters)
        return { success: true }
      } catch (error) {
        console.error('Update lead error:', error)
        return { success: false, error: error.message }
      }
    },

    async deleteLead(id) {
      try {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id)
        if (error) throw error
        cacheService.clear()
        // Refresh the list after delete
        await this.fetchLeads(this.currentPage, this.filters)
        return { success: true }
      } catch (error) {
        console.error('Delete lead error:', error)
        return { success: false, error: error.message }
      }
    },

    async updateLeadStatus(leadId, status, notes = '') {
      try {
        const { data, error } = await supabase
          .from('leads')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', leadId)
          .select()
          .single()
        if (error) throw error

        if (notes) {
          await this.addFollowUp(leadId, 'status_change', notes)
        }
        cacheService.clear()
        await this.fetchLeads(this.currentPage, this.filters)
        return { success: true, data }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async convertToStudent(leadId, studentData) {
      try {
        const { data: student, error: studentError } = await supabase
          .from('students')
          .insert([studentData])
          .select()
          .single()
        if (studentError) throw studentError

        const { error: leadError } = await supabase
          .from('leads')
          .update({
            status: 'enrolled',
            converted_to_student_id: student.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId)
        if (leadError) throw leadError

        cacheService.clear()
        await this.fetchLeads(this.currentPage, this.filters)
        return { success: true, student }
      } catch (error) {
        console.error('Conversion error:', error)
        return { success: false, error: error.message }
      }
    },

    // ------------------- Follow‑ups -------------------
    async fetchFollowUps(leadId) {
      try {
        const { data, error } = await supabase
          .from('follow_ups')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false })
        if (error) throw error
        this.followUps = data || []
        return this.followUps
      } catch (error) {
        console.error('Fetch follow-ups error:', error)
        return []
      }
    },

    async addFollowUp(leadId, type, notes) {
      try {
        const { data, error } = await supabase
          .from('follow_ups')
          .insert([{
            lead_id: leadId,
            follow_up_type: type,
            notes: notes,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()
        if (error) throw error
        await this.fetchFollowUps(leadId)
        return { success: true, data }
      } catch (error) {
        console.error('Add follow-up error:', error)
        return { success: false, error: error.message }
      }
    },

    async deleteFollowUp(followUpId) {
      try {
        const { error } = await supabase
          .from('follow_ups')
          .delete()
          .eq('id', followUpId)
        if (error) throw error
        if (this.currentLead) {
          await this.fetchFollowUps(this.currentLead.id)
        }
        return { success: true }
      } catch (error) {
        console.error('Delete follow-up error:', error)
        return { success: false, error: error.message }
      }
    },

    // ------------------- Real‑time subscription -------------------
    subscribeToLeadChanges(callback) {
      const authStore = useAuthStore()
      const schoolId = authStore.profile?.school_id
      if (!schoolId) return null

      const channel = supabase
        .channel('crm-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'leads', filter: `school_id=eq.${schoolId}` },
          () => callback()
        )
        .subscribe()
      return channel
    },

    // ------------------- Utilities -------------------
    getStageFromStatus(status) {
      const stages = { new: 1, contacted: 2, enrolled: 4, lost: 5 }
      return stages[status] || 1
    },

    async sendWhatsAppNotification(phoneNumber, template) {
      console.log(`WhatsApp notification sent to ${phoneNumber} for template ${template}`)
      return true
    }
  }
})