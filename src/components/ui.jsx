import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { Leaf, Link2, ShieldCheck, Search, FileSearch, Map, BookOpenCheck, TrendingUp, Upload, HeartHandshake, MessagesSquare, Gauge, SearchX, Share2, Check, Copy, MessageCircle, Send, FileText, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import credits from '../credits.json'

const byName = { Search, FileSearch, Map, BookOpenCheck, TrendingUp, ShieldCheck, Upload, HeartHandshake, MessagesSquare, Gauge, FileText, BadgeCheck }
export const Icon = ({ name, ...p }) => { const C = byName[name] || Leaf; return <C {...p} /> }

export const Reveal = ({ children, delay = 0, y = 28, ...p }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} {...p}>{children}</motion.div>
)

export function Counter({ to, dec = 0, suffix = '' }) {
  const ref = useRef(null); const inView = useInView(ref, { once: true }); const [v, setV] = useState(0)
  useEffect(() => { if (inView) { const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setV }); return () => c.stop() } }, [inView, to])
  return <b ref={ref}>{v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</b>
}

export const Status = ({ s }) => <span className={`pill s-${s}`}>{s}</span>
export const Trust = ({ t }) => <span className={`pill t-${t}`}>{t}</span>
export const Source = ({ children }) => <span className="chip"><Link2 size={11} />{children}</span>

export const photoCredit = k => credits[k] ? `Photo: ${credits[k].artist}, ${credits[k].license}` : ''
export const PhotoCredit = ({ k, style }) => <a className="credit" style={style} href={credits[k]?.page} target="_blank" rel="noreferrer">{photoCredit(k)}</a>

export const PageHead = ({ eyebrow, title, sub }) => (
  <header className="phead">
    <Orbs tone="sky" />
    <div className="pdots" />
    <Leaves />
    <div className="wrap" style={{ paddingTop: 56, paddingBottom: 56, position: 'relative', zIndex: 2 }}>
      <Reveal><div className="eyebrow">{eyebrow}</div></Reveal>
      <h1 className="page-title">{title.split(' ').map((w, i) => <span key={i} className="mask" style={{ display: 'inline-block', marginRight: '.25em' }}>
        <motion.span style={{ display: 'inline-block' }} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: .8, delay: .05 * i, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span></span>)}</h1>
      <Reveal delay={.2}><p className="sub">{sub}</p></Reveal>
    </div>
  </header>
)

/* ---------- motion & background effects ---------- */

export function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24 })
  return <motion.div className="scrollbar" style={{ scaleX }} />
}

/* blurred colour orbs that drift slowly; purely decorative */
export const Orbs = ({ tone = 'mint' }) => (
  <div className={`orbs ${tone}`} aria-hidden="true"><i /><i /><i /></div>
)

const leafSpec = [[6, 22, 0, 18], [18, 16, 4, 24], [32, 26, 9, 20], [48, 18, 2, 26], [63, 24, 7, 19], [77, 16, 12, 23], [90, 22, 5, 21]]
export const Leaves = () => (
  <div className="leaves" aria-hidden="true">
    {leafSpec.map(([x, size, delay, dur], i) => (
      <span key={i} style={{ left: x + '%', animationDelay: -delay + 's', animationDuration: dur + 's' }}><Leaf size={size} strokeWidth={1.6} /></span>))}
  </div>
)

export const Marquee = ({ items }) => (
  <div className="marquee" aria-hidden="true"><div className="track">
    {[...items, ...items].map((t, i) => <span key={i}><Leaf size={14} />{t}</span>)}
  </div></div>
)

/* wavy section edge; `fill` is the colour of the section it leads into */
export const Wave = ({ fill = '#f1faf4', flip = false }) => (
  <div className={`wave ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path fill={fill} d="M0 40c150-50 300-50 450 0s300 50 450 0 300-50 450 0 300 50 450 0 300-50 450 0 300 50 450 0V80H0z" /></svg>
  </div>
)

export function Tilt({ children, max = 6, ...p }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-.5, .5], [max, -max]), { stiffness: 220, damping: 22 })
  const ry = useSpring(useTransform(x, [-.5, .5], [-max, max]), { stiffness: 220, damping: 22 })
  const move = e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - .5); y.set((e.clientY - r.top) / r.height - .5) }
  const leave = () => { x.set(0); y.set(0) }
  return <motion.div onMouseMove={move} onMouseLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, height: '100%' }} {...p}>{children}</motion.div>
}

/* image that slides inside its frame as the page scrolls */
export function Par({ src, alt = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  return <div ref={ref} className="par"><motion.img src={src} alt={alt} loading="lazy" style={{ y, scale: 1.18 }} /></div>
}

/* hand-drawn underline that draws itself when scrolled into view */
export const Squiggle = () => (
  <svg className="squiggle" viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
    <motion.path d="M2 9c18-9 36-9 54 0s36 9 54 0 36-9 54 0 36 9 54 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: .3, ease: [0.22, 1, 0.36, 1] }} />
  </svg>
)

export const Missing = ({ what = 'This data', children }) => (
  <div className="missing"><SearchX size={22} /><div><b>{what} not found yet</b><p>{children || 'Nobody has added a sourced record for this case. Without a source we do not show a claim.'}</p><Link to="/contribute" className="btn sky">Add evidence</Link></div></div>
)

export function ShareButton({ title, className = 'btn ghost' }) {
  const [open, setOpen] = useState(false); const [done, setDone] = useState(false)
  const url = typeof location !== 'undefined' ? location.href : ''
  const copy = async () => { try { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1800) } catch { /* clipboard blocked */ } }
  const click = async () => { if (navigator.share) { try { await navigator.share({ title, url }); return } catch { /* cancelled */ } } setOpen(o => !o) }
  const q = encodeURIComponent(title + ' ' + url)
  return (
    <div className="sharewrap">
      <button className={className} onClick={click} aria-expanded={open}><Share2 size={15} /> Share</button>
      {open && <div className="share-pop">
        <button onClick={copy}>{done ? <Check size={15} /> : <Copy size={15} />}{done ? 'Link copied' : 'Copy link'}</button>
        <a href={`https://wa.me/?text=${q}`} target="_blank" rel="noreferrer"><MessageCircle size={15} />WhatsApp</a>
        <a href={`https://twitter.com/intent/tweet?text=${q}`} target="_blank" rel="noreferrer"><Send size={15} />X</a>
      </div>}
    </div>
  )
}
