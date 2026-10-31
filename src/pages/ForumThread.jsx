import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowBigUp, ArrowBigDown, Flag, Pin, Check } from 'lucide-react'
import { issues } from '../data'
import { useThreads, forum } from '../forumStore'
import { PageHead } from '../components/ui'
import { useAuth } from '../authStore'
import { can } from '../roles'
import { verifiedByName } from '../data'

const roleList = ['Lawyer', 'Researcher', 'Local']

export default function ForumThread() {
  const { id } = useParams(); const { me } = useAuth(); const t = useThreads().find(x => x.id === id)
  const [f, setF] = useState({ author: me?.name || '', role: 'Local', text: '' }); const [tried, setTried] = useState(false)
  if (t?.hidden && !can(me, 'forum.moderate')) return <PageHead eyebrow="Discuss" title="This thread was removed" sub="A moderator removed it for breaking the forum rules." />
  if (!t) return <PageHead eyebrow="Discuss" title="Thread not found" sub="It may have been removed, or the prototype reset." />
  const issue = issues.find(i => i.id === t.case)
  const bad = !f.author.trim() || !f.text.trim()
  const submit = () => {
    setTried(true); if (bad) return
    forum.reply(t.id, { ...f, author: f.author.trim(), text: f.text.trim(), when: 'Just now' })
    setF({ ...f, text: '' }); setTried(false)
  }
  return (
    <>
      <PageHead eyebrow="Discuss" title={t.title} sub={issue ? issue.name : ''} />
      <div className="wrap side" style={{ margin: '28px auto 60px' }}>
        <div>
          <Link to={`/forum?case=${t.case}`} className="mono" style={{ color: 'var(--mute)' }}>← All threads for this case</Link>
          <article className={`card ${t.pinned ? 'thread pin' : ''}`} style={{ margin: '16px 0' }}>
            {t.pinned && <span className="t-pin"><Pin size={13} /> Pinned by moderators</span>}
            {t.hidden && <p className="mono" style={{ color: 'var(--sig)', textTransform: 'none', marginBottom: 8 }}>Hidden from the public by a moderator{t.modNote ? `: ${t.modNote}` : ''}</p>}
            <div className="mono" style={{ color: 'var(--mute)' }}>{t.author} · {t.role}{verifiedByName(t.author).length > 0 && ` · Verified ${verifiedByName(t.author)[0].toLowerCase()}`}</div>
            <p style={{ margin: '12px 0 16px', lineHeight: 1.6 }}>{t.body}</p>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <div className="row" style={{ gap: 4 }}>
                <button className={`btn ghost ${t.myVote === 1 ? 'on' : ''}`} onClick={() => forum.vote(t.id, 1)} aria-label="Upvote"><ArrowBigUp size={18} /></button>
                <b>{t.votes}</b>
                <button className="btn ghost" onClick={() => forum.vote(t.id, -1)} aria-label="Downvote"><ArrowBigDown size={18} /></button>
              </div>
              <button className="btn ghost" disabled={t.reported} onClick={() => forum.report(t.id)}>{t.reported ? <><Check size={15} /> Reported to moderators</> : <><Flag size={15} /> Report</>}</button>
            </div>
          </article>
          <h3 style={{ fontSize: 20, margin: '24px 0 12px' }}>{t.posts.length} {t.posts.length === 1 ? 'reply' : 'replies'}</h3>
          {t.posts.length === 0 && <div className="f-empty">No replies yet. Be the first to answer.</div>}
          <div className="grid" style={{ gap: 12 }}>{t.posts.map((p, k) => <div key={k} className="card"><div className="mono" style={{ color: 'var(--mute)' }}>{p.author} · {p.role} · {p.when}</div><p style={{ marginTop: 8, lineHeight: 1.6 }}>{p.text}</p></div>)}</div>
          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 18 }}>Add a reply</h3>
            <label className="field"><span>Display name</span><input value={f.author} onChange={e => setF({ ...f, author: e.target.value })} />{tried && !f.author.trim() && <small style={{ color: 'var(--sig)' }}>Required</small>}</label>
            <label className="field"><span>I am a</span><select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{roleList.map(r => <option key={r}>{r}</option>)}</select></label>
            <label className="field"><span>Your reply</span><textarea rows="4" value={f.text} onChange={e => setF({ ...f, text: e.target.value })} placeholder="Link what you cite. No source, no claim." />{tried && !f.text.trim() && <small style={{ color: 'var(--sig)' }}>Write something first</small>}</label>
            <button className="btn primary" onClick={submit}>Post reply</button>
          </div>
        </div>
        <aside className="card" style={{ alignSelf: 'start', background: 'var(--mint)', borderColor: 'transparent' }}>
          <p style={{ lineHeight: 1.6 }}>Sample discussion. Replies you post live in memory only and reset on refresh.</p>
          {issue && <Link to={`/issues/${issue.id}`} className="btn ghost" style={{ marginTop: 14 }}>Open the case</Link>}
        </aside>
      </div>
    </>
  )
}
