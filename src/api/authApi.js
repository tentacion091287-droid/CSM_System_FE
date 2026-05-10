import api from './axios'

export const login          = (credentials) => api.post('/auth/login', credentials)
export const register       = (data)        => api.post('/auth/register', data)
export const logoutApi      = ()            => api.post('/auth/logout')
export const getProfile     = ()            => api.get('/users/me')
export const updateProfile  = (data)        => api.put('/users/me', data)
export const changePassword = (data)        => api.post('/auth/change-password', data)
