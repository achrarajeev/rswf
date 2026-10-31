import { useSyncExternalStore } from 'react'
import { people, institutions, assignments, staff, credentials } from './data'
import { can, staffRoles, isStaff } from './roles'
import { audit } from './auditStore'

// PROTOTYPE AUTH. In memory plus a sessionStorage session. Passwords are stored in plain text and nothing
// leaves the browser, so never enter a real password. TODO: replace with a real backend (hashed passwords,
// sessions, email verification). The shapes below mirror what that backend would hold.
//   account      { email, password, type: 'User'|'Institute', ref }   ref = people.id or institutions.id
// Registration also writes a row into the shared `people` / `institutions` / `assignments` arrays in data.js,
// so new accounts show up on the People tab like seeded ones.
const accounts = [
  { email: 'ganesh@example.org', password: 'demo1234', type: 'User', ref: 'p-ganesh' },
  { email: 'hima@example.org', password: 'demo1234', type: 'Institute', ref: 'i-hima' },
  { email: 'asha@example.org', password: 'demo1234', type: 'Reviewer', ref: 'r-asha' },
  { email: 'ravi@example.org', password: 'demo1234', type: 'Moderator', ref: 'm-ravi' },
  { email: 'meena@example.org', password: 'demo1234', type: 'Admin', ref: 'a-meena' },
]
// account.suspended = true blocks login and ends the session. Only an admin can set it.
const KEY = 'rswf-session'
const load = () => { try { return sessionStorage.getItem(KEY) } catch { return null } }
const save = v => { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY) } catch { /* storage blocked */ } }

let state = { rev: 0, email: accounts.some(a => a.email === load()) ? load() : null }
const subs = new Set()
const set = patch => { state = { ...state, ...patch, rev: state.rev + 1 }; subs.forEach(f => f()) }
const norm = e => e.trim().toLowerCase()
const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)

export const lookup = acc => acc && (acc.type === 'Institute' ? institutions : isStaff(acc) ? staff : people).find(x => x.id === acc.ref)

// Returns { me, account, rev } and re-renders on any change, including new rows in people/institutions/assignments.
export function useAuth() {
  const st = useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
  const found = accounts.find(a => a.email === st.email); const account = found && !found.suspended ? found : null
  return { account, me: account ? { ...lookup(account), type: account.type, email: account.email } : null, rev: st.rev }
}

