// ─── Vehicle ─────────────────────────────────────────────────────────────────

export const VEHICLE_CATEGORIES = ['economy', 'compact', 'midsize', 'suv', 'luxury', 'van', 'truck']
export const VEHICLE_CATEGORIES_WITH_ALL = ['', ...VEHICLE_CATEGORIES]
export const VEHICLE_BROWSE_CATEGORIES   = ['', 'sedan', 'suv', 'luxury', 'sports', 'van', 'truck']
export const FUEL_TYPES    = ['petrol', 'diesel', 'electric', 'hybrid']
export const TRANSMISSIONS = ['automatic', 'manual']
export const VEHICLE_STATUSES = ['', 'available', 'rented', 'maintenance']

export const CATEGORY_GRADIENT = {
  sedan:  'from-blue-600 to-cyan-500',
  suv:    'from-emerald-600 to-teal-500',
  luxury: 'from-yellow-500 to-amber-400',
  sports: 'from-red-600 to-pink-500',
  van:    'from-violet-600 to-purple-500',
  truck:  'from-orange-600 to-amber-500',
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export const BOOKING_STATUSES    = ['', 'pending', 'approved', 'active', 'completed', 'cancelled', 'rejected']
export const BOOKING_STATUS_TABS = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled']
export const BOOKING_STEPS       = ['pending', 'approved', 'active', 'completed']
export const BOOKING_STEP_META   = {
  pending:   { label: 'Pending',   icon: '⏳' },
  approved:  { label: 'Approved',  icon: '✅' },
  active:    { label: 'Active',    icon: '🚗' },
  completed: { label: 'Completed', icon: '🏁' },
}

// ─── Payments ────────────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { id: 'card',          label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'upi',           label: 'UPI',                 icon: '📱', desc: 'GPay, PhonePe, Paytm'  },
  { id: 'bank_transfer', label: 'Bank Transfer',        icon: '🏦', desc: 'NEFT / IMPS / RTGS'    },
  { id: 'cash',          label: 'Cash',                 icon: '💵', desc: 'Pay at branch counter' },
]
export const PAYMENT_METHOD_ICON  = { card: '💳', upi: '📱', bank_transfer: '🏦', cash: '💵' }
export const PAYMENT_METHOD_LABEL = { card: 'Card', upi: 'UPI', bank_transfer: 'Bank Transfer', cash: 'Cash' }
export const PAYMENT_STATUSES     = ['', 'pending', 'verified', 'failed']

// ─── Fines ───────────────────────────────────────────────────────────────────

export const FINE_STATUSES = ['', 'pending', 'paid', 'waived']

// ─── Maintenance ─────────────────────────────────────────────────────────────

export const MAINTENANCE_STATUSES = ['', 'scheduled', 'in_progress', 'completed', 'cancelled']
export const MAINTENANCE_TYPES    = [
  'oil_change', 'tire_rotation', 'brake_inspection', 'full_service',
  'engine_check', 'ac_service', 'battery_replacement', 'other',
]

// ─── Ratings ─────────────────────────────────────────────────────────────────

export const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

// ─── Status Badge ────────────────────────────────────────────────────────────

