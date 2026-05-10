import { format } from 'date-fns'

export const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'
