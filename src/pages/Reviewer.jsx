import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, MessageSquarePlus, X } from 'lucide-react'
import { claims } from '../data'
import { PageHead, Trust } from '../components/ui'

export default function Reviewer() {
  const [q, setQ] = useState(claims.map((c, k) => ({ ...c, age: `${k + 1}d` }))); const [sel, setSel] = useState(0); const [trust, setTrust] = useState('Medium'); const [note, setNote] = useState('')
  const act = () => { setQ(q.filter((_, k) => k !== sel)); setSel(0); setNote('') }
  const c = q[sel]
  return (
    <>
      <PageHead eyebrow="Check" title="Reviewer dashboard" sub={`${q.length} submissions waiting.`} />
      <div className="wrap side" style={{ margin: '24px auto 60px' }}>
        <div className="grid" style={{ gap: 10 }}>{q.map((x, k) => (
          <motion.button layout key={x.text} onClick={() => setSel(k)} className="card hover row" style={{ textAlign: 'left', borderColor: k === sel ? 'var(--g1)' : undefined }}>
            <img className="rev-thumb" src={`/images/${x.thumb}.jpg`} alt="" /><div style={{ flex: 1 }}><div>{x.text}</div><div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{x.type} · by {x.by} · {x.age} old</div></div></motion.button>))}
          {!q.length && <div className="card">Queue clear. Nice work.</div>}</div>
        {c && <aside className="card" style={{ alignSelf: 'start' }}><img className="rev-big" src={`/images/${c.thumb}.jpg`} alt="Attached evidence, sample image" /><div className="mono" style={{ color: 'var(--mute)', margin: '8px 0 10px' }}>Submitted by {c.by} · sample attachment</div><b>Decision</b><p style={{ fontSize: 13, margin: '6px 0 12px', color: 'var(--mute)' }}>{c.src}</p>
          <div className="row" style={{ marginBottom: 12 }}>{['High', 'Medium', 'Unverified'].map(t => <button key={t} onClick={() => setTrust(t)} style={{ opacity: trust === t ? 1 : .45, outline: trust === t ? '2px solid var(--g1)' : 0, borderRadius: 99 }}><Trust t={t} /></button>)}</div>
          <label className="field"><span>Note (required)</span><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} /></label>
          <div className="grid" style={{ gap: 8 }}>
            <button disabled={!note} className="btn primary" onClick={act}><Check size={15} />Approve</button>
            <button disabled={!note} className="btn ghost" onClick={act}><MessageSquarePlus size={15} />Request more evidence</button>
            <button disabled={!note} className="btn warn" onClick={act}><X size={15} />Reject</button></div></aside>}
      </div>
    </>
  )
}
