import api from './axios'

export const getMyInvoices       = (params) => api.get('/invoices', { params })
export const getInvoice          = (id)     => api.get(`/invoices/${id}`)
export const getInvoiceByBooking = (bid)    => api.get(`/invoices/booking/${bid}`)

// Admin
export const getAllInvoices = (params) => api.get('/invoices/all', { params })
