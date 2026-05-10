import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLOR = {
  available:   '#10b981',
  rented:      '#8b5cf6',
  maintenance: '#f59e0b',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl border border-white/10 px-3 py-2">
      <p className="text-white/40 text-xs capitalize mb-0.5">{payload[0].name}</p>
      <p className="text-white font-bold">{payload[0].value}</p>
    </div>
  )
}

export default function VehicleStatusChart({ data = [] }) {
  const normalized = data.map(d => ({
    name:  d.status ?? d.name  ?? 'unknown',
    value: d.count  ?? d.value ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={normalized}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={82}
          paddingAngle={4}
          dataKey="value"
          stroke="transparent"
        >
          {normalized.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLOR[entry.name] ?? '#6366f1'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={v => (
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'capitalize' }}>
              {v}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
