import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Search, TreePine, Waves, PawPrint, Droplets, Upload, ShieldCheck, BadgeCheck, MapPin, Banknote, Users, Scale, TrendingUp } from 'lucide-react'
import { Counter, Reveal, Source, Trust, Status, PhotoCredit, Orbs, Leaves, Marquee, Wave, Tilt, Par, Squiggle } from '../components/ui'
import Chart from '../components/Chart'
import { issues, indicators, forestSeries, tigerSeries } from '../data'

const ease = [0.22, 1, 0.36, 1]
const line = (t, i) => <span className="mask"><motion.span style={{ display: 'block' }} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .15 + i * .12, ease }}>{t}</motion.span></span>
const cats = [
  ['Forests', TreePine, 'hasdeo', 'Trees, tribal land and clearances', ['Forest']],
  ['Rivers & lakes', Waves, 'chilika', 'Pollution, diversion and dams', ['Rivers', 'Lakes']],
  ['Wildlife', PawPrint, 'tiger', 'Habitat, corridors and species', ['Wildlife']],
]
const grid = [['Forests', 'hasdeo'], ['Rivers', 'ganga'], ['Lakes', 'chilika'], ['Wildlife', 'rhino'], ['Coasts', 'turtle'], ['Industry', 'ennore']]
const helpIcon = { Money: Banknote, People: Users, Legal: Scale }
const sources = [...new Set(indicators.map(i => i.src))]
const bgs = ['bg-mint', 'bg-sky', 'bg-mist', 'bg-mint']

