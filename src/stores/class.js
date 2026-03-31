import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useClassStore = defineStore('class', {
    state: () => ({
        classes: [],
        currentClass: null,
        totalCount: 0,
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchClasses(page = 1, filters = {}) {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                let query = supabase
                    .from('classes')
                    .select('*, teacher:teachers(full_name)', { count: 'exact' })
                    .eq('school_id', authStore.profile?.school_id)
                    .range((page - 1) * 20, page * 20 - 1)
                    .order('grade_level', { ascending: true })

                if (filters.grade_level) {
                    query = query.eq('grade_level', filters.grade_level)
                }
                if (filters.search) {
                    query = query.ilike('name', `%${filters.search}%`)
                }

                const { data, error, count } = await query

                if (error) throw error

                this.classes = data
                this.totalCount = count || 0
                
                return { data, count }
            } catch (error) {
                console.error('Fetch classes error:', error)
                this.error = error.message
                return { data: [], count: 0 }
            } finally {
                this.isLoading = false
            }
        },

        async createClass(classData) {
            this.isLoading = true
            try {
                const authStore = useAuthStore()
                
                const { data, error } = await supabase
                    .from('classes')
                    .insert([{
                        ...classData,
                        school_id: authStore.profile.school_id,
                        current_enrollment: 0
                    }])
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Create class error:', error)
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async updateClass(id, updates) {
            this.isLoading = true
            try {
                const { data, error } = await supabase
                    .from('classes')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Update class error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async deleteClass(id) {
            this.isLoading = true
            try {
                const { error } = await supabase
                    .from('classes')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                cacheService.clear()
                return { success: true }
            } catch (error) {
                console.error('Delete class error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async getClassById(id) {
            this.isLoading = true
            try {
                const cached = cacheService.get(`class_${id}`)
                if (cached) {
                    this.currentClass = cached
                    return cached
                }

                const { data, error } = await supabase
                    .from('classes')
                    .select('*, teacher:teachers(*), students:students(count)')
                    .eq('id', id)
                    .single()

                if (error) throw error

                this.currentClass = data
                cacheService.set(`class_${id}`, data)
                return data
            } catch (error) {
                console.error('Get class error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        async getClassStudents(classId) {
            try {
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .eq('class_id', classId)
                    .eq('status', 'active')
                    .order('full_name')

                if (error) throw error
                return data
            } catch (error) {
                console.error('Get class students error:', error)
                return []
            }
        }
    }
})