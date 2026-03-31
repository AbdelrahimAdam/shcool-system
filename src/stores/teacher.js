import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useTeacherStore = defineStore('teacher', {
    state: () => ({
        teachers: [],
        currentTeacher: null,
        totalCount: 0,
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchTeachers(page = 1, filters = {}) {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                let query = supabase
                    .from('teachers')
                    .select('id, teacher_code, full_name, arabic_name, email, phone, qualification, specialization, hire_date, status, subjects, created_at, user:users(full_name, email)', { count: 'exact' })
                    .eq('school_id', authStore.profile?.school_id)
                    .range((page - 1) * 20, page * 20 - 1)
                    .order('created_at', { ascending: false })

                if (filters.status) {
                    query = query.eq('status', filters.status)
                }
                if (filters.search) {
                    query = query.or(`full_name.ilike.%${filters.search}%,arabic_name.ilike.%${filters.search}%,teacher_code.ilike.%${filters.search}%`)
                }

                const { data, error, count } = await query

                if (error) throw error

                this.teachers = data
                this.totalCount = count || 0
                
                return { data, count }
            } catch (error) {
                console.error('Fetch teachers error:', error)
                this.error = error.message
                return { data: [], count: 0 }
            } finally {
                this.isLoading = false
            }
        },

        async createTeacher(teacherData) {
            this.isLoading = true
            try {
                const authStore = useAuthStore()
                
                // Prepare teacher data with all fields
                const teacherToInsert = {
                    school_id: authStore.profile.school_id,
                    full_name: teacherData.full_name,
                    arabic_name: teacherData.arabic_name || null,
                    email: teacherData.email || null,
                    phone: teacherData.phone || null,
                    qualification: teacherData.qualification || null,
                    specialization: teacherData.specialization || null,
                    hire_date: teacherData.hire_date || new Date().toISOString().split('T')[0],
                    status: teacherData.status || 'active',
                    subjects: teacherData.subjects || [],
                    user_id: teacherData.user_id || null,
                    teacher_code: teacherData.teacher_code || `TCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                }
                
                const { data, error } = await supabase
                    .from('teachers')
                    .insert([teacherToInsert])
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Create teacher error:', error)
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async updateTeacher(id, updates) {
            this.isLoading = true
            try {
                // Prepare update data (only include fields that exist in the table)
                const updateData = {
                    full_name: updates.full_name,
                    arabic_name: updates.arabic_name || null,
                    email: updates.email || null,
                    phone: updates.phone || null,
                    qualification: updates.qualification || null,
                    specialization: updates.specialization || null,
                    hire_date: updates.hire_date,
                    status: updates.status,
                    subjects: updates.subjects || []
                }
                
                const { data, error } = await supabase
                    .from('teachers')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Update teacher error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async deleteTeacher(id) {
            this.isLoading = true
            try {
                const { error } = await supabase
                    .from('teachers')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                cacheService.clear()
                return { success: true }
            } catch (error) {
                console.error('Delete teacher error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async getTeacherById(id) {
            this.isLoading = true
            try {
                const cached = cacheService.get(`teacher_${id}`)
                if (cached) {
                    this.currentTeacher = cached
                    return cached
                }

                const { data, error } = await supabase
                    .from('teachers')
                    .select('*, user:users(*)')
                    .eq('id', id)
                    .single()

                if (error) throw error

                this.currentTeacher = data
                cacheService.set(`teacher_${id}`, data)
                return data
            } catch (error) {
                console.error('Get teacher error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        }
    }
})