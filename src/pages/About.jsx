import { Link } from 'react-router-dom'
import { Upload, ScanSearch, UserCheck, BadgeCheck, ArrowRight } from 'lucide-react'
import { PageHead, Reveal, Trust } from '../components/ui'

const steps = [
  [Upload, 'Someone submits', 'Anyone can attach a document, photo, RTI reply or testimony to a claim. A source is mandatory.'],
  [ScanSearch, 'We trace the source', 'A reviewer opens the original, checks date, author and whether it can be found independently.'],
  [UserCheck, 'A reviewer decides', 'They approve, ask for more evidence or reject, and must leave a written note.'],
  [BadgeCheck, 'A trust level is shown', 'The claim appears with its badge and a link back to the source, so you can check it yourself.'],
]
const levels = [
  ['High', 'Original document or official record seen by a reviewer, and consistent with a second source.'],
  ['Medium', 'Credible source such as a paper or testimony, not yet matched with a second independent source.'],
  ['Unverified', 'Submitted or stated by a party to the case. Shown for transparency, not as fact.'],
]
export default function About() {
  return (
    <>
      <PageHead eyebrow="About" title="How we verify" sub="No source, no claim. Here is exactly how a statement earns a badge." />
      <div className="wrap" style={{ paddingBottom: 70 }}>
        <ol className="grid g2 vsteps">{steps.map(([I, t, d], k) => (
          <Reveal key={t} delay={k * .07}><li className={`hubgroup ${k % 2 ? 'bg-sky' : 'bg-mint'}`}>
            <span className="iconbox" style={{ background: '#fff' }}><I size={20} /></span><small className="mono">Step {k + 1}</small>
            <h2 style={{ fontSize: 22, margin: '4px 0 6px' }}>{t}</h2><p>{d}</p></li></Reveal>))}</ol>
        <h2 style={{ margin: '48px 0 18px' }}>What the badges mean</h2>
        <div className="grid" style={{ gap: 12 }}>{levels.map(([t, d]) => <div key={t} className="card row" style={{ gap: 16 }}><Trust t={t} /><p style={{ margin: 0 }}>{d}</p></div>)}</div>
        <p style={{ margin: '28px 0', color: 'var(--mute)', fontSize: 14 }}>Everything shown today is sample data. Statuses and figures are illustrative until reviewers confirm them.</p>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}><Link to="/research" className="btn primary">See the sources <ArrowRight size={14} /></Link><Link to="/rti" className="btn sky">Collect your own data</Link></div>
      </div>
    </>
  )
}
