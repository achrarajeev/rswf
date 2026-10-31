import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { issues } from '../data'
import { forum } from '../forumStore'
import { useAuth } from '../authStore'
import { PageHead } from '../components/ui'

export default function ForumNew() {
  const nav = useNavigate(); const { me } = useAuth(); const [params] = useSearchParams()
  const [f, setF] = useState({ title: '', case: issues.some(i => i.id === params.get('case')) ? params.get('case') : issues[0].id, author: me?.name || '', role: 'Local', body: '' })
  const [tried, setTried] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const errors = { title: !f.title.trim() && 'Required', author: !f.author.trim() && 'Required', body: !f.body.trim() && 'Say what you need or found' }
  const err = k => tried && errors[k] && <small style={{ color: 'var(--sig)', display: 'block', marginTop: 6 }}>{errors[k]}</small>
  const submit = () => {
    setTried(true); if (Object.values(errors).some(Boolean)) return
    nav(`/forum/${forum.add({ ...f, title: f.title.trim(), author: f.author.trim(), body: f.body.trim() })}`)
  }
  return (
    <>
      <PageHead eyebrow="Discuss" title="Start a thread" sub="Ask for a cross-check, share a field note or request an RTI template." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 720 }}>
        <div className="card">
          <label className="field"><span>Case</span><select value={f.case} onChange={set('case')}>{issues.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
          <label className="field"><span>Title</span><input value={f.title} onChange={set('title')} />{err('title')}</label>
          <label className="field"><span>Details</span><textarea rows="5" value={f.body} onChange={set('body')} placeholder="Link what you cite. No source, no claim." />{err('body')}</label>
          <label className="field"><span>Display name</span><input value={f.author} onChange={set('author')} />{err('author')}</label>
          <label className="field"><span>I am a</span><select value={f.role} onChange={set('role')}>{['Lawyer', 'Researcher', 'Local'].map(r => <option key={r}>{r}</option>)}</select></label>
          <div className="row between" style={{ marginTop: 20 }}>
            <Link to="/forum" className="btn ghost">Cancel</Link>
            <button className="btn primary" onClick={submit}>Post thread</button>
          </div>
        </div>
      </div>
    </>
  )
}
