import { useMemo } from 'react'
import { geoMercator, geoPath, geoGraticule10 } from 'd3-geo'
import { motion } from 'framer-motion'
import india from '../india.json'

// India outline from the Natural Earth dataset (via world-atlas). Not the Survey of India
// official boundary: see the note in the project handover before publishing.
const W = 600, H = 680
const projection = geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], india)
const path = geoPath(projection)
export const project = (lon, lat) => projection([lon, lat])

export default function IndiaMap({ children }) {
  const d = useMemo(() => path(india), [])
  const grid = useMemo(() => path(geoGraticule10()), [])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <path d={grid} fill="none" stroke="rgba(18,21,15,.08)" />
      <motion.path d={d} fill="#F8F6F0" stroke="#12150f" strokeWidth="1.2" strokeLinejoin="round"
        initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} />
      {children}
    </svg>
  )
}
