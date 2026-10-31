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

// ILLUSTRATIVE sample discussion. `replies` is derived from posts.length. Authors and replies are made up.
export const threads = [
  { id: 'saidongar-facts', case: 'saidongar', title: 'Pinned: verified facts for Saidongar', author: 'RSWF Team', role: 'Moderator', votes: 312, pinned: true,
    body: 'Only claims with a source and a trust level are listed here. Add new evidence through Contribute, not in replies.',
    posts: [
      { author: 'A. Deshmukh', role: 'Lawyer', text: 'The RTI reply of 12 Aug is the strongest item so far. Please cite it by date.', when: '14 Sep 2026' },
      { author: 'ghats_walker', role: 'Local', text: 'Can we add the stream count to this list? I have photos from the field visit.', when: '16 Sep 2026' },
    ] },
  { id: 'rti-template', case: 'saidongar', title: 'RTI template for forest diversion files, works in Maharashtra', author: 'meera_law', role: 'Lawyer', votes: 188,
    body: 'This template asks for the Stage-I proposal, site inspection report and gram sabha resolutions. It worked for two files this year.',
    posts: [
      { author: 'new_volunteer', role: 'Local', text: 'Which office do I address it to?', when: '02 Sep 2026' },
      { author: 'meera_law', role: 'Lawyer', text: 'The Divisional Forest Officer for the district. Keep a copy of the postal receipt.', when: '02 Sep 2026' },
    ] },
  { id: 'streams-field', case: 'saidongar', title: 'Field visit report: 6 streams not in EIA map', author: 'ghats_walker', role: 'Local', votes: 143,
    body: 'Walked the northern boundary on 30 Aug. Six perennial streams are present that the EIA map does not show. GPS points are available on request.',
    posts: [{ author: 'dr_sunita', role: 'Researcher', text: 'Please share the points. I will overlay them on the canopy layer.', when: '01 Sep 2026' }] },
  { id: 'carbon-method', case: 'saidongar', title: 'Carbon estimate method, can someone cross-check?', author: 'dr_sunita', role: 'Researcher', votes: 97,
    body: 'The 1.9 Mt figure uses a stock-change method with default biomass values. I would like a second pair of eyes on the assumptions.',
    posts: [{ author: 'S. Rao', role: 'Researcher', text: 'Default values may overstate dense-canopy biomass. I will test with local plot data.', when: '05 Sep 2026' }] },
  { id: 'legal-donate', reported: true, case: 'saidongar', title: 'Where do I donate for legal costs?', author: 'new_volunteer', role: 'Local', votes: 41,
    body: 'Is there a way to fund the NGT filing fees yet?',
    posts: [{ author: 'RSWF Team', role: 'Moderator', text: 'Donations are not open yet. Join the case and we will contact you when they are.', when: '20 Sep 2026' }] },
  { id: 'hasdeo-order', case: 'hasdeo', title: 'Where can I read the latest High Court order for Hasdeo?', author: 'k_netam', role: 'Local', votes: 64,
    body: 'Villagers are asking for a plain-language summary of the last order.',
    posts: [{ author: 'meera_law', role: 'Lawyer', text: 'I will post a summary with the certified copy once it is available.', when: '15 Sep 2026' }] },
  { id: 'hasdeo-corridor', reported: true, case: 'hasdeo', title: 'Elephant corridor: which dataset shows the boundary?', author: 'terra_scan', role: 'Researcher', votes: 52,
    body: 'I need an official corridor boundary to overlay on the clearing map.', posts: [] },
  { id: 'ennore-fishers', case: 'ennore', title: 'Fishers lost three landing spots after the fill', author: 'r_selvam', role: 'Local', votes: 58,
    body: 'The creek mouth landing spots are no longer reachable at low tide.',
    posts: [{ author: 'A. Fernandes', role: 'Lawyer', text: 'Please collect names and dates. This supports the compensation petition.', when: '08 Sep 2026' }] },
  { id: 'dibang-baseline', case: 'dibang', title: 'Biodiversity baseline: what is still missing?', author: 'dr_sunita', role: 'Researcher', votes: 73,
    body: 'The baseline has mammals and birds. Amphibians and fish are thin.',
    posts: [{ author: 't_mihu', role: 'Researcher', text: 'Camera traps will not help with fish. We need a river survey partner.', when: '25 Aug 2026' }] },
  { id: 'chilika-enclosures', reported: true, case: 'chilika', title: 'Are these enclosures licensed?', author: 'b_behera', role: 'Local', votes: 29,
    body: 'New bamboo enclosures appeared near the lagoon fringe this season.', posts: [] },
  { id: 'aarey-check', case: 'aarey', title: 'Monthly tree count: how do we keep it consistent?', author: 'mumbai_treewatch', role: 'Local', votes: 35,
    body: 'We count the same 40 marked trees each month. Open to a better method.',
    posts: [{ author: 'dr_sunita', role: 'Researcher', text: 'Photograph each tree from a fixed spot and note the date.', when: '11 Oct 2026' }] },
]

