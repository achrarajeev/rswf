import { useState, useRef } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Hand, HandCoins, Upload, Video, FileText, Radio, Image as ImageIcon, User, Landmark, Scale, Flame, UserPlus, CalendarDays, ShieldCheck } from 'lucide-react'
import { issues, claims, peopleOnIssue, progress, legal, impact, evidenceTypes } from '../data'
import { useThreads, replyCount } from '../forumStore'
import { useAuth } from '../authStore'
import { useSubmissions, evidenceFor } from '../evidenceStore'
import Solution from './Solution'
import { Status, Trust, Source, PhotoCredit, Missing, ShareButton } from '../components/ui'

const tabs = ['Overview', 'Solution', 'Legal', 'Emissions and biodiversity', 'People', 'Progress', 'Evidence', 'Sources', 'Discussion']
const evIcon = { Video, Document: FileText, 'Live recording': Radio, Photo: ImageIcon }
const kindIcon = { Volunteer: User, Institute: Landmark }
const kindLabel = { All: 'All', Volunteer: 'Volunteers', Institute: 'Institutes' }
const steps = ['Proposed', 'Under clearance', 'Cleared', 'In court', 'Stopped']

export default function IssueDetail() {
  const { id } = useParams(); const i = issues.find(x => x.id === id) || issues[0]
  const [etype, setEtype] = useState('All'); const [donate, setDonate] = useState(false); const [params] = useSearchParams(); const [tab, setTab] = useState(tabs.includes(params.get('tab')) ? params.get('tab') : 'Overview'); const [kind, setKind] = useState('All')
  const { me } = useAuth() // re-render when someone joins
  const people = peopleOnIssue(i.id), updates = progress[i.id] || []
  const proofs = evidenceFor(useSubmissions(), i.id), shownProofs = etype === 'All' ? proofs : proofs.filter(e => e.type === etype)
  const caseThreads = useThreads().filter(t => t.case === i.id && !t.hidden), lg = legal[i.id], im = impact[i.id]
  const shown = kind === 'All' ? people : people.filter(p => p.kind === kind); const idx = steps.indexOf(i.status)
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  return (
    <>
      <section className="dhero" ref={ref}>
        <motion.img src={`/images/${i.img}.jpg`} alt={i.caption} style={{ y }} />
        <PhotoCredit k={i.img} style={{ top: 'auto', bottom: 14 }} />
        <div className="wrap in" style={{ width: '100%' }}>
          <Link to="/issues" className="mono" style={{ opacity: .8, marginBottom: 14 }}>← All issues</Link>
          <div className="row" style={{ flexWrap: 'wrap', marginBottom: 14, color: '#fff' }}><Status s={i.status} /><Trust t={i.trust} /><span className="mono">{i.eco} · {i.caption}</span></div>
          <h1>{i.name}</h1>
          <div className="timeline">{steps.map((s, k) => <div key={s} className={k < idx ? 'done' : k === idx ? 'now' : ''}><i />{s}</div>)}</div>
        </div>
      </section>
      <div className="wrap side" style={{ paddingBottom: 80 }}>
        <div>
          <div className="tabs">{tabs.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}{tab === t && <motion.span layoutId="tabbar" className="bar" />}</button>)}</div>
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            {tab === 'Overview' && <>
              <p className="head" style={{ fontSize: 28, lineHeight: 1.3, marginBottom: 12, letterSpacing: '-.01em', fontWeight: 400 }}>{i.blurb}</p>
              <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginBottom: 32 }}>{i.company} · {i.state} · {i.mw} · illustrative sample until reviewed</p>
              <div className="cmp">
                <div><div className="mono" style={{ opacity: .7 }}>Government says</div><div className="head" style={{ fontSize: 64, margin: '14px 0 6px', lineHeight: 1 }}>38 ha</div><p style={{ opacity: .75 }}>of degraded forest is affected.</p><div style={{ marginTop: 16 }}><Source>Parivesh PP-2041</Source> <Trust t="Unverified" /></div></div>
                <div><div className="mono" style={{ opacity: .7 }}>Independent evidence</div><div className="head" style={{ fontSize: 64, margin: '14px 0 6px', lineHeight: 1, color: 'var(--g1)' }}>{i.hectares} ha</div><p style={{ opacity: .75 }}>including 6 perennial streams, per forest survey.</p><div style={{ marginTop: 16 }}><Source>RTI reply, 12 Aug 2026</Source> <Trust t="High" /></div></div>
              </div>
            </>}
            {tab === 'Solution' && <Solution issue={i} me={me} />}
            {tab === 'Legal' && (lg ? <div className="card"><Scale size={20} /><p style={{ margin: '12px 0' }}>{lg.text}</p><Source>{lg.src}</Source><p style={{ marginTop: 16, color: 'var(--sig)' }}>{lg.gap}</p></div> : <Missing what="Legal record" />)}
            {tab === 'Emissions and biodiversity' && (im ? <div className="grid g2"><div className="card"><Flame color="#E0471B" /><h3 style={{ fontSize: 56, margin: '12px 0' }}>{im.co2}</h3><p>{im.co2Note}</p><Source>{im.co2Src}</Source></div><div className="card"><h3 style={{ fontSize: 56, margin: '34px 0 12px' }}>{im.species}</h3><p>{im.speciesNote}</p><Source>{im.speciesSrc}</Source></div></div> : <Missing what="Emissions and biodiversity data" />)}
            {tab === 'People' && <>
              <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                <p style={{ color: 'var(--mute)' }}>{people.length ? `${people.length} volunteers and institutes are working on this issue.` : 'Nobody has joined this issue yet.'}</p>
                <Link to={`/issues/${i.id}/join`} className="btn primary"><UserPlus size={15} /> Join this issue</Link>
              </div>
              {people.length > 0 && <div className="filters" style={{ marginBottom: 18 }}>{Object.entries(kindLabel).map(([k, l]) => <button key={k} className={`fbtn ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>{l}</button>)}</div>}
              {people.length === 0 && <Missing what="People" cta="Join this case" to={`/issues/${i.id}/join`}>Be the first volunteer or institute to join this case.</Missing>}
              <div className="grid g2">{shown.map(p => { const K = kindIcon[p.kind]; return <div key={p.kind + p.key} className="card"><div className="row" style={{ gap: 12 }}><div className="iconbox" style={{ margin: 0 }}><K size={20} /></div><div><b>{p.kind === 'Institute' ? <Link to={`/institutes/${p.key}`} style={{ textDecoration: 'underline' }}>{p.name}</Link> : p.name}</b><div className="mono" style={{ color: 'var(--mute)' }}>{p.kind} · {p.sub} · {p.place}</div></div></div><p style={{ margin: '14px 0 10px' }}>{p.does}</p><div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>{p.verified?.map(v => <span key={v} className="chip" style={{ background: '#E3EFE7', color: '#1F4D3A' }}><ShieldCheck size={11} /> Verified {v.toLowerCase()}</span>)}<span className="chip"><CalendarDays size={11} />Joined {p.joined}</span>{p.status !== 'Verified' && p.status !== 'Active' && <span className="chip">{p.status}</span>}{p.others.map(o => <Link key={o} to={`/issues/${o}`} className="chip">Also on {issues.find(x => x.id === o)?.name}</Link>)}</div></div> })}</div>
              {people.length > 0 && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 18 }}>Illustrative sample until registrations are verified.</p>}
            </>}
            {tab === 'Progress' && <>
              <div className="card" style={{ background: 'var(--mint)', borderColor: 'transparent', marginBottom: 26 }}>
                <div className="mono" style={{ color: 'var(--mute)' }}>Current status</div>
                <div className="row" style={{ gap: 12, flexWrap: 'wrap', margin: '10px 0' }}><Status s={i.status} /><span className="mono">{updates.length ? `Last update ${updates[0].date}` : 'No updates recorded'}</span></div>
                <p style={{ fontSize: 14 }}>Every update below carries its proof. An update without a source is not shown.</p>
              </div>
              {updates.length === 0 && <Missing what="Progress record" cta="Log progress" to={`/contribute?case=${i.id}`}>No contributor has logged work with proof for this case yet.</Missing>}
              <ol className="proof">{updates.map(u => <li key={u.title}>
                <div className="card"><div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}><span className="mono" style={{ color: 'var(--mute)' }}>{u.date} · {u.by}</span><Trust t={u.trust} /></div>
                  <h3 style={{ fontSize: 20, margin: '10px 0 6px' }}>{u.title}</h3><p>{u.note}</p>
                  <div className="row" style={{ marginTop: 12, gap: 12 }}><img src={`/images/${u.img}.jpg`} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} /><Source>{u.src}</Source></div></div>
              </li>)}</ol>
              {updates.length > 0 && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 18 }}>Illustrative sample until reviewed. <Link to="/contribute" style={{ color: 'var(--g1)', textDecoration: 'underline' }}>Add evidence of progress</Link></p>}
            </>}
            {tab === 'Evidence' && <>
              <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 6 }}>
                <p style={{ color: 'var(--mute)' }}>{proofs.length ? `${proofs.length} items showing work done on this issue.` : 'No evidence of work has been added yet.'}</p>
                <Link to={`/contribute?case=${i.id}`} className="btn primary"><Upload size={15} /> Add evidence</Link>
              </div>
              <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 18 }}>Video, documents and live recordings that prove progress updates. Cited claims are under Sources.</p>
              {proofs.length > 0 && <div className="filters" style={{ marginBottom: 18 }}>{['All', ...evidenceTypes].map(k => <button key={k} className={`fbtn ${etype === k ? 'on' : ''}`} onClick={() => setEtype(k)}>{k}</button>)}</div>}
              {proofs.length === 0 && <Missing what="Evidence of work">Nothing has been uploaded for this case yet.</Missing>}
              {proofs.length > 0 && shownProofs.length === 0 && <div className="f-empty">No {etype.toLowerCase()} items for this case.</div>}
              <div className="grid g2">{shownProofs.map(e => { const T = evIcon[e.type]; return <div key={e.title} className="card">
                <div style={{ position: 'relative' }}><img src={`/images/${e.img}.jpg`} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 14 }} /><span className="chip" style={{ position: 'absolute', left: 10, top: 10, background: '#fff' }}><T size={12} /> {e.type}</span></div>
                <h3 style={{ fontSize: 18, margin: '12px 0 4px' }}>{e.title}</h3>
                <div className="mono" style={{ color: 'var(--mute)' }}>{e.by} · {e.date}</div>
                <p style={{ margin: '10px 0', fontSize: 14 }}>Proves: <b>{e.for}</b></p>
                <Trust t={e.trust} /></div> })}</div>
              {proofs.length > 0 && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 18 }}>Illustrative sample until reviewed.</p>}
            </>}
            {tab === 'Sources' && <div className="grid">{claims.map(c => <div key={c.text} className="card"><p>{c.text}</p><div className="row" style={{ marginTop: 10 }}><Source>{c.src}</Source><Trust t={c.trust} /></div></div>)}</div>}
            {tab === 'Discussion' && <>
              <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                <p style={{ color: 'var(--mute)' }}>{caseThreads.length ? `${caseThreads.length} threads on this case.` : 'No threads on this case yet.'}</p>
                <Link to={`/forum/new?case=${i.id}`} className="btn primary">Start a thread</Link>
              </div>
              <div className="grid">{caseThreads.map(t => <Link key={t.id} to={`/forum/${t.id}`} className="card hover">{t.title}<div className="mono" style={{ color: 'var(--mute)', marginTop: 8 }}>{replyCount(t)} replies · {t.votes} votes</div></Link>)}</div>
              {caseThreads.length > 0 && <p style={{ marginTop: 18 }}><Link to={`/forum?case=${i.id}`} style={{ color: 'var(--g1)', textDecoration: 'underline' }}>Open the forum for this case</Link></p>}
            </>}
          </motion.div>
        </div>
        <aside className="rail" id="help">
          <h3 style={{ fontSize: 28, marginBottom: 6 }}>How you can help</h3>
          <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 20 }}>Needs: {i.help.join(', ') || 'nothing right now'}</p>
          <div className="grid" style={{ gap: 10 }}>
            <Link to={`/issues/${i.id}/join`} className="btn primary"><Hand size={15} /> Volunteer</Link>
            <button className="btn warn" onClick={() => setDonate(d => !d)} aria-expanded={donate}><HandCoins size={15} /> Donate</button>
            {donate && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none' }}>Donations are not open yet. No payment is taken in this prototype.</p>}
            <ShareButton title={i.name} />
          </div>
        </aside>
      </div>
      <button className="sticky-help" onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Hand size={16} /> Help</button>
    </>
  )
}
