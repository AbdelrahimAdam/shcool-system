import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const login = async (email, password) => {
    return await authStore.login(email, password)
  }

  const logout = async () => {
    return await authStore.logout()
  }

  const hasPermission = (permission) => {
    return authStore.hasPermission(permission)
  }

  return {
    user: authStore.user,
    profile: authStore.profile,
    isAuthenticated: authStore.isAuthenticated,
    role: authStore.role,
    isSuperAdmin: authStore.isSuperAdmin,
    isAdmin: authStore.isAdmin,
    isTeacher: authStore.isTeacher,
    isAccountant: authStore.isAccountant,
    login,
    logout,
    hasPermission
  }
}