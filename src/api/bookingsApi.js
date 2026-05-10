import api from './axios'

export const createBooking   = (data)      => api.post('/bookings', data)
export const getMyBookings   = (params)    => api.get('/bookings', { params })
export const getBooking      = (id)        => api.get(`/bookings/${id}`)
export const updateBooking   = (id, data)  => api.put(`/bookings/${id}`, data)
export const cancelBooking   = (id)        => api.patch(`/bookings/${id}/cancel`)
export const getHistory      = (params)    => api.get('/bookings/history', { params })
export const getInvoiceByBooking = (bid)   => api.get(`/invoices/booking/${bid}`)
export const getFineByBooking    = (bid)   => api.get(`/fines/booking/${bid}`)
