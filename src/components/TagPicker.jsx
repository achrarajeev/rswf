import { auth } from '../authStore'

// Admin picks which accounts to tag. Prototype: lists every active account except the admin's own.
// TODO: with a backend this is GET /users?q= (admins only) with search, since the list will be long.
export default function TagPicker({ value, onChange }) {
  const people = auth.users().filter(u => !u.self && !u.suspended)
  const toggle = u => onChange(value.some(v => v.email === u.email) ? value.filter(v => v.email !== u.email) : [...value, { email: u.email, name: u.name }])
  return (
    <div className="checks">{people.map(u => <button key={u.email} type="button" className={value.some(v => v.email === u.email) ? 'on' : ''} onClick={() => toggle(u)} aria-pressed={value.some(v => v.email === u.email)}>{u.name} · {u.type}</button>)}</div>
  )
}
