import api from './axios'

export const getUsers         = (params)   => api.get('/users', { params })
export const getUser          = (id)       => api.get(`/users/${id}`)
export const updateUserStatus = (id, data) => api.patch(`/users/${id}/status`, data)
export const updateUserRole   = (id, data) => api.patch(`/users/${id}/role`, data)