export default function Home() {
  const nav = useNavigate()
  const f = issues.find(i => i.id === 'saidongar'); const h = issues.find(i => i.id === 'hasdeo')
  return (
    <>
      <section className="hero">
        <Orbs tone="mint" /><Leaves />
        <div className="art"><img src="/images/hero.jpg" alt="Forest in the Western Ghats" /></div>
        <PhotoCredit k="hero" />
        <div className="wrap"><div className="copy">
          <h1>{line('Check the claim.', 0)}{line(<span>Follow the <span className="ul">source.<Squiggle /></span></span>, 1)}</h1>
          <p className="lead">An open, citizen-run ledger of India’s environmental issues, where every claim links back to a source.</p>
          <form className="hero-search" onSubmit={e => { e.preventDefault(); nav('/issues') }}>
            <input placeholder="Search a project, company or place" /><button className="btn primary"><Search size={15} />Search</button>
          </form>
          <div className="row"><Link to="/issues" className="btn">Explore issues</Link><Link to="/hub" className="btn sky">All features</Link></div>
        </div></div>
        <motion.div className="live" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: .9, ease }}>
          <span className="dot" /><div><b>Live ledger</b><small>{issues.length} cases · {indicators.length} national indicators</small></div>
        </motion.div>
      </section>
      <Marquee items={['No source, no claim', ...sources]} />

      <div className="wrap"><div className="cat3">
        {cats.map(([t, I, img, d, ecos], k) => {
          const n = issues.filter(i => ecos.includes(i.eco)).length
          return (
            <Reveal key={t} delay={k * .1}><Tilt><Link to="/issues" className={`cat ${['bg-mint', 'bg-sky', 'bg-mist'][k]}`}>
              <div className={`ph ${['shape-a', 'shape-b', 'shape-c'][k]}`}><img src={`/images/${img}.jpg`} alt="" /></div>
              <div className="cb">
                <span className="iconbox"><I size={22} /></span>
                <h3>{t}</h3><p>{d}</p>
                <div className="cmeta"><span>{n} {n === 1 ? 'case' : 'cases'} tracked</span><span className="go"><ArrowUpRight size={16} /></span></div>
              </div>
            </Link></Tilt></Reveal>)
        })}
      </div></div>

      <section className="section"><div className="wrap">
        <div className="trio">
          <Reveal><div className="im shape-a"><Par src="/images/ganga.jpg" alt="The Ganga" /></div></Reveal>
          <Reveal delay={.1}><div className="tx">
            <h2>Leading the way to accountable land and water</h2>
            <p>Government filings say one thing. Surveys, court records and people on the ground often say another. We put them side by side.</p>
            <Link to="/research" className="btn olive">How it works</Link></div></Reveal>
          <Reveal delay={.2}><div className="im shape-b"><Par src="/images/rhino.jpg" alt="Rhinoceros at Kaziranga" /></div></Reveal>
        </div>
      </div></section>

      <section className="section fx dots" style={{ paddingTop: 0 }}><Orbs tone="sky" /><div className="wrap">
        <div className="center"><h2><span className="ul">Where India stands<Squiggle /></span></h2><p>Government-reported numbers, shown first so they can be checked against independent evidence.</p></div>
        <div className="stats">
          {indicators.map((s, i) => (
            <Reveal key={s.label} delay={i * .08}><div className={`stat ${bgs[i % 4]}`}>
              <Trust t={s.trust} />
              <Counter to={s.value} dec={s.dec} suffix={s.suffix} />
              <div className="l">{s.label}</div><div className="n">{s.note}</div>
              <a href={s.url} target="_blank" rel="noreferrer"><Source>{s.src}</Source></a>
            </div></Reveal>))}
        </div>
      </div></section>

      <Wave fill="#f1faf4" />
      <section className="section fx" style={{ background: '#f1faf4', marginTop: -1 }}><Orbs tone="mint" /><div className="wrap">
        <div className="center"><h2>What we track</h2><p>Six kinds of places, each with cases you can open, check and help with.</p></div>
        <div className="tiles">
          {grid.map(([t, img], k) => (
            <Reveal key={t} delay={(k % 4) * .08}><Link to="/issues" className="tile"><div className={`ph ${['shape-a', 'shape-b', 'shape-c', 'shape-a'][k % 4]}`}><img src={`/images/${img}.jpg`} alt="" loading="lazy" /></div><h3>{t}</h3></Link></Reveal>))}
        </div>
      </div></section>
      <Wave fill="#f1faf4" flip />

      <section className="section"><div className="wrap">
        <Reveal><div className="feat">
          <div className="fimg shape-a"><Par src={`/images/${f.img}.jpg`} alt={f.caption} /><PhotoCredit k={f.img} style={{ bottom: 14, left: 22, right: 'auto' }} /></div>
          <div className="fpanel bg-mint">
            <span className="eyebrow" style={{ background: '#fff' }}>Featured case</span>
            <h3>{f.name}: same project, two numbers</h3>
            <p>The filing and the independent survey disagree on the forest area affected by a factor of ten.</p>
            <div className="vs">
              <div><small>Government says</small><b>38 ha</b><Trust t="Unverified" /></div>
              <span className="vsdot">vs</span>
              <div className="hi"><small>Independent survey</small><b>{f.hectares} ha</b><Trust t="High" /></div>
            </div>
            <Link to={`/issues/${f.id}`} className="btn primary">Read the evidence <ArrowRight size={14} /></Link>
          </div>
        </div></Reveal>

        <Reveal><div className="feat rev" style={{ marginTop: 56 }}>
          <div className="fimg shape-b"><Par src={`/images/${h.img}.jpg`} alt={h.caption} /><PhotoCredit k={h.img} style={{ bottom: 14, right: 26 }} /></div>
          <div className="fpanel bg-sky">
            <span className="eyebrow" style={{ background: '#fff', color: 'var(--teal)' }}>Open to everyone</span>
            <h3>One vision, many hands</h3>
            <ol className="steps">
              {[[Upload, 'Upload', 'A photo, document, RTI reply or court order.'], [ShieldCheck, 'Review', 'A reviewer checks the source and your note.'], [BadgeCheck, 'Trust level', 'It is published with a High, Medium or Unverified badge.']].map(([I, t, d]) => (
                <li key={t}><span className="iconbox"><I size={20} /></span><span><b>{t}</b><small>{d}</small></span></li>))}
            </ol>
            <Link to="/contribute" className="btn primary">Contribute evidence <ArrowRight size={14} /></Link>
          </div>
        </div></Reveal>
      </div></section>

      <section className="section" style={{ paddingTop: 20 }}><div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Get involved</span><h2 style={{ marginTop: 14 }}>Cases that need help now</h2><p className="sub" style={{ fontSize: 14, marginTop: 10 }}>Sample entries. Statuses stay illustrative until a reviewer assigns a trust level.</p></div>
          <Link to="/issues" className="btn ghost">All cases <ArrowRight size={14} /></Link>
        </div>
        <div className="grid g3 swipe">
          {issues.slice(0, 3).map((i, k) => (
            <Reveal key={i.id} delay={k * .1}><Tilt max={5}><Link to={`/issues/${i.id}`} className="help">
              <div className={`ph ${['shape-a', 'shape-b', 'shape-c'][k]}`}>
                <img src={`/images/${i.img}.jpg`} alt={i.caption} loading="lazy" />
                <span className="stat-pill"><Status s={i.status} /></span>
              </div>
              <div className="hb">
                <h3>{i.name}</h3>
                <div className="chip"><MapPin size={13} />{i.state} · {i.company}</div>
                <div className="needs">
                  <small>Needs</small>
                  <div>{i.help.map(h => { const I = helpIcon[h]; return <span key={h} className="need"><I size={14} />{h}</span> })}</div>
                </div>
                <div className="cmeta"><span>Offer help</span><span className="go"><ArrowUpRight size={16} /></span></div>
              </div>
            </Link></Tilt></Reveal>))}
        </div>
      </div></section>

      <section className="section fx" style={{ paddingTop: 20 }}><Orbs tone="sky" /><div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">In the spotlight</span><h2 style={{ marginTop: 14 }}>Stories behind the files</h2></div>
          <Link to="/issues" className="btn ghost">All issues <ArrowRight size={14} /></Link>
        </div>
        <div className="bento">
          {issues.slice(2, 6).map((i, k) => (
            <Reveal key={i.id} delay={k * .08} className={`b${k}`}><Link to={`/issues/${i.id}`} className="story shape-b">
              <Par src={`/images/${i.img}.jpg`} alt={i.caption} />
              <span className="stat-pill tl"><Status s={i.status} /></span>
              <div className="t"><small><MapPin size={12} />{i.state}</small><b>{i.name}</b><em>{i.company}</em></div>
              <span className="go"><ArrowUpRight size={18} /></span>
            </Link></Reveal>))}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="sec-head">
          <div><span className="eyebrow">Progress</span><h2 style={{ marginTop: 14 }}>Slow gains, long way to go</h2></div>
          <Link to="/tracker" className="btn ghost">Open the tracker <ArrowRight size={14} /></Link>
        </div>
        <div className="charts">
          {[[forestSeries, v => v + '%', TreePine, 'bg-mint', 2, ' pts'], [tigerSeries, v => v.toLocaleString('en-IN'), PawPrint, 'bg-sky', 0, '']].map(([s, fmt, I, bg, dec, unit], k) => {
            const a = s.pts[0], z = s.pts.at(-1), dlt = z[1] - a[1]
            return (
              <Reveal key={s.title} delay={k * .12}><div className={`pcard ${bg}`}>
                <div className="ph-row"><span className="iconbox"><I size={22} /></span><div><b className="head">{s.title}</b><Source>{s.src}</Source></div></div>
                <div className="big"><Counter to={z[1]} dec={dec === 2 ? 2 : 0} suffix={dec === 2 ? '%' : ''} />
                  <span className="delta"><TrendingUp size={14} />+{dlt.toLocaleString('en-IN', { maximumFractionDigits: dec })}{unit} since {a[0]}</span></div>
                <Chart pts={s.pts} fmt={fmt} />
              </div></Reveal>)
          })}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 20 }}><div className="wrap">
        <Reveal><div className="cta">
          <Orbs tone="dark" />
          <div className="cta-copy">
            <span className="eyebrow">Open to everyone</span>
            <h2>Know something the record doesn’t?</h2>
            <p>Add a photo, a document or a court order. A reviewer checks the source before it counts.</p>
            <div className="row"><Link to="/contribute" className="btn">Contribute evidence <ArrowRight size={14} /></Link><Link to="/issues" className="btn glass">Browse issues</Link></div>
          </div>
          <div className="cta-art">
            <div className="im shape-b"><img src="/images/turtle.jpg" alt="" loading="lazy" /></div>
            <span className="chipf c1"><Upload size={15} />Upload</span><span className="chipf c2"><ShieldCheck size={15} />Review</span><span className="chipf c3"><BadgeCheck size={15} />Trusted</span>
          </div>
        </div></Reveal>
      </div></section>
    </>
  )
}
