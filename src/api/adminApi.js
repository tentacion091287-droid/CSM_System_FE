import api from './axios'

export const getUsers         = (params) => api.get('/admin/users', { params })
export const getUser          = (id)     => api.get(`/admin/users/${id}`)
export const updateUserStatus = (id)     => api.patch(`/admin/users/${id}/activate`)
export const updateUserRole   = (id, data) => api.patch(`/admin/users/${id}/role`, data)
