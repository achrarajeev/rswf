import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Bookmark, ShieldCheck, LayoutGrid, ArrowUpRight, Clock, User, Landmark } from 'lucide-react'
import { issues } from '../data'
import { useAuth, auth, issuesFor } from '../authStore'
import { useThreads } from '../forumStore'
import { useSubmissions } from '../evidenceStore'
import { useTasks, taskStore, isMine } from '../tasksStore'
import { PageHead, Reveal, ShareButton } from '../components/ui'
import { isStaff, can } from '../roles'
import { credentials, claimable } from '../data'

const cards = [
  ['Saved cases', 'Follow a case to get its updates. Nothing saved yet.', Bookmark, '/issues', 'Browse issues', 'bg-sky'],
  ['Reviewer tools', 'For reviewers who verify evidence and assign trust levels.', ShieldCheck, '/reviewer', 'Open dashboard', 'bg-mist'],
  ['All features', 'Every part of Earth Ledger, grouped by what you want to do.', LayoutGrid, '/hub', 'Open the hub', 'bg-mint'],
]

// Ask for a verified badge. A reviewer checks the proof (Reviewer dashboard > Verification).
function Credentials({ me }) {
  const mine = credentials.filter(c => c.person === me.id)
  const open = claimable.filter(k => !mine.some(c => c.claim === k && (c.status === 'Verified' || c.status === 'Pending review')))
  const [claim, setClaim] = useState(''); const [proof, setProof] = useState(''); const [err, setErr] = useState('')
  const pick = claim && open.includes(claim) ? claim : open[0]
  const submit = () => { const m = auth.requestCredential(pick, proof); m ? setErr(m) : (setProof(''), setErr('')) }
  return <div className="card" style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 18 }}>Verified badge</h3>
    <p style={{ color: 'var(--mute)', fontSize: 14, margin: '6px 0 10px' }}>Lawyers and local researchers can ask a reviewer to verify them. The badge then shows next to your name on People and in the forum.</p>
    <div className="grid" style={{ gap: 8 }}>{mine.map(c => <div key={c.id}><b>{c.claim}</b> <span className="chip">{c.status === 'Verified' ? 'Verified' : c.status}</span>{c.note && c.status !== 'Verified' && <span style={{ fontSize: 14, color: 'var(--mute)' }}> {c.note}</span>}</div>)}</div>
    {open.length > 0 && <div style={{ marginTop: 12 }}>
      <label className="field"><span>I am a</span><select className="select" style={{ width: '100%' }} value={pick} onChange={e => setClaim(e.target.value)}>{open.map(k => <option key={k}>{k}</option>)}</select></label>
      <label className="field"><span>Proof (registration number, affiliation or reference)</span><textarea rows="2" value={proof} onChange={e => setProof(e.target.value)} /></label>
      {err && <p style={{ color: 'var(--sig)', marginBottom: 8 }}>{err}</p>}
      <button className="btn primary" onClick={submit}>Ask for verification</button>
    </div>}
  </div>
}

