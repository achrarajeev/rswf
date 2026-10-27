// One-off: pull India out of Natural Earth (world-atlas) so the app ships ~100 KB, not the whole world.
import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
const world = JSON.parse(readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'))
const india = feature(world, world.objects.countries).features.find(f => f.id === '356')
const round = c => Array.isArray(c[0]) ? c.map(round) : c.map(n => +n.toFixed(3))
india.geometry.coordinates = round(india.geometry.coordinates)
writeFileSync('src/india.json', JSON.stringify(india))
console.log('bytes', JSON.stringify(india).length)
