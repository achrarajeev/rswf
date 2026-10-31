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

export const forum = {
  vote: (id, d) => update(ts => ts.map(t => t.id !== id ? t : { ...t, myVote: t.myVote === d ? 0 : d, votes: t.votes + (t.myVote === d ? 0 : d) - t.myVote })),
  reply: (id, post) => update(ts => ts.map(t => t.id === id ? { ...t, posts: [...t.posts, post] } : t)),
  report: id => update(ts => ts.map(t => t.id === id ? { ...t, reported: true } : t)),
  add: t => { const id = `${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${state.length + 1}`; update(ts => [{ ...t, id, votes: 1, myVote: 1, reported: false, posts: [] }, ...ts]); return id },
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