export default function Me() {
  const { me } = useAuth(); const threads = useThreads()
  const subs = useSubmissions(); const myEv = me ? subs.filter(x => x.byRef === me.id) : []
  const inst = me?.type === 'Institute', rev = isStaff(me)
  const mine = me ? issuesFor(me.type, me.id) : []
  const myTasks = useTasks().filter(t => isMine(t, me) && t.status !== 'Open')
  const posts = me ? threads.filter(t => t.author === me.name) : []
  return (
    <>
      <PageHead eyebrow="Me" title={me ? `Hello, ${me.name}` : 'Your space'} sub={me ? (inst ? 'Institute account' : rev ? `${me.type} account` : 'User account') : 'Log in or register to join issues and keep your activity here.'} />
      <div className="wrap" style={{ paddingBottom: 70 }}>
        {!me ? (
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22 }}>You are not logged in</h2>
            <p style={{ color: 'var(--mute)', margin: '8px 0 16px' }}>Register as a user, or register your institute. One account can join many issues.</p>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}><Link to="/login" className="btn primary">Log in</Link><Link to="/register" className="btn ghost">Create an account</Link></div>
          </div>
        ) : (
          <div className="grid g2" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="row" style={{ gap: 12 }}><div className="iconbox" style={{ margin: 0 }}>{inst ? <Landmark size={20} /> : <User size={20} />}</div>
                <div><b>{me.name}</b><div className="mono" style={{ color: 'var(--mute)' }}>{inst ? me.type : me.role} · {me.place || 'Place not given'}</div></div></div>
              <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', margin: '12px 0' }}>{me.email}</p>
              {inst && <p style={{ margin: '0 0 12px' }}>{me.status === 'Verified' || !me.status ? 'Verified' : <><Clock size={14} /> {me.status}</>}{me.reviewNote && me.status !== 'Verified' ? `: ${me.reviewNote}` : ''}</p>}
              <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                {can(me, 'evidence.review') && <Link to="/reviewer" className="btn primary">Open reviewer dashboard</Link>}{can(me, 'admin.panel') && <Link to="/admin" className="btn primary">Open admin panel</Link>}{inst && <><Link to={`/institutes/${me.id}`} className="btn primary">View public page</Link><ShareButton title={me.name} /></>}
                <button className="btn ghost" onClick={() => auth.logout()}>Log out</button>
              </div>
            </div>
            {!rev && <div className="card">
              <h3 style={{ fontSize: 18 }}>{mine.length} {mine.length === 1 ? 'issue' : 'issues'} joined</h3>
              {mine.length === 0 && <p style={{ color: 'var(--mute)', margin: '8px 0 12px' }}>You are not on any issue yet.</p>}
              <div className="grid" style={{ gap: 8, margin: '10px 0' }}>{mine.map(a => <Link key={a.issue} to={`/issues/${a.issue}`}><b>{issues.find(i => i.id === a.issue)?.name}</b><div className="mono" style={{ color: 'var(--mute)' }}>Joined {a.joined}</div></Link>)}</div>
              <Link to="/issues" className="btn ghost">Find an issue to join</Link>
              {posts.length > 0 && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 14 }}>{posts.length} forum {posts.length === 1 ? 'thread' : 'threads'} started: {posts.map((t, k) => <span key={t.id}>{k > 0 && ', '}<Link to={`/forum/${t.id}`} style={{ textDecoration: 'underline' }}>{t.title}</Link></span>)}</p>}
            </div>}
          </div>
        )}
        {me?.type === 'User' && <Credentials me={me} />}
        {me && !rev && <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18 }}>Your tasks ({myTasks.length})</h3>
          {myTasks.length === 0 && <p style={{ color: 'var(--mute)', marginTop: 8 }}>Tasks you pick up or are assigned appear here. Open a joined issue and choose its Solution tab.</p>}
          <div className="grid" style={{ gap: 10, marginTop: 12 }}>{myTasks.map(t => <div key={t.id}>
            <b>{t.title}</b><div className="mono" style={{ color: 'var(--mute)' }}>{issues.find(i => i.id === t.issue)?.name} · {t.kind} · {t.how === 'Assigned' ? 'Assigned' : 'Volunteered'}</div>
            <div className="row" style={{ gap: 8, marginTop: 4, flexWrap: 'wrap' }}><span className="chip">{t.status}</span>
              {t.status === 'Taken up' && <><Link to={`/contribute?case=${t.issue}&task=${t.id}`} style={{ textDecoration: 'underline', fontSize: 14 }}>Add evidence for it</Link><button className="btn ghost" onClick={() => taskStore.markDone(me, t.id)}>Mark done</button></>}
              <Link to={`/issues/${t.issue}?tab=Solution`} style={{ textDecoration: 'underline', fontSize: 14 }}>See on the issue</Link></div></div>)}</div>
        </div>}
        {me && !rev && <div className="card" style={{ marginBottom: 24 }}>
          <div className="row between" style={{ flexWrap: 'wrap', gap: 10 }}><h3 style={{ fontSize: 18 }}>Your contributions ({myEv.length})</h3><Link to="/contribute" className="btn primary"><Upload size={15} /> Add evidence</Link></div>
          {myEv.length === 0 && <p style={{ color: 'var(--mute)', marginTop: 8 }}>Evidence you submit appears here with its review status.</p>}
          <div className="grid" style={{ gap: 10, marginTop: 12 }}>{myEv.map(x => <div key={x.id}>
            <b>{x.title}</b><div className="mono" style={{ color: 'var(--mute)' }}>{x.type} · {issues.find(i => i.id === x.issue)?.name} · {x.date}</div>
            <div style={{ marginTop: 4 }}><span className="chip">{x.status === 'Approved' ? `Published · ${x.trust} trust` : x.status}</span>{x.reviewNote && <span style={{ fontSize: 14, color: 'var(--mute)' }}> {x.reviewNote}</span>}</div>
            {x.status === 'Approved' && <Link to={`/issues/${x.issue}`} style={{ textDecoration: 'underline', fontSize: 14 }}>See it on the issue</Link>}</div>)}</div>
        </div>}
        <div className="grid g2">
          {cards.map(([t, d, I, to, b, bg], k) => (
            <Reveal key={t} delay={k * .07}><div className={`hubgroup ${bg}`}>
              <span className="iconbox" style={{ background: '#fff' }}><I size={20} /></span>
              <h2 style={{ fontSize: 24, margin: '14px 0 6px' }}>{t}</h2><p style={{ marginBottom: 16 }}>{d}</p>
              <Link to={to} className="btn">{b} <ArrowUpRight size={14} /></Link>
            </div></Reveal>))}
        </div>
      </div>
    </>
  )
}
