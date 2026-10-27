import { useId } from 'react'
import { motion } from 'framer-motion'

// Line chart on real data points, labelled directly. Brand colours, gradient area, soft gridlines.
export default function Chart({ pts, h = 220, fmt = v => v, color = '#17601f' }) {
  const gid = useId().replace(/:/g, '')
  const w = 560, pad = { l: 8, r: 36, t: 34, b: 30 }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
  const lo = Math.min(...ys), hi = Math.max(...ys), span = hi - lo || 1
  const X = x => pad.l + ((x - xs[0]) / (xs.at(-1) - xs[0])) * (w - pad.l - pad.r)
  const Y = y => pad.t + (1 - (y - lo) / span) * (h - pad.t - pad.b)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join(' ')
  const base = h - pad.b
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', overflow: 'visible' }} role="img">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2].map(i => <line key={i} x1={pad.l} x2={w - pad.r} y1={pad.t + i * (base - pad.t) / 3} y2={pad.t + i * (base - pad.t) / 3} stroke="rgba(15,76,79,.12)" strokeDasharray="3 6" />)}
      <line x1={pad.l} x2={w - pad.r} y1={base} y2={base} stroke="rgba(15,76,79,.25)" />
      <motion.path d={`${d} L${X(xs.at(-1))} ${base} L${X(xs[0])} ${base}Z`} fill={`url(#${gid})`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1 }} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
      {pts.map(([x, y], i) => {
        const last = i === pts.length - 1
        return (
          <motion.g key={x} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .25 * i + .3 }}>
            {last && <circle cx={X(x)} cy={Y(y)} r="11" fill={color} opacity=".15"><animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" /></circle>}
            <circle cx={X(x)} cy={Y(y)} r={last ? 6 : 4} fill={last ? '#d9531e' : '#fff'} stroke={last ? '#fff' : color} strokeWidth="2.5" />
            <text x={X(x)} y={h - 8} textAnchor="middle" fontSize="11.5" fontFamily="Poppins" fill="#5d6e69">{x}</text>
            {(last || i === 0) && <text x={X(x)} y={Y(y) - 14} textAnchor={last ? 'end' : 'start'} fontSize="14" fontWeight="600" fontFamily="Rubik" fill="#0f4c4f">{fmt(y)}</text>}
          </motion.g>)
      })}
    </svg>
  )
}
