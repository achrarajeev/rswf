import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, UploadCloud, ShieldCheck } from 'lucide-react'
import { issues, progress, evidenceTypes } from '../data'
import { useAuth } from '../authStore'
import { evidenceStore } from '../evidenceStore'
import { useTasks, isMine } from '../tasksStore'
import { PageHead } from '../components/ui'
import { isStaff, can } from '../roles'

// Evidence of work progress: video, documents, live recordings, photos. A reviewer checks it before it is published.
const labels = ['Issue', 'What it is', 'File or link', 'Context', 'Preview']
export default function Contribute() {
  const [params] = useSearchParams(); const { me } = useAuth()
  const [s, setS] = useState(0); const [done, setDone] = useState(false); const [tried, setTried] = useState(false)
  const first = issues.some(i => i.id === params.get('case')) ? params.get('case') : issues[0].id
  const [f, setF] = useState({ issue: first, type: 'Video', title: '', link: '', fileName: '', proves: '', task: params.get('task') || '', note: '' }); const set = k => e => setF({ ...f, [k]: e.target.value })
  const here = `/contribute${params.get('case') ? `?case=${params.get('case')}` : ''}`
  const issue = issues.find(i => i.id === f.issue)
  const updates = progress[f.issue] || []
  const myTasks = useTasks().filter(t => t.issue === f.issue && isMine(t, me) && t.status === 'Taken up')
  const errors = { title: !f.title.trim() && 'Give it a short title', file: !f.link.trim() && !f.fileName && 'Add a link or choose a file', note: !f.note.trim() && 'Say how you obtained it' }
  const stepErr = [null, errors.title, errors.file, errors.note, null][s]
  const next = () => { setTried(true); if (stepErr) return; setTried(false); setS(s + 1) }
  const submit = () => { evidenceStore.submit(me, f); setDone(true) }

  if (!me || isStaff(me)) return (
    <>
      <PageHead eyebrow="Act" title="Add evidence" sub="Video, documents and live recordings that show work done on an issue." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card">
        {me ? <p>Staff accounts ({me.type}) check and run the site, and do not submit evidence. <Link to={can(me, 'admin.panel') ? '/admin' : '/reviewer'} style={{ textDecoration: 'underline' }}>Open your dashboard</Link>.</p> : <>
          <h2 style={{ fontSize: 22 }}>Log in to add evidence</h2>
          <p style={{ color: 'var(--mute)', margin: '8px 0 16px' }}>Evidence is credited to your account so a reviewer can follow up.</p>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}><Link to={`/login?next=${encodeURIComponent(here)}`} className="btn primary">Log in</Link><Link to={`/register?next=${encodeURIComponent(here)}`} className="btn ghost">Create an account</Link></div></>}
      </div></div>
    </>
  )

  const err = k => tried && errors[k] && <small style={{ color: 'var(--sig)', display: 'block', marginTop: 6 }}>{errors[k]}</small>
  return (
    <>
      <PageHead eyebrow="Act" title="Add evidence" sub="Video, documents and live recordings that show work done on an issue." />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div className="card">
          {!done ? <>
            <div className="row" style={{ marginBottom: 24, flexWrap: 'wrap' }}>{labels.map((l, k) => <div key={l} className="step" style={{ margin: 0 }}><span className={`dot ${k <= s ? 'on' : ''}`}>{k < s ? <Check size={15} /> : k + 1}</span><span style={{ fontSize: 13 }}>{l}</span></div>)}</div>
            <AnimatePresence mode="wait"><motion.div key={s} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {s === 0 && <label className="field"><span>Choose issue</span><select className="select" style={{ width: '100%' }} value={f.issue} onChange={e => setF({ ...f, issue: e.target.value, proves: '', task: '' })}>{issues.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>}
              {s === 1 && <><div className="field"><span>Type</span><div className="checks">{evidenceTypes.map(t => <button key={t} type="button" className={f.type === t ? 'on' : ''} onClick={() => setF({ ...f, type: t })}>{t}</button>)}</div></div>
                <label className="field"><span>Title</span><input value={f.title} onChange={set('title')} placeholder="e.g. Stream survey walk, northern boundary" />{err('title')}</label></>}
              {s === 2 && <><label className="field"><span>Link to the {f.type.toLowerCase()}</span><input value={f.link} onChange={set('link')} placeholder="https://…" /></label>
                <label style={{ display: 'block', border: '2px dashed var(--line)', borderRadius: 12, padding: 28, textAlign: 'center', color: 'var(--muted)', cursor: 'pointer' }}><UploadCloud style={{ margin: '0 auto 6px' }} />{f.fileName || 'Or choose a file'}
                  <input type="file" style={{ display: 'none' }} onChange={e => setF({ ...f, fileName: e.target.files[0]?.name || '' })} /></label>
                <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 8 }}>Prototype: only the file name is kept. Nothing is uploaded.</p>{err('file')}</>}
              {s === 3 && <><label className="field"><span>Which progress update does this prove? (optional)</span><select className="select" style={{ width: '100%' }} value={f.proves} onChange={set('proves')}><option value="">General work on this issue</option>{updates.map(u => <option key={u.title}>{u.title}</option>)}</select></label>
                {myTasks.length > 0 && <label className="field"><span>Which of your tasks is this for? (optional)</span><select className="select" style={{ width: '100%' }} value={f.task} onChange={set('task')}><option value="">Not tied to a task</option>{myTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>}
                <label className="field"><span>How did you obtain it?</span><textarea rows="4" value={f.note} onChange={set('note')} placeholder="Who recorded it, where and when" />{err('note')}</label></>}
              {s === 4 && <div><b>{f.title}</b><p className="mono" style={{ color: 'var(--mute)', margin: '6px 0' }}>{f.type} · {issue.name}</p><p style={{ margin: '8px 0' }}>{f.note}</p><p style={{ fontSize: 13, color: 'var(--muted)' }}>{f.link || f.fileName} · Proves: {f.proves || 'General work on this issue'}</p></div>}
            </motion.div></AnimatePresence>
            <div className="row between" style={{ marginTop: 20 }}>
              <button className="btn ghost" disabled={!s} onClick={() => setS(s - 1)}><ArrowLeft size={15} />Back</button>
              {s < 4 ? <button className="btn primary" onClick={next}>Next <ArrowRight size={15} /></button> : <button className="btn warn" onClick={submit}>Submit for review</button>}
            </div>
          </> : (
            <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 20 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: .2 }} className="iconbox" style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: '50%', background: 'var(--green)', color: '#fff' }}><Check size={32} /></motion.div>
              <h2 style={{ fontSize: 26 }}>Submitted. Thank you.</h2>
              <div className="row" style={{ justifyContent: 'center', margin: '22px 0', gap: 24 }}>{['Submitted', 'In review', 'Published'].map((t, k) => <span key={t} className="row"><span className={`dot ${k === 0 ? 'on' : ''}`}>{k === 0 ? <Check size={15} /> : k + 1}</span>{t}</span>)}</div>
              <p style={{ color: 'var(--mute)', marginBottom: 16 }}>It appears on the issue's Evidence tab once a reviewer approves it. Track it in your space.</p>
              <div className="row" style={{ gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><Link to="/me" className="btn primary">Your contributions</Link><button className="btn ghost" onClick={() => { setDone(false); setS(0); setF({ ...f, title: '', link: '', fileName: '', proves: '', note: '' }) }}>Add another</button></div>
            </motion.div>)}
        </div>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}><ShieldCheck color="#1F4D3A" /><p style={{ marginTop: 10, lineHeight: 1.6 }}>A reviewer will check this and assign a trust level before it is published.</p></aside>
      </div>
    </>
  )
}
