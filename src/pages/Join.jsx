import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ShieldCheck } from 'lucide-react'
import { issues, helpKinds, needToKinds } from '../data'
import { useAuth, auth } from '../authStore'
import { PageHead } from '../components/ui'
import { isStaff, can } from '../roles'

// Joining needs an account (see Register). The form only asks how you can help on THIS issue;
// who you are comes from your account, so one person or institute can join many issues.
export default function Join() {
  const { id } = useParams(); const issue = issues.find(x => x.id === id) || issues[0]
  const { me } = useAuth()
  const [help, setHelp] = useState(() => [...new Set(issue.help.flatMap(n => needToKinds[n] || []))])
  const [msg, setMsg] = useState(''); const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false); const [done, setDone] = useState(false); const [serverErr, setServerErr] = useState('')
  const toggle = h => setHelp(help.includes(h) ? help.filter(x => x !== h) : [...help, h])
  const errors = { help: !help.length && 'Pick at least one way you can help', agree: !agree && 'Please confirm to continue' }
  const err = k => tried && errors[k] && <small style={{ color: 'var(--sig)', display: 'block', marginTop: 6 }}>{errors[k]}</small>
  const next = encodeURIComponent(`/issues/${issue.id}/join`)
  const pending = me?.type === 'Institute' && me.status === 'Pending review'
  if (isStaff(me)) return <><PageHead eyebrow="Act" title="Join this issue" sub={`Help with ${issue.name}.`} /><div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card">Staff accounts ({me.type}) run the site and do not join issues. <Link to={can(me, 'admin.panel') ? '/admin' : '/reviewer'} style={{ textDecoration: 'underline' }}>Open your dashboard</Link>.</div></div></>
  // TODO: with a backend this is POST /issues/:id/assignments for the signed-in account.
  const submit = () => {
    setTried(true); if (Object.values(errors).some(Boolean)) return
    const m = auth.join(issue.id, msg.trim() || `Offering: ${help.join(', ').toLowerCase()}.`)
    m ? setServerErr(m) : setDone(true)
  }
  return (
    <>
      <PageHead eyebrow="Act" title="Join this issue" sub={`Help with ${issue.name}.`} />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div className="card">
          {!me ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <h2 style={{ fontSize: 24 }}>Log in to join</h2>
              <p style={{ margin: '12px 0 22px', color: 'var(--mute)' }}>You need an account so one profile can join many issues. Register as a user, or register your institute.</p>
              <div className="row" style={{ gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={`/login?next=${next}`} className="btn primary">Log in</Link>
                <Link to={`/register?next=${next}`} className="btn ghost">Create an account</Link>
              </div>
            </div>
          ) : done ? (
            <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 20 }}>
              <div className="iconbox" style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: '50%', background: 'var(--g1)', color: '#fff' }}><Check size={32} /></div>
              <h2 style={{ fontSize: 26 }}>You are on {issue.name}</h2>
              <p style={{ margin: '12px 0 22px', color: 'var(--mute)' }}>{pending ? 'Your institute is listed as “Pending review” until a reviewer checks it.' : 'You now appear under People on this issue.'}</p>
              <div className="row" style={{ gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><Link to={`/issues/${issue.id}?tab=Solution`} className="btn primary">Pick up a task</Link><Link to={`/issues/${issue.id}`} className="btn ghost">Back to the issue</Link><Link to="/me" className="btn ghost">Your space</Link></div>
            </motion.div>
          ) : <>
            <p style={{ color: 'var(--mute)' }}>Joining as <b style={{ color: 'var(--ink)' }}>{me.name}</b> ({me.type === 'Institute' ? 'institute' : 'user'}).</p>
            <div className="field"><span>How can you help?</span>
              <div className="checks">{helpKinds.map(h => <button key={h} type="button" className={help.includes(h) ? 'on' : ''} onClick={() => toggle(h)}>{h}</button>)}</div>{err('help')}
            </div>
            <label className="field"><span>What will you do on this issue? (optional)</span><textarea rows="3" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Experience, time you can give, tools or funds you can offer" /></label>
            <label className="agree"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /><span>I agree that my name{me.type === 'Institute' ? ' and organisation' : ''} may be listed publicly on this issue.</span></label>
            {err('agree')}
            {serverErr && <p style={{ color: 'var(--sig)', marginTop: 10 }}>{serverErr}</p>}
            <div className="row between" style={{ marginTop: 20 }}>
              <Link to={`/issues/${issue.id}`} className="btn ghost">Cancel</Link>
              <button className="btn primary" onClick={submit}>Join this issue</button>
            </div>
          </>}
        </div>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}>
          <ShieldCheck color="#1F4D3A" />
          <p style={{ marginTop: 10, lineHeight: 1.6 }}>Anyone can join: a single person or an institute. Institutes are checked against their registration number and show as “Pending review” until then.</p>
          <p style={{ marginTop: 12, lineHeight: 1.6, fontSize: 14, color: 'var(--mute)' }}>Once on an issue, log your work with proof under Progress and Evidence so the status stays honest.</p>
        </aside>
      </div>
    </>
  )
}
