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

// Custom fetch wrapper for retry logic (not overriding internal methods)
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

// Add a helper method for authenticated requests with retry
export const supabaseWithRetry = {
    ...supabase,
    
    async query(table, query = {}) {
        const session = await supabase.auth.getSession()
        const accessToken = session.data.session?.access_token
        
        const url = `${supabaseUrl}/rest/v1/${table}?${new URLSearchParams(query).toString()}`
        const options = {
            method: 'GET',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        
        return fetchWithRetry(url, options)
    },
    
    async insert(table, data) {
        const session = await supabase.auth.getSession()
        const accessToken = session.data.session?.access_token
        
        const url = `${supabaseUrl}/rest/v1/${table}`
        const options = {
            method: 'POST',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        }
        
        return fetchWithRetry(url, options)
    },
    
    async update(table, id, data) {
        const session = await supabase.auth.getSession()
        const accessToken = session.data.session?.access_token
        
        const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`
        const options = {
            method: 'PATCH',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        }
        
        return fetchWithRetry(url, options)
    },
    
    async delete(table, id) {
        const session = await supabase.auth.getSession()
        const accessToken = session.data.session?.access_token
        
        const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`
        const options = {
            method: 'DELETE',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${accessToken}`
            }
        }
        
        return fetchWithRetry(url, options)
    }
}