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
        error: null,
        // Dashboard specific state
        myClasses: [],
        myStudents: [],
        teacherStats: {
            classesCount: 0,
            studentsCount: 0,
            todayAttendance: 0,
            upcomingExams: 0
        }
    }),

    getters: {
        // Dashboard getters
        getMyClasses: (state) => state.myClasses,
        getMyStudents: (state) => state.myStudents,
        getTeacherStats: (state) => state.teacherStats
    },

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
        },

        // ============= NEW TEACHER DASHBOARD METHODS =============

        // Get teacher's own record using user_id
        async getTeacherByUserId(userId) {
            this.isLoading = true
            try {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('id, school_id, full_name, teacher_code')
                    .eq('user_id', userId)
                    .maybeSingle()

                if (error) throw error
                return data
            } catch (error) {
                console.error('Get teacher by user ID error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        // Get classes assigned to this teacher
        async fetchMyClasses() {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                const teacherId = authStore.teacherId
                if (!teacherId) {
                    console.log('No teacher ID found')
                    return []
                }

                const { data, error } = await supabase
                    .from('classes')
                    .select('id, name, grade_level, section, capacity, current_enrollment')
                    .eq('teacher_id', teacherId)
                    .order('grade_level', { ascending: true })

                if (error) throw error

                this.myClasses = data || []
                this.teacherStats.classesCount = this.myClasses.length
                
                // Calculate total students across all classes
                let totalStudents = 0
                for (const cls of this.myClasses) {
                    totalStudents += cls.current_enrollment || 0
                }
                this.teacherStats.studentsCount = totalStudents
                
                return this.myClasses
            } catch (error) {
                console.error('Fetch my classes error:', error)
                return []
            } finally {
                this.isLoading = false
            }
        },

        // Get students from teacher's classes
        async fetchMyStudents() {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                const teacherId = authStore.teacherId
                if (!teacherId || this.myClasses.length === 0) {
                    return []
                }

                const classIds = this.myClasses.map(c => c.id)
                
                const { data, error } = await supabase
                    .from('students')
                    .select('id, full_name, student_number, class_id, status')
                    .in('class_id', classIds)
                    .eq('status', 'active')
                    .order('full_name')

                if (error) throw error

                this.myStudents = data || []
                return this.myStudents
            } catch (error) {
                console.error('Fetch my students error:', error)
                return []
            } finally {
                this.isLoading = false
            }
        },

        // Get today's attendance rate for teacher's classes
        async fetchTodayAttendanceRate() {
            const authStore = useAuthStore()
            const today = new Date().toISOString().split('T')[0]
            
            try {
                const teacherId = authStore.teacherId
                if (!teacherId || this.myClasses.length === 0) {
                    return 0
                }

                const classIds = this.myClasses.map(c => c.id)
                
                // Get students in these classes
                const { data: students } = await supabase
                    .from('students')
                    .select('id')
                    .in('class_id', classIds)
                    .eq('status', 'active')

                if (!students || students.length === 0) {
                    return 0
                }

                const studentIds = students.map(s => s.id)
                
                // Get today's attendance
                const { data: attendance } = await supabase
                    .from('attendance')
                    .select('student_id, status')
                    .in('student_id', studentIds)
                    .eq('date', today)

                if (!attendance || attendance.length === 0) {
                    return 0
                }

                const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length
                const rate = Math.round((presentCount / attendance.length) * 100)
                
                this.teacherStats.todayAttendance = rate
                return rate
            } catch (error) {
                console.error('Fetch today attendance error:', error)
                return 0
            }
        },

        // Get upcoming exams for teacher's classes
        async fetchUpcomingExams() {
            const authStore = useAuthStore()
            const today = new Date().toISOString().split('T')[0]
            
            try {
                const teacherId = authStore.teacherId
                if (!teacherId || this.myClasses.length === 0) {
                    return 0
                }

                const classIds = this.myClasses.map(c => c.id)
                
                const { data, error } = await supabase
                    .from('exams')
                    .select('id')
                    .in('class_id', classIds)
                    .gte('exam_date', today)

                if (error) throw error

                const count = data?.length || 0
                this.teacherStats.upcomingExams = count
                return count
            } catch (error) {
                console.error('Fetch upcoming exams error:', error)
                return 0
            }
        },

        // Load all dashboard data at once
        async loadTeacherDashboard() {
            this.isLoading = true
            
            try {
                await this.fetchMyClasses()
                await this.fetchMyStudents()
                await this.fetchTodayAttendanceRate()
                await this.fetchUpcomingExams()
                
                return {
                    myClasses: this.myClasses,
                    myStudents: this.myStudents,
                    stats: this.teacherStats
                }
            } catch (error) {
                console.error('Load teacher dashboard error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        }
    }
})