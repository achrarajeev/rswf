import { useMemo } from 'react'
import { geoMercator, geoPath, geoGraticule10 } from 'd3-geo'
import { motion } from 'framer-motion'
import india from '../india.json'
import states from '../states.json'
import { forestCover, forestMeta } from '../forest'

// India outline from the Natural Earth dataset (via world-atlas). Not the Survey of India
// official boundary: see the note in the project handover before publishing.
const W = 600, H = 680
const projection = geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], india)
const path = geoPath(projection)
export const project = (lon, lat) => projection([lon, lat])

// Forest cover % for a state in a given year: linear between report years, held flat outside them.
const [Y0, Y1] = forestMeta.years
export function forestAt(name, year) {
  const f = forestCover[name]
  if (!f) return null
  const t = Math.min(1, Math.max(0, (year - Y0) / (Y1 - Y0)))
  return f[Y0] + (f[Y1] - f[Y0]) * t
}

// Pale to deep green. The square root spreads the many low-cover states (Punjab 4%, Kerala 50%, Mizoram 87%)
// across the scale instead of bunching them all at the pale end.
const LO = [236, 232, 214], HI = [22, 92, 52], MAX = 90
export const forestColor = pct => {
  const t = Math.sqrt(Math.min(1, Math.max(0, pct / MAX)))
  return `rgb(${LO.map((l, i) => Math.round(l + (HI[i] - l) * t)).join(',')})`
}
export const FOREST_RAMP = `linear-gradient(90deg, ${[0, 5, 15, 30, 50, 90].map((p, i, a) => `${forestColor(p)} ${(i / (a.length - 1)) * 100}%`).join(', ')})`

export default function IndiaMap({ year, children }) {
  const d = useMemo(() => path(india), [])
  const grid = useMemo(() => path(geoGraticule10()), [])
  const regions = useMemo(() => states.features.map(f => ({ name: f.properties.name, d: path(f) })), [])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs><clipPath id="india-clip"><path d={d} /></clipPath></defs>
      <path d={grid} fill="none" stroke="rgba(18,21,15,.08)" />
      <motion.path d={d} fill="#F8F6F0" stroke="#12150f" strokeWidth="1.2" strokeLinejoin="round"
        initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} />
      {year != null && (
        <g clipPath="url(#india-clip)">
          {regions.map(r => {
            const pct = forestAt(r.name, year)
            return (
              <path key={r.name} d={r.d} className="forest-state" strokeLinejoin="round"
                fill={pct == null ? '#E4E1D6' : forestColor(pct)}>
                <title>{pct == null ? `${r.name}: no data` : `${r.name}: ${pct.toFixed(1)}% forest cover`}</title>
              </path>
            )
          })}
        </g>
      )}
      {year != null && <path d={d} fill="none" stroke="#12150f" strokeWidth="1.2" strokeLinejoin="round" pointerEvents="none" />}
      {children}
    </svg>
  )
}
