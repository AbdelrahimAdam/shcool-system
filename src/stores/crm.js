import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useCRMStore = defineStore('crm', {
    state: () => ({
        leads: [],
        currentLead: null,
        totalCount: 0,
        pipelineStats: {
            new: 0,
            contacted: 0,
            enrolled: 0,
            lost: 0
        }
    }),

    actions: {
        async fetchLeads(page = 1, filters = {}) {
            const authStore = useAuthStore()
            
            try {
                let query = supabase
                    .from('leads')
                    .select('*', { count: 'exact' })
                    .eq('school_id', authStore.profile?.school_id)
                    .range((page - 1) * 20, page * 20 - 1)
                    .order('created_at', { ascending: false })

                if (filters.status) {
                    query = query.eq('status', filters.status)
                }
                if (filters.assigned_to) {
                    query = query.eq('assigned_to', filters.assigned_to)
                }

                const { data, error, count } = await query

                if (error) throw error

                this.leads = data
                this.totalCount = count || 0
                
                // Update pipeline stats
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
                
                // Send WhatsApp notification (mocked)
                await this.sendWhatsAppNotification(data.phone, 'lead_received')
                
                return { success: true, data }
            } catch (error) {
                console.error('Create lead error:', error)
                return { success: false, error: error.message }
            }
        },

        async updateLeadStatus(leadId, status, notes = '') {
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .update({ 
                        status, 
                        updated_at: new Date().toISOString(),
                        pipeline_stage: this.getStageFromStatus(status)
                    })
                    .eq('id', leadId)
                    .select()
                    .single()

                if (error) throw error

                // Add follow-up record
                await supabase
                    .from('follow_ups')
                    .insert([{
                        lead_id: leadId,
                        notes,
                        follow_up_type: 'call'
                    }])

                cacheService.clear()
                
                return { success: true, data }
            } catch (error) {
                return { success: false, error: error.message }
            }
        },

        getStageFromStatus(status) {
            const stages = {
                'new': 1,
                'contacted': 2,
                'enrolled': 4,
                'lost': 5
            }
            return stages[status] || 1
        },

        async convertToStudent(leadId, studentData) {
            try {
                // First create the student
                const { data: student, error: studentError } = await supabase
                    .from('students')
                    .insert([studentData])
                    .select()
                    .single()

                if (studentError) throw studentError

                // Update lead with conversion
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
                
                return { success: true, student }
            } catch (error) {
                return { success: false, error: error.message }
            }
        },

        async sendWhatsAppNotification(phoneNumber, template) {
            // Mock WhatsApp notification for low bandwidth
            console.log(`WhatsApp notification sent to ${phoneNumber} for template ${template}`)
            return true
        }
    }
})