export const features = {
  Find: [['/issues', 'Issues', 'Every active environmental issue, filterable.', 'Search'], ['/issues/saidongar', 'Issue detail', 'Government claims against independent evidence.', 'FileSearch'], ['/map', 'Map', 'Where the pressure is, by ecosystem.', 'Map']],
  Check: [['/research', 'Research and sources', 'No source, no claim. Trace every figure.', 'BookOpenCheck'], ['/tracker', 'Year-on-year tracker', 'Forest cover and tigers across census cycles.', 'TrendingUp'], ['/reviewer', 'Reviewer dashboard', 'Verify evidence and assign trust levels.', 'ShieldCheck'], ['/about', 'How we verify', 'Trust levels and what each one means.', 'BadgeCheck']],
  Act: [['/contribute', 'Contribute evidence', 'Upload RTIs, field notes, documents.', 'Upload'], ['/rti', 'Collect your own data', 'File an RTI and gather evidence yourself.', 'FileText'], ['/issues', 'Needs help', 'Money, people and legal support requests.', 'HeartHandshake']],
  Discuss: [['/forum', 'Forum', 'Threads by lawyers, researchers and locals.', 'MessagesSquare'], ['/tracker', 'Ecological Progress Index', 'One index. Method still being agreed.', 'Gauge']],
}

