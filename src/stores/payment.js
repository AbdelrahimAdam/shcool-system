import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import { cacheService } from '../services/cache'
import { useAuthStore } from './auth'

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        payments: [],
        currentPayment: null,
        totalCount: 0,
        isLoading: false,
        pendingApprovals: 0,
        totalRevenue: 0
    }),

    actions: {
        // Simplified bucket check - just try to use it
        async ensureBucketExists() {
            try {
                // Try a simple list operation to verify bucket exists
                const { data, error } = await supabase.storage
                    .from('payment-proofs')
                    .list('', { limit: 1 })
                
                if (error) {
                    console.log('Bucket check returned error, but will try upload anyway:', error.message)
                    return false
                }
                
                console.log('Bucket "payment-proofs" is accessible')
                return true
            } catch (error) {
                console.log('Bucket check error, will try upload anyway:', error.message)
                return false
            }
        },

        // Generate unique payment number
        generatePaymentNumber() {
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const datePart = `${year}${month}${day}`
            const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
            return `PAY-${datePart}-${randomPart}`
        },

        async fetchPayments(page = 1, filters = {}) {
            this.isLoading = true
            const authStore = useAuthStore()
            
            try {
                let query = supabase
                    .from('payments')
                    .select('*, student:students(full_name, student_number)', { count: 'exact' })
                    .eq('school_id', authStore.profile?.school_id)
                    .range((page - 1) * 20, page * 20 - 1)
                    .order('created_at', { ascending: false })

                if (filters.status) {
                    query = query.eq('status', filters.status)
                }
                if (filters.student_id) {
                    query = query.eq('student_id', filters.student_id)
                }
                if (filters.payment_method) {
                    query = query.eq('payment_method', filters.payment_method)
                }

                const { data, error, count } = await query

                if (error) throw error

                this.payments = data
                this.totalCount = count || 0
                this.pendingApprovals = data.filter(p => p.status === 'pending').length
                
                return { data, count }
            } catch (error) {
                console.error('Fetch payments error:', error)
                return { data: [], count: 0 }
            } finally {
                this.isLoading = false
            }
        },

        async createPayment(paymentData, proofFile = null) {
            this.isLoading = true
            try {
                const authStore = useAuthStore()
                let proofUrl = null

                // Upload proof image if provided - try upload, don't block on bucket check
                if (proofFile) {
                    const fileExt = proofFile.name.split('.').pop()
                    const fileName = `payment_proof_${Date.now()}.${fileExt}`
                    const schoolId = authStore.profile?.school_id
                    
                    if (schoolId) {
                        // Use simple filename without folder structure
                        const filePath = fileName

                        console.log('Attempting to upload file:', filePath)

                        try {
                            const { data: uploadData, error: uploadError } = await supabase.storage
                                .from('payment-proofs')
                                .upload(filePath, proofFile, {
                                    cacheControl: '3600',
                                    upsert: false
                                })

                            if (!uploadError && uploadData) {
                                const { data: { publicUrl } } = supabase.storage
                                    .from('payment-proofs')
                                    .getPublicUrl(filePath)

                                proofUrl = publicUrl
                                console.log('File uploaded successfully, URL:', proofUrl)
                            } else {
                                console.error('Upload error:', uploadError?.message || 'Unknown error')
                                // Don't throw - continue with payment creation without image
                            }
                        } catch (uploadErr) {
                            console.error('Upload exception:', uploadErr.message)
                            // Continue without image
                        }
                    }
                }

                // Generate payment number
                const paymentNumber = this.generatePaymentNumber()

                // Prepare the insert data
                const insertData = {
                    student_id: paymentData.student_id,
                    amount: parseFloat(paymentData.amount),
                    payment_type: paymentData.payment_type,
                    payment_method: paymentData.payment_method,
                    due_date: paymentData.due_date,
                    bankak_number: paymentData.bankak_number || null,
                    notes: paymentData.notes || null,
                    payment_number: paymentNumber,
                    school_id: authStore.profile?.school_id,
                    proof_image_url: proofUrl,
                    created_by: authStore.user?.id,
                    status: 'pending'
                }

                console.log('Inserting payment:', insertData)

                // Create payment record
                const { data, error } = await supabase
                    .from('payments')
                    .insert([insertData])
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                
                return { success: true, data }
            } catch (error) {
                console.error('Create payment error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async getPaymentById(id) {
            this.isLoading = true
            try {
                const cached = cacheService.get(`payment_${id}`)
                if (cached) {
                    this.currentPayment = cached
                    return cached
                }

                const { data, error } = await supabase
                    .from('payments')
                    .select('*, student:students(full_name, student_number)')
                    .eq('id', id)
                    .single()

                if (error) throw error

                this.currentPayment = data
                cacheService.set(`payment_${id}`, data)
                return data
            } catch (error) {
                console.error('Get payment error:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        async approvePayment(paymentId, approved = true) {
            this.isLoading = true
            try {
                const authStore = useAuthStore()
                
                const { data, error } = await supabase
                    .from('payments')
                    .update({
                        status: approved ? 'approved' : 'rejected',
                        approved_by: authStore.user?.id,
                        approved_at: new Date().toISOString()
                    })
                    .eq('id', paymentId)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                
                return { success: true, data }
            } catch (error) {
                console.error('Approve payment error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async updatePayment(id, updates) {
            this.isLoading = true
            try {
                const { payment_number, ...safeUpdates } = updates
                
                const { data, error } = await supabase
                    .from('payments')
                    .update(safeUpdates)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Update payment error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async deletePayment(id) {
            this.isLoading = true
            try {
                const { error } = await supabase
                    .from('payments')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                cacheService.clear()
                return { success: true }
            } catch (error) {
                console.error('Delete payment error:', error)
                return { success: false, error: error.message }
            } finally {
                this.isLoading = false
            }
        },

        async getRevenueStats() {
            const authStore = useAuthStore()
            
            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('amount, status, payment_method')
                    .eq('school_id', authStore.profile?.school_id)
                    .eq('status', 'approved')

                if (error) throw error

                const total = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                const byMethod = {
                    bankak: data?.filter(p => p.payment_method === 'bankak').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                    cash: data?.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                }

                this.totalRevenue = total
                
                return { total, byMethod }
            } catch (error) {
                console.error('Get revenue stats error:', error)
                return { total: 0, byMethod: { bankak: 0, cash: 0 } }
            }
        }
    }
})