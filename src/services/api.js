import { supabase } from './supabase'
import { cacheService } from './cache'
import { offlineService } from './offline'

export const api = {
  async get(table, query = {}, options = {}) {
    const cacheKey = cacheService.generateKey(table, query)
    const cached = cacheService.get(cacheKey)
    if (cached && !options.skipCache) return cached

    let supabaseQuery = supabase.from(table).select(query.select || '*')
    if (query.filters) supabaseQuery = supabaseQuery.match(query.filters)
    if (query.range) supabaseQuery = supabaseQuery.range(query.range[0], query.range[1])
    if (query.order) supabaseQuery = supabaseQuery.order(query.order.field, { ascending: query.order.ascending })

    const { data, error, count } = await supabaseQuery
    if (error) throw error

    cacheService.set(cacheKey, { data, count })
    return { data, count }
  },

  async post(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select()
    if (error) throw error
    cacheService.clear()
    return data
  },

  async put(table, id, payload) {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select()
    if (error) throw error
    cacheService.clear()
    return data
  },

  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
    cacheService.clear()
  },

  // For offline capable requests
  async postOffline(table, payload) {
    if (!navigator.onLine) {
      await offlineService.addPendingRequest({
        url: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${table}`,
        method: 'POST',
        data: payload,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      return { offline: true }
    }
    return this.post(table, payload)
  }
}