// People data is shaped like three database tables so a backend can copy it directly.
// ILLUSTRATIVE sample. Names marked (sample) are invented; individuals are placeholders.
//   people        one row per volunteer/user. A person can have many assignments.
//   institutions  one row per institute already working on issues (NGO, research, company).
//   assignments   join table: which person or institution works on which issue, and what they do there.
export const people = [
  { id: 'p-deshmukh', name: 'A. Deshmukh', role: 'Lawyer', place: 'Pune' },
  { id: 'p-rao', name: 'S. Rao', role: 'Researcher', place: 'Bengaluru' },
  { id: 'p-kulkarni', name: 'P. Kulkarni', role: 'Local leader', place: 'Mulshi' },
  { id: 'p-netam', name: 'K. Netam', role: 'Local leader', place: 'Korba' },
  { id: 'p-selvam', name: 'R. Selvam', role: 'Fisher representative', place: 'Ennore' },
  { id: 'p-mihu', name: 'T. Mihu', role: 'Researcher', place: 'Roing' },
  { id: 'p-behera', name: 'B. Behera', role: 'Local leader', place: 'Puri' },
  { id: 'p-fernandes', name: 'A. Fernandes', role: 'Lawyer', place: 'Mumbai' },
  { id: 'p-ganesh', name: 'Ganesh', role: 'Local resident', place: 'Puri' },
]
export const institutions = [
  { id: 'i-sahyadri', name: 'Sahyadri Wildlife Trust (sample)', type: 'NGO', place: 'Pune' },
  { id: 'i-greenledger', name: 'GreenLedger Analytics (sample)', type: 'Company', place: 'Bengaluru' },
  { id: 'i-meera', name: 'Meera Law Collective (sample)', type: 'NGO', place: 'Delhi' },
  { id: 'i-terrascan', name: 'TerraScan (sample)', type: 'Company', place: 'Hyderabad' },
  { id: 'i-coastal', name: 'Coastal Wetlands Institute (sample)', type: 'Research institute', place: 'Chennai' },
  { id: 'i-ehtrust', name: 'Eastern Himalaya Trust (sample)', type: 'NGO', place: 'Itanagar' },
  { id: 'i-hydro', name: 'Hydro Review Partners (sample)', type: 'Company', place: 'Guwahati' },
  { id: 'i-treewatch', name: 'Mumbai Tree Watch (sample)', type: 'NGO', place: 'Mumbai' },
  // status: omitted means Verified. New registrations start as 'Pending review'.
  // A reviewer sets it to 'Verified', 'More info needed' or 'Rejected' and leaves `reviewNote`.
  { id: 'i-hima', name: 'Himalayan Waters Trust (sample)', type: 'NGO', place: 'Shimla', status: 'Pending review', reg: 'HP/SOC/2021/0412 (sample)', web: '', about: 'Community group monitoring rivers and small hydro projects in the Himalaya.' },
]
// Staff accounts. Reviewers verify evidence, institutes and credentials. Moderators handle reported forum posts.
// Admins manage accounts and roles. Demo only: real staff would be invited by an admin (see Admin > Users).
export const staff = [
  { id: 'r-asha', name: 'Asha (reviewer)', role: 'Reviewer', place: 'Pune' },
  { id: 'm-ravi', name: 'Ravi (moderator)', role: 'Moderator', place: 'Chennai' },
  { id: 'a-meena', name: 'Meena (admin)', role: 'Admin', place: 'Delhi' },
]
// A user can claim a professional credential. A reviewer checks the proof, then the badge shows publicly.
//   credentials { id, person, claim, proof, status: 'Pending review'|'Verified'|'More info needed'|'Rejected', note, reviewedBy, asked }
export const claimable = ['Lawyer', 'Local researcher']
export const credentials = [
  { id: 'c-deshmukh', person: 'p-deshmukh', claim: 'Lawyer', proof: 'Bar council enrolment MH/1234/2009 (sample)', status: 'Verified', note: 'Number matched the state bar council list (sample).', reviewedBy: 'Asha (reviewer)', asked: 'Jun 2026' },
  { id: 'c-rao', person: 'p-rao', claim: 'Local researcher', proof: 'Research fellow, Bengaluru institute, letter attached (sample)', status: 'Verified', note: 'Affiliation letter checked (sample).', reviewedBy: 'Asha (reviewer)', asked: 'Aug 2026' },
  { id: 'c-fernandes', person: 'p-fernandes', claim: 'Lawyer', proof: 'Bar council enrolment MH/5678/2014 (sample)', status: 'Pending review', asked: 'Oct 2026' },
  { id: 'c-mihu', person: 'p-mihu', claim: 'Local researcher', proof: 'Field assistant on the Dibang valley biodiversity survey (sample)', status: 'Pending review', asked: 'Oct 2026' },
]
export const verifiedClaims = personId => credentials.filter(c => c.person === personId && c.status === 'Verified').map(c => c.claim)
export const verifiedByName = name => { const p = people.find(x => x.name === name); return p ? verifiedClaims(p.id) : [] }
export const assignments = [
  { issue: 'saidongar', person: 'p-deshmukh', does: 'Preparing the NGT Pune submission and reviewing legal claims.', joined: 'Jun 2026' },
  { issue: 'saidongar', person: 'p-rao', does: 'Carbon estimate and method write-up.', joined: 'Aug 2026' },
  { issue: 'saidongar', person: 'p-kulkarni', does: 'Coordinating village testimony in Mulshi.', joined: 'Jul 2026' },
  { issue: 'saidongar', institution: 'i-sahyadri', does: 'Stream and species survey across the project area.', joined: 'Aug 2026' },
  { issue: 'saidongar', institution: 'i-greenledger', does: 'Canopy-loss mapping, donated pro bono.', joined: 'Sep 2026' },
  { issue: 'saidongar', institution: 'i-meera', does: 'Template RTI requests and legal review.', joined: 'Jul 2026' },
  { issue: 'hasdeo', person: 'p-netam', does: 'Documenting village-level consent objections.', joined: 'Apr 2026' },
  { issue: 'hasdeo', institution: 'i-meera', does: 'Tracking the High Court matter and drafting interventions.', joined: 'Mar 2026' },
  { issue: 'hasdeo', institution: 'i-terrascan', does: 'Tree-cover loss mapping, donated pro bono.', joined: 'May 2026' },
  { issue: 'ennore', person: 'p-selvam', does: 'Recording how filling has changed fishing grounds.', joined: 'Jul 2026' },
  { issue: 'ennore', person: 'p-fernandes', does: 'Supporting the compensation petition.', joined: 'Aug 2026' },
  { issue: 'ennore', institution: 'i-coastal', does: 'Mapping creek water flow before and after filling.', joined: 'Aug 2026' },
  { issue: 'dibang', person: 'p-mihu', does: 'Compiling the biodiversity baseline for the valley.', joined: 'Jun 2026' },
  { issue: 'dibang', person: 'p-rao', does: 'Reviewing carbon assumptions for submerged forest.', joined: 'Sep 2026' },
  { issue: 'dibang', institution: 'i-ehtrust', does: 'Camera-trap survey across the submergence zone.', joined: 'Aug 2026' },
  { issue: 'dibang', institution: 'i-hydro', does: 'Independent review of the dam safety and cost documents.', joined: 'Sep 2026' },
  { issue: 'chilika', person: 'p-behera', does: 'Reporting new enclosures from the lagoon fringe.', joined: 'Aug 2026' },
  { issue: 'chilika', institution: 'i-coastal', does: 'Water-quality sampling near the enclosures.', joined: 'Oct 2026' },
  { issue: 'aarey', person: 'p-deshmukh', does: 'Monitoring compliance with the stop order.', joined: 'Oct 2019' },
  { issue: 'aarey', person: 'p-fernandes', does: 'Monitoring compliance with the stop order.', joined: 'Oct 2019' },
  { issue: 'aarey', institution: 'i-treewatch', does: 'Periodic canopy and tree-count checks.', joined: 'Nov 2019' },
  { issue: 'chilika', person: 'p-ganesh', does: 'Photographing enclosures along the Satapada shore.', joined: 'Oct 2026' },
  { issue: 'dibang', institution: 'i-hima', does: 'River-flow monitoring and community outreach in the lower valley.', joined: 'Oct 2026' },
  { issue: 'aarey', institution: 'i-sahyadri', does: 'Bird and small-mammal checks in the patch.', joined: 'Mar 2026' },
]

