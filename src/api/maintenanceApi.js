import api from './axios'

export const getMaintenances     = (params)   => api.get('/maintenance', { params })
export const getMaintenance      = (id)       => api.get(`/maintenance/${id}`)
export const createMaintenance   = (data)     => api.post('/maintenance', data)
export const updateMaintenance   = (id, data) => api.put(`/maintenance/${id}`, data)
export const deleteMaintenance   = (id)       => api.delete(`/maintenance/${id}`)
export const completeMaintenance = (id, data) => api.patch(`/maintenance/${id}/complete`, data)
export const cancelMaintenance   = (id)       => api.patch(`/maintenance/${id}/cancel`)
