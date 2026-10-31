import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Hand, Undo2, Check, Trash2, User, Landmark } from 'lucide-react'
import { solutionSteps, people, institutions, assignments, helpKinds } from '../data'
import { useTasks, taskStore, can, isMine } from '../tasksStore'

const filters = ['All', 'Open', 'Taken up', 'Done']
const who = t => t.institution ? { name: institutions.find(x => x.id === t.institution)?.name, to: `/institutes/${t.institution}`, I: Landmark }
  : t.person ? { name: people.find(x => x.id === t.person)?.name, I: User } : null

// The issue's solution: the problem, ordered steps, and the tasks under each step.
export default function Solution({ issue, me }) {
  const all = useTasks().filter(t => t.issue === issue.id)
  const steps = solutionSteps.filter(s => s.issue === issue.id).sort((a, b) => a.order - b.order)
  const [f, setF] = useState('All'); const [err, setErr] = useState(''); const [adding, setAdding] = useState(null)
  const [draft, setDraft] = useState({ title: '', kind: helpKinds[0] })
  const maintain = can.maintain(me, issue.id), pick = can.pick(me, issue.id)
  const run = r => setErr(r || '')
  const crew = assignments.filter(a => a.issue === issue.id).map(a => a.institution ? { v: `institution:${a.institution}`, n: institutions.find(x => x.id === a.institution)?.name } : { v: `person:${a.person}`, n: people.find(x => x.id === a.person)?.name })
  const count = s => all.filter(t => t.status === s).length
  const addTask = step => {
    if (!draft.title.trim()) return setErr('Give the task a short title')
    const r = taskStore.add(me, { issue: issue.id, step, title: draft.title, kind: draft.kind }); run(r); if (!r) { setAdding(null); setDraft({ title: '', kind: helpKinds[0] }) }
  }
  const join = !me ? <Link to={`/login?next=${encodeURIComponent(`/issues/${issue.id}?tab=Solution`)}`} className="btn ghost">Log in to pick up a task</Link>
    : can.join(me, issue.id) ? <Link to={`/issues/${issue.id}/join`} className="btn ghost">Join this issue to pick up a task</Link> : null

  return <>
    <div className="card" style={{ background: 'var(--mint)', borderColor: 'transparent', marginBottom: 22 }}>
      <div className="mono" style={{ color: 'var(--mute)' }}>The problem</div>
      <p style={{ fontSize: 17, margin: '8px 0 14px' }}>{issue.blurb}</p>
      <div className="row" style={{ gap: 14, flexWrap: 'wrap' }}><span className="chip">{count('Open')} open</span><span className="chip">{count('Taken up')} taken up</span><span className="chip">{count('Done')} done</span>
        {maintain && <span className="mono" style={{ color: 'var(--mute)', textTransform: 'none' }}>Your institute maintains this list.</span>}</div>
    </div>
    <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
      <div className="filters">{filters.map(k => <button key={k} className={`fbtn ${f === k ? 'on' : ''}`} onClick={() => setF(k)}>{k}</button>)}</div>
      {join}
    </div>
    {err && <p style={{ color: 'var(--sig)', marginBottom: 12 }}>{err}</p>}
    {steps.length === 0 && <div className="f-empty">No solution plan has been written for this issue yet.</div>}
    <ol className="grid" style={{ gap: 16, listStyle: 'none', padding: 0 }}>{steps.map(s => {
      const ts = all.filter(t => t.step === s.id), shown = f === 'All' ? ts : ts.filter(t => t.status === f)
      return <li key={s.id} className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}><span className="mono" style={{ color: 'var(--mute)' }}>Step {s.order}</span><span className="mono" style={{ color: 'var(--mute)' }}>{ts.filter(t => t.status !== 'Open').length} of {ts.length} tasks under way</span></div>
        <h3 style={{ fontSize: 20, margin: '8px 0 4px' }}>{s.title}</h3><p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 12 }}>{s.detail}</p>
        {shown.length === 0 && <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none' }}>{ts.length ? `No ${f.toLowerCase()} tasks in this step.` : 'No tasks in this step yet.'}</p>}
        <div className="grid" style={{ gap: 10 }}>{shown.map(t => { const w = who(t), mine = isMine(t, me); return <div key={t.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}><b>{t.title}</b><span className="chip">{t.status}</span></div>
          <div className="mono" style={{ color: 'var(--mute)', textTransform: 'none', margin: '4px 0' }}>{t.kind} · added {t.added}{w && <> · {t.how === 'Assigned' ? 'assigned to' : 'taken by'} {mine ? 'you' : w.to ? <Link to={w.to} style={{ textDecoration: 'underline' }}>{w.name}</Link> : w.name}</>}</div>
          <div className="row task-actions" style={{ gap: 8, flexWrap: 'wrap' }}>
            {t.status === 'Open' && pick && <button className="btn primary" onClick={() => run(taskStore.pickUp(me, t.id))}><Hand size={14} /> Pick up</button>}
            {t.status === 'Taken up' && (mine || maintain) && <button className="btn ghost" onClick={() => run(taskStore.markDone(me, t.id))}><Check size={14} /> Mark done</button>}
            {t.status === 'Taken up' && (mine || maintain) && <button className="btn ghost" onClick={() => run(taskStore.release(me, t.id))}><Undo2 size={14} /> {mine ? 'Release' : 'Reopen'}</button>}
            {t.status === 'Open' && maintain && <select className="select" defaultValue="" onChange={e => { if (e.target.value) run(taskStore.assign(me, t.id, e.target.value)) }} aria-label="Assign this task"><option value="">Assign to…</option>{crew.map(c => <option key={c.v} value={c.v}>{c.n}</option>)}</select>}
            {maintain && <button className="btn ghost" onClick={() => run(taskStore.remove(me, t.id))} aria-label={`Remove ${t.title}`}><Trash2 size={14} /></button>}
          </div></div> })}</div>
        {maintain && (adding === s.id ? <div style={{ marginTop: 14 }}>
          <label className="field"><span>New task</span><input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Photograph the eastern boundary" /></label>
          <label className="field"><span>Kind of help</span><select className="select" style={{ width: '100%' }} value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value })}>{helpKinds.map(k => <option key={k}>{k}</option>)}</select></label>
          <div className="row" style={{ gap: 8 }}><button className="btn primary" onClick={() => addTask(s.id)}>Add task</button><button className="btn ghost" onClick={() => { setAdding(null); setErr('') }}>Cancel</button></div>
        </div> : <button className="btn ghost" style={{ marginTop: 14 }} onClick={() => { setAdding(s.id); setErr('') }}><Plus size={14} /> Add a task</button>)}
      </li> })}</ol>
    <p className="mono" style={{ color: 'var(--mute)', textTransform: 'none', marginTop: 18 }}>Illustrative sample plan. Institutes already on this issue maintain the list; volunteers pick up open tasks.</p>
  </>
}
