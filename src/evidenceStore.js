import { useSyncExternalStore } from 'react'
import { issues, evidence as seedEvidence } from './data'
import { taskTitle } from './tasksStore'
import { audit } from './auditStore'

// In-memory evidence pipeline: submit -> reviewer queue -> published on the issue's Evidence tab.
// TODO: with a backend this is POST /evidence (multipart upload), GET /evidence?status=pending (reviewers),
// PATCH /evidence/:id/review, and GET /issues/:id/evidence (approved only). Resets on refresh.
//   submission { id, issue, type, title, link, fileName, proves, note, byName, byRef, date,
//                status: 'Pending review' | 'Approved' | 'More info needed' | 'Rejected', trust, reviewNote }
const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
let state = [
  { id: 's1', issue: 'saidongar', type: 'Video', title: 'Dry-season stream footage (sample)', link: '', fileName: 'streams-dry.mp4', proves: '', note: 'Four of the six streams still flow in the dry season.', byName: 'ghats_walker', byRef: null, date: '24 Oct 2026', status: 'Pending review' },
  { id: 's2', issue: 'hasdeo', type: 'Document', title: 'Gram sabha resolution copy (sample)', link: '', fileName: 'gram-sabha.pdf', proves: '', note: 'Resolution recorded in the village register.', byName: 'K. Netam', byRef: 'p-netam', date: '25 Oct 2026', status: 'Pending review' },
  { id: 's3', issue: 'ennore', type: 'Live recording', title: 'Fishers public meeting recording (sample)', link: 'https://example.org/recording', fileName: '', proves: 'Fishing ground survey', note: 'Recorded live at the community hall.', byName: 'R. Selvam', byRef: 'p-selvam', date: '27 Oct 2026', status: 'Pending review' },
  { id: 's4', issue: 'chilika', type: 'Photo', title: 'Enclosure poles along the Satapada shore (sample)', link: '', fileName: 'satapada-poles.jpg', proves: '', note: 'New bamboo poles, photographed on 28 Oct.', byName: 'Ganesh', byRef: 'p-ganesh', date: '28 Oct 2026', status: 'Pending review' },
]
const subs = new Set()
const update = fn => { state = fn(state); subs.forEach(f => f()) }
export const useSubmissions = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)

export const evidenceStore = {
  // acct: the signed-in person or institute { id, name }
  submit(acct, f) {
    const id = `s${state.length + 1}-${Date.now().toString(36)}`
    update(s => [{ id, issue: f.issue, type: f.type, title: f.title.trim(), link: f.link.trim(), fileName: f.fileName, proves: f.proves, task: f.task || '', note: f.note.trim(), byName: acct.name, byRef: acct.id, date: today(), status: 'Pending review' }, ...s])
    return id
  },
  // decision: 'Approved' | 'More info needed' | 'Rejected'. trust only matters for Approved.
  review(id, decision, note, trust, reviewer) {
    audit.log(reviewer, `${decision === 'Approved' ? 'Approved' : decision} evidence`, state.find(x => x.id === id)?.title)
    update(s => s.map(x => x.id === id ? { ...x, status: decision, reviewNote: note.trim(), trust: decision === 'Approved' ? trust : undefined, reviewedBy: reviewer } : x))
  },
}

// What an issue's Evidence tab shows: the seeded items plus approved submissions.
export const evidenceFor = (subsList, issueId) => [
  ...subsList.filter(x => x.issue === issueId && x.status === 'Approved').map(x => ({ type: x.type, title: x.title, for: x.proves || (x.task && taskTitle(x.task)) || 'General work on this issue', by: x.byName, date: x.date, trust: x.trust, img: issues.find(i => i.id === issueId)?.img, link: x.link })),
  ...(seedEvidence[issueId] || []),
]
