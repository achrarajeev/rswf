// Forest cover as % of each state's geographical area, from the FSI India State of Forest Report (ISFR).
// SOURCE: secondary (English Wikipedia, "Forest cover by state in India", ISFR 2015 and 2017 tables). Official FSI
// sources were unreachable when this was built. STATUS: UNVERIFIED. Replace with figures from the ISFR volumes
// (fsi.gov.in) before publishing.
//
// How the numbers were derived and cross-checked:
//  - 2015 = (very dense + moderately dense + open forest) / geographical area.
//  - 2017 = the published percentage, accepted only where it equals either the class sum or the published total.
//    Kerala's 2017 class sum disagrees with its published total; the total is kept because 2015 + the published
//    change since 2015 reproduces it.
//  - 2017 minus the published "change since 2015" was compared with the 2015 class sum. Rows that are off are
//    marked `flag` (Meghalaya, Tripura, Chandigarh, Lakshadweep, Puducherry). Delhi is omitted: its published 2017
//    percentage contradicts its own total.
//  - Before 2019, Ladakh was reported inside Jammu & Kashmir, so both share one combined value.
//  - Dadra & Nagar Haveli and Daman & Diu are summed (one map feature).
// ISFR 2019, 2021 and 2023 have no clean state-level source yet, so the map holds flat after 2017.
export const forestMeta = {
  src: 'FSI, ISFR 2015 and 2017 via Wikipedia', trust: 'Unverified', years: [2015, 2017],
  note: 'State figures are unverified and come from a secondary source. Jammu & Kashmir and Ladakh share one combined value. Later reports are not loaded yet.',
}
export const forestCover = {
 "Andhra Pradesh": {
  "2015": 15.96,
  "2017": 17.27
 },
 "Arunachal Pradesh": {
  "2015": 80.19,
  "2017": 79.96
 },
 "Assam": {
  "2015": 35.11,
  "2017": 35.83
 },
 "Bihar": {
  "2015": 7.7,
  "2017": 7.75
 },
 "Chhattisgarh": {
  "2015": 41.1,
  "2017": 41.09
 },
 "Goa": {
  "2015": 59.7,
  "2017": 60.21
 },
 "Gujarat": {
  "2015": 7.5,
  "2017": 7.52
 },
 "Haryana": {
  "2015": 3.57,
  "2017": 3.59
 },
 "Himachal Pradesh": {
  "2015": 26.42,
  "2017": 27.12
 },
 "Jammu and Kashmir": {
  "2015": 10.34,
  "2017": 10.46
 },
 "Ladakh": {
  "2015": 10.34,
  "2017": 10.46
 },
 "Jharkhand": {
  "2015": 29.51,
  "2017": 29.55
 },
 "Karnataka": {
  "2015": 19.0,
  "2017": 19.58
 },
 "Kerala": {
  "2015": 49.62,
  "2017": 52.3
 },
 "Madhya Pradesh": {
  "2015": 25.12,
  "2017": 25.11
 },
 "Maharashtra": {
  "2015": 16.48,
  "2017": 16.47
 },
 "Manipur": {
  "2015": 76.51,
  "2017": 77.69
 },
 "Meghalaya": {
  "2015": 76.96,
  "2017": 76.45,
  "flag": "2015/2017 sources disagree slightly"
 },
 "Mizoram": {
  "2015": 88.79,
  "2017": 86.27
 },
 "Nagaland": {
  "2015": 78.04,
  "2017": 75.33
 },
 "Odisha": {
  "2015": 32.41,
  "2017": 32.98
 },
 "Punjab": {
  "2015": 3.52,
  "2017": 3.65
 },
 "Rajasthan": {
  "2015": 4.71,
  "2017": 4.84
 },
 "Sikkim": {
  "2015": 47.25,
  "2017": 47.13
 },
 "Tamil Nadu": {
  "2015": 20.15,
  "2017": 20.21
 },
 "Telangana": {
  "2015": 17.71,
  "2017": 18.22
 },
 "Tripura": {
  "2015": 75.53,
  "2017": 73.68,
  "flag": "2015/2017 sources disagree slightly"
 },
 "Uttar Pradesh": {
  "2015": 5.98,
  "2017": 6.09
 },
 "Uttarakhand": {
  "2015": 45.38,
  "2017": 45.43
 },
 "West Bengal": {
  "2015": 18.96,
  "2017": 18.98
 },
 "Andaman and Nicobar": {
  "2015": 81.84,
  "2017": 81.73
 },
 "Chandigarh": {
  "2015": 19.0,
  "2017": 18.42,
  "flag": "2015/2017 sources disagree slightly"
 },
 "Lakshadweep": {
  "2015": 90.2,
  "2017": 90.0,
  "flag": "2015/2017 sources disagree slightly"
 },
 "Puducherry": {
  "2015": 11.62,
  "2017": 11.02,
  "flag": "2015/2017 sources disagree slightly"
 },
 "Dadra and Nagar Haveli and Daman and Diu": {
  "2015": 37.48,
  "2017": 37.71
 }
}