// Everyone on one issue, with the other issues each is also tagged to. kind: Volunteer | Institute
export const peopleOnIssue = issueId => assignments.filter(a => a.issue === issueId && !(a.institution && institutions.find(x => x.id === a.institution)?.status === 'Rejected')).map(a => {
  const inst = !!a.institution, key = inst ? a.institution : a.person
  const ref = (inst ? institutions : people).find(x => x.id === key)
  const others = assignments.filter(b => (inst ? b.institution : b.person) === key && b.issue !== issueId).map(b => b.issue)
  return { key, kind: inst ? 'Institute' : 'Volunteer', name: ref.name, sub: inst ? ref.type : ref.role, place: ref.place, status: inst ? (ref.status || 'Verified') : 'Active', verified: inst ? [] : verifiedClaims(key), does: a.does, joined: a.joined, others }
})

// Dated, sourced progress updates, newest first. Each needs proof, or it is not listed.
// ILLUSTRATIVE sample for saidongar.
export const progress = {
  saidongar: [
    { date: '19 Sep 2026', title: 'NGT Pune hearing listed', by: 'A. Deshmukh', note: 'Matter listed before the Pune bench. Next date awaited.', src: 'News report, 19 Sep 2026', trust: 'High', img: 'ganga' },
    { date: '02 Sep 2026', title: 'Village testimony collected', by: 'P. Kulkarni', note: 'Residents of 3 villages state gram sabha consent was not sought.', src: 'Village testimony, Mulshi', trust: 'Medium', img: 'hasdeo' },
    { date: '30 Aug 2026', title: 'Carbon estimate drafted', by: 'S. Rao', note: 'Estimate of 1.9 Mt CO₂e from cleared canopy, awaiting peer cross-check.', src: 'Draft paper (sample)', trust: 'Unverified', img: 'falls' },
    { date: '12 Aug 2026', title: 'RTI reply received', by: 'R. Patil', note: 'Reply records 412 ha including 6 perennial streams, against 38 ha in the filing.', src: 'RTI reply, 12 Aug 2026', trust: 'High', img: 'rays' },
  ],

  hasdeo: [
    { date: '14 Sep 2026', title: 'High Court hearing held', by: 'Meera Law Collective (sample)', note: 'Matter heard; next date listed. Sample entry.', src: 'Court cause list (sample)', trust: 'Medium', img: 'hasdeo' },
    { date: '20 Jul 2026', title: 'Tree-cover loss mapped', by: 'TerraScan (sample)', note: 'Satellite comparison shows clearing at the block edge. Sample entry.', src: 'Satellite analysis (sample)', trust: 'Unverified', img: 'rays' },
  ],
  ennore: [
    { date: '05 Sep 2026', title: 'Fishing ground survey', by: 'R. Selvam', note: 'Fishers report lost access to three landing spots. Sample entry.', src: 'Community survey (sample)', trust: 'Medium', img: 'ennore' },
  ],
  dibang: [
    { date: '22 Aug 2026', title: 'Camera-trap round completed', by: 'Eastern Himalaya Trust (sample)', note: 'First survey round finished; images under review. Sample entry.', src: 'Field report (sample)', trust: 'Unverified', img: 'tiger' },
  ],
  aarey: [
    { date: '10 Oct 2026', title: 'Tree count re-checked', by: 'Mumbai Tree Watch (sample)', note: 'No new felling found in the patch checked. Sample entry.', src: 'Field note (sample)', trust: 'Medium', img: 'aarey' },
  ],
}

