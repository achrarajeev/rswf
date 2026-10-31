// One-off: cut India's states/UTs out of Natural Earth 10m admin-1 and simplify them so the app ships ~150 KB.
// usage: node scripts/extract-states.mjs <path to ne_10m_admin_1_states_provinces.geojson>
import { readFileSync, writeFileSync } from 'node:fs'

const src = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const TOL = 0.02 // degrees (~2 km): invisible at the 600px map width
const MIN_AREA = 0.004 // drop specks smaller than this (sq. degrees); keeps Andaman/Lakshadweep islands

// Ramer-Douglas-Peucker
function rdp(pts, tol) {
  if (pts.length < 3) return pts
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1]
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-12
  let max = 0, idx = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len
    if (d > max) { max = d; idx = i }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]]
  return [...rdp(pts.slice(0, idx + 1), tol).slice(0, -1), ...rdp(pts.slice(idx), tol)]
}
const area = r => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2)
const rnd = p => [+p[0].toFixed(2), +p[1].toFixed(2)]
function ring(r) {
  const s = rdp(r.slice(0, -1), TOL).map(rnd)
  return s.length >= 3 ? [...s, s[0]] : null
}

const features = src.features.filter(f => f.properties.iso_a2 === 'IN').map(f => {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  const out = polys.map(p => p.map(ring).filter(Boolean)).filter(p => p.length && area(p[0]) >= MIN_AREA)
  return { type: 'Feature', properties: { name: f.properties.name }, geometry: { type: 'MultiPolygon', coordinates: out } }
})
const json = JSON.stringify({ type: 'FeatureCollection', features })
writeFileSync('src/states.json', json)
console.log(features.length, 'regions,', json.length, 'bytes')
