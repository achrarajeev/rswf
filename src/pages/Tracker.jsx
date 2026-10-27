import { Trust, PageHead, Reveal, Source } from '../components/ui'
import Chart from '../components/Chart'
import { forestSeries, tigerSeries } from '../data'

export default function Tracker() {
  return (
    <>
      <PageHead eyebrow="Check" title="Year on year" sub="Published figures by census cycle. Independent data collection is the next layer: contributors can add and challenge these." />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="grid" style={{ gap: 64 }}>
          {[[forestSeries, v => v + '%', 'FSI reports forest cover every two years. Its definition covers any land above 1 ha with more than 10% canopy, so plantations and orchards count.'], [tigerSeries, v => v.toLocaleString('en-IN'), 'Estimates come from a four-yearly camera-trap census. Counting methods improved between cycles, so early and late figures are not strictly like-for-like.']].map(([s, fmt, note]) => (
            <Reveal key={s.title}><div className="sec-head trk" style={{ gap: 48, alignItems: 'start' }}>
              <div><h2 className="trk-h">{s.title}</h2><p style={{ color: 'var(--body)', margin: '14px 0' }}>{note}</p><Source>{s.src}</Source> <Trust t="Medium" /></div>
              <Chart pts={s.pts} fmt={fmt} h={280} /></div></Reveal>))}
        </div>
        <div className="banner" style={{ marginTop: 56 }}><b className="head" style={{ fontSize: 22 }}>Ecological Progress Index: method not final.</b><span>Until the group agrees how to combine sources, we show the raw series, not a score.</span></div>
      </div>
    </>
  )
}