export const auth = {
  login(email, password) {
    const a = accounts.find(x => x.email === norm(email))
    if (!a || a.password !== password) return 'Email or password is not right'
    if (a.suspended) return 'This account is suspended. Contact an administrator.'
    save(a.email); set({ email: a.email }); return null
  },
  logout() { save(null); set({ email: null }) },
  // f: { type, email, password, name, place, role, org, orgType, reg, web }. Returns an error string, or null on success.
  register(f) {
    const email = norm(f.email)
    if (accounts.some(a => a.email === email)) return 'An account with this email already exists'
    let ref
    if (f.type === 'Institute') {
      ref = `i-${slug(f.org)}-${institutions.length + 1}`
      institutions.push({ id: ref, name: f.org.trim(), type: f.orgType, place: f.place.trim(), reg: f.reg.trim(), contact: f.name.trim(), web: f.web.trim(), status: 'Pending review' })
    } else {
      ref = `p-${slug(f.name)}-${people.length + 1}`
      people.push({ id: ref, name: f.name.trim(), role: f.role, place: f.place.trim() })
    }
    accounts.push({ email, password: f.password, type: f.type, ref })
    save(email); set({ email }); return null
  },
  // Reviewer decision on an institute registration. decision: 'Verified' | 'More info needed' | 'Rejected'.
  // TODO: with a backend this is PATCH /institutions/:id/review, allowed for reviewers only, and emails the contact.
  reviewInstitute(id, decision, note) {
    const a = accounts.find(x => x.email === state.email)
    if (!can(a && { type: a.type }, 'institute.review')) return 'Only reviewers can do this'
    const inst = institutions.find(x => x.id === id); if (!inst) return 'Institute not found'
    inst.status = decision; inst.reviewNote = note.trim(); inst.reviewedBy = lookup(a).name
    audit.log(inst.reviewedBy, `${decision === 'Verified' ? 'Verified' : decision} institute`, inst.name)
    set({}); return null
  },
  // ---- Admin. TODO: PATCH /users/:id (suspend, role), POST /staff/invitations. Checked server-side later. ----
  users() {
    return accounts.map(a => { const r = lookup(a) || {}; return { email: a.email, type: a.type, name: r.name || a.email, place: r.place, status: r.status, suspended: !!a.suspended, self: a.email === state.email } })
  },
  setSuspended(email, flag) {
    const me = accounts.find(x => x.email === state.email); if (!can(me, 'users.manage')) return 'Only admins can do this'
    const t = accounts.find(x => x.email === email); if (!t) return 'Account not found'
    if (t === me) return 'You cannot suspend your own account'
    t.suspended = flag; audit.log(lookup(me).name, flag ? 'Suspended account' : 'Reinstated account', lookup(t)?.name || email); set({}); return null
  },
  setStaffRole(email, role) {
    const me = accounts.find(x => x.email === state.email); if (!can(me, 'users.manage')) return 'Only admins can do this'
    const t = accounts.find(x => x.email === email); if (!t || !isStaff(t)) return 'Only staff roles can be changed here'
    if (t === me) return 'You cannot change your own role'
    if (!staffRoles.includes(role)) return 'Unknown role'
    const was = t.type; t.type = role; const r = lookup(t); if (r) r.role = role
    audit.log(lookup(me).name, `Changed role ${was} to ${role}`, r?.name || email); set({}); return null
  },
  // f: { name, email, role, password }. Creates a staff account. Prototype: the admin sets a temporary password.
  inviteStaff(f) {
    const me = accounts.find(x => x.email === state.email); if (!can(me, 'users.manage')) return 'Only admins can do this'
    const email = norm(f.email); if (!f.name.trim() || !email || !f.password) return 'Fill in name, email and a temporary password'
    if (!staffRoles.includes(f.role)) return 'Unknown role'
    if (accounts.some(a => a.email === email)) return 'An account with this email already exists'
    const id = `${f.role[0].toLowerCase()}-${slug(f.name)}-${staff.length + 1}`
    staff.push({ id, name: f.name.trim(), role: f.role, place: '' })
    accounts.push({ email, password: f.password, type: f.role, ref: id })
    audit.log(lookup(me).name, `Invited ${f.role}`, f.name.trim()); set({}); return null
  },
  // ---- Credentials (verified Lawyer / Local researcher badge). TODO: POST /credentials, PATCH /credentials/:id/review ----
  requestCredential(claim, proof) {
    const a = accounts.find(x => x.email === state.email); if (a?.type !== 'User') return 'Only user accounts can claim a credential'
    if (!proof.trim()) return 'Add proof: a registration number, affiliation or reference'
    const cur = credentials.find(c => c.person === a.ref && c.claim === claim)
    if (cur && cur.status !== 'Rejected' && cur.status !== 'More info needed') return cur.status === 'Verified' ? 'This credential is already verified' : 'You already have a request waiting'
    const row = { id: `c-${slug(lookup(a).name)}-${credentials.length + 1}`, person: a.ref, claim, proof: proof.trim(), status: 'Pending review', asked: new Date().toLocaleString('en-GB', { month: 'short', year: 'numeric' }) }
    if (cur) Object.assign(cur, row, { id: cur.id, note: undefined, reviewedBy: undefined }); else credentials.push(row)
    set({}); return null
  },
  reviewCredential(id, decision, note) {
    const a = accounts.find(x => x.email === state.email); if (!can(a, 'credential.review')) return 'Only reviewers can do this'
    const c = credentials.find(x => x.id === id); if (!c) return 'Request not found'
    c.status = decision; c.note = note.trim(); c.reviewedBy = lookup(a).name
    audit.log(c.reviewedBy, `${decision === 'Verified' ? 'Verified' : decision} credential (${c.claim})`, people.find(p => p.id === c.person)?.name); set({}); return null
  },
  // Tag the signed-in user or institute to an issue. One account can join many issues.
  join(issueId, does) {
    const a = accounts.find(x => x.email === state.email); if (!a) return 'Log in first'
    const key = a.type === 'Institute' ? 'institution' : 'person'
    if (assignments.some(x => x.issue === issueId && x[key] === a.ref)) return 'You are already on this issue'
    assignments.push({ issue: issueId, [key]: a.ref, does, joined: new Date().toLocaleString('en-GB', { month: 'short', year: 'numeric' }) })
    set({}); return null
  },
}

export const issuesFor = (type, ref) => assignments.filter(a => (type === 'Institute' ? a.institution : a.person) === ref)
