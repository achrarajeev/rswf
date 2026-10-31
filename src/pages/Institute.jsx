import { useParams, Link } from 'react-router-dom'
import { MapPin, ShieldCheck, Clock, Globe } from 'lucide-react'
import { institutions, issues } from '../data'
import { issuesFor, useAuth } from '../authStore'
import { PageHead, ShareButton } from '../components/ui'

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
          {status === 'Pending review' && <div className="card" style={{ background: '#fff2d1', borderColor: 'transparent', marginBottom: 18 }}><Clock size={18} /> <b>Pending review.</b> A reviewer will check the registration number before this institute is marked verified.</div>}
          {status === 'More info needed' && <div className="card" style={{ background: '#fff2d1', borderColor: 'transparent', marginBottom: 18 }}><Clock size={18} /> <b>More information needed.</b> {inst.reviewNote}</div>}
          {status === 'Rejected' && <div className="card" style={{ background: '#fbe9dd', borderColor: 'transparent', marginBottom: 18 }}><b>Not approved.</b> {inst.reviewNote} This institute is hidden from issue pages.</div>}
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
          {mine && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 12 }}>This is your public page. Share the link above.</p>}
        </aside>
      </div>
    </>
  )
}
