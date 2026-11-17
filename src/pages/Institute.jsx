import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ShieldCheck, Clock, Globe, UploadCloud, FileText } from 'lucide-react'
import { institutions, issues } from '../data'
import { issuesFor, useAuth, auth } from '../authStore'
import { docTypes, accept, maxMB, checkDoc, makeDoc, sizeLabel } from '../proofDoc'
import { PageHead, ShareButton } from '../components/ui'

// Shown to the institute's own account when a reviewer asked for more information or rejected the document.
function Resubmit() {
  const [type, setType] = useState(docTypes[0]); const [file, setFile] = useState(null); const [err, setErr] = useState('')
  const send = () => { const m = checkDoc(file) || auth.resubmitInstituteDoc(makeDoc(file, type)); if (m) setErr(m) }
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <b>Send a new document</b>
      <label className="field" style={{ marginTop: 10 }}><span>Type of proof document</span><select value={type} onChange={e => setType(e.target.value)}>{docTypes.map(t => <option key={t}>{t}</option>)}</select></label>
      <label style={{ display: 'block', border: '2px dashed var(--line)', borderRadius: 12, padding: 20, textAlign: 'center', color: 'var(--muted)', cursor: 'pointer' }}><UploadCloud style={{ margin: '0 auto 6px' }} />{file ? `${file.name} (${sizeLabel(file.size)})` : `Choose a PDF, JPG or PNG, up to ${maxMB} MB`}
        <input type="file" accept={accept} style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0] || null); setErr('') }} /></label>
      {err && <p role="alert" style={{ color: 'var(--sig)', marginTop: 8 }}>{err}</p>}
      <button className="btn primary" style={{ marginTop: 12 }} onClick={send}>Send for review</button>
    </div>
  )
}

export default function Institute() {
  const { id } = useParams(); const { account } = useAuth()
  const inst = institutions.find(x => x.id === id)
  if (!inst) return <PageHead eyebrow="Institute" title="Institute not found" sub="The link may be wrong, or the prototype was reset." />
  const status = inst.status || 'Verified'; const verified = status === 'Verified'
  const work = issuesFor('Institute', inst.id)
  const mine = account?.type === 'Institute' && account.ref === inst.id
  return (
    <>
      <PageHead eyebrow={inst.type} title={inst.name} sub={inst.about || `${inst.type} working on environmental issues.`} />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div>
          {status === 'Pending review' && <div className="card" style={{ background: '#fff2d1', borderColor: 'transparent', marginBottom: 18 }}><Clock size={18} /> <b>Pending review.</b> A reviewer will check the registration number and proof document before this institute is marked verified.</div>}
          {status === 'More info needed' && <div className="card" style={{ background: '#fff2d1', borderColor: 'transparent', marginBottom: 18 }}><Clock size={18} /> <b>More information needed.</b> {inst.reviewNote}</div>}
          {status === 'Rejected' && <div className="card" style={{ background: '#fbe9dd', borderColor: 'transparent', marginBottom: 18 }}><b>Not approved.</b> {inst.reviewNote} This institute is hidden from issue pages.</div>}
          {mine && (status === 'More info needed' || status === 'Rejected') && <Resubmit />}
          <h3 style={{ fontSize: 22, marginBottom: 12 }}>Works on {work.length} {work.length === 1 ? 'issue' : 'issues'}</h3>
          {work.length === 0 && <div className="f-empty">Not on any issue yet.{mine && <> <Link to="/issues" style={{ textDecoration: 'underline' }}>Browse issues to join</Link></>}</div>}
          <div className="grid">{work.map(a => { const is = issues.find(i => i.id === a.issue); return <Link key={a.issue} to={`/issues/${a.issue}`} className="card hover"><b>{is?.name}</b><div className="mono" style={{ color: 'var(--mute)', margin: '4px 0 8px' }}>{is?.state} · Joined {a.joined}</div><p>{a.does}</p></Link> })}</div>
          <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 18 }}>Illustrative sample until registrations are verified.</p>
        </div>
        <aside className="card" style={{ alignSelf: 'start' }}>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="chip">{verified ? <><ShieldCheck size={12} /> Verified</> : <><Clock size={12} /> {status}</>}</span>
            <span className="chip"><MapPin size={12} /> {inst.place || 'Place not given'}</span>
          </div>
          {inst.web && <p style={{ marginBottom: 12 }}><Globe size={14} /> <a href={inst.web} rel="noreferrer noopener" target="_blank" style={{ textDecoration: 'underline' }}>{inst.web}</a></p>}
          <ShareButton title={inst.name} className="btn primary" />
          {mine && inst.doc && <p style={{ marginBottom: 12, fontSize: 14 }}><FileText size={14} /> {inst.doc.type}: {inst.doc.name}</p>}
          {mine && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 12 }}>This is your public page. Share the link above.</p>}
        </aside>
      </div>
    </>
  )
}
