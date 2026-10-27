import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Map } from 'lucide-react'
import { issues } from '../data'
import { PageHead } from '../components/ui'
import CaseCard from '../components/CaseCard'

const ecos = ['Forest', 'Rivers', 'Lakes', 'Wildlife']; const helps = ['Money', 'People', 'Legal']
export default function Issues() {
  const [eco, setEco] = useState([]); const [help, setHelp] = useState([])
  const tog = (a, s, v) => s(a.includes(v) ? a.filter(x => x !== v) : [...a, v])
  const list = issues.filter(i => (!eco.length || eco.includes(i.eco)) && (!help.length || help.some(h => i.help.includes(h))))
  return (
    <>
      <PageHead eyebrow="Find" title="Active issues" sub="Filter by ecosystem or by the kind of help a case needs." />
      <div className="wrap" style={{ paddingBottom: 60 }}>
        <div className="row between" style={{ flexWrap: 'wrap', gap: 20 }}>
          <div className="filters" style={{ margin: 0 }}>
            {ecos.map(e => <button key={e} className={`fbtn ${eco.includes(e) ? 'on' : ''}`} onClick={() => tog(eco, setEco, e)}>{e}</button>)}
            <span style={{ width: 1, background: 'var(--line)', margin: '0 6px' }} />
            {helps.map(e => <button key={e} className={`fbtn ${help.includes(e) ? 'on' : ''}`} onClick={() => tog(help, setHelp, e)}>Needs {e.toLowerCase()}</button>)}
          </div>
          <Link to="/map" className="btn ghost"><Map size={14} /> Map view</Link>
        </div>
        <div className="mono" style={{ color: 'var(--mute)', margin: '28px 0 12px' }}>{list.length} of {issues.length} cases</div>
        {list.length ? <div className="grid g3">{list.map((i, k) => <CaseCard key={i.id} i={i} k={k} />)}</div> : <p style={{ padding: '40px 0' }}>No cases match. Clear a filter.</p>}
      </div>
    </>
  )
}
