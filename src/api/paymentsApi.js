import api from './axios'

export const createPayment  = (data)   => api.post('/payments', data)
export const getMyPayments  = (params) => api.get('/payments', { params })
export const getPayment     = (id)     => api.get(`/payments/${id}`)
