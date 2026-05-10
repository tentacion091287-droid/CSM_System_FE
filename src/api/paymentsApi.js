import api from './axios'

export const createPayment  = (data)   => api.post('/payments', data)
export const getMyPayments  = (params) => api.get('/payments', { params })
export const getPayment     = (id)     => api.get(`/payments/${id}`)

// Admin
export const getAllPayments  = (params) => api.get('/payments/all', { params })
export const verifyPayment   = (id)    => api.patch(`/payments/${id}/verify`)
