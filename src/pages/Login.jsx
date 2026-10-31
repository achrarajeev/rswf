import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { auth } from '../authStore'
import { PageHead } from '../components/ui'

export default function Login() {
  const nav = useNavigate(); const [params] = useSearchParams(); const next = params.get('next') || '/me'
  const [f, setF] = useState({ email: '', password: '' }); const [e, setE] = useState('')
  const fill = email => setF({ email, password: 'demo1234' })
  const submit = ev => { ev.preventDefault(); const m = auth.login(f.email, f.password); m ? setE(m) : nav(next) }
  return (
    <>
      <PageHead eyebrow="Account" title="Log in" sub="Log in to join issues and manage your page." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 520 }}>
        <form className="card" onSubmit={submit}>
          <label className="field"><span>Email</span><input type="email" value={f.email} onChange={ev => setF({ ...f, email: ev.target.value })} autoComplete="email" /></label>
          <label className="field"><span>Password</span><input type="password" value={f.password} onChange={ev => setF({ ...f, password: ev.target.value })} autoComplete="current-password" /></label>
          {e && <p style={{ color: 'var(--sig)' }}>{e}</p>}
          <div className="row between" style={{ marginTop: 20 }}>
            <Link to={`/register${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link>
            <button className="btn primary" type="submit">Log in</button>
          </div>
        </form>
        <div className="card" style={{ marginTop: 16, background: 'var(--mint)', borderColor: 'transparent' }}>
          <b>Demo accounts</b>
          <p style={{ fontSize: 14, color: 'var(--mute)', margin: '6px 0 12px' }}>Prototype only. Password for all demo accounts is demo1234.</p>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn ghost" onClick={() => fill('ganesh@example.org')}>Ganesh (user)</button>
            <button type="button" className="btn ghost" onClick={() => fill('hima@example.org')}>Hima (institute)</button>
            <button type="button" className="btn ghost" onClick={() => fill('asha@example.org')}>Asha (reviewer)</button>
            <button type="button" className="btn ghost" onClick={() => fill('ravi@example.org')}>Ravi (moderator)</button>
            <button type="button" className="btn ghost" onClick={() => fill('meena@example.org')}>Meena (admin)</button>
          </div>
        </div>
      </div>
    </>
  )
}
