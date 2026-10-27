import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, UploadCloud, ShieldCheck } from 'lucide-react'
import { issues } from '../data'
import { PageHead } from '../components/ui'

const labels = ['Issue', 'Claim', 'Evidence', 'Context', 'Preview']
export default function Contribute() {
  const [s, setS] = useState(0); const [done, setDone] = useState(false)
  const [f, setF] = useState({ issue: issues[0].id, claim: '', link: '', ctx: '' }); const set = k => e => setF({ ...f, [k]: e.target.value })
  return (
    <>
      <PageHead eyebrow="Act" title="Contribute evidence" sub="RTIs, field visits and research are all welcome." />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div className="card">
          {!done ? <>
            <div className="row" style={{ marginBottom: 24, flexWrap: 'wrap' }}>{labels.map((l, k) => <div key={l} className="step" style={{ margin: 0 }}><span className={`dot ${k <= s ? 'on' : ''}`}>{k < s ? <Check size={15} /> : k + 1}</span><span style={{ fontSize: 13 }}>{l}</span></div>)}</div>
            <AnimatePresence mode="wait"><motion.div key={s} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {s === 0 && <label className="field"><span>Choose issue</span><select className="select" style={{ width: '100%' }} value={f.issue} onChange={set('issue')}>{issues.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>}
              {s === 1 && <label className="field"><span>Your claim</span><textarea rows="4" value={f.claim} onChange={set('claim')} placeholder="e.g. Survey records 6 streams inside the project area" /></label>}
              {s === 2 && <><label className="field"><span>Link to source</span><input value={f.link} onChange={set('link')} placeholder="https://…" /></label>
                <div style={{ border: '2px dashed var(--line)', borderRadius: 12, padding: 28, textAlign: 'center', color: 'var(--muted)' }}><UploadCloud style={{ margin: '0 auto 6px' }} />Or drop a document here</div></>}
              {s === 3 && <label className="field"><span>Context</span><textarea rows="4" value={f.ctx} onChange={set('ctx')} placeholder="How did you obtain this?" /></label>}
              {s === 4 && <div><b>{issues.find(i => i.id === f.issue).name}</b><p style={{ margin: '8px 0' }}>{f.claim || 'No claim entered'}</p><p style={{ fontSize: 13, color: 'var(--muted)' }}>{f.link || 'No link'} · {f.ctx}</p></div>}
            </motion.div></AnimatePresence>
            <div className="row between" style={{ marginTop: 20 }}>
              <button className="btn ghost" disabled={!s} onClick={() => setS(s - 1)}><ArrowLeft size={15} />Back</button>
              {s < 4 ? <button className="btn primary" onClick={() => setS(s + 1)}>Next <ArrowRight size={15} /></button> : <button className="btn warn" onClick={() => setDone(true)}>Submit</button>}
            </div>
          </> : (
            <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 20 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: .2 }} className="iconbox" style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: '50%', background: 'var(--green)', color: '#fff' }}><Check size={32} /></motion.div>
              <h2 style={{ fontSize: 26 }}>Submitted. Thank you.</h2>
              <div className="row" style={{ justifyContent: 'center', margin: '22px 0', gap: 24 }}>{['Submitted', 'In review', 'Published'].map((t, k) => <span key={t} className="row"><span className={`dot ${k === 0 ? 'on' : ''}`}>{k === 0 ? <Check size={15} /> : k + 1}</span>{t}</span>)}</div>
              <button className="btn ghost" onClick={() => { setDone(false); setS(0) }}>Add another</button>
            </motion.div>)}
        </div>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}><ShieldCheck color="#1F4D3A" /><p style={{ marginTop: 10, lineHeight: 1.6 }}>A reviewer will check this and assign a trust level.</p></aside>
      </div>
    </>
  )
}
