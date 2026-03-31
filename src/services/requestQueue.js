class RequestQueue {
  constructor() {
    this.queue = []
    this.isProcessing = false
  }

  add(request) {
    this.queue.push(request)
    this.process()
  }

  async process() {
    if (this.isProcessing) return
    this.isProcessing = true

    while (this.queue.length > 0) {
      const request = this.queue.shift()
      try {
        await this.executeRequest(request)
      } catch (error) {
        console.error('Request failed:', error)
        // Re-queue for later
        setTimeout(() => this.add(request), 5000)
      }
    }

    this.isProcessing = false
  }

  async executeRequest(request) {
    const { method, url, data } = request
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) throw new Error('Request failed')
    return response.json()
  }
}

export const requestQueue = new RequestQueue()