// Case-level needs (issue.help) are coarse; the join form is finer. This maps one to the other so Join can preselect.
export const needToKinds = { Legal: ['Legal'], Money: ['Funding'], People: ['Field work', 'Local outreach'] }
export const helpKinds = ['Legal', 'Research', 'Field work', 'Local outreach', 'Funding', 'Media and awareness', 'Technical or data']

// ILLUSTRATIVE sample legal and impact records so every case can be walked end to end. Replace with sourced records.
export const legal = {
  saidongar: { text: 'Stage-I forest clearance pending. NGT Pune hearing listed.', src: 'News report, 19 Sep 2026', gap: 'Missing: gram sabha consent record. Help needed to obtain via RTI.' },
  hasdeo: { text: 'Challenge to the mining clearance is before the High Court. Hearing in progress (sample).', src: 'Court cause list (sample)', gap: 'Missing: certified copy of the latest order.' },
  ennore: { text: 'Clearance granted. A petition on compensation for fishers is pending (sample).', src: 'Order summary (sample)', gap: 'Missing: the original environmental clearance letter.' },
  dibang: { text: 'Clearance granted. Conditions on compensatory afforestation are open to review (sample).', src: 'Ministry record (sample)', gap: 'Missing: compliance reports against the conditions.' },
  chilika: { text: 'No order yet. Complaint about unauthorised enclosures is with the authority (sample).', src: 'Complaint copy (sample)', gap: 'Missing: lease records for the enclosure sites.' },
  aarey: { text: 'Felling stopped by court order. Compliance is being monitored (sample).', src: 'Order summary (sample)', gap: 'Missing: none known. Periodic site checks continue.' },
}

export const impact = {
  saidongar: { co2: '1.9 Mt', co2Note: 'CO₂e estimated from cleared canopy', co2Src: 'Sample estimate', species: 14, speciesNote: 'Schedule-I species recorded nearby', speciesSrc: 'Local survey (sample)' },
  hasdeo: { co2: '4.1 Mt', co2Note: 'CO₂e estimated from standing forest at risk', co2Src: 'Sample estimate', species: 22, speciesNote: 'Species recorded in the corridor', speciesSrc: 'Survey summary (sample)' },
  ennore: { co2: '0.2 Mt', co2Note: 'CO₂e estimated from filled wetland', co2Src: 'Sample estimate', species: 9, speciesNote: 'Waterbird species recorded', speciesSrc: 'Bird count (sample)' },
  dibang: { co2: '6.3 Mt', co2Note: 'CO₂e estimated from submerged forest', co2Src: 'Sample estimate', species: 31, speciesNote: 'Protected species recorded in the valley', speciesSrc: 'Baseline study (sample)' },
  chilika: { co2: '0.1 Mt', co2Note: 'CO₂e estimated from lagoon-edge change', co2Src: 'Sample estimate', species: 12, speciesNote: 'Migratory bird species recorded', speciesSrc: 'Bird count (sample)' },
  aarey: { co2: '0.05 Mt', co2Note: 'CO₂e estimated from trees already felled', co2Src: 'Sample estimate', species: 16, speciesNote: 'Species recorded in the patch', speciesSrc: 'Field survey (sample)' },
}

