import { useSyncExternalStore } from 'react'
import { issues, legal, evidence as seedEvidence, solutionSteps } from './data'
import { audit } from './auditStore'

// In-memory issue submissions (GitHub issue #6): submit -> reviewer queue -> listed on /issues with the form's content in the tabs.
// TODO: with a backend this is POST /issues (multipart, evidence file), GET /issues?status=pending (reviewers),
// PATCH /issues/:id/review, and GET /issues (listed only). Resets on refresh.
//   submission { id, name, state, eco, blurb, company, hectares, status, legalText, solutionText,
//                evidence: { type, title, link, fileName, note }, byName, byRef, date,
//                review: 'Pending review' | 'Listed' | 'More info needed' | 'Rejected', reviewNote }
// Assumed defaults until the team agrees the open questions on the issue: required = title, state, category, description, evidence.
export const ecosystems = ['Forest', 'Rivers', 'Lakes', 'Wildlife']
export const legalStatuses = ['Proposed', 'Under clearance', 'Cleared', 'In court', 'Stopped']
// Stand-in photos, one per category. The photo credit shown is the real one for that picture; the caption says it is illustrative.
const stock = { Forest: 'hasdeo', Rivers: 'ganga', Lakes: 'chilika', Wildlife: 'tiger' }

const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
let state = []
const subs = new Set()
const update = fn => { state = fn(state); subs.forEach(f => f()) }
export const useIssueSubmissions = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'issue'
const uniqueId = name => { let id = slug(name), n = 2; while (issues.some(i => i.id === id)) id = `${slug(name)}-${n++}`; return id }

// Returns an error message, or '' when the form may be submitted. Evidence is mandatory.
export const validate = f => {
  if (!f.name.trim()) return 'Give the issue a title'
  if (!f.state) return 'Choose the state'
  if (!f.blurb.trim()) return 'Describe the issue in a sentence or two'
  if (!f.evTitle.trim()) return 'Name the evidence you are attaching'
  if (!f.evLink.trim() && !f.evFile) return 'Evidence is required: add a link or choose a file'
  if (!f.evNote.trim()) return 'Say how you obtained the evidence'
  return ''
}

export const issueStore = {
  submit(acct, f) {
    const err = validate(f); if (err) return { error: err }
    const id = `p${state.length + 1}-${Date.now().toString(36)}`
    const area = Number(f.hectares)
    update(s => [{
      id, name: f.name.trim(), state: f.state, eco: f.eco, blurb: f.blurb.trim(), company: f.company.trim(),
      hectares: area > 0 ? area : 0, status: f.status, legalText: f.legalText.trim(), solutionText: f.solutionText.trim(),
      evidence: { type: f.evType, title: f.evTitle.trim(), link: f.evLink.trim(), fileName: f.evFile, note: f.evNote.trim() },
      byName: acct.name, byRef: acct.id, date: today(), review: 'Pending review',
    }, ...s])
    return { id }
  },
  // decision: 'Listed' | 'More info needed' | 'Rejected'. Listing adds the issue to the shared lists that every page reads.
  review(id, decision, note, trust, reviewer) {
    const p = state.find(x => x.id === id); if (!p || p.review === 'Listed') return
    audit.log(reviewer, `${decision === 'Listed' ? 'Listed' : decision} issue`, p.name)
    if (decision === 'Listed') {
      const issueId = uniqueId(p.name), img = stock[p.eco]
      issues.push({ id: issueId, trend: 'depleted', since: new Date().getFullYear(), no: String(issues.length + 1).padStart(2, '0'), name: p.name, company: p.company || 'Not stated', state: p.state, eco: p.eco, status: p.status, trust, help: [], mw: 'Not stated', hectares: p.hectares, lon: null, lat: null, img, caption: `${p.eco} (illustrative image)`, blurb: p.blurb, submitted: true })
      if (p.legalText) legal[issueId] = { text: p.legalText, src: `Submitted by ${p.byName}, ${p.date}`, gap: 'Not yet checked against the official record.' }
      if (p.solutionText) solutionSteps.push({ id: `st-${issueId}-1`, issue: issueId, order: 1, title: 'Solution proposed by the submitter', detail: p.solutionText })
      seedEvidence[issueId] = [{ type: p.evidence.type, title: p.evidence.title, for: 'Submitted with the issue', by: p.byName, date: p.date, trust, img, link: p.evidence.link }]
      p.listedAs = issueId
    }
    update(s => s.map(x => x.id === id ? { ...x, review: decision, reviewNote: note.trim(), reviewedBy: reviewer } : x))
  },
}
