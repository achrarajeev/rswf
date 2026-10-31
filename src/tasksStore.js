import { useSyncExternalStore } from 'react'
import { tasks as seed, assignments } from './data'
import { isStaff } from './roles'

// In-memory task store. Institutes already on an issue maintain its tasks; people and institutes on the issue pick them up.
// TODO: with a backend: GET /issues/:id/tasks, POST /issues/:id/tasks, PATCH /tasks/:id (status, assignee), DELETE /tasks/:id.
// The checks in `can` become server-side authorisation. Resets on refresh.
let state = seed.map(t => ({ ...t }))
const subs = new Set()
const update = fn => { state = fn(state); subs.forEach(f => f()) }
const when = () => new Date().toLocaleString('en-GB', { month: 'short', year: 'numeric' })
export const taskTitle = id => state.find(x => x.id === id)?.title
export const useTasks = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)

// acct: the signed-in record from useAuth().me ({ id, type, status })
const onIssue = (acct, issue) => !!acct && assignments.some(a => a.issue === issue && (acct.type === 'Institute' ? a.institution : a.person) === acct.id)
export const isMine = (t, acct) => !!acct && (acct.type === 'Institute' ? t.institution : t.person) === acct.id
export const can = {
  join: (acct, issue) => !!acct && !isStaff(acct) && !onIssue(acct, issue),
  pick: (acct, issue) => !!acct && !isStaff(acct) && onIssue(acct, issue),
  // Only an approved institute that is on the issue maintains its task list.
  maintain: (acct, issue) => acct?.type === 'Institute' && (!acct.status || acct.status === 'Verified') && onIssue(acct, issue),
}
const holder = acct => acct.type === 'Institute' ? { institution: acct.id, person: undefined } : { person: acct.id, institution: undefined }
const open = { status: 'Open', person: undefined, institution: undefined, how: undefined }

export const taskStore = {
  add(acct, f) {
    if (!can.maintain(acct, f.issue)) return 'Only approved institutes on this issue can add tasks'
    const id = `t-${f.issue}-${Date.now().toString(36)}`
    update(s => [...s, { id, issue: f.issue, step: f.step, title: f.title.trim(), kind: f.kind, status: 'Open', createdBy: acct.id, added: when() }]); return null
  },
  pickUp(acct, id) {
    const t = state.find(x => x.id === id); if (!t) return 'Task not found'
    if (!can.pick(acct, t.issue)) return 'Join this issue first'
    if (t.status !== 'Open') return 'Someone already took this task'
    update(s => s.map(x => x.id === id ? { ...x, status: 'Taken up', ...holder(acct), how: 'Volunteered' } : x)); return null
  },
  release(acct, id) {
    const t = state.find(x => x.id === id)
    if (!t || !(isMine(t, acct) || can.maintain(acct, t.issue))) return 'Not allowed'
    update(s => s.map(x => x.id === id ? { ...x, ...open } : x)); return null
  },
  markDone(acct, id) {
    const t = state.find(x => x.id === id)
    if (!t || !(isMine(t, acct) || can.maintain(acct, t.issue))) return 'Not allowed'
    update(s => s.map(x => x.id === id ? { ...x, status: 'Done' } : x)); return null
  },
  // to: 'person:p-id' or 'institution:i-id', someone already on the issue.
  assign(acct, id, to) {
    const t = state.find(x => x.id === id); if (!t || !can.maintain(acct, t.issue)) return 'Not allowed'
    const [kind, ref] = to.split(':')
    if (!assignments.some(a => a.issue === t.issue && a[kind] === ref)) return 'That account is not on this issue'
    update(s => s.map(x => x.id === id ? { ...x, status: 'Taken up', person: kind === 'person' ? ref : undefined, institution: kind === 'institution' ? ref : undefined, how: 'Assigned' } : x)); return null
  },
  remove(acct, id) {
    const t = state.find(x => x.id === id); if (!t || !can.maintain(acct, t.issue)) return 'Not allowed'
    update(s => s.filter(x => x.id !== id)); return null
  },
}
