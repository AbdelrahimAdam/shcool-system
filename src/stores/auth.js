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
        isInitialized: false
    }),

    getters: {
        isSuperAdmin: (state) => state.role === 'super_admin',
        isAdmin: (state) => state.role === 'admin',
        isTeacher: (state) => state.role === 'teacher',
        isAccountant: (state) => state.role === 'accountant',
        isParent: (state) => state.role === 'parent',
        currentSchool: (state) => state.school,
        userProfile: (state) => state.profile,
        isReady: (state) => state.isInitialized
    },

    actions: {
        async initialize() {
            if (this.isInitialized) return true
            await this.getCurrentUser()
            this.isInitialized = true
            return true
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

                console.log('Auth success, user ID:', authData.user.id)

                // Fetch profile with maybeSingle to handle missing profiles gracefully
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
                    
                    // Create profile from auth metadata as fallback
                    const userRole = authData.user.user_metadata?.role || 
                                   (email === 'zack.superadmin@school.com' ? 'super_admin' : 
                                    email.includes('admin') ? 'admin' : 
                                    email.includes('teacher') ? 'teacher' : 'parent')
                    
                    const basicProfile = {
                        id: authData.user.id,
                        email: authData.user.email,
                        full_name: authData.user.user_metadata?.full_name || authData.user.email.split('@')[0],
                        role: userRole,
                        school_id: null,
                        is_active: true,
                        schools: null
                    }
                    
                    // Try to save the profile in background
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
                        .then(() => console.log('Profile saved in background'))
                        .catch(err => console.error('Failed to save profile:', err))
                    
                    this.user = authData.user
                    this.profile = basicProfile
                    this.role = basicProfile.role
                    this.school = null
                    this.isAuthenticated = true
                    
                    // Update user metadata in background
                    supabase.auth.updateUser({
                        data: { 
                            role: basicProfile.role, 
                            school_id: basicProfile.school_id,
                            full_name: basicProfile.full_name
                        }
                    }).catch(err => console.error('Failed to update metadata:', err))
                    
                    cacheService.set(`user_${basicProfile.id}`, basicProfile, 3600000)
                    
                    // Small delay to ensure state is fully updated
                    await new Promise(resolve => setTimeout(resolve, 50))
                    
                    return { success: true, role: basicProfile.role }
                }

                if (!profile) {
                    console.error('No profile found')
                    throw new Error('Profile not found')
                }

                console.log('User profile loaded:', profile)
                console.log('User role:', profile.role)

                this.user = authData.user
                this.profile = profile
                this.role = profile.role
                this.school = profile.schools || null
                this.isAuthenticated = true

                // Update user metadata in background
                supabase.auth.updateUser({
                    data: { 
                        role: profile.role, 
                        school_id: profile.school_id,
                        full_name: profile.full_name
                    }
                }).catch(err => console.error('Failed to update metadata:', err))

                cacheService.set(`user_${profile.id}`, profile, 3600000)

                // Small delay to ensure state is fully updated
                await new Promise(resolve => setTimeout(resolve, 50))

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
                this.user = null
                this.profile = null
                this.school = null
                this.isAuthenticated = false
                this.role = null
                this.isInitialized = false
                cacheService.clear()
                return { success: true }
            } catch (error) {
                return { success: false, error: error.message }
            }
        },

        async getCurrentUser() {
            try {
                // First check if there's a session using getSession (more reliable)
                const { data: { session } } = await supabase.auth.getSession()
                
                // If no session, user is not authenticated
                if (!session) {
                    console.log('No active session found')
                    this.isAuthenticated = false
                    this.user = null
                    this.profile = null
                    this.role = null
                    return null
                }

                const user = session.user
                if (!user) {
                    console.log('No user in session')
                    this.isAuthenticated = false
                    return null
                }

                console.log('Getting current user:', user.email)

                // Check cache first
                const cachedProfile = cacheService.get(`user_${user.id}`)
                if (cachedProfile) {
                    this.profile = cachedProfile
                    this.user = user
                    this.role = cachedProfile.role
                    this.school = cachedProfile.schools
                    this.isAuthenticated = true
                    console.log('Using cached profile, role:', this.role)
                    return cachedProfile
                }

                // Fetch profile from database using maybeSingle
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
                    console.log('No profile found, creating one from auth metadata...')
                    
                    // Create profile from auth metadata
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
                    
                    // Save the profile in background (don't await)
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
                        .then(() => console.log('Profile created in background'))
                        .catch(err => console.error('Failed to create profile:', err))
                    
                    this.profile = newProfile
                    this.user = user
                    this.role = newProfile.role
                    this.isAuthenticated = true
                    cacheService.set(`user_${user.id}`, newProfile, 3600000)
                    return newProfile
                }

                console.log('Profile loaded from DB, role:', profile.role)

                this.user = user
                this.profile = profile
                this.role = profile.role
                this.school = profile.schools || null
                this.isAuthenticated = true

                cacheService.set(`user_${user.id}`, profile, 3600000)
                return profile
            } catch (error) {
                // Handle session missing error gracefully
                if (error?.message?.includes('Auth session missing') || 
                    error?.message?.includes('session') ||
                    error?.status === 401) {
                    console.log('No auth session, user not logged in')
                    this.isAuthenticated = false
                    this.user = null
                    this.profile = null
                    this.role = null
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
                if (profile) {
                    cacheService.set(`user_${this.user.id}`, profile, 3600000)
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
                cacheService.set(`user_${this.user.id}`, this.profile, 3600000)
                
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