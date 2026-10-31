import { can } from '../roles'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Leaf, LayoutGrid, Map, Upload, MessagesSquare, ListChecks, ArrowUp, Menu, X, User } from 'lucide-react'
import { features } from '../data'
import { ScrollBar, Orbs } from './ui'
import { useAuth, auth } from '../authStore'

const links = [['/issues', 'Issues'], ['/map', 'Map'], ['/research', 'Research'], ['/contribute', 'Contribute'], ['/forum', 'Forum'], ['/hub', 'Hub']]

export default function Layout() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const nav = useNavigate(); const { me } = useAuth()
  const go = e => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q').trim(); nav(q ? `/issues?q=${encodeURIComponent(q)}` : '/issues'); e.currentTarget.reset(); setOpen(false) }
  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [loc.pathname])
  return (
    <>
      <ScrollBar />
      <header className="nav"><div className="wrap">
        <Link to="/" className="brand"><Leaf size={26} strokeWidth={2.2} />Earth Ledger</Link>
        <nav className="links">{links.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</nav>
        <form className="search" onSubmit={go} role="search"><Search size={15} /><input name="q" placeholder="Search issues" aria-label="Search issues" /></form>
        <div className="navbtns">{me ? <>{can(me, 'admin.panel') && <Link to="/admin" className="btn">Admin</Link>}<Link to="/me" className="btn sky">{me.name}</Link><button className="btn" onClick={() => { auth.logout(); nav('/') }}>Log out</button></> : <><Link to="/login" className="btn sky">Log in</Link><Link to="/register" className="btn">Register</Link></>}
          <button className="burger" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>
      </div>
        <AnimatePresence>{open && <><motion.nav className="drawer" initial={{ opacity: 0, y: -10, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .97 }} transition={{ duration: .22 }}>
          <div className="wrap"><form className="dsearch" onSubmit={go} role="search"><Search size={16} /><input name="q" placeholder="Search a project, company or place" aria-label="Search" /></form>{[['/', 'Home'], ...links].map(([to, l], i) => <motion.div key={to} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .04 * i }}><NavLink to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink></motion.div>)}
            <div className="drawer-btns">{me ? <Link to="/me" className="btn">{me.name}</Link> : <Link to="/register" className="btn">Register</Link>}{!me && <Link to="/login" className="btn sky">Log in</Link>}<Link to="/issues" className="btn glass">Take action</Link><Link to="/tracker" className="btn sky">Year on year</Link></div></div>
        </motion.nav></>}</AnimatePresence></header>
      <AnimatePresence>{open && <motion.div className="scrim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}</AnimatePresence>
      <motion.main key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}><Outlet /></motion.main>
      <footer className="footer"><Orbs tone="dark" /><div className="wrap">
        <div className="f-top">
          <div className="f-brand">
            <Link to="/" className="brand"><Leaf size={26} strokeWidth={2.2} />Earth Ledger</Link>
            <div className="f-tag">Check the claim.<br />Follow the source.</div>
            <p>An open, citizen-run ledger of India’s environmental issues. Case entries are illustrative until reviewed.</p>
            <div className="row"><Link to="/contribute" className="btn">Contribute</Link><Link to="/issues" className="btn glass">Browse issues</Link></div>
          </div>
          {Object.entries(features).map(([g, items]) => <div key={g} className="f-col"><div className="f-h">{g}</div>{items.map(([to, t]) => <Link key={t} to={to}>{t}</Link>)}</div>)}
        </div>
        <div className="f-bar">
          <span>Statistics: FSI (ISFR 2023), NTCA (AITE 2022). Photos: Wikimedia Commons, credited on each image.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">Back to top <ArrowUp size={14} /></button>
        </div>
        <div className="big-word">Earth Ledger</div>
      </div></footer>
      <nav className="mobile-tab">
        {[['/issues', ListChecks, 'Issues'], ['/map', Map, 'Map'], ['/contribute', Upload, 'Add'], ['/forum', MessagesSquare, 'Forum'], ['/me', User, 'Me']].map(([to, I, l]) =>
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><I size={18} />{l}</NavLink>)}
      </nav>
    </>
  )
}
