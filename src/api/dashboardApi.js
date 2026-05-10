import api from './axios'

export const getStats               = ()     => api.get('/dashboard/stats')
export const getRevenue             = ()     => api.get('/dashboard/revenue')
export const getVehicleStatus       = ()     => api.get('/dashboard/vehicles/status')
export const getRecentBookings      = ()     => api.get('/dashboard/bookings/recent')
export const getPendingFines        = ()     => api.get('/dashboard/fines/pending')
export const getUpcomingMaintenance = ()     => api.get('/dashboard/maintenance/upcoming')
