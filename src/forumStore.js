import { useSyncExternalStore } from 'react'
import { threads as seed } from './data'
import { can } from './roles'
import { audit } from './auditStore'

// In-memory forum store shared by the list, thread and new-thread pages.
// TODO: no backend. Everything here resets on refresh. Replace with API calls.
let state = seed.map(t => ({ ...t, myVote: 0, reported: !!t.reported, hidden: false }))
const subs = new Set()
const update = fn => { state = fn(state); subs.forEach(f => f()) }

export const useThreads = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
export const replyCount = t => t.posts.length

const makeId = title => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${state.length + 1}`
const mergeTags = (a = [], b = []) => [...a, ...b.filter(x => !a.some(y => y.email === x.email))]
// Threads that tag this account, for the Me page. Hidden threads are left out.
export const taggedFor = (threads, me) => me ? threads.filter(t => !t.hidden && t.tags?.some(g => g.email === me.email)) : []

export const forum = {
  vote: (id, d) => update(ts => ts.map(t => t.id !== id ? t : { ...t, myVote: t.myVote === d ? 0 : d, votes: t.votes + (t.myVote === d ? 0 : d) - t.myVote })),
  reply: (id, post) => update(ts => ts.map(t => t.id === id ? { ...t, posts: [...t.posts, post] } : t)),
  report: id => update(ts => ts.map(t => t.id === id ? { ...t, reported: true } : t)),
  add: t => { const id = makeId(t.title); update(ts => [{ ...t, id, votes: 1, myVote: 1, reported: false, posts: [] }, ...ts]); return id },
  // Admins only: an official, pinned topic that tags accounts so it shows on their Me page.
  // TODO: POST /threads { official: true, tags }, with email or push notification to the tagged accounts.
  official(acct, f) {
    if (!can(acct, 'forum.official')) return { error: 'Only admins can create official topics' }
    if (!f.title.trim() || !f.body.trim()) return { error: 'Add a title and details' }
    const id = makeId(f.title)
    update(ts => [{ id, case: f.case, title: f.title.trim(), body: f.body.trim(), author: acct.name, role: 'Admin', official: true, pinned: true, tags: mergeTags([], f.tags), votes: 0, myVote: 0, reported: false, posts: [] }, ...ts])
    audit.log(acct.name, 'Created official topic', f.title.trim()); return { id }
  },
  // Admins only: tag more accounts on an existing thread.
  tag(acct, id, tags) {
    if (!can(acct, 'forum.official')) return 'Only admins can tag users'
    const t = state.find(x => x.id === id); if (!t) return 'Thread not found'
    if (!tags.length) return 'Choose at least one user'
    update(ts => ts.map(x => x.id === id ? { ...x, tags: mergeTags(x.tags, tags) } : x))
    audit.log(acct.name, `Tagged ${tags.length} ${tags.length === 1 ? 'user' : 'users'} on`, t.title); return null
  },
  // Moderators only. action: 'hide' | 'restore' | 'pin' | 'unpin' | 'dismiss'. TODO: PATCH /threads/:id/moderation, written to the audit log server-side.
  moderate(acct, id, action, note = '') {
    if (!can(acct, 'forum.moderate')) return 'Only moderators can do this'
    const t = state.find(x => x.id === id); if (!t) return 'Thread not found'
    if ((action === 'hide' || action === 'dismiss') && !note.trim()) return 'Add a short note for the record'
    const patch = { hide: { hidden: true, reported: false, modNote: note.trim() }, restore: { hidden: false, modNote: undefined }, pin: { pinned: true }, unpin: { pinned: false }, dismiss: { reported: false, modNote: undefined } }[action]
    if (!patch) return 'Unknown action'
    update(ts => ts.map(x => x.id === id ? { ...x, ...patch } : x))
    audit.log(acct.name, { hide: 'Hid thread', restore: 'Restored thread', pin: 'Pinned thread', unpin: 'Unpinned thread', dismiss: 'Dismissed report on' }[action], t.title); return null
  },
}
