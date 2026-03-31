class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine
    this.pendingRequests = []
    this.initListeners()
  }
  
  initListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processPendingRequests()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }
  
  async addPendingRequest(request) {
    this.pendingRequests.push({
      ...request,
      timestamp: Date.now(),
      retryCount: 0
    })
    
    // Store in IndexedDB for persistence
    await this.saveToIndexedDB(request)
  }
  
  async processPendingRequests() {
    while (this.pendingRequests.length > 0 && this.isOnline) {
      const request = this.pendingRequests.shift()
      try {
        await this.executeRequest(request)
      } catch (error) {
        console.error('Failed to process pending request:', error)
        if (request.retryCount < 3) {
          request.retryCount++
          this.pendingRequests.push(request)
        }
      }
    }
  }
  
  async executeRequest(request) {
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      },
      body: JSON.stringify(request.data)
    })
    
    if (!response.ok) throw new Error('Request failed')
    return response.json()
  }
  
  async saveToIndexedDB(request) {
    // Implementation for IndexedDB storage
    const db = await this.openDB()
    const tx = db.transaction(['pendingRequests'], 'readwrite')
    const store = tx.objectStore('pendingRequests')
    store.add(request)
    await tx.done
  }
  
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('OfflineDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        db.createObjectStore('pendingRequests', { autoIncrement: true })
      }
    })
  }
}

export const offlineService = new OfflineService()