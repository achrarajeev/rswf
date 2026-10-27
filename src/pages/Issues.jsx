import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Map, SlidersHorizontal, X, ArrowDownUp, Search } from 'lucide-react'
import { issues } from '../data'
import { PageHead } from '../components/ui'
import CaseCard from '../components/CaseCard'

const uniq = k => [...new Set(issues.map(i => i[k]))].sort()
const groups = [
  ['State', 'state', uniq('state')],
  ['Ecosystem', 'eco', ['Forest', 'Rivers', 'Lakes', 'Wildlife']],
  ['Company', 'company', uniq('company')],
  ['Legal status', 'status', ['Proposed', 'Under clearance', 'Cleared', 'In court', 'Stopped']],
]
const helps = ['Money', 'People', 'Legal']
const rank = { High: 0, Medium: 1, Unverified: 2 }
const sorts = { name: ['Name, A to Z', (a, b) => a.name.localeCompare(b.name)], area: ['Largest area first', (a, b) => b.hectares - a.hectares], trust: ['Highest trust first', (a, b) => rank[a.trust] - rank[b.trust]], help: ['Most help needed', (a, b) => b.help.length - a.help.length] }

export default function Issues() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [f, setF] = useState({ state: [], eco: [], company: [], status: [], help: [] })
  const [sort, setSort] = useState('name'); const [open, setOpen] = useState(false)
  const tog = (k, v) => setF(o => ({ ...o, [k]: o[k].includes(v) ? o[k].filter(x => x !== v) : [...o[k], v] }))
  const active = Object.values(f).flat().length
  const clear = () => { setF({ state: [], eco: [], company: [], status: [], help: [] }); setParams({}) }

  const list = useMemo(() => issues
    .filter(i => ['state', 'eco', 'company', 'status'].every(k => !f[k].length || f[k].includes(i[k])))
    .filter(i => !f.help.length || f.help.some(h => i.help.includes(h)))
    .filter(i => !q || [i.name, i.company, i.state, i.eco, i.blurb].join(' ').toLowerCase().includes(q.toLowerCase()))
    .sort(sorts[sort][1]), [f, q, sort])
  const count = (k, v) => issues.filter(i => i[k] === v).length

  return (
    <>
      <PageHead eyebrow="Find" title="Active issues" sub="Filter by place, company, legal status or the kind of help a case needs." />
      <div className="wrap iss">
        <button className="filter-toggle" onClick={() => setOpen(true)}><SlidersHorizontal size={16} /> Filters{active ? ` (${active})` : ''}</button>
        <aside className={`iss-side ${open ? 'open' : ''}`}>
          <div className="iss-side-h"><b>Filters</b>{active > 0 && <button onClick={clear}>Clear all</button>}<button className="close" onClick={() => setOpen(false)} aria-label="Close filters"><X size={20} /></button></div>
          {groups.map(([title, k, opts]) => (
            <fieldset key={k}><legend>{title}</legend>
              {opts.map(o => <label key={o} className={f[k].includes(o) ? 'on' : ''}><input type="checkbox" checked={f[k].includes(o)} onChange={() => tog(k, o)} /><span className="box" />{o}<em>{count(k, o)}</em></label>)}
            </fieldset>))}
          <fieldset><legend>Help needed</legend>
            {helps.map(o => <label key={o} className={f.help.includes(o) ? 'on' : ''}><input type="checkbox" checked={f.help.includes(o)} onChange={() => tog('help', o)} /><span className="box" />{o}<em>{issues.filter(i => i.help.includes(o)).length}</em></label>)}
          </fieldset>
          <button className="btn primary apply" onClick={() => setOpen(false)}>Show {list.length} cases</button>
        </aside>
        {open && <div className="iss-scrim" onClick={() => setOpen(false)} />}

        <div className="iss-main">
          <div className="iss-bar">
            <span className="mono" style={{ color: 'var(--mute)' }}>{list.length} of {issues.length} cases</span>
            {q && <button className="qchip" onClick={() => setParams({})}><Search size={12} /> {q} <X size={13} /></button>}
            <label className="sortsel"><ArrowDownUp size={15} /><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort cases">{Object.entries(sorts).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select></label>
            <Link to="/map" className="btn ghost"><Map size={14} /> Map view</Link>
          </div>
          {list.length ? <div className="grid g2 iss-grid">{list.map((i, k) => <CaseCard key={i.id} i={i} k={k} />)}</div>
            : <div className="f-empty">No cases match. <button className="link" onClick={clear}>Clear filters</button></div>}
        </div>
      </div>
    </>
  )
}
