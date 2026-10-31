import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { issues } from '../data'
import { PageHead, Status, Trust } from '../components/ui'
import IndiaMap, { project, FOREST_RAMP, CHANGE_RAMP, CHANGE_MAX, LAST_YEAR } from '../components/IndiaMap'
import { forestMeta } from '../forest'

const layers = ['All', 'Forest', 'Rivers', 'Lakes', 'Wildlife']
const trendCol = { depleted: '#E0471B', restored: '#2F6B45', improved: '#2b86c5' }
const trendTxt = { depleted: 'Depleted', restored: 'Restored', improved: 'Improved' }
const CLUSTER_PX = 34 // markers closer than this on the 600x680 map merge into one

function cluster(list) {
  const out = []
  list.forEach(i => {
    const [x, y] = project(i.lon, i.lat)
    const hit = out.find(c => Math.hypot(c.x - x, c.y - y) < CLUSTER_PX)
    if (hit) { hit.items.push(i); hit.x = (hit.x * (hit.items.length - 1) + x) / hit.items.length; hit.y = (hit.y * (hit.items.length - 1) + y) / hit.items.length }
    else out.push({ x, y, items: [i] })
  })
  return out
}

export default function MapView() {
  const [layer, setLayer] = useState('All'); const [year, setYear] = useState(2026); const [selKey, setSelKey] = useState(null); const [fmode, setFmode] = useState('change')
  const shown = issues.filter(i => (layer === 'All' || i.eco === layer) && i.since <= year)
  const clusters = useMemo(() => cluster(shown), [layer, year])
  const sel = clusters.find(c => c.items.map(i => i.id).join() === selKey) || clusters[0]
  const key = c => c.items.map(i => i.id).join()
  return (
    <>
      <PageHead eyebrow="Find" title="Where it is happening" sub="Each marker is a tracked case. Nearby cases group into one marker. Choose a layer, drag the year, then open the one you want to follow." />
      <div className="wrap side mapgrid" style={{ paddingBottom: 80, gap: 40, gridTemplateColumns: '1fr 360px' }}>
        <div>
          <div className="filters" style={{ margin: '0 0 16px' }}>{layers.map(l => <button key={l} className={`fbtn ${layer === l ? 'on' : ''}`} onClick={() => setLayer(l)}>{l}</button>)}</div>
          <div className="mapbox" style={{ display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'relative', height: '100%', aspectRatio: '600/680' }}>
              <IndiaMap year={year} mode={fmode} />
              <AnimatePresence>
                {clusters.map(c => { const multi = c.items.length > 1; const col = multi ? '#0f4c4f' : trendCol[c.items[0].trend]; const on = sel && key(sel) === key(c); return (
                  <motion.button key={key(c)} className={`marker ${multi ? 'cl' : ''}`} aria-label={multi ? `${c.items.length} cases` : c.items[0].name} onClick={() => setSelKey(key(c))}
                    style={{ left: `${(c.x / 600) * 100}%`, top: `${(c.y / 680) * 100}%`, background: col, color: col, outline: on ? '2px solid #12150f' : 0, outlineOffset: 3 }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} whileHover={{ scale: 1.25 }}>
                    {multi ? c.items.length : <span className="pulse" />}</motion.button>) })}
              </AnimatePresence>
            </div>
          </div>
          <div className="row" style={{ marginTop: 18, gap: 14 }}><span className="mono" style={{ width: 44 }}>{year}</span><input type="range" min="2015" max="2026" value={year} onChange={e => setYear(+e.target.value)} aria-label="Year" style={{ flex: 1, accentColor: '#E0471B' }} /></div>
          <div className="row" style={{ gap: 18, marginTop: 14, flexWrap: 'wrap' }}>{Object.entries(trendCol).map(([k, c]) => <span key={k} className="chip"><i style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />{trendTxt[k]}</span>)}
            <span className="chip"><i className="cl-key">2</i>Grouped cases</span></div>
          <div className="forest-key">
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <b>Forest cover by state</b><Trust t={forestMeta.trust} />
              <span className="filters" style={{ margin: '0 0 0 auto' }}>
                {[['change', 'Change'], ['cover', 'Cover']].map(([k, t]) => <button key={k} className={`fbtn ${fmode === k ? 'on' : ''}`} onClick={() => setFmode(k)}>{t}</button>)}
              </span>
            </div>
            {fmode === 'change' ? <>
              <div className="forest-ramp" style={{ background: CHANGE_RAMP }} role="img" aria-label={`Change in forest cover since first report year, from minus ${CHANGE_MAX} to plus ${CHANGE_MAX} percentage points`} />
              <div className="forest-scale"><span>−{CHANGE_MAX} pts lost</span><span>no change</span><span>+{CHANGE_MAX} pts gained</span></div>
              <small>Compared with each state's own first report year (2015, or 2017 where 2015 is missing). </small>
            </> : <>
              <div className="forest-ramp" style={{ background: FOREST_RAMP }} role="img" aria-label="Forest cover scale from 0 to 90 percent or more" />
              <div className="forest-scale"><span>0%</span><span>30%</span><span>90%+</span></div>
            </>}
            <small>{year > LAST_YEAR ? `No newer forest report yet, so the shading holds at ${LAST_YEAR}. ` : forestMeta.years.includes(year) ? `Report year ${year}. ` : `${year} is between report years (${forestMeta.years.filter(y => y < year).pop()} and ${forestMeta.years.find(y => y > year)}), so the shading is blended. `}Source: {forestMeta.src}. {forestMeta.note}</small>
          </div>
        </div>

        <aside className="mapside">
          {sel ? <motion.div key={key(sel)} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mapside-h"><MapPin size={15} /> {sel.items.length > 1 ? `${sel.items.length} cases in this area` : sel.items[0].state}</div>
            {sel.items.map(i => (
              <Link key={i.id} to={`/issues/${i.id}`} className="mcase">
                <img src={`/images/${i.img}.jpg`} alt={i.caption} />
                <div><b>{i.name}</b><small>{i.company} · {i.state}</small>
                  <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: 8 }}><Status s={i.status} /><Trust t={i.trust} /><span className="pill" style={{ background: '#fff', color: trendCol[i.trend] }}>{trendTxt[i.trend]}</span></div></div>
              </Link>))}
          </motion.div> : <p>No cases for {layer === 'All' ? 'this year' : layer} in {year}. Move the slider forward.</p>}
        </aside>
      </div>
    </>
  )
}
