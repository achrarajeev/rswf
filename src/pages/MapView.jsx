import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { issues } from '../data'
import { PageHead } from '../components/ui'
import IndiaMap, { project } from '../components/IndiaMap'

const layers = ['All', 'Forest', 'Rivers', 'Lakes', 'Wildlife']
const colour = { Proposed: '#757869', 'Under clearance': '#B4801A', Cleared: '#E0471B', 'In court': '#2b4f9e', Stopped: '#2F6B45' }
export default function MapView() {
  const [layer, setLayer] = useState('All'); const [sel, setSel] = useState(issues[0]); const [year, setYear] = useState(2026)
  const shown = issues.filter(i => layer === 'All' || i.eco === layer)
  return (
    <>
      <PageHead eyebrow="Find" title="Where it is happening" sub="Each marker is a tracked case. Choose a layer, then open the one you want to follow." />
      <div className="wrap side" style={{ paddingBottom: 80, gap: 40, gridTemplateColumns: '1fr 340px' }}>
        <div>
          <div className="filters" style={{ margin: '0 0 16px' }}>{layers.map(l => <button key={l} className={`fbtn ${layer === l ? 'on' : ''}`} onClick={() => setLayer(l)}>{l}</button>)}</div>
          <div className="mapbox" style={{ display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'relative', height: '100%', aspectRatio: '600/680' }}>
              <IndiaMap />
              {shown.map(i => { const [px, py] = project(i.lon, i.lat); return (
                <motion.button key={i.id} className="marker" aria-label={i.name} onClick={() => setSel(i)}
                  style={{ left: `${(px / 600) * 100}%`, top: `${(py / 680) * 100}%`, background: colour[i.status], color: colour[i.status], outline: sel?.id === i.id ? '2px solid #12150f' : 0, outlineOffset: 3 }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: 'spring' }} whileHover={{ scale: 1.4 }}><span className="pulse" /></motion.button>) })}
            </div>
          </div>
          <div className="row" style={{ marginTop: 18 }}><span className="mono" style={{ width: 44 }}>{year}</span><input type="range" min="2015" max="2026" value={year} onChange={e => setYear(+e.target.value)} style={{ flex: 1, accentColor: '#E0471B' }} /></div>
          <div className="row" style={{ gap: 18, marginTop: 14, flexWrap: 'wrap' }}>{Object.entries(colour).map(([k, c]) => <span key={k} className="chip"><i style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'block' }} />{k}</span>)}</div>
        </div>
        <aside className="mapside">
          {sel ? <motion.div key={sel.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <img src={`/images/${sel.img}.jpg`} alt={sel.caption} style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 24 }} />
            <div className="mono" style={{ margin: '14px 0 8px', color: 'var(--mute)' }}>{sel.caption}</div>
            <h3 style={{ fontSize: 32 }}>{sel.name}</h3>
            <p style={{ color: 'var(--body)', margin: '10px 0 18px' }}>{sel.company} · {sel.state} · as of {year}</p>
            <Link to={`/issues/${sel.id}`} className="btn primary">Open the case</Link>
          </motion.div> : <p>Select a marker.</p>}
        </aside>
      </div>
    </>
  )
}
