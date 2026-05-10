import api from './axios'

export const getMyFines       = (params)    => api.get('/fines', { params })
export const getFine          = (id)        => api.get(`/fines/${id}`)
export const getFineByBooking = (bid)       => api.get(`/fines/booking/${bid}`)
export const payFine          = (id, data)  => api.post(`/fines/${id}/pay`, data)
