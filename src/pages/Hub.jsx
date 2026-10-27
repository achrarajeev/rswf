import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { features } from '../data'
import { Icon, PageHead, Reveal } from '../components/ui'

const bgs = ['bg-mint', 'bg-sky', 'bg-mist', 'bg-mint']

export default function Hub() {
  return (
    <>
      <PageHead eyebrow="Hub" title="Explore everything" sub="Every part of Earth Ledger, grouped by what you want to do." />
      <div className="wrap" style={{ paddingBottom: 60 }}>
        <div className="grid g2">
          {Object.entries(features).map(([g, items], k) => (
            <Reveal key={g} delay={(k % 2) * .1}><section className={`hubgroup ${bgs[k % 4]}`}>
              <h2>{g}</h2>
              {items.map(([to, t, d, ic]) => (
                <Link key={t} to={to} className="hubrow">
                  <span className="iconbox" style={{ margin: 0, background: '#fff' }}><Icon name={ic} size={20} /></span>
                  <span><b>{t}</b><small>{d}</small></span>
                  <ArrowUpRight size={18} />
                </Link>))}
            </section></Reveal>))}
        </div>
      </div>
    </>
  )
}
