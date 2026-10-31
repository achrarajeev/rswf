import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MessageSquarePlus, X, Building2 } from 'lucide-react'
import { issues, institutions, credentials, people } from '../data'
import { can } from '../roles'
import { useSubmissions, evidenceStore } from '../evidenceStore'
import { useAuth, auth, issuesFor } from '../authStore'
import { PageHead, Trust } from '../components/ui'

// Pending institute registrations. A reviewer checks the registration number, then approves, asks for more, or rejects.
function InstituteQueue() {
  useAuth() // re-render after a decision
  const pending = institutions.filter(i => i.status === 'Pending review')
  const [sel, setSel] = useState(0); const [note, setNote] = useState(''); const [err, setErr] = useState('')
  const c = pending[Math.min(sel, pending.length - 1)]
  const decide = d => { const m = auth.reviewInstitute(c.id, d, note); if (m) return setErr(m); setErr(''); setNote(''); setSel(0) }
  return (
    <div className="wrap side" style={{ margin: '24px auto 60px' }}>
      <div className="grid" style={{ gap: 10 }}>
        {pending.map((x, k) => <button key={x.id} onClick={() => setSel(k)} className="card hover row" style={{ textAlign: 'left', borderColor: c?.id === x.id ? 'var(--g1)' : undefined }}>
          <div className="iconbox" style={{ margin: 0 }}><Building2 size={20} /></div>
          <div style={{ flex: 1 }}><div>{x.name}</div><div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{x.type} · {x.place || 'place not given'}</div></div></button>)}
        {!pending.length && <div className="card">No institutes waiting. Nice work.</div>}
      </div>
      {c && <aside className="card" style={{ alignSelf: 'start' }}>
        <b>{c.name}</b>
        <div className="mono" style={{ color: 'var(--mute)', margin: '8px 0' }}>{c.type} · {c.place || 'place not given'}</div>
        <dl style={{ display: 'grid', gap: 6, fontSize: 14, margin: '10px 0 14px' }}>
          <div><dt className="mono" style={{ color: 'var(--mute)' }}>Registration number</dt><dd>{c.reg || 'Not given'}</dd></div>
          {c.contact && <div><dt className="mono" style={{ color: 'var(--mute)' }}>Contact person</dt><dd>{c.contact}</dd></div>}
          {c.web && <div><dt className="mono" style={{ color: 'var(--mute)' }}>Website</dt><dd>{c.web}</dd></div>}
          <div><dt className="mono" style={{ color: 'var(--mute)' }}>Issues joined</dt><dd>{issuesFor('Institute', c.id).length}</dd></div>
        </dl>
        <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 10 }}>Check the number against the issuing registry before approving. Sample data here: no real check is made.</p>
        <label className="field"><span>Note (required)</span><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} /></label>
        {err && <p style={{ color: 'var(--sig)', marginBottom: 8 }}>{err}</p>}
        <div className="grid" style={{ gap: 8 }}>
          <button disabled={!note.trim()} className="btn primary" onClick={() => decide('Verified')}><Check size={15} />Approve</button>
          <button disabled={!note.trim()} className="btn ghost" onClick={() => decide('More info needed')}><MessageSquarePlus size={15} />Request more information</button>
          <button disabled={!note.trim()} className="btn warn" onClick={() => decide('Rejected')}><X size={15} />Reject</button>
        </div>
      </aside>}
    </div>
  )
}

export default function Reviewer() {
  const { me } = useAuth(); const [params] = useSearchParams(); const [tab, setTab] = useState(['Evidence', 'Institutes', 'Verification'].includes(params.get('tab')) ? params.get('tab') : 'Evidence')
  if (!can(me, 'evidence.review')) return (
    <>
      <PageHead eyebrow="Check" title="Reviewer dashboard" sub="For reviewers who verify evidence and institutes." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card">
        <h2 style={{ fontSize: 22 }}>{me ? 'Reviewers only' : 'Log in as a reviewer'}</h2>
        <p style={{ color: 'var(--mute)', margin: '8px 0 16px' }}>{me ? `You are logged in as ${me.name}, which cannot review evidence.` : 'Reviewer accounts are not open to sign-up. A demo reviewer is on the login page.'}</p>
        <Link to="/login?next=%2Freviewer" className="btn primary">{me ? 'Switch account' : 'Log in'}</Link>
      </div></div>
    </>
  )
  return <ReviewerHome tab={tab} setTab={setTab} />
}

