import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the base client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    global: {
        headers: { 'x-application-name': 'school-management' }
    },
    db: {
        schema: 'public'
    },
    realtime: {
        params: {
            eventsPerSecond: 2 // Limit for low bandwidth
        }
    }
})

// Custom fetch wrapper for retry logic
const fetchWithRetry = async (url, options, retries = 3) => {
    let lastError
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return await response.json()
        } catch (error) {
            lastError = error
            if (i === retries - 1) throw error
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
    }
    
    throw lastError
}

// Helper function to get access token safely
const getAccessToken = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token || null
    } catch (error) {
        console.error('Error getting access token:', error)
        return null
    }
}

// Helper function to build headers with auth
const buildAuthHeaders = async (additionalHeaders = {}) => {
    const accessToken = await getAccessToken()
    const headers = {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
        ...additionalHeaders
    }
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }
    
    return headers
}

// Add a helper method for authenticated requests with retry
export const supabaseWithRetry = {
    ...supabase,
    
    async query(table, query = {}) {
        const url = `${supabaseUrl}/rest/v1/${table}?${new URLSearchParams(query).toString()}`
        const headers = await buildAuthHeaders()
        
        const options = {
            method: 'GET',
            headers
        }
        
        return fetchWithRetry(url, options)
    },
    
    async insert(table, data) {
        const url = `${supabaseUrl}/rest/v1/${table}`
        const headers = await buildAuthHeaders({
            'Prefer': 'return=representation'
        })
        
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }
        
        return fetchWithRetry(url, options)
    },
    
    async update(table, id, data) {
        const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`
        const headers = await buildAuthHeaders({
            'Prefer': 'return=representation'
        })
        
        const options = {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        }
        
        return fetchWithRetry(url, options)
    },
    
    async delete(table, id) {
        const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`
        const headers = await buildAuthHeaders()
        
        const options = {
            method: 'DELETE',
            headers
        }
        
        return fetchWithRetry(url, options)
    },
    
    // New helper method for making authenticated requests with proper error handling
    async request(method, table, options = {}) {
        const url = `${supabaseUrl}/rest/v1/${table}${options.params ? `?${new URLSearchParams(options.params).toString()}` : ''}`
        const headers = await buildAuthHeaders(options.headers)
        
        const fetchOptions = {
            method,
            headers,
            ...(options.body && { body: JSON.stringify(options.body) })
        }
        
        return fetchWithRetry(url, fetchOptions)
    },
    
    // Helper to check if user is authenticated
    async isAuthenticated() {
        const accessToken = await getAccessToken()
        return !!accessToken
    }
}

// Also export the getAccessToken helper for use elsewhere if needed
export const getAuthToken = getAccessToken