import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    currentStudent: null,
    totalCount: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 20,
    filters: {}
  }),

  getters: {
    // Get the current school ID from the authenticated user
    schoolId: () => {
      const authStore = useAuthStore()
      return authStore.profile?.school_id
    }
  },

  actions: {
    async fetchStudents(page = 1, filters = {}) {
      this.isLoading = true
      this.error = null
      this.currentPage = page

      const authStore = useAuthStore()
      const cacheKey = cacheService.generateKey('students', {
        page,
        filters,
        schoolId: authStore.profile?.school_id
      })

      const cached = cacheService.get(cacheKey)
      if (cached) {
        this.students = cached.data
        this.totalCount = cached.count
        this.isLoading = false
        return cached
      }

      try {
        let query = supabase
          .from('students')
          .select('*, class:classes(name), parent:parents(full_name, phone)', { count: 'exact' })
          .eq('school_id', authStore.profile?.school_id)
          .range((page - 1) * this.pageSize, page * this.pageSize - 1)
          .order('created_at', { ascending: false })

        if (filters.class_id) {
          query = query.eq('class_id', filters.class_id)
        }
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.search) {
          query = query.or(
            `full_name.ilike.%${filters.search}%,student_number.ilike.%${filters.search}%`
          )
        }

        const { data, error, count } = await query

        if (error) throw error

        this.students = data
        this.totalCount = count || 0
        this.filters = filters

        cacheService.set(cacheKey, { data, count })

        return { data, count }
      } catch (error) {
        this.error = error.message
        console.error('Fetch students error:', error)
        return { data: [], count: 0 }
      } finally {
        this.isLoading = false
      }
    },

    async createStudent(studentData) {
      this.isLoading = true
      try {
        const authStore = useAuthStore()

        const dataToInsert = {
          ...studentData,
          school_id: authStore.profile?.school_id || studentData.school_id,
          created_by: studentData.created_by || authStore.user?.id
        }

        const { data, error } = await supabase
          .from('students')
          .insert([dataToInsert])
          .select()
          .single()

        if (error) throw error

        cacheService.clear()

        return { success: true, data }
      } catch (error) {
        this.error = error.message
        console.error('Create student error:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async updateStudent(id, updates) {
      this.isLoading = true
      try {
        // Remove fields that should never be updated directly
        const { created_by, ...cleanUpdates } = updates

        const { data, error } = await supabase
          .from('students')
          .update(cleanUpdates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update local list if present
        const index = this.students.findIndex(s => s.id === id)
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...data }
        }

        cacheService.clear()

        return { success: true, data }
      } catch (error) {
        this.error = error.message
        console.error('Update student error:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async deleteStudent(id) {
      this.isLoading = true
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.students = this.students.filter(s => s.id !== id)
        cacheService.clear()

        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('Delete student error:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async getStudentById(id) {
      this.isLoading = true
      try {
        const cached = cacheService.get(`student_${id}`)
        if (cached) {
          this.currentStudent = cached
          return cached
        }

        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            class:classes(*),
            parent:parents(*),
            payments:payments(*),
            grades:grades(*, exam:exams(*))
          `)
          .eq('id', id)
          .single()

        if (error) throw error

        this.currentStudent = data
        cacheService.set(`student_${id}`, data)

        return data
      } catch (error) {
        this.error = error.message
        console.error('Get student by ID error:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    async getStudentByUserId(userId) {
      this.isLoading = true
      try {
        const cached = cacheService.get(`student_user_${userId}`)
        if (cached) {
          return cached
        }

        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            class:classes(name),
            parent:parents(full_name, phone, email)
          `)
          .eq('user_id', userId)
          .single()

        if (error) throw error

        cacheService.set(`student_user_${userId}`, data)

        return data
      } catch (error) {
        console.error('Get student by user ID error:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    async getChildrenByParentId(parentId) {
      this.isLoading = true
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            class:classes(name),
            grades:grades(percentage, grade, exam:exams(subject, exam_type))
          `)
          .eq('parent_id', parentId)
          .order('full_name')

        if (error) throw error

        return data || []
      } catch (error) {
        console.error('Get children error:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    async linkStudentToParent(studentId, parentId) {
      try {
        const { error } = await supabase
          .from('students')
          .update({ parent_id: parentId })
          .eq('id', studentId)

        if (error) throw error

        cacheService.clear()
        return { success: true }
      } catch (error) {
        console.error('Link student to parent error:', error)
        return { success: false, error: error.message }
      }
    },

    async linkStudentToUser(studentId, userId) {
      try {
        const { error } = await supabase
          .from('students')
          .update({ user_id: userId })
          .eq('id', studentId)

        if (error) throw error

        cacheService.clear()
        return { success: true }
      } catch (error) {
        console.error('Link student to user error:', error)
        return { success: false, error: error.message }
      }
    },

    // Utility action to clear all filters and reset to first page
    async clearFilters() {
      this.filters = {}
      this.currentPage = 1
      await this.fetchStudents(1, {})
    }
  }
})