import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pin, EyeOff, Eye, X, UserPlus } from 'lucide-react'
import { issues, institutions, credentials } from '../data'
import { useAuth, auth } from '../authStore'
import { useThreads, forum } from '../forumStore'
import { useSubmissions } from '../evidenceStore'
import { useAudit } from '../auditStore'
import { can, staffRoles } from '../roles'
import { PageHead } from '../components/ui'

// Admin panel. Admins see everything; moderators see Moderation only. Every action here is written to the audit log.
// TODO: each action is a protected API call once there is a backend (see the TODO notes in authStore, forumStore and roles).
const caseName = id => issues.find(i => i.id === id)?.name

function Stat({ n, label, to }) {
  const body = <><div className="head" style={{ fontSize: 40, lineHeight: 1 }}>{n}</div><div className="mono" style={{ color: 'var(--mute)', marginTop: 6 }}>{label}</div></>
  return to ? <Link to={to} className="card hover">{body}</Link> : <div className="card">{body}</div>
}

function Overview() {
  const subs = useSubmissions(), threads = useThreads(), log = useAudit(); useAuth()
  const users = auth.users()
  return <div className="wrap" style={{ margin: '24px auto 60px' }}>
    <div className="grid g2" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>
      <Stat n={subs.filter(x => x.status === 'Pending review').length} label="Evidence waiting" to="/reviewer" />
      <Stat n={institutions.filter(i => i.status === 'Pending review').length} label="Institutes waiting" to="/reviewer?tab=Institutes" />
      <Stat n={credentials.filter(c => c.status === 'Pending review').length} label="Credentials waiting" to="/reviewer?tab=Verification" />
      <Stat n={threads.filter(t => t.reported && !t.hidden).length} label="Reported threads" />
      <Stat n={users.length} label="Accounts" />
      <Stat n={users.filter(u => u.suspended).length} label="Suspended" />
    </div>
    <h3 style={{ fontSize: 20, margin: '28px 0 10px' }}>Audit log</h3>
    <div className="grid" style={{ gap: 8 }}>{log.map(e => <div key={e.id} className="card"><b>{e.action}</b>{e.target ? `: ${e.target}` : ''}<div className="mono" style={{ color: 'var(--mute)', marginTop: 4 }}>{e.actor} · {e.when}</div></div>)}</div>
  </div>
}

