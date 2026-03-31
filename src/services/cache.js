class CacheService {
    constructor() {
        this.cache = new Map()
        this.ttl = 5 * 60 * 1000 // 5 minutes default
    }

    set(key, data, customTtl = null) {
        const expiry = Date.now() + (customTtl || this.ttl)
        this.cache.set(key, { data, expiry })
    }

    get(key) {
        const item = this.cache.get(key)
        if (!item) return null
        if (Date.now() > item.expiry) {
            this.cache.delete(key)
            return null
        }
        return item.data
    }

    clear() {
        this.cache.clear()
    }

    remove(key) {
        this.cache.delete(key)
    }

    // Generate cache key from query
    generateKey(table, filters = {}) {
        return `${table}:${JSON.stringify(filters)}`
    }
}

export const cacheService = new CacheService()