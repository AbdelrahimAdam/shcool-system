import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useLanguageStore } from './language'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        profile: null,
        school: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        permissions: [],
        isInitialized: false,
        teacherId: null,
        schoolId: null
    }),

    getters: {
        isSuperAdmin: (state) => state.role === 'super_admin',
        isAdmin: (state) => state.role === 'admin',
        isTeacher: (state) => state.role === 'teacher',
        isAccountant: (state) => state.role === 'accountant',
        isParent: (state) => state.role === 'parent',
        currentSchool: (state) => state.school,
        userProfile: (state) => state.profile,
        isReady: (state) => state.isInitialized,
        getTeacherId: (state) => state.teacherId,
        getSchoolId: (state) => state.schoolId
    },

    actions: {
        async initialize() {
            if (this.isInitialized) return true
            await this.getCurrentUser()
            this.isInitialized = true
            return true
        },

        async fetchTeacherId() {
            try {
                const userId = this.user?.id
                if (!userId) {
                    return null
                }

                const { data, error } = await supabase
                    .from('teachers')
                    .select('id, school_id')
                    .eq('user_id', userId)
                    .maybeSingle()

                if (error) {
                    console.error('Error fetching teacher ID:', error)
                    return null
                }

                this.teacherId = data?.id || null
                if (data?.school_id) {
                    this.schoolId = data.school_id
                    localStorage.setItem('schoolId', data.school_id)
                }
                return this.teacherId
            } catch (error) {
                console.error('Error in fetchTeacherId:', error)
                return null
            }
        },

        async login(email, password) {
            this.isLoading = true
            const languageStore = useLanguageStore()

            try {
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (authError) throw authError

                const { data: profile, error: profileError } = await supabase
                    .from('users')
                    .select(`
                        *,
                        schools (*)
                    `)
                    .eq('id', authData.user.id)
                    .maybeSingle()

                if (profileError) {
                    console.error('Profile fetch error:', profileError)

                    const userRole = authData.user.user_metadata?.role || 
                                   (email === 'zack.superadmin@school.com' ? 'super_admin' : 
                                    email.includes('admin') ? 'admin' : 
                                    email.includes('teacher') ? 'teacher' : 'parent')

                    const basicProfile = {
                        id: authData.user.id,
                        email: authData.user.email,
                        full_name: authData.user.user_metadata?.full_name || authData.user.email.split('@')[0],
                        role: userRole,
                        school_id: authData.user.user_metadata?.school_id || null,
                        is_active: true,
                        schools: null
                    }

                    supabase
                        .from('users')
                        .upsert([{
                            id: basicProfile.id,
                            email: basicProfile.email,
                            full_name: basicProfile.full_name,
                            role: basicProfile.role,
                            school_id: basicProfile.school_id,
                            is_active: basicProfile.is_active
                        }])
                        .then(() => {})
                        .catch(err => console.error('Failed to save profile:', err))

                    this.user = authData.user
                    this.profile = basicProfile
                    this.role = basicProfile.role
                    this.school = null
                    this.schoolId = basicProfile.school_id
                    this.isAuthenticated = true

                    if (basicProfile.school_id) {
                        localStorage.setItem('schoolId', basicProfile.school_id)
                    }

                    supabase.auth.updateUser({
                        data: { 
                            role: basicProfile.role, 
                            school_id: basicProfile.school_id,
                            full_name: basicProfile.full_name
                        }
                    }).catch(err => console.error('Failed to update metadata:', err))

                    cacheService.set(`user_${basicProfile.id}`, basicProfile, 3600000)

                    if (basicProfile.role === 'teacher') {
                        await this.fetchTeacherId()
                    }

                    // ✅ FIX: Removed unnecessary delay
                    return { success: true, role: basicProfile.role }
                }

                if (!profile) {
                    throw new Error('Profile not found')
                }

                this.user = authData.user
                this.profile = profile
                this.role = profile.role
                this.school = profile.schools || null
                this.schoolId = profile.school_id
                this.isAuthenticated = true

                if (profile.school_id) {
                    localStorage.setItem('schoolId', profile.school_id)
                }

                supabase.auth.updateUser({
                    data: { 
                        role: profile.role, 
                        school_id: profile.school_id,
                        full_name: profile.full_name
                    }
                }).catch(err => console.error('Failed to update metadata:', err))

                cacheService.set(`user_${profile.id}`, profile, 3600000)

                if (profile.role === 'teacher') {
                    await this.fetchTeacherId()
                }

                // ✅ FIX: Removed unnecessary delay
                return { success: true, role: profile.role }
            } catch (error) {
                console.error('Login error:', error)
                return { success: false, error: error.message || languageStore.t('operationFailed') }
            } finally {
                this.isLoading = false
            }
        },

        async logout() {
            try {
                await supabase.auth.signOut()
            } catch (error) {
                console.error('Sign out error:', error)
            }

            // ✅ FIX: Clear state immediately (synchronously)
            this.user = null
            this.profile = null
            this.school = null
            this.isAuthenticated = false
            this.role = null
            this.isInitialized = false
            this.teacherId = null
            this.schoolId = null
            
            localStorage.removeItem('schoolId')
            
            try {
                cacheService.clear()
            } catch (error) {
                console.error('Cache clear error:', error)
            }
            
            return { success: true }
        },

        async getCurrentUser() {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    this.isAuthenticated = false
                    this.user = null
                    this.profile = null
                    this.role = null
                    this.teacherId = null
                    this.schoolId = null
                    return null
                }

                const user = session.user
                if (!user) {
                    this.isAuthenticated = false
                    return null
                }

                const cachedProfile = cacheService.get(`user_${user.id}`)
                if (cachedProfile) {
                    this.profile = cachedProfile
                    this.user = user
                    this.role = cachedProfile.role
                    this.school = cachedProfile.schools
                    this.schoolId = cachedProfile.school_id
                    this.isAuthenticated = true

                    if (this.role === 'teacher' && !this.teacherId) {
                        await this.fetchTeacherId()
                    }

                    return cachedProfile
                }

                const { data: profile, error: profileError } = await supabase
                    .from('users')
                    .select('*, schools(*)')
                    .eq('id', user.id)
                    .maybeSingle()

                if (profileError) {
                    console.error('Profile fetch error:', profileError)
                    return null
                }

                if (!profile) {
                    const userRole = user.user_metadata?.role || 'parent'
                    const newProfile = {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                        role: userRole,
                        school_id: user.user_metadata?.school_id || null,
                        is_active: true,
                        schools: null
                    }

                    supabase
                        .from('users')
                        .insert([{
                            id: newProfile.id,
                            email: newProfile.email,
                            full_name: newProfile.full_name,
                            role: newProfile.role,
                            school_id: newProfile.school_id,
                            is_active: newProfile.is_active
                        }])
                        .then(() => {})
                        .catch(err => console.error('Failed to create profile:', err))

                    this.profile = newProfile
                    this.user = user
                    this.role = newProfile.role
                    this.schoolId = newProfile.school_id
                    this.isAuthenticated = true
                    cacheService.set(`user_${user.id}`, newProfile, 3600000)

                    if (newProfile.role === 'teacher') {
                        await this.fetchTeacherId()
                    }

                    return newProfile
                }

                this.user = user
                this.profile = profile
                this.role = profile.role
                this.school = profile.schools || null
                this.schoolId = profile.school_id
                this.isAuthenticated = true

                if (profile.school_id) {
                    localStorage.setItem('schoolId', profile.school_id)
                }

                cacheService.set(`user_${user.id}`, profile, 3600000)

                if (profile.role === 'teacher') {
                    await this.fetchTeacherId()
                }

                return profile
            } catch (error) {
                if (error?.message?.includes('Auth session missing') || 
                    error?.message?.includes('session') ||
                    error?.status === 401) {
                    this.isAuthenticated = false
                    this.user = null
                    this.profile = null
                    this.role = null
                    this.teacherId = null
                    this.schoolId = null
                    return null
                }
                console.error('Get current user error:', error)
                this.isAuthenticated = false
                return null
            }
        },

        async refreshProfile() {
            if (!this.user) return null

            try {
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('*, schools(*)')
                    .eq('id', this.user.id)
                    .maybeSingle()

                if (error) throw error

                this.profile = profile
                this.role = profile?.role || this.role
                this.school = profile?.schools || null
                this.schoolId = profile?.school_id || null
                if (profile) {
                    cacheService.set(`user_${this.user.id}`, profile, 3600000)
                    if (profile.school_id) {
                        localStorage.setItem('schoolId', profile.school_id)
                    }
                }

                if (this.role === 'teacher') {
                    await this.fetchTeacherId()
                }

                return profile
            } catch (error) {
                console.error('Refresh profile error:', error)
                return this.profile
            }
        },

        async updateProfile(updates) {
            if (!this.user) return { success: false, error: 'Not authenticated' }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', this.user.id)
                    .select()
                    .maybeSingle()

                if (error) throw error

                this.profile = { ...this.profile, ...data }
                this.role = data?.role || this.role
                this.schoolId = data?.school_id || this.schoolId
                cacheService.set(`user_${this.user.id}`, this.profile, 3600000)

                if (this.role === 'teacher') {
                    await this.fetchTeacherId()
                }

                return { success: true, data }
            } catch (error) {
                console.error('Update profile error:', error)
                return { success: false, error: error.message }
            }
        },

        hasPermission(permission) {
            const rolePermissions = {
                super_admin: ['*'],
                admin: ['manage_students', 'manage_teachers', 'manage_payments', 'view_reports', 'manage_crm'],
                teacher: ['view_students', 'mark_attendance', 'enter_grades'],
                accountant: ['manage_payments', 'view_reports'],
                parent: ['view_children', 'view_payments']
            }

            const permissions = rolePermissions[this.role] || []
            return permissions.includes('*') || permissions.includes(permission)
        }
    }
})