function Users() {
  const { me } = useAuth(); const all = auth.users()
  const [q, setQ] = useState(''); const [role, setRole] = useState('All'); const [err, setErr] = useState('')
  const [inv, setInv] = useState({ name: '', email: '', role: 'Reviewer', password: 'demo1234' }); const [ok, setOk] = useState('')
  const shown = all.filter(u => (role === 'All' || u.type === role) && `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))
  const invite = () => { const m = auth.inviteStaff(inv); m ? (setErr(m), setOk('')) : (setErr(''), setOk(`${inv.name.trim()} can now log in as ${inv.role}.`), setInv({ ...inv, name: '', email: '' })) }
  return <div className="wrap side" style={{ margin: '24px auto 60px' }}>
    <div>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <input className="select" style={{ flex: 1, minWidth: 180 }} value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email" aria-label="Search accounts" />
        <select className="select" value={role} onChange={e => setRole(e.target.value)} aria-label="Filter by role"><option>All</option>{['User', 'Institute', ...staffRoles].map(r => <option key={r}>{r}</option>)}</select>
      </div>
      {err && <p style={{ color: 'var(--sig)', marginBottom: 10 }}>{err}</p>}
      <div className="grid" style={{ gap: 10 }}>{shown.map(u => <div key={u.email} className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}><b>{u.name}{u.self && ' (you)'}</b><span className="row" style={{ gap: 6 }}><span className="chip">{u.type}</span>{u.suspended && <span className="chip" style={{ background: '#FBE9DD', color: '#C8561B' }}>Suspended</span>}</span></div>
        <div className="mono" style={{ color: 'var(--mute)', textTransform: 'none', margin: '4px 0 10px' }}>{u.email}{u.place ? ` · ${u.place}` : ''}{u.status && u.status !== 'Verified' ? ` · ${u.status}` : ''}</div>
        {!u.self && <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {staffRoles.includes(u.type) && <select className="select" value={u.type} aria-label={`Role for ${u.name}`} onChange={e => setErr(auth.setStaffRole(u.email, e.target.value) || '')}>{staffRoles.map(r => <option key={r}>{r}</option>)}</select>}
          <button className="btn ghost" onClick={() => setErr(auth.setSuspended(u.email, !u.suspended) || '')}>{u.suspended ? 'Reinstate' : 'Suspend'}</button>
        </div>}
      </div>)}{!shown.length && <div className="f-empty">No accounts match.</div>}</div>
    </div>
    <aside className="card" style={{ alignSelf: 'start' }}>
      <UserPlus size={20} /><h3 style={{ fontSize: 18, margin: '8px 0' }}>Invite staff</h3>
      <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 10 }}>Reviewers, moderators and admins cannot sign up themselves. Prototype: you set a temporary password.</p>
      <label className="field"><span>Name</span><input value={inv.name} onChange={e => setInv({ ...inv, name: e.target.value })} /></label>
      <label className="field"><span>Email</span><input type="email" value={inv.email} onChange={e => setInv({ ...inv, email: e.target.value })} /></label>
      <label className="field"><span>Role</span><select value={inv.role} onChange={e => setInv({ ...inv, role: e.target.value })}>{staffRoles.map(r => <option key={r}>{r}</option>)}</select></label>
      <label className="field"><span>Temporary password</span><input value={inv.password} onChange={e => setInv({ ...inv, password: e.target.value })} /></label>
      {ok && <p style={{ color: 'var(--g1)', marginBottom: 8 }}>{ok}</p>}
      <button className="btn primary" onClick={invite}>Create staff account</button>
    </aside>
  </div>
}

function ModCard({ t, me, hidden }) {
  const [note, setNote] = useState(''); const [err, setErr] = useState('')
  const run = a => setErr(forum.moderate(me, t.id, a, note) || '')
  return <div className="card">
    <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}><b><Link to={`/forum/${t.id}`} style={{ textDecoration: 'underline' }}>{t.title}</Link></b>{t.pinned && <span className="chip"><Pin size={11} /> Pinned</span>}</div>
    <div className="mono" style={{ color: 'var(--mute)', textTransform: 'none', margin: '4px 0 8px' }}>{t.author} · {caseName(t.case)} · {t.posts.length} replies</div>
    <p style={{ fontSize: 14, marginBottom: 10 }}>{t.body.slice(0, 160)}{t.body.length > 160 ? '…' : ''}</p>
    {hidden ? <>{t.modNote && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 8 }}>Hidden: {t.modNote}</p>}<button className="btn ghost" onClick={() => run('restore')}><Eye size={14} /> Restore</button></> : <>
      <label className="field"><span>Note (needed to hide or dismiss)</span><input value={note} onChange={e => setNote(e.target.value)} /></label>
      {err && <p style={{ color: 'var(--sig)', marginBottom: 8 }}>{err}</p>}
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="btn warn" onClick={() => run('hide')}><EyeOff size={14} /> Hide thread</button>
        <button className="btn ghost" onClick={() => run('dismiss')}><X size={14} /> Dismiss report</button>
        <button className="btn ghost" onClick={() => run(t.pinned ? 'unpin' : 'pin')}><Pin size={14} /> {t.pinned ? 'Unpin' : 'Pin'}</button>
      </div></>}
  </div>
}

function Moderation({ me }) {
  const threads = useThreads(); const reported = threads.filter(t => t.reported && !t.hidden), hidden = threads.filter(t => t.hidden)
  return <div className="wrap" style={{ margin: '24px auto 60px', maxWidth: 760 }}>
    <h3 style={{ fontSize: 20, marginBottom: 10 }}>Reported threads ({reported.length})</h3>
    <div className="grid" style={{ gap: 12 }}>{reported.map(t => <ModCard key={t.id} t={t} me={me} />)}{!reported.length && <div className="card">No reports waiting.</div>}</div>
    <h3 style={{ fontSize: 20, margin: '28px 0 10px' }}>Hidden threads ({hidden.length})</h3>
    <div className="grid" style={{ gap: 12 }}>{hidden.map(t => <ModCard key={t.id} t={t} me={me} hidden />)}{!hidden.length && <div className="card">Nothing hidden.</div>}</div>
  </div>
}

export default function Admin() {
  const { me } = useAuth()
  const tabs = ['Overview', 'Users', 'Moderation'].filter(t => t === 'Moderation' ? can(me, 'forum.moderate') : can(me, 'users.manage'))
  const [tab, setTab] = useState(null); const cur = tabs.includes(tab) ? tab : tabs[0]
  if (!can(me, 'admin.panel')) return <>
    <PageHead eyebrow="Manage" title="Admin panel" sub="For admins and moderators." />
    <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card">
      <h2 style={{ fontSize: 22 }}>{me ? 'Admins and moderators only' : 'Log in as staff'}</h2>
      <p style={{ color: 'var(--mute)', margin: '8px 0 16px' }}>{me ? `You are logged in as ${me.name}, which has no access here.` : 'Staff accounts are invited by an admin. Demo accounts are on the login page.'}</p>
      <Link to="/login?next=%2Fadmin" className="btn primary">{me ? 'Switch account' : 'Log in'}</Link>
    </div></div></>
  return <>
    <PageHead eyebrow="Manage" title="Admin panel" sub={`${me.type}: ${me.name}`} />
    <div className="wrap" style={{ marginTop: 24 }}><div className="filters">{tabs.map(t => <button key={t} className={`fbtn ${cur === t ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      {can(me, 'evidence.review') && <Link to="/reviewer" className="fbtn">Reviewer dashboard</Link>}</div></div>
    {cur === 'Overview' ? <Overview /> : cur === 'Users' ? <Users /> : <Moderation me={me} />}
  </>
}
