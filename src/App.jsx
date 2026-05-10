import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import Navbar from './components/layout/Navbar'

import Home from './pages/public/Home'
import VehicleList from './pages/public/VehicleList'
import VehicleDetail from './pages/public/VehicleDetail'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import CustomerDashboard from './pages/customer/CustomerDashboard'
import BookVehicle from './pages/customer/BookVehicle'
import MyBookings from './pages/customer/MyBookings'
import RentalHistory from './pages/customer/RentalHistory'
import BookingDetail from './pages/customer/BookingDetail'
import EditBooking from './pages/customer/EditBooking'
import MyPayments from './pages/customer/MyPayments'
import PaymentPage from './pages/customer/PaymentPage'
import MyInvoices from './pages/customer/MyInvoices'
import InvoiceDetail from './pages/customer/InvoiceDetail'
import MyFines from './pages/customer/MyFines'
import RateDriver from './pages/customer/RateDriver'
import Profile from './pages/customer/Profile'

import AdminDashboard from './pages/admin/AdminDashboard'
import VehicleManage from './pages/admin/vehicles/VehicleManage'
import VehicleForm from './pages/admin/vehicles/VehicleForm'
import BookingManage from './pages/admin/bookings/BookingManage'
import AdminBookingDetail from './pages/admin/bookings/BookingDetail'
import DriverManage from './pages/admin/drivers/DriverManage'
import DriverForm from './pages/admin/drivers/DriverForm'
import InvoiceManage from './pages/admin/invoices/InvoiceManage'
import PaymentManage from './pages/admin/payments/PaymentManage'
import FineManage from './pages/admin/fines/FineManage'
import MaintenanceManage from './pages/admin/maintenance/MaintenanceManage'
import MaintenanceForm from './pages/admin/maintenance/MaintenanceForm'
import UserManage from './pages/admin/users/UserManage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer — protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/book/:vehicleId" element={<BookVehicle />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/history" element={<RentalHistory />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/bookings/:id/edit" element={<EditBooking />} />
          <Route path="/payments" element={<MyPayments />} />
          <Route path="/payments/:bookingId/pay" element={<PaymentPage />} />
          <Route path="/invoices" element={<MyInvoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/fines" element={<MyFines />} />
          <Route path="/rate/:bookingId" element={<RateDriver />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin — protected + admin role */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<VehicleManage />} />
          <Route path="/admin/vehicles/new" element={<VehicleForm />} />
          <Route path="/admin/vehicles/:id/edit" element={<VehicleForm />} />
          <Route path="/admin/bookings" element={<BookingManage />} />
          <Route path="/admin/bookings/:id" element={<AdminBookingDetail />} />
          <Route path="/admin/drivers" element={<DriverManage />} />
          <Route path="/admin/drivers/new" element={<DriverForm />} />
          <Route path="/admin/drivers/:id/edit" element={<DriverForm />} />
          <Route path="/admin/invoices" element={<InvoiceManage />} />
          <Route path="/admin/payments" element={<PaymentManage />} />
          <Route path="/admin/fines" element={<FineManage />} />
          <Route path="/admin/maintenance" element={<MaintenanceManage />} />
          <Route path="/admin/maintenance/new" element={<MaintenanceForm />} />
          <Route path="/admin/maintenance/:id/edit" element={<MaintenanceForm />} />
          <Route path="/admin/users" element={<UserManage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
