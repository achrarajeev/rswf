import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Building2, Landmark, Check, ShieldCheck } from 'lucide-react'
import { issues, helpKinds } from '../data'
import { PageHead } from '../components/ui'

// What we ask for depends on who is joining. Organisations give a registration
// number so a reviewer can check they are real before they appear on the case page.
const kinds = {
  Individual: { icon: User, hint: 'Lawyer, researcher, local resident, student', name: 'Full name', org: null, regLabel: null },
  Company: { icon: Building2, hint: 'Business offering skills, tools or funds', name: 'Contact person', org: 'Company name', regLabel: 'CIN or GST number' },
  Institute: { icon: Landmark, hint: 'University, NGO, trust, research body', name: 'Contact person', org: 'Institute or NGO name', regLabel: 'Registration number (society, trust or UGC)' },
}
const blank = { name: '', org: '', reg: '', email: '', phone: '', place: '', web: '', help: [], msg: '', agree: false }

export default function Join() {
  const { id } = useParams(); const issue = issues.find(x => x.id === id) || issues[0]
  const [kind, setKind] = useState('Individual'); const [f, setF] = useState(blank)
  const [tried, setTried] = useState(false); const [done, setDone] = useState(false)
  const k = kinds[kind]
  const set = key => e => setF({ ...f, [key]: e.target.value })
  const toggle = h => setF({ ...f, help: f.help.includes(h) ? f.help.filter(x => x !== h) : [...f.help, h] })

  const errors = {
    name: !f.name.trim() && 'Required',
    org: k.org && !f.org.trim() && 'Required',
    reg: k.regLabel && !f.reg.trim() && 'Required so a reviewer can verify you',
    email: !/^\S+@\S+\.\S+$/.test(f.email) && 'Enter a valid email',
    help: !f.help.length && 'Pick at least one way you can help',
    agree: !f.agree && 'Please confirm to continue',
  }
  const bad = Object.values(errors).some(Boolean)
  const err = key => tried && errors[key] && <small style={{ color: 'var(--sig)', display: 'block', marginTop: 6 }}>{errors[key]}</small>
  // TODO: no backend yet. Submit should POST { issueId, kind, ...f } to a registrations endpoint.
  const submit = () => { setTried(true); if (!bad) setDone(true) }

  return (
    <>
      <PageHead eyebrow="Act" title="Join this issue" sub={`Register to help with ${issue.name}.`} />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div className="card">
          {done ? (
            <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 20 }}>
              <div className="iconbox" style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: '50%', background: 'var(--g1)', color: '#fff' }}><Check size={32} /></div>
              <h2 style={{ fontSize: 26 }}>Registration received</h2>
              <p style={{ margin: '12px 0 22px', color: 'var(--mute)' }}>A reviewer will check your details and then list you under Contributors on {issue.name}.</p>
              <Link to={`/issues/${issue.id}`} className="btn primary">Back to the issue</Link>
            </motion.div>
          ) : <>
            <div className="field"><span>I am joining as</span>
              <div className="seg">{Object.entries(kinds).map(([n, v]) => { const I = v.icon; return <button key={n} type="button" className={kind === n ? 'on' : ''} onClick={() => setKind(n)}><I size={20} />{n}<small>{v.hint}</small></button> })}</div>
            </div>
            {k.org && <label className="field"><span>{k.org}</span><input value={f.org} onChange={set('org')} />{err('org')}</label>}
            {k.regLabel && <label className="field"><span>{k.regLabel}</span><input value={f.reg} onChange={set('reg')} />{err('reg')}</label>}
            <label className="field"><span>{k.name}</span><input value={f.name} onChange={set('name')} />{err('name')}</label>
            <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set('email')} placeholder="you@example.org" />{err('email')}</label>
            <label className="field"><span>Phone (optional)</span><input type="tel" value={f.phone} onChange={set('phone')} /></label>
            <label className="field"><span>City and state</span><input value={f.place} onChange={set('place')} placeholder="e.g. Pune, Maharashtra" /></label>
            {kind !== 'Individual' && <label className="field"><span>Website (optional)</span><input value={f.web} onChange={set('web')} placeholder="https://…" /></label>}
            <div className="field"><span>How can you help?</span>
              <div className="checks">{helpKinds.map(h => <button key={h} type="button" className={f.help.includes(h) ? 'on' : ''} onClick={() => toggle(h)}>{h}</button>)}</div>{err('help')}
            </div>
            <label className="field"><span>Anything else we should know? (optional)</span><textarea rows="3" value={f.msg} onChange={set('msg')} placeholder="Experience, time you can give, tools or funds you can offer" /></label>
            <label className="agree"><input type="checkbox" checked={f.agree} onChange={e => setF({ ...f, agree: e.target.checked })} /><span>I agree that my name{k.org ? ' and organisation' : ''} may be listed publicly on this issue once a reviewer approves it. My email and phone stay private.</span></label>
            {err('agree')}
            <div className="row between" style={{ marginTop: 20 }}>
              <Link to={`/issues/${issue.id}`} className="btn ghost">Cancel</Link>
              <button className="btn primary" onClick={submit}>Submit registration</button>
            </div>
          </>}
        </div>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}>
          <ShieldCheck color="#1F4D3A" />
          <p style={{ marginTop: 10, lineHeight: 1.6 }}>Anyone can join: a single person, a company or an institute. Organisations are checked against their registration number before they are listed.</p>
          <p style={{ marginTop: 12, lineHeight: 1.6, fontSize: 14, color: 'var(--mute)' }}>Once listed, log your work with proof under Progress and evidence so the status stays honest.</p>
        </aside>
      </div>
    </>
  )
}
