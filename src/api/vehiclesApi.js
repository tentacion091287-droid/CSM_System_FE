import api from './axios'

export const getVehicles = (params) => api.get('/vehicles', { params })
export const getVehicle = (id) => api.get(`/vehicles/${id}`)
