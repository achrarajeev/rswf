// Case data is ILLUSTRATIVE until reviewed (see PRD: every claim needs a traceable source).
export const issues = [
  { id: 'saidongar', trend: 'depleted', since: 2024, no: '01', name: 'Saidongar Pumped Storage', company: 'Torrent Power', state: 'Maharashtra', eco: 'Forest', status: 'Under clearance', trust: 'Medium', help: ['Legal', 'People'], mw: '1,200 MW', hectares: 412, lon: 73.45, lat: 18.55, img: 'saidongar', caption: 'Western Ghats, Maharashtra', blurb: 'Pumped-storage hydro project in the Western Ghats seeking forest diversion.' },
  { id: 'hasdeo', trend: 'depleted', since: 2015, no: '02', name: 'Hasdeo Arand Coal Block', company: 'Adani Enterprises', state: 'Chhattisgarh', eco: 'Forest', status: 'In court', trust: 'High', help: ['Legal', 'Money'], mw: 'Coal', hectares: 1898, lon: 82.5, lat: 22.45, img: 'hasdeo', caption: 'Forest, Korba district, Chhattisgarh', blurb: 'Dense sal forest and elephant corridor under mining pressure.' },
  { id: 'ennore', trend: 'depleted', since: 2016, no: '03', name: 'Ennore Creek Industrial Fill', company: 'Kamarajar Port', state: 'Tamil Nadu', eco: 'Rivers', status: 'Cleared', trust: 'Medium', help: ['People'], mw: 'Port', hectares: 120, lon: 80.32, lat: 13.23, img: 'ennore', caption: 'Ennore Creek, Tamil Nadu', blurb: 'Wetland filling along the creek affecting fisher communities.' },
  { id: 'dibang', trend: 'depleted', since: 2017, no: '04', name: 'Dibang Multipurpose Dam', company: 'NHPC', state: 'Arunachal Pradesh', eco: 'Wildlife', status: 'Cleared', trust: 'High', help: ['Money', 'Legal'], mw: '2,880 MW', hectares: 4577, lon: 95.75, lat: 28.5, img: 'dibang', caption: 'Dibang Valley, Arunachal Pradesh', blurb: 'A very large dam proposal in a biodiversity hotspot.' },
  { id: 'chilika', trend: 'improved', since: 2022, no: '05', name: 'Chilika Shrimp Enclosures', company: 'Multiple operators', state: 'Odisha', eco: 'Lakes', status: 'Proposed', trust: 'Unverified', help: ['People'], mw: 'Aquaculture', hectares: 86, lon: 85.32, lat: 19.7, img: 'chilika', caption: 'Chilika Lake, Odisha', blurb: 'Enclosures reported across a large brackish lagoon.' },
  { id: 'aarey', trend: 'restored', since: 2019, no: '06', name: 'Aarey Metro Car Shed', company: 'MMRCL', state: 'Maharashtra', eco: 'Forest', status: 'Stopped', trust: 'High', help: [], mw: 'Metro', hectares: 33, lon: 72.88, lat: 19.15, img: 'aarey', caption: 'Aarey Milk Colony, Mumbai', blurb: 'Urban forest in Mumbai where tree-felling was halted.' },
]

// Figures as published by the original agencies. Government-reported: independent check pending.
export const indicators = [
  { value: 21.76, dec: 2, suffix: '%', label: 'of India’s land is forest cover', note: '715,343 km². FSI counts any land above 1 ha with >10% canopy, plantations included.', src: 'FSI, ISFR 2023', url: 'https://fsi.nic.in', trust: 'Medium' },
  { value: 25.17, dec: 2, suffix: '%', label: 'forest and tree cover combined', note: 'The National Forest Policy 1988 target is 33%.', src: 'FSI, ISFR 2023', url: 'https://fsi.nic.in', trust: 'Medium' },
  { value: 3682, dec: 0, suffix: '', label: 'tigers, average estimate', note: 'Range 3,167 to 3,925 in the 2022 All India Tiger Estimation.', src: 'NTCA, AITE 2022', url: 'https://ntca.gov.in', trust: 'Medium' },
  { value: 7.83, dec: 2, suffix: ' pts', label: 'gap to the 33% target', note: 'Derived: 33 minus 25.17. Reviewer to confirm method.', src: 'Derived from ISFR 2023', url: 'https://fsi.nic.in', trust: 'Unverified' },
]
export const forestSeries = { title: 'Forest cover, % of area', src: 'FSI, ISFR 2015 to 2023', pts: [[2015, 21.34], [2017, 21.54], [2019, 21.67], [2021, 21.71], [2023, 21.76]] }
export const tigerSeries = { title: 'Tigers, estimated', src: 'NTCA census cycles', pts: [[2006, 1411], [2010, 1706], [2014, 2226], [2018, 2967], [2022, 3682]] }

