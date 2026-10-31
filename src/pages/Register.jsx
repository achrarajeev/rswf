import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Landmark } from 'lucide-react'
import { auth } from '../authStore'
import { PageHead } from '../components/ui'

const types = {
  User: { icon: User, hint: 'Lawyer, researcher, local resident, student' },
  Institute: { icon: Landmark, hint: 'NGO, research institute or company' },
}
const userRoles = ['Lawyer', 'Researcher', 'Local resident', 'Student', 'Other']
const orgTypes = ['NGO', 'Research institute', 'Company']

export default function Register() {
  const nav = useNavigate(); const [params] = useSearchParams(); const next = params.get('next') || '/me'
  const [type, setType] = useState('User')
  const [f, setF] = useState({ name: '', email: '', password: '', place: '', role: 'Local resident', org: '', orgType: 'NGO', reg: '', web: '' })
  const [tried, setTried] = useState(false); const [serverErr, setServerErr] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const inst = type === 'Institute'
  const errors = {
    name: !f.name.trim() && 'Required',
    org: inst && !f.org.trim() && 'Required',
    reg: inst && !f.reg.trim() && 'Required so a reviewer can verify the institute',
    email: !/^\S+@\S+\.\S+$/.test(f.email) && 'Enter a valid email',
    password: f.password.length < 8 && 'At least 8 characters',
  }
  const err = k => tried && errors[k] && <small style={{ color: 'var(--sig)', display: 'block', marginTop: 6 }}>{errors[k]}</small>
  const submit = e => {
    e.preventDefault(); setTried(true)
    if (Object.values(errors).some(Boolean)) return
    const msg = auth.register({ ...f, type }); if (msg) return setServerErr(msg)
    nav(next)
  }
  return (
    <>
      <PageHead eyebrow="Account" title="Create an account" sub="Register as a user, or register your institute. One account can join many issues." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 720 }}>
        <form className="card" onSubmit={submit} noValidate>
          <div className="field"><span>I am registering as</span>
            <div className="seg two">{Object.entries(types).map(([n, v]) => { const I = v.icon; return <button key={n} type="button" className={type === n ? 'on' : ''} onClick={() => setType(n)}><I size={20} />{n}<small>{v.hint}</small></button> })}</div>
          </div>
          {inst && <>
            <label className="field"><span>Institute or organisation name</span><input value={f.org} onChange={set('org')} />{err('org')}</label>
            <label className="field"><span>Type of organisation</span><select value={f.orgType} onChange={set('orgType')}>{orgTypes.map(t => <option key={t}>{t}</option>)}</select></label>
            <label className="field"><span>Registration number (society, trust, CIN or UGC)</span><input value={f.reg} onChange={set('reg')} />{err('reg')}</label>
          </>}
          <label className="field"><span>{inst ? 'Contact person' : 'Full name'}</span><input value={f.name} onChange={set('name')} autoComplete="name" />{err('name')}</label>
          {!inst && <label className="field"><span>I am a</span><select value={f.role} onChange={set('role')}>{userRoles.map(r => <option key={r}>{r}</option>)}</select></label>}
          <label className="field"><span>City and state</span><input value={f.place} onChange={set('place')} placeholder="e.g. Pune, Maharashtra" /></label>
          {inst && <label className="field"><span>Website (optional)</span><input value={f.web} onChange={set('web')} placeholder="https://…" /></label>}
          <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set('email')} autoComplete="email" />{err('email')}</label>
          <label className="field"><span>Password</span><input type="password" value={f.password} onChange={set('password')} autoComplete="new-password" />{err('password')}</label>
          <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none' }}>Prototype: accounts live in this browser tab only. Do not use a real password.</p>
          {inst && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 8 }}>A reviewer checks the registration number. Your page shows “Pending review” until then.</p>}
          {serverErr && <p style={{ color: 'var(--sig)', marginTop: 12 }}>{serverErr}</p>}
          <div className="row between" style={{ marginTop: 20 }}>
            <Link to={`/login${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>I already have an account</Link>
            <button className="btn primary" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </>
  )
}
