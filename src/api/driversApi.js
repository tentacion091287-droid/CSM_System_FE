import api from './axios'

export const getDrivers              = (params)   => api.get('/drivers', { params })
export const getDriver               = (id)       => api.get(`/drivers/${id}`)
export const createDriver            = (data)     => api.post('/drivers', data)
export const updateDriver            = (id, data) => api.put(`/drivers/${id}`, data)
export const deleteDriver            = (id)       => api.delete(`/drivers/${id}`)
export const toggleDriverAvailability = (id, data) => api.patch(`/drivers/${id}/availability`, data)
export const rateDriver              = (data)     => api.post('/drivers/ratings', data)
