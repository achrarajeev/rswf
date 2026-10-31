import { useSyncExternalStore } from 'react'

// Append-only record of staff actions. TODO: with a backend this is an audit_log table written by the server, never by the client.
//   entry { id, when, actor, action, target }
const now = () => new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
let state = [{ id: 'a0', when: '20 Oct, 10:12', actor: 'Asha (reviewer)', action: 'Verified credential (Lawyer)', target: 'A. Deshmukh' }]
const subs = new Set()
export const useAudit = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
export const audit = {
  log(actor, action, target) { state = [{ id: `a${state.length}-${Date.now().toString(36)}`, when: now(), actor, action, target }, ...state]; subs.forEach(f => f()) },
}
