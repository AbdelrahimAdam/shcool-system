import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useParentStore = defineStore('parent', {
    state: () => ({
        currentParent: null,
        children: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async getParentByUserId(userId) {
            this.isLoading = true
            try {
                const cached = cacheService.get(`parent_user_${userId}`)
                if (cached) {
                    this.currentParent = cached
                    return cached
                }

                const { data, error } = await supabase
                    .from('parents')
                    .select('*')
                    .eq('user_id', userId)
                    .single()

                if (error) throw error

                this.currentParent = data
                cacheService.set(`parent_user_${userId}`, data)
                
                return data
            } catch (error) {
                console.error('Get parent by user ID error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        async getChildren() {
            if (!this.currentParent) return []
            
            this.isLoading = true
            try {
                const { data, error } = await supabase
                    .from('students')
                    .select(`
                        *,
                        class:classes(name),
                        attendance:attendance(status, date),
                        grades:grades(percentage, grade, exam:exams(subject, exam_type))
                    `)
                    .eq('parent_id', this.currentParent.id)
                    .order('full_name')

                if (error) throw error

                this.children = data || []
                return this.children
            } catch (error) {
                console.error('Get children error:', error)
                return []
            } finally {
                this.isLoading = false
            }
        },

        async getChildGrades(childId) {
            try {
                const { data, error } = await supabase
                    .from('grades')
                    .select(`
                        *,
                        exam:exams(subject, exam_type, max_score, exam_date)
                    `)
                    .eq('student_id', childId)
                    .order('created_at', { ascending: false })

                if (error) throw error
                return data || []
            } catch (error) {
                console.error('Get child grades error:', error)
                return []
            }
        },

        async getChildAttendance(childId, startDate = null, endDate = null) {
            try {
                let query = supabase
                    .from('attendance')
                    .select('*')
                    .eq('student_id', childId)
                    .order('date', { ascending: false })

                if (startDate) {
                    query = query.gte('date', startDate)
                }
                if (endDate) {
                    query = query.lte('date', endDate)
                }

                const { data, error } = await query
                if (error) throw error
                return data || []
            } catch (error) {
                console.error('Get child attendance error:', error)
                return []
            }
        },

        async getChildPayments(childId) {
            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('student_id', childId)
                    .order('created_at', { ascending: false })

                if (error) throw error
                return data || []
            } catch (error) {
                console.error('Get child payments error:', error)
                return []
            }
        }
    }
})