// Evidence of WORK PROGRESS: the proof behind each progress update (video, documents, live recordings).
// Not legal-case evidence, and separate from Sources (cited claims). `for` names the progress update it proves.
// ILLUSTRATIVE sample. type: Video | Document | Live recording | Photo
export const evidence = {
  saidongar: [
    { type: 'Document', title: 'NGT Pune cause list, 19 Sep', for: 'NGT Pune hearing listed', by: 'A. Deshmukh', date: '19 Sep 2026', trust: 'High', img: 'ganga' },
    { type: 'Video', title: 'Mulshi villagers on gram sabha consent', for: 'Village testimony collected', by: 'P. Kulkarni', date: '02 Sep 2026', trust: 'Medium', img: 'hasdeo' },
    { type: 'Document', title: 'Draft carbon estimate (PDF)', for: 'Carbon estimate drafted', by: 'S. Rao', date: '30 Aug 2026', trust: 'Unverified', img: 'falls' },
    { type: 'Document', title: 'RTI reply, 12 Aug', for: 'RTI reply received', by: 'R. Patil', date: '12 Aug 2026', trust: 'High', img: 'rays' },
    { type: 'Live recording', title: 'Stream survey walk, northern boundary', for: 'RTI reply received', by: 'ghats_walker', date: '30 Aug 2026', trust: 'Medium', img: 'saidongar' },
  ],
  hasdeo: [
    { type: 'Document', title: 'High Court cause list (sample)', for: 'High Court hearing held', by: 'Meera Law Collective (sample)', date: '14 Sep 2026', trust: 'Medium', img: 'hasdeo' },
    { type: 'Photo', title: 'Satellite comparison, block edge (sample)', for: 'Tree-cover loss mapped', by: 'TerraScan (sample)', date: '20 Jul 2026', trust: 'Unverified', img: 'rays' },
  ],
  ennore: [
    { type: 'Video', title: 'Fishers at the creek mouth (sample)', for: 'Fishing ground survey', by: 'R. Selvam', date: '05 Sep 2026', trust: 'Medium', img: 'ennore' },
  ],
  dibang: [
    { type: 'Live recording', title: 'Camera-trap setup, day one (sample)', for: 'Camera-trap round completed', by: 'Eastern Himalaya Trust (sample)', date: '22 Aug 2026', trust: 'Unverified', img: 'tiger' },
  ],
  aarey: [
    { type: 'Photo', title: 'Marked trees, fixed-spot photos (sample)', for: 'Tree count re-checked', by: 'Mumbai Tree Watch (sample)', date: '10 Oct 2026', trust: 'Medium', img: 'aarey' },
    { type: 'Video', title: 'Site walk-through (sample)', for: 'Tree count re-checked', by: 'A. Fernandes', date: '10 Oct 2026', trust: 'Medium', img: 'aarey' },
  ],
}
export const evidenceTypes = ['Video', 'Document', 'Live recording', 'Photo']

