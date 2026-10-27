import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Hand, HandCoins, Share2, Users, Scale, Flame } from 'lucide-react'
import { issues, claims, threads } from '../data'
import { Status, Trust, Source, PhotoCredit } from '../components/ui'

const tabs = ['Overview', 'Legal', 'Emissions and biodiversity', 'People and lawyers', 'Sources', 'Discussion']
const steps = ['Proposed', 'Under clearance', 'Cleared', 'In court', 'Stopped']

export default function IssueDetail() {
  const { id } = useParams(); const i = issues.find(x => x.id === id) || issues[0]
  const [tab, setTab] = useState('Overview'); const idx = steps.indexOf(i.status)
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  return (
    <>
      <section className="dhero" ref={ref}>
        <motion.img src={`/images/${i.img}.jpg`} alt={i.caption} style={{ y }} />
        <PhotoCredit k={i.img} style={{ top: 'auto', bottom: 14 }} />
        <div className="wrap in" style={{ width: '100%' }}>
          <Link to="/issues" className="mono" style={{ opacity: .8, marginBottom: 14 }}>← All issues</Link>
          <div className="row" style={{ flexWrap: 'wrap', marginBottom: 14, color: '#fff' }}><Status s={i.status} /><Trust t={i.trust} /><span className="mono">{i.eco} · {i.caption}</span></div>
          <h1>{i.name}</h1>
          <div className="timeline">{steps.map((s, k) => <div key={s} className={k < idx ? 'done' : k === idx ? 'now' : ''}><i />{s}</div>)}</div>
        </div>
      </section>
      <div className="wrap side" style={{ paddingBottom: 80 }}>
        <div>
          <div className="tabs">{tabs.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}{tab === t && <motion.span layoutId="tabbar" className="bar" />}</button>)}</div>
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            {tab === 'Overview' && <>
              <p className="head" style={{ fontSize: 28, lineHeight: 1.3, marginBottom: 12, letterSpacing: '-.01em', fontWeight: 400 }}>{i.blurb}</p>
              <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 32 }}>{i.company} · {i.state} · {i.mw} · illustrative sample until reviewed</p>
              <div className="cmp">
                <div><div className="mono" style={{ opacity: .7 }}>Government says</div><div className="head" style={{ fontSize: 64, margin: '14px 0 6px', lineHeight: 1 }}>38 ha</div><p style={{ opacity: .75 }}>of degraded forest is affected.</p><div style={{ marginTop: 16 }}><Source>Parivesh PP-2041</Source> <Trust t="Unverified" /></div></div>
                <div><div className="mono" style={{ opacity: .7 }}>Independent evidence</div><div className="head" style={{ fontSize: 64, margin: '14px 0 6px', lineHeight: 1, color: 'var(--g1)' }}>{i.hectares} ha</div><p style={{ opacity: .75 }}>including 6 perennial streams, per forest survey.</p><div style={{ marginTop: 16 }}><Source>RTI reply, 12 Aug 2026</Source> <Trust t="High" /></div></div>
              </div>
            </>}
            {tab === 'Legal' && <div className="card"><Scale size={20} /><p style={{ margin: '12px 0' }}>Stage-I forest clearance pending. NGT Pune hearing listed.</p><Source>News report, 19 Sep 2026</Source><p style={{ marginTop: 16, color: 'var(--sig)' }}>Missing: gram sabha consent record. Help needed to obtain via RTI.</p></div>}
            {tab === 'Emissions and biodiversity' && <div className="grid g2"><div className="card"><Flame color="#E0471B" /><h3 style={{ fontSize: 56, margin: '12px 0' }}>1.9 Mt</h3><p>CO₂e estimated from cleared canopy</p><Source>Sample estimate</Source></div><div className="card"><h3 style={{ fontSize: 56, margin: '34px 0 12px' }}>14</h3><p>Schedule-I species recorded nearby</p><Source>Local survey (sample)</Source></div></div>}
            {tab === 'People and lawyers' && <div className="grid g2">{[['A. Deshmukh', 'Lawyer'], ['S. Rao', 'Researcher'], ['P. Kulkarni', 'Local leader']].map(([n, r]) => <div key={n} className="card row"><Users size={20} /><div><b>{n}</b><div className="mono" style={{ color: 'var(--mute)' }}>{r}</div></div></div>)}</div>}
            {tab === 'Sources' && <div className="grid">{claims.map(c => <div key={c.text} className="card"><p>{c.text}</p><div className="row" style={{ marginTop: 10 }}><Source>{c.src}</Source><Trust t={c.trust} /></div></div>)}</div>}
            {tab === 'Discussion' && <div className="grid">{threads.slice(0, 3).map(t => <Link key={t.title} to="/forum" className="card hover">{t.title}<div className="mono" style={{ color: 'var(--mute)', marginTop: 8 }}>{t.replies} replies</div></Link>)}</div>}
          </motion.div>
        </div>
        <aside className="rail">
          <h3 style={{ fontSize: 28, marginBottom: 6 }}>How you can help</h3>
          <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 20 }}>Needs: {i.help.join(', ') || 'nothing right now'}</p>
          <div className="grid" style={{ gap: 10 }}>
            <button className="btn primary"><Hand size={15} /> Volunteer</button>
            <button className="btn warn"><HandCoins size={15} /> Donate</button>
            <button className="btn ghost"><Share2 size={15} /> Share</button>
          </div>
        </aside>
      </div>
    </>
  )
}
