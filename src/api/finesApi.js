import api from './axios'

export const getMyFines       = (params)   => api.get('/fines/my', { params })
export const getFine          = (id)       => api.get(`/fines/${id}`)
export const getFineByBooking = (bid)      => api.get(`/fines/booking/${bid}`)
export const payFine          = (id, data) => api.patch(`/fines/${id}/pay`, data)

// Admin
export const getAllFines  = (params) => api.get('/fines', { params })
export const waiveFine    = (id)     => api.patch(`/fines/${id}/waive`)
