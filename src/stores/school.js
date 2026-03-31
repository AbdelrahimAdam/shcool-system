import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useSchoolStore = defineStore('school', {
    state: () => ({
        schools: [],
        currentSchool: null,
        totalCount: 0,
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchSchools(page = 1, filters = {}) {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                let query = supabase
                    .from('schools')
                    .select('*', { count: 'exact' })
                    .range((page - 1) * 20, page * 20 - 1)
                    .order('created_at', { ascending: false })

                if (filters.status) {
                    query = query.eq('status', filters.status)
                }
                if (filters.search) {
                    query = query.ilike('name', `%${filters.search}%`)
                }

                const { data, error, count } = await query

                if (error) throw error

                this.schools = data
                this.totalCount = count || 0
                
                return { data, count }
            } catch (error) {
                console.error('Fetch schools error:', error)
                this.error = error.message
                return { data: [], count: 0 }
            } finally {
                this.isLoading = false
            }
        },

        async createSchool(schoolData) {
            this.isLoading = true
            try {
                const { data, error } = await supabase
                    .from('schools')
                    .insert([{
                        ...schoolData,
                        slug: schoolData.slug || schoolData.name.toLowerCase().replace(/\s+/g, '-')
                    }])
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Create school error:', error)
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async updateSchool(id, updates) {
            this.isLoading = true
            try {
                const { data, error } = await supabase
                    .from('schools')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Update school error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async getSchoolById(id) {
            this.isLoading = true
            try {
                const cached = cacheService.get(`school_${id}`)
                if (cached) {
                    this.currentSchool = cached
                    return cached
                }

                const { data, error } = await supabase
                    .from('schools')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error

                this.currentSchool = data
                cacheService.set(`school_${id}`, data)
                return data
            } catch (error) {
                console.error('Get school error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        async getSchoolStats(schoolId) {
            try {
                const [students, teachers, payments] = await Promise.all([
                    supabase.from('students').select('count', { count: 'exact', head: true }).eq('school_id', schoolId),
                    supabase.from('teachers').select('count', { count: 'exact', head: true }).eq('school_id', schoolId),
                    supabase.from('payments').select('amount').eq('school_id', schoolId).eq('status', 'approved')
                ])
                
                const totalRevenue = (payments.data || []).reduce((sum, p) => sum + p.amount, 0)
                
                return {
                    students: students.count || 0,
                    teachers: teachers.count || 0,
                    revenue: totalRevenue
                }
            } catch (error) {
                console.error('Get school stats error:', error)
                return { students: 0, teachers: 0, revenue: 0 }
            }
        }
    }
})