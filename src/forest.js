// Forest cover as % of each state's geographical area, from the Forest Survey of India's India State of Forest
// Report (ISFR). Report years 2015 to 2023; the map interpolates between them and holds flat after the last.
//
// SOURCES (read from the FSI PDFs, not from memory):
//  - 2019: ISFR 2019 Vol. I, Table 2.4 (fsi.nic.in/isfr2019/isfr-fsi-vol1.pdf). National sum checked = 7,12,249 km2.
//  - 2017: derived as ISFR 2019 total minus that table's "change w.r.t. ISFR 2017" column (exact, official).
//  - 2021 and 2023: ISFR 2023 Vol. I, Table 2.4, columns S and T (forest cover inside + outside RFA/GW).
//    2021 is the report's own REVISED 2021 figure, so it differs slightly from the numbers printed in ISFR 2021.
//    National sum checked = 7,15,342.61 km2 and change +156.41, both as published.
//  - 2015: UNVERIFIED. Density-class sums from a secondary source (Wikipedia, "Forest cover by state in India"),
//    kept only for states where they agree with official 2017 minus the published change (within 0.12 points).
//    Omitted (see forestMeta.partial2015) for J&K and Ladakh (reported combined in 2015), Delhi, Tripura and
//    Dadra & Nagar Haveli and Daman & Diu, where the check failed or no clean figure exists.
// Percentages use one area per state throughout (ISFR 2023 revised areas; J&K and Ladakh use the ISFR 2021 split),
// so a state never changes colour just because its reference area changed.
export const forestMeta = {
  src: 'FSI, India State of Forest Report 2019 and 2023 (2017 derived, 2021 as revised in ISFR 2023)',
  trust: 'Medium', years: [2015, 2017, 2019, 2021, 2023],
  note: 'Government-reported, independent check pending. 2015 values come from a secondary source and are omitted for states where they could not be confirmed. The series changes assessment method between reports, so small moves are within method noise.',
  partial2015: ["Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Tripura"],
}
export const forestCover = {
  "Andaman and Nicobar": { 2015: 81.84, 2017: 81.73, 2019: 81.74, 2021: 81.67, 2023: 81.62 },
  "Andhra Pradesh": { 2015: 15.96, 2017: 17.28, 2019: 17.88, 2021: 18.55, 2023: 18.47 },
  "Arunachal Pradesh": { 2015: 80.19, 2017: 79.96, 2019: 79.63, 2021: 78.78, 2023: 78.67 },
  "Assam": { 2015: 35.11, 2017: 35.83, 2019: 36.11, 2021: 36.11, 2023: 36.1 },
  "Bihar": { 2015: 7.7, 2017: 7.75, 2019: 7.76, 2021: 7.86, 2023: 8.0 },
  "Chandigarh": { 2015: 19.0, 2017: 18.91, 2019: 19.32, 2021: 20.88, 2023: 21.93 },
  "Chhattisgarh": { 2015: 41.1, 2017: 41.09, 2019: 41.13, 2021: 41.3, 2023: 41.28 },
  "Dadra and Nagar Haveli and Daman and Diu": { 2017: 37.79, 2019: 37.79, 2021: 37.53, 2023: 37.48 },
  "Delhi": { 2017: 12.97, 2019: 13.18, 2021: 13.17, 2023: 13.17 },
  "Goa": { 2015: 59.7, 2017: 60.21, 2019: 60.43, 2021: 61.24, 2023: 61.2 },
  "Gujarat": { 2015: 7.5, 2017: 7.52, 2019: 7.57, 2021: 7.56, 2023: 7.65 },
  "Haryana": { 2015: 3.57, 2017: 3.59, 2019: 3.62, 2021: 3.68, 2023: 3.65 },
  "Himachal Pradesh": { 2015: 26.42, 2017: 27.12, 2019: 27.72, 2021: 27.89, 2023: 27.99 },
  "Jammu and Kashmir": { 2017: 38.03, 2019: 38.67, 2021: 38.93, 2023: 39.08 },
  "Jharkhand": { 2015: 29.51, 2017: 29.55, 2019: 29.62, 2021: 29.74, 2023: 29.81 },
  "Karnataka": { 2015: 19.0, 2017: 19.58, 2019: 20.11, 2021: 20.39, 2023: 20.47 },
  "Kerala": { 2015: 49.62, 2017: 52.3, 2019: 54.42, 2021: 56.43, 2023: 56.78 },
  "Ladakh": { 2017: 1.47, 2019: 1.48, 2021: 1.36, 2023: 1.36 },
  "Lakshadweep": { 2015: 91.33, 2017: 91.46, 2019: 91.46, 2021: 91.33, 2023: 91.33 },
  "Madhya Pradesh": { 2015: 25.12, 2017: 25.11, 2019: 25.14, 2021: 25.12, 2023: 25.0 },
  "Maharashtra": { 2015: 16.48, 2017: 16.47, 2019: 16.5, 2021: 16.55, 2023: 16.53 },
  "Manipur": { 2015: 76.51, 2017: 77.69, 2019: 75.46, 2021: 74.53, 2023: 74.28 },
  "Meghalaya": { 2015: 76.96, 2017: 76.45, 2019: 76.33, 2021: 75.78, 2023: 75.65 },
  "Mizoram": { 2015: 88.79, 2017: 86.27, 2019: 85.41, 2021: 84.19, 2023: 85.34 },
  "Nagaland": { 2015: 78.04, 2017: 75.33, 2019: 75.31, 2021: 74.04, 2023: 73.72 },
  "Odisha": { 2015: 32.41, 2017: 32.98, 2019: 33.15, 2021: 33.58, 2023: 33.67 },
  "Puducherry": { 2015: 11.62, 2017: 10.95, 2019: 10.7, 2021: 9.01, 2023: 9.04 },
  "Punjab": { 2015: 3.52, 2017: 3.65, 2019: 3.67, 2021: 3.67, 2023: 3.67 },
  "Rajasthan": { 2015: 4.71, 2017: 4.84, 2019: 4.86, 2021: 4.86, 2023: 4.84 },
  "Sikkim": { 2015: 47.25, 2017: 47.13, 2019: 47.1, 2021: 47.25, 2023: 47.33 },
  "Tamil Nadu": { 2015: 20.15, 2017: 20.21, 2019: 20.27, 2021: 20.38, 2023: 20.34 },
  "Telangana": { 2015: 17.71, 2017: 18.21, 2019: 18.36, 2021: 18.98, 2023: 18.89 },
  "Tripura": { 2017: 73.68, 2019: 73.68, 2021: 73.24, 2023: 72.33 },
  "Uttar Pradesh": { 2015: 5.98, 2017: 6.09, 2019: 6.15, 2021: 6.2, 2023: 6.24 },
  "Uttarakhand": { 2015: 45.38, 2017: 45.43, 2019: 45.44, 2021: 45.48, 2023: 45.44 },
  "West Bengal": { 2015: 18.96, 2017: 18.98, 2019: 19.04, 2021: 18.91, 2023: 18.97 }
}
