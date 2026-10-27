import { Link } from 'react-router-dom'
import { Upload, Bookmark, ShieldCheck, LayoutGrid, ArrowUpRight } from 'lucide-react'
import { PageHead, Reveal } from '../components/ui'

const cards = [
  ['Your contributions', 'Evidence you submit appears here with its review status.', Upload, '/contribute', 'Add evidence', 'bg-mint'],
  ['Saved cases', 'Follow a case to get its updates. Nothing saved yet.', Bookmark, '/issues', 'Browse issues', 'bg-sky'],
  ['Reviewer tools', 'For reviewers who verify evidence and assign trust levels.', ShieldCheck, '/reviewer', 'Open dashboard', 'bg-mist'],
  ['All features', 'Every part of Earth Ledger, grouped by what you want to do.', LayoutGrid, '/hub', 'Open the hub', 'bg-mint'],
]
export default function Me() {
  return (
    <>
      <PageHead eyebrow="Me" title="Your space" sub="Accounts are not live yet. Your activity will gather here once they are." />
      <div className="wrap grid g2" style={{ paddingBottom: 70 }}>
        {cards.map(([t, d, I, to, b, bg], k) => (
          <Reveal key={t} delay={k * .07}><div className={`hubgroup ${bg}`}>
            <span className="iconbox" style={{ background: '#fff' }}><I size={20} /></span>
            <h2 style={{ fontSize: 24, margin: '14px 0 6px' }}>{t}</h2><p style={{ marginBottom: 16 }}>{d}</p>
            <Link to={to} className="btn">{b} <ArrowUpRight size={14} /></Link>
          </div></Reveal>))}
      </div>
    </>
  )
}
