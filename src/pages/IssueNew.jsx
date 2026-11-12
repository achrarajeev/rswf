import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, UploadCloud, ShieldCheck } from 'lucide-react'
import { evidenceTypes } from '../data'
import states from '../states.json'
import { useAuth } from '../authStore'
import { issueStore, validate, ecosystems, legalStatuses } from '../issueStore'
import { PageHead } from '../components/ui'
import { isStaff, can } from '../roles'

const stateNames = states.features.map(f => f.properties.name).sort()
const blank = { name: '', state: '', eco: ecosystems[0], blurb: '', company: '', hectares: '', status: legalStatuses[0], legalText: '', solutionText: '', evType: evidenceTypes[0], evTitle: '', evLink: '', evFile: '', evNote: '' }

// Submit a new issue. Evidence is mandatory; a reviewer decides whether it is listed (GitHub issue #6).
export default function IssueNew() {
  const { me } = useAuth(); const [f, setF] = useState(blank); const [tried, setTried] = useState(false); const [done, setDone] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const err = validate(f)
  const submit = e => { e.preventDefault(); setTried(true); if (err) return; issueStore.submit(me, f); setDone(true) }
  const here = '/issues/new'

  if (!me || isStaff(me) || !can(me, 'contribute')) return (
    <>
      <PageHead eyebrow="Act" title="Submit an issue" sub="Tell us about a project that harms a forest, river, lake or wildlife, with evidence." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card">
        {me ? <p>Staff accounts ({me.type}) check and run the site, and do not submit issues.</p> : <>
          <h2 style={{ fontSize: 22 }}>Log in to submit an issue</h2>
          <p style={{ color: 'var(--mute)', margin: '8px 0 16px' }}>Submissions are credited to your account so a reviewer can follow up.</p>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}><Link to={`/login?next=${encodeURIComponent(here)}`} className="btn primary">Log in</Link><Link to={`/register?next=${encodeURIComponent(here)}`} className="btn ghost">Create an account</Link></div></>}
      </div></div>
    </>
  )

  if (done) return (
    <>
      <PageHead eyebrow="Act" title="Submit an issue" sub="Tell us about a project that harms a forest, river, lake or wildlife, with evidence." />
      <div className="wrap" style={{ margin: '28px auto 60px', maxWidth: 640 }}><div className="card" style={{ textAlign: 'center', padding: 28 }}>
        <div className="iconbox" style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: '50%', background: 'var(--green)', color: '#fff' }}><Check size={32} /></div>
        <h2 style={{ fontSize: 26 }}>Submitted. Thank you.</h2>
        <p style={{ color: 'var(--mute)', margin: '12px 0 18px' }}>A reviewer will check the evidence. If it is accepted the issue is listed, and what you wrote fills its tabs.</p>
        <div className="row" style={{ gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><Link to="/issues" className="btn primary">Browse issues</Link><button className="btn ghost" onClick={() => { setF(blank); setTried(false); setDone(false) }}>Submit another</button></div>
      </div></div>
    </>
  )

  return (
    <>
      <PageHead eyebrow="Act" title="Submit an issue" sub="Tell us about a project that harms a forest, river, lake or wildlife, with evidence." />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <form className="card" onSubmit={submit} noValidate>
          <h3>About the issue</h3>
          <label className="field"><span>Title (required)</span><input value={f.name} onChange={set('name')} placeholder="e.g. Saidongar Pumped Storage" /></label>
          <div className="grid g2">
            <label className="field"><span>State (required)</span><select value={f.state} onChange={set('state')}><option value="">Choose a state</option>{stateNames.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="field"><span>Category</span><select value={f.eco} onChange={set('eco')}>{ecosystems.map(s => <option key={s}>{s}</option>)}</select></label>
          </div>
          <label className="field"><span>Description (required)</span><textarea rows="4" value={f.blurb} onChange={set('blurb')} placeholder="What is happening, where, and who is affected" /></label>
          <div className="grid g2">
            <label className="field"><span>Company or authority (optional)</span><input value={f.company} onChange={set('company')} /></label>
            <label className="field"><span>Area affected in hectares (optional)</span><input type="number" min="0" value={f.hectares} onChange={set('hectares')} /></label>
          </div>

          <h3 style={{ marginTop: 28 }}>Legal status and solution (optional)</h3>
          <label className="field"><span>Where is it in the approval process?</span><select value={f.status} onChange={set('status')}>{legalStatuses.map(s => <option key={s}>{s}</option>)}</select></label>
          <label className="field"><span>Legal details</span><textarea rows="3" value={f.legalText} onChange={set('legalText')} placeholder="Court case, clearance stage, order dates. Shows on the Legal tab." /></label>
          <label className="field"><span>Is there a solution? What is it?</span><textarea rows="3" value={f.solutionText} onChange={set('solutionText')} placeholder="Shows on the Solution tab." /></label>

          <h3 style={{ marginTop: 28 }}>Evidence (required)</h3>
          <div className="field"><span>Type</span><div className="checks">{evidenceTypes.map(t => <button key={t} type="button" className={f.evType === t ? 'on' : ''} onClick={() => setF({ ...f, evType: t })}>{t}</button>)}</div></div>
          <label className="field"><span>Evidence title</span><input value={f.evTitle} onChange={set('evTitle')} placeholder="e.g. Forest survey map, northern boundary" /></label>
          <label className="field"><span>Link to the {f.evType.toLowerCase()}</span><input value={f.evLink} onChange={set('evLink')} placeholder="https://…" /></label>
          <label style={{ display: 'block', border: '2px dashed var(--line)', borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--muted)', cursor: 'pointer' }}><UploadCloud style={{ margin: '0 auto 6px' }} />{f.evFile || 'Or choose a file'}
            <input type="file" style={{ display: 'none' }} onChange={e => setF({ ...f, evFile: e.target.files[0]?.name || '' })} /></label>
          <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 8 }}>Prototype: only the file name is kept. Nothing is uploaded.</p>
          <label className="field"><span>How did you obtain it?</span><textarea rows="3" value={f.evNote} onChange={set('evNote')} placeholder="Who recorded or wrote it, where and when" /></label>

          {tried && err && <p role="alert" style={{ color: 'var(--sig)', marginBottom: 12 }}>{err}</p>}
          <button className="btn warn" type="submit">Submit for review</button>
        </form>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}><ShieldCheck color="#1F4D3A" /><p style={{ marginTop: 10, lineHeight: 1.6 }}>An issue is listed only after a reviewer checks the evidence and assigns a trust level. Without evidence it cannot be submitted.</p></aside>
      </div>
    </>
  )
}
