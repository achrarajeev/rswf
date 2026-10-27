import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, ChevronDown, FileText } from 'lucide-react'
import { claims } from '../data'
import { PageHead, Trust } from '../components/ui'

export default function Research() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <PageHead eyebrow="Check" title="Research & sources" sub="Every claim links to where it came from." />
      <div className="wrap" style={{ paddingBottom: 40 }}>
        <div className="banner"><ShieldAlert /><b className="head" style={{ fontSize: 20 }}>No source, no claim.</b></div>
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="rtable">
            <thead><tr><th>Claim</th><th>Source</th><th>Type</th><th>Trust</th><th>Reviewer</th><th>Date</th><th /></tr></thead>
            <tbody>{claims.map((c, k) => (
              <Fragment key={k}>
                <tr className="clickable" onClick={() => setOpen(open === k ? null : k)}>
                  <td className="claim" style={{ maxWidth: 280 }}>{c.text}</td><td data-l="Source"><a style={{ color: 'var(--green)', textDecoration: 'underline' }}>{c.src}</a></td>
                  <td data-l="Type">{c.type}</td><td data-l="Trust"><Trust t={c.trust} /></td><td data-l="Reviewer">{c.reviewer}</td><td data-l="Date">{c.date}</td>
                  <td className="chev"><motion.span animate={{ rotate: open === k ? 180 : 0 }} style={{ display: 'inline-block' }}><ChevronDown size={16} /></motion.span></td>
                </tr>
                <AnimatePresence>{open === k && <tr><td colSpan={7} style={{ padding: 0, background: '#f7f5ee' }}>
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="row" style={{ padding: 20 }}><div style={{ width: 90, height: 120, background: '#fff', border: '1px solid var(--line)', borderRadius: 6, display: 'grid', placeItems: 'center' }}><FileText color="#6b6b63" /></div>
                      <div><b>Original document preview</b><p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{c.src}. Scanned copy stored for traceability.</p></div></div>
                  </motion.div></td></tr>}</AnimatePresence>
              </Fragment>))}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
