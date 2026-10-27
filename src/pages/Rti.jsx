import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Camera, Droplets, Copy, Check, ArrowRight } from 'lucide-react'
import { PageHead, Reveal } from '../components/ui'

const ways = [
  [FileText, 'File an RTI', 'Ask the public authority for the clearance file, survey report or consent record. A reply is evidence with a date and a reference number.'],
  [Camera, 'Document the site', 'Take dated, geotagged photos of felling, fencing or dumping. Note who was present and what you saw.'],
  [Droplets, 'Measure locally', 'Record water level, turbidity or species sightings with a method others can repeat.'],
]
const tpl = `To,
The Public Information Officer,
[Department / Authority]

Subject: Information under Section 6(1) of the RTI Act, 2005

Please provide certified copies of:
1. The application and all enclosures for [project name], [location].
2. Any site inspection or forest survey report for the area.
3. Records of gram sabha consent, if any.

I enclose the application fee as prescribed.

[Name, address, date]`
export default function Rti() {
  const [done, setDone] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(tpl); setDone(true); setTimeout(() => setDone(false), 1800) } catch { /* clipboard blocked */ } }
  return (
    <>
      <PageHead eyebrow="Act" title="Collect your own data" sub="Independent evidence is what separates a claim from a fact. Three ways to gather it." />
      <div className="wrap" style={{ paddingBottom: 70 }}>
        <div className="grid g3">{ways.map(([I, t, d], k) => (
          <Reveal key={t} delay={k * .08}><div className={`hubgroup ${['bg-mint', 'bg-sky', 'bg-mist'][k]}`} style={{ height: '100%' }}>
            <span className="iconbox" style={{ background: '#fff' }}><I size={20} /></span><h2 style={{ fontSize: 22, margin: '14px 0 6px' }}>{t}</h2><p>{d}</p></div></Reveal>))}</div>
        <div className="card rti-tpl">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}><b>Sample RTI request</b><button className="btn ghost" onClick={copy}>{done ? <Check size={14} /> : <Copy size={14} />}{done ? 'Copied' : 'Copy text'}</button></div>
          <pre>{tpl}</pre>
          <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 12 }}>A starting template, not legal advice. Check the fee and format for the authority you are writing to.</p>
        </div>
        <Link to="/contribute" className="btn primary" style={{ marginTop: 24 }}>Upload what you found <ArrowRight size={14} /></Link>
      </div>
    </>
  )
}
