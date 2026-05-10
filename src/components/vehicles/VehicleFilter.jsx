import { VEHICLE_BROWSE_CATEGORIES as CATEGORIES, INPUT_CLS_SM as inputCls, LABEL_CLS as labelCls } from '../../constants'

export default function VehicleFilter({ filters, onChange, onSearch }) {
  const set = (key, val) => onChange({ ...filters, [key]: val })

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch() }}
      className="glass rounded-2xl border border-white/10 p-5"
    >
      <p className="text-sm font-semibold text-white/60 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        Filter Vehicles
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={filters.category}
            onChange={(e) => set('category', e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="bg-[#0a0a1a]">
                {c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Pickup Date</label>
          <input
            type="date"
            value={filters.date_from}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => set('date_from', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Return Date</label>
          <input
            type="date"
            value={filters.date_to}
            min={filters.date_from || new Date().toISOString().split('T')[0]}
            onChange={(e) => set('date_to', e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">
          Search
        </button>
        <button
          type="button"
          onClick={() => { onChange({ category: '', date_from: '', date_to: '' }); onSearch() }}
          className="px-5 py-2.5 text-sm text-white/40 hover:text-white glass border border-white/10 rounded-xl transition-all duration-200"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