export const STATUS_BADGE_CONFIG = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-500/15  border-yellow-500/30  text-yellow-400'  },
  approved:    { label: 'Approved',    bg: 'bg-blue-500/15    border-blue-500/30    text-blue-400'    },
  active:      { label: 'Active',      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  completed:   { label: 'Completed',   bg: 'bg-white/10       border-white/20       text-white/50'    },
  cancelled:   { label: 'Cancelled',   bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  rejected:    { label: 'Rejected',    bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  available:   { label: 'Available',   bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  rented:      { label: 'Rented',      bg: 'bg-violet-500/15  border-violet-500/30  text-violet-400'  },
  maintenance: { label: 'Maintenance', bg: 'bg-orange-500/15  border-orange-500/30  text-orange-400'  },
  paid:        { label: 'Paid',        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  unpaid:      { label: 'Unpaid',      bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  waived:      { label: 'Waived',      bg: 'bg-white/10       border-white/20       text-white/50'    },
  scheduled:   { label: 'Scheduled',   bg: 'bg-cyan-500/15    border-cyan-500/30    text-cyan-400'    },
  in_progress: { label: 'In Progress', bg: 'bg-amber-500/15   border-amber-500/30   text-amber-400'   },
  verified:    { label: 'Verified',    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  failed:      { label: 'Failed',      bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  inactive:    { label: 'Inactive',    bg: 'bg-white/10       border-white/20       text-white/40'    },
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const STAT_CARD_COLORS = {
  violet:  { from: 'from-violet-600',  to: 'to-fuchsia-600',  shadow: 'shadow-violet-500/30'  },
  emerald: { from: 'from-emerald-600', to: 'to-teal-500',     shadow: 'shadow-emerald-500/30' },
  blue:    { from: 'from-blue-600',    to: 'to-cyan-500',     shadow: 'shadow-blue-500/30'    },
  amber:   { from: 'from-amber-500',   to: 'to-yellow-500',   shadow: 'shadow-amber-500/30'   },
  red:     { from: 'from-red-600',     to: 'to-rose-500',     shadow: 'shadow-red-500/30'     },
  cyan:    { from: 'from-cyan-500',    to: 'to-sky-500',      shadow: 'shadow-cyan-500/30'    },
}

export const VEHICLE_STATUS_COLORS = {
  available:   '#10b981',
  rented:      '#8b5cf6',
  maintenance: '#f59e0b',
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

export const LABEL_CLS    = 'block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5'
export const INPUT_CLS    = 'input-exotic'
export const INPUT_CLS_SM = 'input-exotic text-sm py-2.5'

// ─── Home Page ───────────────────────────────────────────────────────────────

export const HOME_STATS = [
  { value: '500+', label: 'Vehicles',        icon: '🚗', color: 'from-violet-600 to-fuchsia-600' },
  { value: '10K+', label: 'Happy Customers', icon: '😎', color: 'from-cyan-600 to-blue-600'      },
  { value: '50+',  label: 'Cities Covered',  icon: '🌆', color: 'from-emerald-600 to-teal-600'   },
  { value: '4.9★', label: 'Avg Rating',      icon: '⚡', color: 'from-amber-500 to-orange-500'   },
]

export const HOME_BRANDS = [
  'BMW', 'Mercedes-Benz', 'Porsche', 'Ferrari', 'Audi', 'Tesla',
  'Lamborghini', 'Bentley', 'Rolls Royce', 'McLaren', 'Bugatti', 'Maserati',
  'BMW', 'Mercedes-Benz', 'Porsche', 'Ferrari', 'Audi', 'Tesla',
  'Lamborghini', 'Bentley', 'Rolls Royce', 'McLaren', 'Bugatti', 'Maserati',
]

export const HOME_HOW_IT_WORKS = [
  {
    step: '01', icon: '🔍',
    title: 'Browse the Fleet',
    desc: 'Scroll through hundreds of verified rides — city sedans to exotic supercars. Filter by vibe, price, and availability.',
    color: 'from-violet-600/20 to-fuchsia-600/20', border: 'border-violet-500/20',
  },
  {
    step: '02', icon: '📲',
    title: 'Book in 2 Minutes',
    desc: "Pick your dates, confirm availability, and lock it in. Instant confirmation, no paperwork, no BS.",
    color: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500/20',
  },
  {
    step: '03', icon: '🔑',
    title: 'Grab Keys & Go',
    desc: "Show up, verify ID, and you're out. Zero wait time. Pure vibe. Return when done — it's that easy.",
    color: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/20',
  },
]

// ─── Photo Strip (two opposing marquee rows) ─────────────────────────────────

const _STRIP = [
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=420&h=240&q=75', label: 'Porsche 911'    },
  { url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=420&h=240&q=75', label: 'Luxury Coupe'   },
  { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=420&h=240&q=75', label: 'Audi Executive' },
  { url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=420&h=240&q=75', label: 'Sports Edition' },
  { url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=420&h=240&q=75', label: 'Premium SUV'   },
  { url: 'https://images.unsplash.com/photo-1580273916550-2ea2d3ba0b72?auto=format&fit=crop&w=420&h=240&q=75', label: 'Night Cruiser' },
]
export const HOME_PHOTO_STRIP_ROW1 = [..._STRIP, ..._STRIP]
export const HOME_PHOTO_STRIP_ROW2 = [...[..._STRIP].reverse(), ...[..._STRIP].reverse()]

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const HOME_ACTIVITY = [
  '🚗 Arjun booked a Porsche 911 in Mumbai · 2m ago',
  '✨ Priya\'s rental received 5 stars in Delhi · 6m ago',
  '🔑 Karan picked up a Tesla Model S in Bangalore · 12m ago',
  '🚙 Riya booked a Range Rover in Pune · 17m ago',
  '⚡ Express booking confirmed in 47 seconds · 22m ago',
  '🎉 Sneha completed her first Rydr trip · 28m ago',
  '🏆 Milestone: 10,000th booking hit today · 35m ago',
  '🗺️ Fleet expanded to Jaipur & Chandigarh · 1h ago',
]

// ─── Bento Feature Cards ──────────────────────────────────────────────────────

export const HOME_FEATURES = [
  {
    icon: '⚡', title: 'Instant Booking', bg: '2min', wide: true,
    desc: 'Confirm your ride in under 2 minutes. No calls, no waiting — just pure speed.',
    color: 'from-violet-600/15 to-fuchsia-600/15', border: 'border-violet-500/20', accent: 'text-violet-400',
  },
  {
    icon: '✅', title: 'Verified Fleet', bg: null, wide: false,
    desc: 'Every vehicle is inspected and certified before it hits the road.',
    color: 'from-emerald-600/15 to-teal-600/15', border: 'border-emerald-500/20', accent: 'text-emerald-400',
  },
  {
    icon: '💬', title: '24/7 Support', bg: null, wide: false,
    desc: 'Real humans, always on. Day or night, we\'ve got your back.',
    color: 'from-blue-600/15 to-cyan-600/15', border: 'border-blue-500/20', accent: 'text-blue-400',
  },
  {
    icon: '🔄', title: 'Free Cancellation', bg: null, wide: false,
    desc: 'Cancel up to 24h before pickup — zero charge, no cap.',
    color: 'from-amber-500/15 to-orange-500/15', border: 'border-amber-500/20', accent: 'text-amber-400',
  },
  {
    icon: '🛡️', title: 'Fully Insured', bg: null, wide: false,
    desc: 'Comprehensive coverage included in every rental. Drive worry-free.',
    color: 'from-rose-600/15 to-pink-600/15', border: 'border-rose-500/20', accent: 'text-rose-400',
  },
  {
    icon: '🗺️', title: '50+ Cities', bg: '50+', wide: true,
    desc: 'From metro hubs to scenic routes — Rydr is everywhere you need to go.',
    color: 'from-cyan-600/15 to-sky-600/15', border: 'border-cyan-500/20', accent: 'text-cyan-400',
  },
]

export const HOME_FLEET = [
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80', label: 'Porsche 911',     tag: 'Sports', tagColor: 'bg-red-500/80'     },
  { url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=700&q=80', label: 'Luxury Coupe',   tag: 'Luxury', tagColor: 'bg-amber-500/80'   },
  { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80', label: 'Audi Executive', tag: 'Sedan',  tagColor: 'bg-blue-500/80'    },
  { url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=700&q=80', label: 'Sports Edition', tag: 'Sports', tagColor: 'bg-red-500/80'     },
  { url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=700&q=80', label: 'Premium SUV',   tag: 'SUV',    tagColor: 'bg-emerald-500/80' },
  { url: 'https://images.unsplash.com/photo-1580273916550-2ea2d3ba0b72?auto=format&fit=crop&w=700&q=80', label: 'Night Cruiser', tag: 'Luxury', tagColor: 'bg-violet-500/80'  },
]

export const HOME_TESTIMONIALS = [
  {
    name: 'Arjun S.', avatar: 'A', role: 'Adventure Seeker', rating: 5,
    text: "Booked a Range Rover for a hill station trip and it was absolutely immaculate. The whole process took like 3 minutes lol. Rydr is built different fr.",
    gradient: 'from-violet-500/10 to-fuchsia-500/10', border: 'border-violet-500/20',
  },
  {
    name: 'Priya M.', avatar: 'P', role: 'Business Traveller', rating: 5,
    text: "Used Rydr for client meetings all week. The Mercedes S-Class was spotless and the app is so clean. No sketchy rental counters. This is the future.",
    gradient: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/20',
  },
  {
    name: 'Karan D.', avatar: 'K', role: 'Car Enthusiast', rating: 5,
    text: "Drove a Porsche 911 for a weekend and I'm not the same person anymore. Rydr lets you experience cars that weren't supposed to be accessible. Goated.",
    gradient: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20',
  },
]

export const HOME_CATEGORIES = [
  { name: 'Sedan',  icon: '🚗', gradient: 'from-blue-600 to-cyan-500'     },
  { name: 'SUV',    icon: '🚙', gradient: 'from-emerald-600 to-teal-500'  },
  { name: 'Luxury', icon: '🏎️', gradient: 'from-yellow-500 to-amber-400' },
  { name: 'Sports', icon: '⚡', gradient: 'from-red-600 to-pink-500'      },
  { name: 'Van',    icon: '🚐', gradient: 'from-violet-600 to-purple-500' },
  { name: 'Truck',  icon: '🛻', gradient: 'from-orange-600 to-amber-500'  },
]