// How each issue can be solved, step by step, and the tasks under each step. Shaped like DB tables.
//   solutionSteps { id, issue, order, title, detail }
//   tasks         { id, issue, step, title, kind (one of helpKinds), status: 'Open'|'Taken up'|'Done',
//                   person | institution (who holds it), how: 'Volunteered'|'Assigned', createdBy (institution id), added }
// Institutes already on the issue maintain tasks. The assignee must also be on the issue (see `assignments`).
// Illustrative sample content, not a real work plan.
export const solutionSteps = [
  { id: 'st-sai-1', issue: 'saidongar', order: 1, title: 'Establish the facts on the ground', detail: 'Independent survey of forest cover, streams and species so every later claim has a baseline.' },
  { id: 'st-sai-2', issue: 'saidongar', order: 2, title: 'Put the evidence before the regulator', detail: 'File the submission with the tribunal and request the public documents the approval relied on.' },
  { id: 'st-sai-3', issue: 'saidongar', order: 3, title: 'Keep local voices on the record', detail: 'Record village testimony and objections so they are part of the file.' },
  { id: 'st-has-1', issue: 'hasdeo', order: 1, title: 'Document consent and objections', detail: 'Collect gram sabha records and village-level objections.' },
  { id: 'st-has-2', issue: 'hasdeo', order: 2, title: 'Track and support the court matter', detail: 'Follow hearings and prepare interventions.' },
  { id: 'st-has-3', issue: 'hasdeo', order: 3, title: 'Measure forest loss independently', detail: 'Repeat canopy mapping on a fixed schedule.' },
  { id: 'st-enn-1', issue: 'ennore', order: 1, title: 'Record the damage to livelihoods', detail: 'Fishing-ground and catch records from the people who fish there.' },
  { id: 'st-enn-2', issue: 'ennore', order: 2, title: 'Support the compensation claim', detail: 'Legal drafting and supporting data for the petition.' },
  { id: 'st-dib-1', issue: 'dibang', order: 1, title: 'Finish the biodiversity baseline', detail: 'Camera-trap and field survey across the submergence zone.' },
  { id: 'st-dib-2', issue: 'dibang', order: 2, title: 'Review the project documents independently', detail: 'Safety, cost and carbon assumptions checked by someone with no stake.' },
  { id: 'st-dib-3', issue: 'dibang', order: 3, title: 'Involve the lower valley communities', detail: 'River-flow monitoring and outreach with residents.' },
  { id: 'st-chi-1', issue: 'chilika', order: 1, title: 'Map and report new enclosures', detail: 'Geotagged photos of enclosures along the lagoon fringe.' },
  { id: 'st-chi-2', issue: 'chilika', order: 2, title: 'Measure the effect on water quality', detail: 'Repeat sampling near enclosures and at a clean reference point.' },
  { id: 'st-aar-1', issue: 'aarey', order: 1, title: 'Keep the stop order honoured', detail: 'Regular site checks and a public log of what was seen.' },
  { id: 'st-aar-2', issue: 'aarey', order: 2, title: 'Track what is still living in the patch', detail: 'Tree counts and species checks over time.' },
]
export const tasks = [
  { id: 't-sai-1', issue: 'saidongar', step: 'st-sai-1', title: 'Stream and species survey, northern boundary', kind: 'Field work', status: 'Taken up', institution: 'i-sahyadri', how: 'Volunteered', createdBy: 'i-sahyadri', added: 'Aug 2026' },
  { id: 't-sai-2', issue: 'saidongar', step: 'st-sai-1', title: 'Canopy-loss map for 2019 to 2025', kind: 'Technical or data', status: 'Done', institution: 'i-greenledger', how: 'Volunteered', createdBy: 'i-sahyadri', added: 'Aug 2026' },
  { id: 't-sai-3', issue: 'saidongar', step: 'st-sai-1', title: 'Check species list against a second source', kind: 'Research', status: 'Open', createdBy: 'i-sahyadri', added: 'Sep 2026' },
  { id: 't-sai-4', issue: 'saidongar', step: 'st-sai-2', title: 'Draft the tribunal submission', kind: 'Legal', status: 'Taken up', person: 'p-deshmukh', how: 'Assigned', createdBy: 'i-meera', added: 'Jul 2026' },
  { id: 't-sai-5', issue: 'saidongar', step: 'st-sai-2', title: 'File template RTI requests for the approval papers', kind: 'Legal', status: 'Open', createdBy: 'i-meera', added: 'Sep 2026' },
  { id: 't-sai-6', issue: 'saidongar', step: 'st-sai-3', title: 'Record testimony from three Mulshi villages', kind: 'Local outreach', status: 'Taken up', person: 'p-kulkarni', how: 'Volunteered', createdBy: 'i-sahyadri', added: 'Jul 2026' },
  { id: 't-sai-7', issue: 'saidongar', step: 'st-sai-3', title: 'Translate testimony into English', kind: 'Media and awareness', status: 'Open', createdBy: 'i-sahyadri', added: 'Oct 2026' },
  { id: 't-has-1', issue: 'hasdeo', step: 'st-has-1', title: 'Photograph and log gram sabha resolutions', kind: 'Field work', status: 'Taken up', person: 'p-netam', how: 'Volunteered', createdBy: 'i-meera', added: 'Apr 2026' },
  { id: 't-has-2', issue: 'hasdeo', step: 'st-has-1', title: 'Visit five more villages for consent records', kind: 'Local outreach', status: 'Open', createdBy: 'i-meera', added: 'Aug 2026' },
  { id: 't-has-3', issue: 'hasdeo', step: 'st-has-2', title: 'Summarise each hearing in plain language', kind: 'Legal', status: 'Taken up', institution: 'i-meera', how: 'Volunteered', createdBy: 'i-meera', added: 'Mar 2026' },
  { id: 't-has-4', issue: 'hasdeo', step: 'st-has-2', title: 'Fund travel to the next hearing', kind: 'Funding', status: 'Open', createdBy: 'i-meera', added: 'Oct 2026' },
  { id: 't-has-5', issue: 'hasdeo', step: 'st-has-3', title: 'Quarterly tree-cover loss map', kind: 'Technical or data', status: 'Taken up', institution: 'i-terrascan', how: 'Volunteered', createdBy: 'i-meera', added: 'May 2026' },
  { id: 't-enn-1', issue: 'ennore', step: 'st-enn-1', title: 'Log catch and fishing-ground changes each month', kind: 'Field work', status: 'Taken up', person: 'p-selvam', how: 'Volunteered', createdBy: 'i-coastal', added: 'Jul 2026' },
  { id: 't-enn-2', issue: 'ennore', step: 'st-enn-1', title: 'Map creek water flow before and after filling', kind: 'Research', status: 'Taken up', institution: 'i-coastal', how: 'Volunteered', createdBy: 'i-coastal', added: 'Aug 2026' },
  { id: 't-enn-3', issue: 'ennore', step: 'st-enn-1', title: 'Interview ten more fishing families', kind: 'Local outreach', status: 'Open', createdBy: 'i-coastal', added: 'Sep 2026' },
  { id: 't-enn-4', issue: 'ennore', step: 'st-enn-2', title: 'Support the compensation petition', kind: 'Legal', status: 'Taken up', person: 'p-fernandes', how: 'Assigned', createdBy: 'i-coastal', added: 'Aug 2026' },
  { id: 't-dib-1', issue: 'dibang', step: 'st-dib-1', title: 'Camera-trap survey across the submergence zone', kind: 'Field work', status: 'Taken up', institution: 'i-ehtrust', how: 'Volunteered', createdBy: 'i-ehtrust', added: 'Aug 2026' },
  { id: 't-dib-2', issue: 'dibang', step: 'st-dib-1', title: 'Compile the species baseline', kind: 'Research', status: 'Taken up', person: 'p-mihu', how: 'Volunteered', createdBy: 'i-ehtrust', added: 'Jun 2026' },
  { id: 't-dib-3', issue: 'dibang', step: 'st-dib-1', title: 'Identify camera-trap images', kind: 'Technical or data', status: 'Open', createdBy: 'i-ehtrust', added: 'Oct 2026' },
  { id: 't-dib-4', issue: 'dibang', step: 'st-dib-2', title: 'Review dam safety and cost documents', kind: 'Technical or data', status: 'Taken up', institution: 'i-hydro', how: 'Volunteered', createdBy: 'i-ehtrust', added: 'Sep 2026' },
  { id: 't-dib-5', issue: 'dibang', step: 'st-dib-2', title: 'Check carbon assumptions for submerged forest', kind: 'Research', status: 'Taken up', person: 'p-rao', how: 'Volunteered', createdBy: 'i-ehtrust', added: 'Sep 2026' },
  { id: 't-dib-6', issue: 'dibang', step: 'st-dib-3', title: 'Monthly river-flow readings, lower valley', kind: 'Field work', status: 'Taken up', institution: 'i-hima', how: 'Volunteered', createdBy: 'i-ehtrust', added: 'Oct 2026' },
  { id: 't-dib-7', issue: 'dibang', step: 'st-dib-3', title: 'Hold a village meeting on the findings', kind: 'Local outreach', status: 'Open', createdBy: 'i-ehtrust', added: 'Oct 2026' },
  { id: 't-chi-1', issue: 'chilika', step: 'st-chi-1', title: 'Geotagged photos along the Satapada shore', kind: 'Field work', status: 'Taken up', person: 'p-ganesh', how: 'Volunteered', createdBy: 'i-coastal', added: 'Oct 2026' },
  { id: 't-chi-2', issue: 'chilika', step: 'st-chi-1', title: 'Report enclosures on the northern fringe', kind: 'Field work', status: 'Open', createdBy: 'i-coastal', added: 'Oct 2026' },
  { id: 't-chi-3', issue: 'chilika', step: 'st-chi-2', title: 'Water sampling near enclosures', kind: 'Research', status: 'Taken up', institution: 'i-coastal', how: 'Volunteered', createdBy: 'i-coastal', added: 'Oct 2026' },
  { id: 't-chi-4', issue: 'chilika', step: 'st-chi-2', title: 'Fund lab tests for 20 samples', kind: 'Funding', status: 'Open', createdBy: 'i-coastal', added: 'Oct 2026' },
  { id: 't-aar-1', issue: 'aarey', step: 'st-aar-1', title: 'Monthly site check against the stop order', kind: 'Legal', status: 'Taken up', person: 'p-deshmukh', how: 'Volunteered', createdBy: 'i-treewatch', added: 'Oct 2019' },
  { id: 't-aar-2', issue: 'aarey', step: 'st-aar-2', title: 'Canopy and tree-count check', kind: 'Field work', status: 'Taken up', institution: 'i-treewatch', how: 'Volunteered', createdBy: 'i-treewatch', added: 'Nov 2019' },
  { id: 't-aar-3', issue: 'aarey', step: 'st-aar-2', title: 'Bird and small-mammal check', kind: 'Research', status: 'Taken up', institution: 'i-sahyadri', how: 'Volunteered', createdBy: 'i-treewatch', added: 'Mar 2026' },
  { id: 't-aar-4', issue: 'aarey', step: 'st-aar-2', title: 'Publish a plain-language yearly summary', kind: 'Media and awareness', status: 'Open', createdBy: 'i-treewatch', added: 'Sep 2026' },
]
