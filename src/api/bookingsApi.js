import api from './axios'

export const createBooking   = (data)      => api.post('/bookings', data)
export const getMyBookings   = (params)    => api.get('/bookings', { params })
export const getBooking      = (id)        => api.get(`/bookings/${id}`)
export const updateBooking   = (id, data)  => api.put(`/bookings/${id}`, data)
export const cancelBooking   = (id)        => api.delete(`/bookings/${id}`)
export const getHistory      = (params)    => api.get('/bookings/history', { params })
export const getInvoiceByBooking = (bid)   => api.get(`/invoices/booking/${bid}`)
export const getFineByBooking    = (bid)   => api.get(`/fines/booking/${bid}`)

// Admin booking actions
export const getAllBookings   = (params)   => api.get('/bookings', { params })
export const approveBooking  = (id)       => api.patch(`/bookings/${id}/approve`)
export const rejectBooking   = (id, data) => api.patch(`/bookings/${id}/reject`, data)
export const activateBooking = (id, data) => api.patch(`/bookings/${id}/activate`, data)
export const completeBooking = (id, data) => api.patch(`/bookings/${id}/complete`, data)
export const assignDriver    = (id, data) => api.patch(`/bookings/${id}/assign-driver`, data)
