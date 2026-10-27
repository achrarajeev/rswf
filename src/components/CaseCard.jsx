import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Status } from './ui'

export default function CaseCard({ i, k = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (k % 3) * .08, duration: .7, ease: [0.22, 1, 0.36, 1] }}>
      <Link to={`/issues/${i.id}`} className="ccard">
        <div className="ph"><img src={`/images/${i.img}.jpg`} alt={i.caption} loading="lazy" /></div>
        <div className="bd">
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}><Status s={i.status} />{i.help.slice(0, 2).map(h => <span key={h} className="pill tag-help">Needs {h.toLowerCase()}</span>)}</div>
          <h3>{i.name}</h3>
          <div className="chip"><MapPin size={12} />{i.state} · {i.company}</div>
        </div>
      </Link>
    </motion.div>
  )
}