function EvidenceQueue() {
  const all = useSubmissions(); const { me } = useAuth()
  const q = all.filter(x => x.status === 'Pending review')
  const [sel, setSel] = useState(0); const [trust, setTrust] = useState('Medium'); const [note, setNote] = useState('')
  const c = q[Math.min(sel, q.length - 1)]
  const act = d => { evidenceStore.review(c.id, d, note, trust, me.name); setSel(0); setNote('') }
  const issue = c && issues.find(i => i.id === c.issue)
  return (
    <div className="wrap side" style={{ margin: '24px auto 60px' }}>
      <div className="grid" style={{ gap: 10 }}>{q.map(x => (
        <motion.button layout key={x.id} onClick={() => setSel(q.indexOf(x))} className="card hover row" style={{ textAlign: 'left', borderColor: c?.id === x.id ? 'var(--g1)' : undefined }}>
          <img className="rev-thumb" src={`/images/${issues.find(i => i.id === x.issue)?.img}.jpg`} alt="" /><div style={{ flex: 1 }}><div>{x.title}</div><div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{x.type} · {issues.find(i => i.id === x.issue)?.name} · by {x.byName} · {x.date}</div></div></motion.button>))}
        {!q.length && <div className="card">Queue clear. Nice work.</div>}</div>
      {c && <aside className="card" style={{ alignSelf: 'start' }}>
        <img className="rev-big" src={`/images/${issue.img}.jpg`} alt="Sample thumbnail for the case" />
        <b style={{ display: 'block', marginTop: 8 }}>{c.title}</b>
        <div className="mono" style={{ color: 'var(--mute)', margin: '6px 0 10px' }}>{c.type} · {issue.name}<br />Submitted by {c.byName} · {c.date}</div>
        <p style={{ marginBottom: 8 }}>{c.note}</p>
        <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 12 }}>{c.link || c.fileName} · Proves: {c.proves || 'General work on this issue'}</p>
        <b>Decision</b>
        <div className="row" style={{ margin: '10px 0 12px' }}>{['High', 'Medium', 'Unverified'].map(t => <button key={t} onClick={() => setTrust(t)} style={{ opacity: trust === t ? 1 : .45, outline: trust === t ? '2px solid var(--g1)' : 0, borderRadius: 99 }}><Trust t={t} /></button>)}</div>
        <label className="field"><span>Note (required)</span><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} /></label>
        <div className="grid" style={{ gap: 8 }}>
          <button disabled={!note.trim()} className="btn primary" onClick={() => act('Approved')}><Check size={15} />Approve and publish</button>
          <button disabled={!note.trim()} className="btn ghost" onClick={() => act('More info needed')}><MessageSquarePlus size={15} />Request more evidence</button>
          <button disabled={!note.trim()} className="btn warn" onClick={() => act('Rejected')}><X size={15} />Reject</button></div></aside>}
    </div>
  )
}

// Users who claim to be a lawyer or local researcher. A reviewer checks the proof, then a verified badge shows on People and in the forum.
function CredentialQueue() {
  useAuth()
  const pending = credentials.filter(c => c.status === 'Pending review')
  const [sel, setSel] = useState(0); const [note, setNote] = useState(''); const [err, setErr] = useState('')
  const c = pending[Math.min(sel, pending.length - 1)], who = c && people.find(p => p.id === c.person)
  const decide = d => { const m = auth.reviewCredential(c.id, d, note); if (m) return setErr(m); setErr(''); setNote(''); setSel(0) }
  return (
    <div className="wrap side" style={{ margin: '24px auto 60px' }}>
      <div className="grid" style={{ gap: 10 }}>
        {pending.map((x, k) => <button key={x.id} onClick={() => setSel(k)} className="card hover" style={{ textAlign: 'left', borderColor: c?.id === x.id ? 'var(--g1)' : undefined }}>
          <div>{people.find(p => p.id === x.person)?.name}</div><div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Claims: {x.claim} · asked {x.asked}</div></button>)}
        {!pending.length && <div className="card">No credential requests waiting.</div>}
      </div>
      {c && <aside className="card" style={{ alignSelf: 'start' }}>
        <b>{who?.name}</b>
        <div className="mono" style={{ color: 'var(--mute)', margin: '8px 0' }}>{who?.role} · {who?.place || 'place not given'}</div>
        <dl style={{ display: 'grid', gap: 6, fontSize: 14, margin: '10px 0 14px' }}>
          <div><dt className="mono" style={{ color: 'var(--mute)' }}>Claims to be a</dt><dd>{c.claim}</dd></div>
          <div><dt className="mono" style={{ color: 'var(--mute)' }}>Proof given</dt><dd>{c.proof}</dd></div>
          <div><dt className="mono" style={{ color: 'var(--mute)' }}>Issues joined</dt><dd>{issuesFor('User', c.person).length}</dd></div>
        </dl>
        <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 10 }}>Check the number or letter with the issuing body before approving. Sample data here: no real check is made.</p>
        <label className="field"><span>Note (required)</span><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} /></label>
        {err && <p style={{ color: 'var(--sig)', marginBottom: 8 }}>{err}</p>}
        <div className="grid" style={{ gap: 8 }}>
          <button disabled={!note.trim()} className="btn primary" onClick={() => decide('Verified')}><Check size={15} />Verify and show badge</button>
          <button disabled={!note.trim()} className="btn ghost" onClick={() => decide('More info needed')}><MessageSquarePlus size={15} />Request more information</button>
          <button disabled={!note.trim()} className="btn warn" onClick={() => decide('Rejected')}><X size={15} />Reject</button>
        </div>
      </aside>}
    </div>
  )
}

function ReviewerHome({ tab, setTab }) {
  const pendingEv = useSubmissions().filter(x => x.status === 'Pending review').length
  return (
    <>
      <PageHead eyebrow="Check" title="Reviewer dashboard" sub={tab === 'Evidence' ? `${pendingEv} submissions waiting.` : tab === 'Institutes' ? 'Institute registrations waiting for a check.' : 'Credential claims waiting for a check.'} />
      <div className="wrap" style={{ marginTop: 24 }}><div className="filters">{['Evidence', 'Institutes', 'Verification'].map(t => <button key={t} className={`fbtn ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}</div></div>
      {tab === 'Institutes' ? <InstituteQueue /> : tab === 'Verification' ? <CredentialQueue /> : <EvidenceQueue />}
    </>
  )
}
