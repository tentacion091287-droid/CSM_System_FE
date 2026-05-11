# Rydr — Drive Different (CSM System Frontend)

Car Rental & Service Management System — React frontend for customers and admins.

## Overview

Rydr is a full-featured car rental web application with two distinct experiences:
- **Customers** — browse vehicles, create bookings, make payments, view invoices, pay fines, and rate drivers
- **Admins** — manage the entire fleet, driver pool, booking lifecycle, payments, maintenance, and users

The UI is built with a dark glassmorphism aesthetic using React 18 and Tailwind CSS, backed by the [CSM System REST API](../CSM_System_BE/README.md).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3 |
| Build Tool | Vite 5.3 |
| Routing | React Router DOM 6 |
| State | Redux Toolkit + Context API |
| Styling | Tailwind CSS 3.4 |
| Forms | React Hook Form 7 + Zod |
| HTTP | Axios (with JWT interceptors) |
| Charts | Recharts 2 |
| Date utils | date-fns 3 |

## Project Structure

```
CSM_System_FE/
├── src/
│   ├── api/            # Axios instance + one module per backend resource
│   ├── components/
│   │   ├── common/     # ProtectedRoute, AdminRoute, Spinner, Pagination, etc.
│   │   ├── layout/     # Navbar, Sidebar, Footer
│   │   ├── bookings/   # BookingCard, BookingStatusStepper
│   │   ├── vehicles/   # VehicleCard, VehicleFilter
│   │   └── dashboard/  # StatCard, RevenueChart, VehicleStatusChart
│   ├── pages/
│   │   ├── public/     # Home, VehicleList, VehicleDetail, Login, Register
│   │   ├── customer/   # Dashboard, Bookings, Payments, Invoices, Fines, Profile
│   │   └── admin/      # Dashboard, Vehicles, Bookings, Drivers, Payments, …
│   ├── store/          # Redux store + authSlice
│   ├── hooks/          # useAuth, useBookings, useDashboard, useVehicles
│   ├── context/        # ToastContext (success/error/info notifications)
│   ├── constants/      # Enums, status colors, UI configs
│   ├── utils/          # Date/currency formatters
│   ├── App.jsx         # Route definitions
│   └── main.jsx        # React root + Redux Provider
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- CSM System backend running (local or Render)

### Local Setup

```bash
# Clone the repo
git clone <repo-url>
cd CSM_System_FE

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# Start the dev server
npm run dev
# App runs at http://localhost:5173
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (e.g. `http://localhost:8000/api/v1`) |

For production, set `VITE_API_URL` to your Render backend URL before building.

### Build for Production

```bash
npm run build       # Outputs optimized bundle to /dist
npm run preview     # Serve the /dist build locally to verify
```

## Pages & Routes

### Public (no login required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page — stats, features, vehicle showcase, testimonials |
| `/vehicles` | VehicleList | Browse & filter all available vehicles |
| `/vehicles/:id` | VehicleDetail | Single vehicle details |
| `/login` | Login | Customer & admin login |
| `/register` | Register | New customer registration |

### Customer (requires login)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | CustomerDashboard | Active rentals, upcoming bookings, outstanding fines |
| `/book/:vehicleId` | BookVehicle | Create a new booking |
| `/bookings` | MyBookings | All bookings with status filter |
| `/bookings/history` | RentalHistory | Completed & cancelled bookings |
| `/bookings/:id` | BookingDetail | Full booking info |
| `/bookings/:id/edit` | EditBooking | Modify a pending booking |
| `/payments` | MyPayments | Payment history |
| `/payments/:bookingId/pay` | PaymentPage | Complete a payment (card / UPI / bank / cash) |
| `/invoices` | MyInvoices | Invoice list |
| `/invoices/:id` | InvoiceDetail | Invoice breakdown |
| `/fines` | MyFines | Outstanding and paid fines |
| `/rate/:bookingId` | RateDriver | Submit a 1–5 star driver rating after rental |
| `/profile` | Profile | Edit name, phone, password |

### Admin (requires login + admin role)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboard | KPI stats, revenue chart, vehicle status chart |
| `/admin/vehicles` | VehicleManage | Fleet list — add, edit, delete, change status |
| `/admin/vehicles/new` | VehicleForm | Add a vehicle |
| `/admin/vehicles/:id/edit` | VehicleForm | Edit vehicle details |
| `/admin/bookings` | BookingManage | All bookings — approve, reject, activate, complete |
| `/admin/bookings/:id` | AdminBookingDetail | Booking detail + status actions + driver assign |
| `/admin/drivers` | DriverManage | Driver list — add, edit, toggle availability |
| `/admin/drivers/new` | DriverForm | Add a driver |
| `/admin/drivers/:id/edit` | DriverForm | Edit driver info |
| `/admin/payments` | PaymentManage | Process pending payments, issue refunds |
| `/admin/invoices` | InvoiceManage | View all invoices |
| `/admin/fines` | FineManage | Waive or track fines |
| `/admin/maintenance` | MaintenanceManage | Maintenance record list |
| `/admin/maintenance/new` | MaintenanceForm | Schedule maintenance |
| `/admin/maintenance/:id/edit` | MaintenanceForm | Edit maintenance record |
| `/admin/users` | UserManage | Activate/deactivate accounts, change roles |

## Authentication

Login returns a JWT that is stored in `localStorage` and automatically attached to every API request via an Axios request interceptor. A 401 response clears the token and redirects to `/login`.

Route protection:
- `<ProtectedRoute>` — redirects unauthenticated users to `/login`
- `<AdminRoute>` — additionally checks `user.role === "admin"`, redirects otherwise

## State Management

| Concern | Solution |
|---------|---------|
| Auth (user, token) | Redux Toolkit (`authSlice`) + localStorage persistence |
| Toast notifications | React Context (`ToastContext`) — auto-dismiss after 4.5s |
| Server data | Local component state + custom hooks (`useVehicles`, `useBookings`, etc.) |

## API Layer

Each backend resource has its own module in `src/api/`:

| Module | Covers |
|--------|--------|
| `authApi.js` | Login, register, profile, password change |
| `vehiclesApi.js` | Vehicle CRUD, status update |
| `bookingsApi.js` | Create/edit/cancel, admin lifecycle actions |
| `paymentsApi.js` | Initiate, process, refund |
| `invoicesApi.js` | Fetch by id / list |
| `finesApi.js` | List, pay, waive |
| `driversApi.js` | Driver CRUD, availability, ratings |
| `maintenanceApi.js` | Schedule, complete, cancel |
| `adminApi.js` | Dashboard statistics |

All modules use the shared `axios.js` instance which injects the Bearer token on every request.

## Design System

The app uses a dark theme (`#0a0a1a` background) with glassmorphism cards and violet → fuchsia → cyan gradient accents.

**Custom Tailwind utilities (`index.css`):**

| Class | Effect |
|-------|--------|
| `.gradient-text` | Animated gradient text fill |
| `.glass` | Frosted glass card (`backdrop-blur`) |
| `.glass-dark` | Darker glass variant |
| `.btn-gradient` | Gradient button with hover scale |
| `.input-exotic` | Dark-themed styled input |
| `.card-glow` | Glow effect on hover |

Custom animations defined in `tailwind.config.js`: `gradient-shift`, `float`, `glow-pulse`, `slide-up`, `fade-in`, `shimmer`, `blob`.

## Backend

This frontend requires the [CSM System Backend](../CSM_System_BE/README.md) (FastAPI + PostgreSQL).

Backend repo: `CSM_System_BE`
Default local URL: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`
