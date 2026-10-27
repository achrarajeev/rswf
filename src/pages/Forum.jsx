import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowBigUp, ArrowBigDown, MessageSquare, Flag, Pin, Search, PenLine, ShieldCheck, Scale, FlaskConical, MapPin } from 'lucide-react'
import { threads } from '../data'
import { PageHead, Reveal, Counter } from '../components/ui'

const roles = {
  Lawyer: { bg: '#E4ECFB', fg: '#2b4f9e', Icon: Scale },
  Researcher: { bg: '#FFF1CC', fg: '#8a6200', Icon: FlaskConical },
  Local: { bg: '#E3EFE7', fg: '#1F4D3A', Icon: MapPin },
  Moderator: { bg: '#FBE9DD', fg: '#C8561B', Icon: ShieldCheck },
}
const sorts = [['top', 'Top'], ['talk', 'Most discussed']]

export default function Forum() {
  const [votes, setVotes] = useState(() => Object.fromEntries(threads.map(t => [t.title, t.votes])))
  const [mine, setMine] = useState({})
  const [sort, setSort] = useState('top')
  const [role, setRole] = useState('All')
  const [q, setQ] = useState('')

  const vote = (title, d) => {
    const cur = mine[title] || 0
    const next = cur === d ? 0 : d
    setVotes(v => ({ ...v, [title]: v[title] + next - cur }))
    setMine(m => ({ ...m, [title]: next }))
  }

  const list = useMemo(() => threads
    .filter(t => (role === 'All' || t.role === role) && t.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (sort === 'top' ? votes[b.title] - votes[a.title] : b.replies - a.replies)),
  [sort, role, q, votes])

  const totalReplies = threads.reduce((n, t) => n + t.replies, 0)

  return (
    <>
      <PageHead eyebrow="Discuss" title="Forum" sub="Saidongar Pumped Storage. Posts can be reported to moderators." />
      <div className="wrap forum">
        <div className="f-main">
          <div className="f-tools">
            <label className="f-search"><Search size={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search threads" aria-label="Search threads" /></label>
            <div className="f-seg">{sorts.map(([k, l]) => <button key={k} className={sort === k ? 'on' : ''} onClick={() => setSort(k)}>{l}</button>)}</div>
          </div>
          <div className="f-chips">
            {['All', ...Object.keys(roles)].map(r => <button key={r} className={`fbtn ${role === r ? 'on' : ''}`} onClick={() => setRole(r)}>{r}</button>)}
          </div>

          <AnimatePresence mode="popLayout">
            {list.map((t, k) => {
              const R = roles[t.role]; const my = mine[t.title] || 0
              return (
                <motion.article layout key={t.title} className={`thread ${t.pinned ? 'pin' : ''}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ delay: k * .05, duration: .45 }}>
                  <div className="vote2">
                    <button className={my === 1 ? 'on' : ''} onClick={() => vote(t.title, 1)} aria-label="Upvote"><ArrowBigUp size={22} /></button>
                    <b>{votes[t.title]}</b>
                    <button className={my === -1 ? 'down' : ''} onClick={() => vote(t.title, -1)} aria-label="Downvote"><ArrowBigDown size={22} /></button>
                  </div>
                  <div className="t-body">
                    {t.pinned && <span className="t-pin"><Pin size={13} /> Pinned by moderators</span>}
                    <h3>{t.title}</h3>
                    <div className="t-meta">
                      <span className="avatar" style={{ background: R.bg, color: R.fg }}>{t.author[0].toUpperCase()}</span>
                      <span>{t.author}</span>
                      <span className="pill" style={{ background: R.bg, color: R.fg }}><R.Icon size={12} /> {t.role}</span>
                      <span className="t-rep"><MessageSquare size={14} /> {t.replies} replies</span>
                    </div>
                  </div>
                  <button className="t-flag" title="Report to moderators" aria-label="Report"><Flag size={16} /></button>
                </motion.article>)
            })}
          </AnimatePresence>
          {!list.length && <div className="f-empty">No threads match. Try another filter, or start the conversation.</div>}
        </div>

        <aside className="f-side">
          <Reveal><div className="f-card start">
            <span className="iconbox"><PenLine size={22} /></span>
            <h3>Start a thread</h3>
            <p>Ask for a cross-check, share a field note or request an RTI template.</p>
            <button className="btn primary">New thread</button>
          </div></Reveal>
          <Reveal delay={.1}><div className="f-card stats">
            <div><Counter to={threads.length} /><small>threads</small></div>
            <div><Counter to={totalReplies} /><small>replies</small></div>
            <div><Counter to={Object.keys(roles).length} /><small>voices</small></div>
          </div></Reveal>
          <Reveal delay={.2}><div className="f-card rules">
            <h3>House rules</h3>
            <ul>
              <li>No source, no claim. Link what you cite.</li>
              <li>Critique the evidence, not the person.</li>
              <li>Report anything that names private individuals.</li>
            </ul>
          </div></Reveal>
        </aside>
      </div>
    </>
  )
}