export const claims = [
  { text: 'Project affects only 38 ha of degraded forest', by: 'Project proponent filing', thumb: 'saidongar', src: 'Parivesh proposal PP-2041', type: 'Government', trust: 'Unverified', reviewer: '—', date: '04 Jun 2026' },
  { text: 'Survey records 412 ha including 6 perennial streams', by: 'R. Patil', thumb: 'rays', src: 'RTI reply, 12 Aug 2026', type: 'RTI', trust: 'High', reviewer: 'A. Deshmukh', date: '12 Aug 2026' },
  { text: 'Estimated 1.9 Mt CO₂e lost from cleared canopy', by: 'S. Rao', thumb: 'falls', src: 'Peer-reviewed paper (sample)', type: 'Paper', trust: 'Medium', reviewer: 'S. Rao', date: '30 Aug 2026' },
  { text: 'Gram sabha consent was not obtained in 3 villages', by: 'M. Jadhav', thumb: 'hasdeo', src: 'Village testimony, Mulshi', type: 'Local testimony', trust: 'Medium', reviewer: 'P. Kulkarni', date: '02 Sep 2026' },
  { text: 'Hearing listed before NGT Pune bench', by: 'Desk upload', thumb: 'ganga', src: 'News report, 19 Sep 2026', type: 'News', trust: 'High', reviewer: 'A. Deshmukh', date: '19 Sep 2026' },
]

export const threads = [
  { title: 'Pinned: verified facts for Saidongar', author: 'RSWF Team', role: 'Moderator', votes: 312, replies: 41, pinned: true },
  { title: 'RTI template for forest diversion files, works in Maharashtra', author: 'meera_law', role: 'Lawyer', votes: 188, replies: 27 },
  { title: 'Field visit report: 6 streams not in EIA map', author: 'ghats_walker', role: 'Local', votes: 143, replies: 19 },
  { title: 'Carbon estimate method, can someone cross-check?', author: 'dr_sunita', role: 'Researcher', votes: 97, replies: 33 },
  { title: 'Where do I donate for legal costs?', author: 'new_volunteer', role: 'Local', votes: 41, replies: 8 },
]

export const features = {
  Find: [['/issues', 'Issues', 'Every active environmental issue, filterable.', 'Search'], ['/issues/saidongar', 'Issue detail', 'Government claims against independent evidence.', 'FileSearch'], ['/map', 'Map', 'Where the pressure is, by ecosystem.', 'Map']],
  Check: [['/research', 'Research and sources', 'No source, no claim. Trace every figure.', 'BookOpenCheck'], ['/tracker', 'Year-on-year tracker', 'Forest cover and tigers across census cycles.', 'TrendingUp'], ['/reviewer', 'Reviewer dashboard', 'Verify evidence and assign trust levels.', 'ShieldCheck'], ['/about', 'How we verify', 'Trust levels and what each one means.', 'BadgeCheck']],
  Act: [['/contribute', 'Contribute evidence', 'Upload RTIs, field notes, documents.', 'Upload'], ['/rti', 'Collect your own data', 'File an RTI and gather evidence yourself.', 'FileText'], ['/issues', 'Needs help', 'Money, people and legal support requests.', 'HeartHandshake']],
  Discuss: [['/forum', 'Forum', 'Threads by lawyers, researchers and locals.', 'MessagesSquare'], ['/tracker', 'Ecological Progress Index', 'One index. Method still being agreed.', 'Gauge']],
}

// Who is already working on a case. ILLUSTRATIVE sample for saidongar until real registrations exist.
// kind: Individual | Company | Institute
export const contributors = {
  saidongar: [
    { name: 'A. Deshmukh', kind: 'Individual', role: 'Lawyer', does: 'Preparing the NGT Pune submission and reviewing legal claims.', joined: 'Jun 2026' },
    { name: 'S. Rao', kind: 'Individual', role: 'Researcher', does: 'Carbon estimate and method write-up.', joined: 'Aug 2026' },
    { name: 'P. Kulkarni', kind: 'Individual', role: 'Local leader', does: 'Coordinating village testimony in Mulshi.', joined: 'Jul 2026' },
    { name: 'Sahyadri Wildlife Trust (sample)', kind: 'Institute', role: 'Field survey', does: 'Stream and species survey across the project area.', joined: 'Aug 2026' },
    { name: 'GreenLedger Analytics (sample)', kind: 'Company', role: 'Satellite analysis', does: 'Canopy-loss mapping, donated pro bono.', joined: 'Sep 2026' },
  ],
}

// Dated, sourced progress updates, newest first. Each needs proof, or it is not listed.
// ILLUSTRATIVE sample for saidongar.
export const progress = {
  saidongar: [
    { date: '19 Sep 2026', title: 'NGT Pune hearing listed', by: 'A. Deshmukh', note: 'Matter listed before the Pune bench. Next date awaited.', src: 'News report, 19 Sep 2026', trust: 'High', img: 'ganga' },
    { date: '02 Sep 2026', title: 'Village testimony collected', by: 'P. Kulkarni', note: 'Residents of 3 villages state gram sabha consent was not sought.', src: 'Village testimony, Mulshi', trust: 'Medium', img: 'hasdeo' },
    { date: '30 Aug 2026', title: 'Carbon estimate drafted', by: 'S. Rao', note: 'Estimate of 1.9 Mt CO₂e from cleared canopy, awaiting peer cross-check.', src: 'Draft paper (sample)', trust: 'Unverified', img: 'falls' },
    { date: '12 Aug 2026', title: 'RTI reply received', by: 'R. Patil', note: 'Reply records 412 ha including 6 perennial streams, against 38 ha in the filing.', src: 'RTI reply, 12 Aug 2026', trust: 'High', img: 'rays' },
  ],
}

export const helpKinds = ['Legal', 'Research', 'Field work', 'Local outreach', 'Funding', 'Media and awareness', 'Technical or data']
