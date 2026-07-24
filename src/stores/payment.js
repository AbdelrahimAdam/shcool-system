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
        totalRevenue: 0,
        parentRequests: 0,
        schoolBankakDetails: null // New state for school Bankak details
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

        // Generate payment number for parent requests
        generatePaymentRequestNumber() {
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const datePart = `${year}${month}${day}`
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
            return `REQ-${datePart}-${randomPart}`
        },

        // ============================================
        // NEW: Bankak Details Methods
        // ============================================

        // Get school Bankak details
        async getSchoolBankakDetails() {
            const authStore = useAuthStore()
            const schoolId = authStore.profile?.school_id || authStore.schoolId

            if (!schoolId) {
                console.log('❌ No school ID found for Bankak details')
                this.schoolBankakDetails = null
                return null
            }

            try {
                console.log('🔍 Fetching Bankak details for school:', schoolId)

                const { data, error } = await supabase
                    .from('schools')
                    .select('bankak_account_number, bankak_account_name, bankak_phone, bankak_reference_prefix')
                    .eq('id', schoolId)
                    .single()

                if (error) {
                    console.error('❌ Error fetching Bankak details:', error)
                    this.schoolBankakDetails = null
                    return null
                }

                console.log('📊 Bankak details from DB:', data)

                if (data && data.bankak_account_number && data.bankak_account_name) {
                    this.schoolBankakDetails = {
                        accountNumber: data.bankak_account_number,
                        accountName: data.bankak_account_name,
                        phone: data.bankak_phone || '',
                        reference: data.bankak_reference_prefix 
                            ? `${data.bankak_reference_prefix}-${new Date().getFullYear()}`
                            : '',
                        isConfigured: true
                    }
                } else {
                    this.schoolBankakDetails = {
                        isConfigured: false,
                        accountNumber: null,
                        accountName: null,
                        phone: null,
                        reference: null
                    }
                }

                return this.schoolBankakDetails
            } catch (error) {
                console.error('❌ Error in getSchoolBankakDetails:', error)
                this.schoolBankakDetails = null
                return null
            }
        },

        // Check if school has Bankak details configured
        async hasBankakDetails() {
            const details = await this.getSchoolBankakDetails()
            return details?.isConfigured === true
        },

        // Get Bankak details from cache or fetch fresh
        async getBankakDetailsCached() {
            if (this.schoolBankakDetails) {
                return this.schoolBankakDetails
            }
            return await this.getSchoolBankakDetails()
        },

        // Clear cached Bankak details
        clearBankakCache() {
            this.schoolBankakDetails = null
        },

        // ============================================
        // End of Bankak Details Methods
        // ============================================

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
                if (filters.is_parent_request) {
                    if (filters.is_parent_request === true) {
                        query = query.not('created_by', 'is', null)
                    } else {
                        query = query.is('created_by', null)
                    }
                }

                const { data, error, count } = await query

                if (error) throw error

                this.payments = data
                this.totalCount = count || 0
                this.pendingApprovals = data.filter(p => p.status === 'pending').length
                this.parentRequests = data.filter(p => p.created_by && p.status === 'pending').length

                return { data, count }
            } catch (error) {
                console.error('Fetch payments error:', error)
                return { data: [], count: 0 }
            } finally {
                this.isLoading = false
            }
        },

        // Get parent-initiated payment requests
        async getParentPaymentRequests() {
            const authStore = useAuthStore()

            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*, student:students(full_name, student_number, class:classes(name))')
                    .eq('school_id', authStore.profile?.school_id)
                    .eq('status', 'pending')
                    .not('created_by', 'is', null)
                    .order('created_at', { ascending: false })

                if (error) throw error

                this.parentRequests = data?.length || 0
                return { success: true, data }
            } catch (error) {
                console.error('Get parent requests error:', error)
                return { success: false, error: error.message }
            }
        },

        // Mark payment as received by admin
        async markPaymentAsReceived(paymentId) {
            const authStore = useAuthStore()

            try {
                const { data, error } = await supabase
                    .from('payments')
                    .update({
                        status: 'processing',
                        payment_date: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        notes: `Payment received by admin ${authStore.user?.email} on ${new Date().toLocaleDateString()}`
                    })
                    .eq('id', paymentId)
                    .select()
                    .single()

                if (error) throw error

                cacheService.clear()
                return { success: true, data }
            } catch (error) {
                console.error('Mark payment received error:', error)
                return { success: false, error: error.message }
            }
        },

        // Create payment request from parent
        async createParentPaymentRequest(paymentData) {
            this.isLoading = true
            try {
                const authStore = useAuthStore()

                // First, check if Bankak details exist
                const hasBankak = await this.hasBankakDetails()
                if (!hasBankak) {
                    return { 
                        success: false, 
                        error: 'Bankak details are not configured. Please contact the school administration.' 
                    }
                }

                // Generate payment number
                const paymentNumber = this.generatePaymentRequestNumber()

                // Prepare the insert data
                const insertData = {
                    student_id: paymentData.student_id,
                    amount: parseFloat(paymentData.amount),
                    payment_type: paymentData.payment_type || 'tuition',
                    payment_method: paymentData.payment_method || 'bankak',
                    due_date: new Date().toISOString().split('T')[0],
                    bankak_number: paymentData.bankak_number || null,
                    notes: paymentData.notes || `Payment requested by parent ${authStore.user?.email}`,
                    payment_number: paymentNumber,
                    school_id: authStore.profile?.school_id || authStore.schoolId,
                    created_by: authStore.user?.id,
                    status: 'pending'
                }

                console.log('📝 Creating parent payment request:', insertData)

                const { data, error } = await supabase
                    .from('payments')
                    .insert([insertData])
                    .select()
                    .single()

                if (error) {
                    console.error('❌ Supabase error:', error)
                    throw error
                }

                console.log('✅ Payment request created successfully:', data)

                cacheService.clear()
                // Add to local state
                this.payments.unshift(data)

                return { success: true, data }
            } catch (error) {
                console.error('❌ Create parent payment request error:', error)
                return { success: false, error: error.message }
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
                // Add to local state
                this.payments.unshift(data)

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

        // Get comprehensive payment statistics
        async getPaymentStats() {
            const authStore = useAuthStore()

            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('status, amount, payment_method, created_by')
                    .eq('school_id', authStore.profile?.school_id)

                if (error) throw error

                const total = data?.length || 0
                const pending = data?.filter(p => p.status === 'pending').length || 0
                const approved = data?.filter(p => p.status === 'approved').length || 0
                const rejected = data?.filter(p => p.status === 'rejected').length || 0
                const processing = data?.filter(p => p.status === 'processing').length || 0
                const parentRequests = data?.filter(p => p.created_by && p.status === 'pending').length || 0
                const totalRevenue = data?.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0) || 0

                this.pendingApprovals = pending
                this.parentRequests = parentRequests
                this.totalRevenue = totalRevenue

                return {
                    total,
                    pending,
                    approved,
                    rejected,
                    processing,
                    parentRequests,
                    totalRevenue,
                    byMethod: {
                        bankak: data?.filter(p => p.payment_method === 'bankak' && p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                        cash: data?.filter(p => p.payment_method === 'cash' && p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                    },
                    byStatus: {
                        pending: data?.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                        processing: data?.filter(p => p.status === 'processing').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                        approved: data?.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
                        rejected: data?.filter(p => p.status === 'rejected').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                    }
                }
            } catch (error) {
                console.error('Get payment stats error:', error)
                return null
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
        },

        // Get payments for a specific student
        async getStudentPayments(studentId) {
            const authStore = useAuthStore()

            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('school_id', authStore.profile?.school_id)
                    .eq('student_id', studentId)
                    .order('created_at', { ascending: false })

                if (error) throw error

                return { success: true, data }
            } catch (error) {
                console.error('Get student payments error:', error)
                return { success: false, error: error.message }
            }
        },

        // Get payment summary for a student
        async getStudentPaymentSummary(studentId) {
            const result = await this.getStudentPayments(studentId)
            if (!result.success) return result

            const payments = result.data || []
            const totalPaid = payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0)
            const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0)

            return {
                success: true,
                totalPaid,
                pendingAmount,
                totalPayments: payments.length,
                payments
            }
        }
    }
})