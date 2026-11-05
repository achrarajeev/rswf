> Survey note from a read-only pass over jayanthmb14/forthepeople at commit 1131d0180e0fadd851c42a5b6b8ef841670fccfd (2026-11-04), written 2026-11-05 by a helper model. Summary and verdicts: [../forthepeople-analysis.md](../forthepeople-analysis.md). Lines marked "unverified" or "inferred" were not opened.
> Errata: the survey brief said rswf runs React 18. rswf runs React 19 (see package.json). Where this note says "fine for React 18 (rswf)", read: react-simple-maps 3.0.0 declares peers up to React 18, so React 19 needs `legacy-peer-deps` (the reference sets `legacy-peer-deps=true` in its `.npmrc`) or a port of the map code to d3-geo, which rswf already uses.
# B1: Generic UI audit, ForThePeople.in

Read-only. 49 files read in full: common 16, graphics 9, layout 4, map 8, providers 1, site 8, hooks 3. Also `src/app/globals.css` (1,261 lines) and `package.json`. Nothing run, REPO unchanged. Lines = last numbered line in the Read output. Your description checks out: MIT (package.json), App Router, TypeScript, Tailwind v4, Prisma with the pg adapter.

**Index**
- [Legend](#legend)
- [Component table](#component-table)
- [Fifteen most reusable](#fifteen-most-reusable)
- [npm dependencies](#npm-dependencies)
- [Theme tokens](#theme-tokens)
- [Outside this slice](#outside-this-slice)
- [Findings](#findings)

## Legend

Class: **A** copy with small edits · **B** rewrite styling, props or Next/i18n coupling · **C** tied to their server, API or registry (pattern may still be reused). Totals: A 21, B 20, C 8.

Next: `UC` "use client" · `SC` no directive (server-safe) · `link` next/link · `nav` next/navigation · `dyn` next/dynamic.

Style: `V` inline CSS vars · `G` global `ftp-*` classes · `CM` CSS Module · `TW` Tailwind · `HEX` hard-coded hex.

i18n: `NI` next-intl · `prop` text passed in · `hard` English in code.

npm: `nintl` next-intl · `rq` @tanstack/react-query · `rsm` react-simple-maps · `rdom` react-dom · `lucide` lucide-react · `react` otherwise.

## Component table

|File|Lines|Class|Purpose|Props|npm|Next|Style|i18n|Server/API|Why|
|-|-|-|-|-|-|-|-|-|-|-|
|src/components/common/AIInsightCard.tsx|227|C|AI reading of module data, severity pill|module, district: string|nintl, lucide|UC, nav|V, G|NI|API /api/data/insight; useFreshness|Tied to their insight API and freshness store|
|src/components/common/BadgeExplainer.tsx|156|C|Badge ladder and tier prices|none|nintl, lucide|UC|V, G|NI|TIER_CONFIG; platform-facts|Prices come from their payment config|
|src/components/common/CorporateSponsorBanner.tsx|68|B|Sponsor-this-district invite card|districtName: string, population?: number (nullable)|nintl, lucide|UC|V, G|NI|hard: email, Instagram|Contact details hard-coded|
|src/components/common/DistrictSponsorBanner.tsx|181|C|Supporter rows per district|district, state: string; stateName?, districtName?, locale?|nintl, lucide, rq|UC, link|V, G|NI|API /api/data/contributors; TIER_CONFIG|Needs their contributors API|
|src/components/common/FeedbackModal.tsx|318|B|Bottom-sheet feedback form|districtSlug?, stateSlug?, module?: string; floating?: boolean; label?: string|nintl, lucide|UC|V|hard (most labels)|POST /api/feedback|Labels mostly hard-coded English|
|src/components/common/LanguageMenu.module.css|221|A|Language switcher styles|none|none|CM|n/a|n/a|Vite handles .module.css natively|
|src/components/common/LanguageMenu.tsx|154|B|Header language switcher, locked planned list|none (exports switchLocalePath, displayOrder)|nintl, lucide|UC, link, nav|CM|NI|i18n/languages; home/use-popover|Route-prefixed locales; rewrite routing|
|src/components/common/LegalPageHeader.tsx|46|B|Legal page header with last-updated date|title, lastUpdated: string; backHref?, emoji?|nintl, lucide|SC|V|NI|SiteHeader; i18n/format-date (Asia/Kolkata)|Thin wrapper on SiteHeader|
|src/components/common/MobileHint.tsx|79|A|Tooltip on desktop, inline text on phones|hint: string, children: ReactNode|lucide|UC|V|prop|none|Pure React; uses matchMedia|
|src/components/common/ModuleErrorBoundary.tsx|94|B|Error card with Try again|children: ReactNode, moduleName?: string|nintl, lucide|UC|V|NI; district/ui ToolbarButton|Class component; copy via i18n|
|src/components/common/NoDataCard.tsx|58|C|"No data yet" block with per-module copy|module, district, state: string; isUrban?, customMessage?|nintl|UC|V|NI; state-config; district/ui EmptyState|Copy keyed to their state config|
|src/components/common/PageProgressBar.tsx|194|A|2 px top bar on client navigation|none|none|UC, nav|V|none|Swap usePathname for useLocation|
|src/components/common/ReportButton.module.css|370|A|Report button and form styles|none|none|CM|n/a|n/a|Tokens only; uses :has() and color-mix|
|src/components/common/ReportButton.tsx|329|B|Floating "Report a problem" button and form|none (exports reportContext)|nintl, lucide, rdom|UC, nav|CM|NI|API /api/feedback; districts, sidebar-modules|reportContext parses their URL scheme|
|src/components/common/SkipLink.tsx|31|A|Skip-to-content link|none|nintl|UC|G|NI (1 key)|none|Replace one t() call with a prop|
|src/components/common/StateSponsorSection.tsx|229|C|State page "Backed by" supporter lines|locale, stateSlug, stateName: string|rq, nintl, lucide|UC, link|V, G, HEX|NI|API /api/data/contributors|Needs their API; hard-coded #fff|
|src/components/graphics/CategoryGlyph.tsx|164|A|Glyph picture, optional pastel chip|glyph?, hue?, pick?, category?, domain?, size=24, chip=false, title?|none|SC|V|none|design/hues (type only)|Pure SVG|
|src/components/graphics/GlyphBarList.tsx|87|A|Ranked bars with glyph chips|rows, max?, colour?: row or page, dense?, ariaLabel?|none|SC|V, G|prop|none|Pure; bars use ftp-grow-x|
|src/components/graphics/GlyphChips.tsx|91|A|Filter chips with glyphs and counts|items: {value,label,count?,pick?}[], value, onChange, label?|nintl|UC|V, G|NI (1 key)|none|Pass group label as a prop|
|src/components/graphics/GlyphEmptyState.tsx|60|A|Empty state with glyph scene|pick, companions?, title: string, body?, action?|none|SC|V|prop|none|Pure; caller supplies text|
|src/components/graphics/GlyphScene.tsx|101|A|Decorative glyph illustration|pick, companions? (max 2), size=120|none|SC|V, G|none|CategoryGlyph|Pure|
|src/components/graphics/GlyphStack.tsx|41|A|Overlapping glyph chips|picks, size=32, max=3|none|SC|V|none|CategoryGlyph|Pure|
|src/components/graphics/category-map.ts|276|B|Category to glyph and hue rules|none (exports glyphPick, categoryGlyph, crimeGlyph, moduleGlyph, projectKindGlyph)|none|SC|n/a|none|civic/project-facts (runtime); design/hues|Civic keys and crime regexes|
|src/components/graphics/glyph-data.ts|466|A|56 glyph drawings on a 24x24 grid|none (exports GLYPHS, glyphParts)|none|SC|n/a|none|design/hues (type only)|Pure data; drop TS-only syntax|
|src/components/graphics/index.ts|49|A|Barrel for graphics|none|none|SC|n/a|none|local files|Re-exports only|
|src/components/layout/MigrationBanner.tsx|262|B|Site-wide announcement, modal or banner|none (fetches announcement)|nintl, lucide|UC|V|NI (disclaimer)|API /api/site-announcement|Name is historical; bodyMd not parsed as Markdown|
|src/components/layout/RelatedModules.tsx|62|B|"See also" tiles on module pages|locale, stateSlug, districtSlug: string|nintl|UC, link, nav|V, G|NI|sidebar-modules registry; district/ui Section|Uses their related-pairs registry|
|src/components/layout/Sidebar.tsx|286|B|Desktop left rail, collapsible, freshness dots|locale, stateSlug, districtSlug: string|nintl, lucide|UC, link, nav|V, G, TW|NI|useFreshness; registry; localStorage|Only Tailwind class in slice|
|src/components/layout/useModuleGroups.ts|22|B|Translated module-group names|none (hook returns key to string)|nintl|UC|n/a|NI|sidebar-modules MODULE_GROUPS|Tiny; re-point registry|
|src/components/map/DrillDownMap.tsx|496|B|India map: state links, live pins, zoom, cards|locale: string, labels: object, renderCard?|rsm|UC, nav|CM, V|prop|/geo/india-states.json; districts, centroids|Most reusable map; swap data and router|
|src/components/map/GenericStateMap.tsx|130|B|Any state map from GeoJSON, with pins|locale, stateSlug: string, activeDistricts: Set<string>|rsm, nintl|UC, nav|V, G, HEX|NI|fetch state GeoJSON; getState; fit; aliases|Fits any state; fix #fff|
|src/components/map/KarnatakaMap.tsx|83|B|Karnataka district map|locale: string, activeDistricts: Set<string>|rsm, nintl|UC, nav|V|NI|/geo/karnataka-districts.json; hard route|One-state copy of the same logic|
|src/components/map/StateMapSection.tsx|74|B|Picks state map; loading skeleton|locale, stateSlug: string, activeDistrictSlugs: string[]|nintl|UC, dyn|V, G|NI|KarnatakaMap; GenericStateMap|dynamic becomes React.lazy; hard-coded karnataka branch|
|src/components/map/TalukMap.tsx|228|B|District taluk map|locale, state, district, unitLabel: string; taluks?: object[]|rsm, nintl, lucide|UC, nav|V, G|NI|9 hard-coded projections and tables; /geo/district-taluks.json|Taluk shapes are schematic boxes (own note)|
|src/components/map/mapTheme.tsx|272|B|Shared map colours, tooltip, legend|geoStyle(), indiaStateStyle(), MapTooltip, MapLegend|nintl, lucide|UC|V|NI (tooltip, legend)|none|Style helpers are A; text needs props|
|src/components/map/pin-layout.ts|155|A|Projection, pin fan-out, label placement|project(lng,lat), fanOut(), placeLabels()|none|SC|n/a|none|none|Pure; India constants; has test|
|src/components/map/drilldown.module.css|254|A|Pin, zoom, card, tooltip styles|none|none|CM|n/a|n/a|Vite handles .module.css natively|
|src/components/providers/QueryProvider.tsx|34|A|React Query client with defaults|children: ReactNode|rq|UC|n/a|none|none|Copy as is; staleTime 4 s|
|src/components/site/LegalSection.tsx|275|B|Legal clause, TOC, responsive table, glance cards|LegalSection, LegalLayout, LegalTable, LegalGlance, LegalSeeAlso|nintl|SC, link|V, CM|NI|none|Good legal kit; swap Link and i18n|
|src/components/site/legal.module.css|61|A|Legal layout and table styles|none|none|CM|n/a|n/a|n/a|Glance cards use a gradient|
|src/components/site/name-error.ts|23|A|Maps validator reasons to translated text|nameErrorText(t, reason: string)|none|SC|prop|none|validator wording (outside slice)|Pure; tied to validator English|
|src/components/site/PlainPageHeader.tsx|66|B|Calm page header: back link, one H1|title, description?, backHref?, children?|nintl, lucide|SC, link|V, G|NI|none|Swap Link and one string|
|src/components/site/SiteHeader.tsx|176|B|Gradient band header for non-module pages|emoji, title, titleLocal?, description?, chip?, icon?: LucideIcon, backHref?, children?|nintl, lucide|SC, link|V, HEX|NI|script-lang util|Gradient and #fff conflict with v5 rule|
|src/components/site/SiteVisuals.tsx|288|A|Donut, ranked BarList, RingStat|Donut(), BarList(), RingStat()|none|SC|V, G, HEX|prop|none|Pure SVG; replace #fff in HUE_SHADES|
|src/components/site/TapCard.tsx|78|A|Card that opens a dialog|onClick, label?, tinted?, padding=14, highlighted?, style?, children|lucide|UC|V, G|prop|none|Pure; real button with aria|
|src/components/site/tier-label.ts|28|A|Translated supporter badge text|tierLabel(t, tier, districtName?, stateName?)|none|SC|prop|none|none|Pure; tier keys are theirs|
|src/hooks/useDistrictData.ts|81|C|React Query wrapper for per-module API|useDistrictData(module, district, state, options?, taluk?)|rq, nintl|UC|n/a|NI (locale)|API /api/data/module|Pattern reusable; endpoint tied|
|src/hooks/useFreshness.ts|235|C|Per-district freshness store for source badges|useFreshness(stateSlug, districtSlug); loadFreshness()|react|UC|n/a|none|API /api/data/freshness; lib/freshness (type)|Store pattern reusable; payload theirs|
|src/hooks/useRealtimeData.ts|792|C|29 per-module data hooks, about 39 types|each (district, state: string)|rq|UC|n/a|none|useDistrictData; /api/data/name|Not realtime; their data only|

## Fifteen most reusable

Chosen for reuse. No footer, tabs, theme toggle or stat-tile component exists in these folders (checked against the file list). Skeletons use the `.ftp-skeleton` class: AIInsightCard's loading state and the map loader in StateMapSection.

### 1. SiteVisuals.tsx (Donut, BarList, RingStat)
- **Props:** `Donut({slices, label, center?, centerSub?, size=176, thickness=30})`, where a slice is `{key, label, value, display, color, sub?}`. `BarList({rows, height=10})`. `RingStat({pct 0-100, value, caption?, label, color, size=112, index})`.
- **States:** no hooks. `Donut` returns null when the total is 0. Entrance comes from CSS (`.ftp-draw-path`, `.ftp-grow-x`).
- **Logic:** each arc is its share of the circumference, with a 2.5 px gap. Bars have a 2% floor. `RingStat` clamps `pct`.
- **Styling:** inline `var(--hue*)` and `color-mix`. `HUE_SHADES` contains `#fff`.

### 2. GlyphBarList.tsx
- **Props:** `rows: {key, label, labelLang?, sub?, value, display, pick}[]`, `max?`, `colour` ("row" default, or "page"), `dense?`, `ariaLabel?`.
- **States:** none. Returns null with no rows or a top value of 0.
- **Logic:** with `colour="row"`, each row takes its own hue class. Bar width is value over top, floored at 3%. It renders an `<ol>`, so the table view reads the same numbers.
- **Styling:** `linear-gradient(90deg, var(--hue-pop), var(--hue))` and inline vars.

### 3. GlyphChips.tsx
- **Props:** `items: {value, label, count?, pick?}[]`, `value`, `onChange(value)`, `label?`.
- **States:** `aria-pressed` marks the active chip. Hover comes from `.ftp-chip`.
- **Logic:** an item without `pick` (for example "All") uses the page hue and no glyph. Phones get 44 px targets from `.ftp-chip`.
- **Styling:** inline vars. Active = hue tint, deep text, hue border.

### 4. CategoryGlyph.tsx with glyph-data.ts and category-map.ts
- **Props:** `glyph` or `pick` or `category`+`domain`; `size=24`, `chip=false`, `title?`. `Glyph({name, size, title})` draws the bare picture.
- **Data:** 56 named drawings on a 24x24 grid (news 15, crime types 9, project kinds 16, national 16). Part tones: b, s, f, i, a, p, w. Stroke width steps with size.
- **Styling:** fills use `var(--hue-pop)`, `--hue-deep` and `--ftp-surface`. Each instance gets its colour from an `ftp-hue-<name>` class (14 hues).
- **Reuse:** the drawing system is reusable. The 56 shapes and the category rules are civic and would need redrawing for rswf.

### 5. DrillDownMap.tsx
- **Props:** `locale: string`, `labels: {map, zoomIn, zoomOut, reset, close, pin(pin), pinName?, stateName(slug, fallback), stateHint(n), stateOpen(name)}`, `renderCard?(pin)`.
- **States:** `sel` (pin or state, hover or pinned), `view {center, zoom}`, last pointer type, box width from ResizeObserver. Touch: first tap shows the card, second opens. Escape closes. Wheel zoom needs Ctrl or ⌘.
- **Logic:** pins are real `<a>` links. Crowded pins are spread by pin-layout. State fills come from mapTheme.
- **Styling:** `drilldown.module.css`, a 40 px pin hit area, and the ping animation off under reduced motion.
- **Port:** replace `useRouter().push`. Replace `INDIA_STATES`, centroids and aliases with your own data.

### 6. pin-layout.ts
- **Exports:** `project(lng, lat)` (Mercator into an 800x900 box, centre [82.75, 22.7], scale 1350); `fanOut(pins, crowdDeg, ringDeg)`; `placeLabels(items, {font, dot, gap, bounds?, avoid?})`, which tries right, left, top, bottom.
- **Logic:** pure, no DOM. Greedy grouping with nested loops (O(n²)).
- **Test:** `tests/map-pins.test.ts` exists (not run). Copy as is and change the projection constants.

### 7. mapTheme.tsx
- **Exports:** `geoStyle(active, solid?, lockedClickable?)` and `indiaStateStyle(selected?, tone?)`, both returning `{default, hover, pressed}`. Also `tint()`, `INDIA_LAND_TONES` (4 tones), `INDIA_STATE_TONE` (hand-set so neighbours differ), `MAP_CARD_STYLE`, `MapTooltip`, `MapLegend`.
- **States:** none. Tooltip and legend are plain components.
- **Styling:** only `--ftp-map-*` tokens and `color-mix`, so dark mode follows the tokens.
- **Port:** the style functions copy as is. `MapTooltip` and `MapLegend` take text props instead of `useTranslations("map")`.

### 8. GenericStateMap.tsx
- **Props:** `locale`, `stateSlug`, `activeDistricts: Set<string>`.
- **States:** fetched `geoData`, `failed`, tooltip. Returns null while loading or on failure. The loader lives in StateMapSection.
- **Logic:** fetches `stateGeoUrl(stateSlug)`. `fitMercator(geo, 500, 450, 18)` frames the state. One pin per live district at `pinPoint`. Only registered districts link.
- **Styling:** `ftp-map-ping` class, plus `stroke="#fff"` hard-coded on the pin dot.

### 9. TapCard.tsx
- **Props:** `onClick()`, `label?`, `tinted?`, `padding=14`, `highlighted?`, `style?`, `children`.
- **States:** none.
- **Logic:** renders a `<button aria-haspopup="dialog">` with a trailing chevron. `.ftp-card-link` gives a 1 px lift on hover.
- **Styling:** inline `var(--ftp-*)`. Highlighted = hue border and a 3 px hue rule. Minimum height 48 px.

### 10. SiteHeader.tsx
- **Props:** `emoji`, `title`, `titleLocal?`, `description?`, `chip?`, `icon?: LucideIcon`, `backHref?`, `backLabel?`, `children?`.
- **Server:** no directive, so a server page can pass `icon`. Only the default back label uses `useTranslations`.
- **Styling:** radial and linear gradient from `--hue` to `--hue-deep`. White text is `#fff`, and the tile uses `rgba(255,255,255,…)`. Watermark icon at 13% opacity.
- **Conflict:** contradicts the file's own v5 "no saturated gradient bands" rule.

### 11. PlainPageHeader.tsx
- **Props:** `title: ReactNode`, `description?`, `backHref?`, `children?` (a row of chips or links).
- **Server:** no directive. Back link is 44 px tall. One `h1.ftp-h1`. No colour band.
- **Port:** swap `Link` and one i18n string.

### 12. Sidebar.tsx
- **Props:** `locale`, `stateSlug`, `districtSlug`.
- **States:** `collapsed` comes from `useSyncExternalStore` reading localStorage `ftp.railCollapsed` and syncs on the `storage` event. Per-module freshness comes from `useFreshness`.
- **Logic:** 240 px open, 56 px closed. A late dataset shows a 6 px warn dot with screen-reader text. `not_collected` greys the item and shows "Coming soon". The active row uses the hue tint.
- **Styling:** inline vars and `.ftp-rail-item`. Sticky under `--ftp-shell-top` (104 px fallback). `hidden lg:block` is the only Tailwind class in the slice.

### 13. LanguageMenu.tsx
- **Props:** none. Reads locale (`useLocale`), path (`usePathname`) and the language registry.
- **States:** open or closed via `usePopover`. ArrowDown focuses the first item. Planned languages sit in a locked `<details>`.
- **Logic:** `switchLocalePath(pathname, code)` swaps the locale segment. Default language first, then by English name.
- **Styling:** `LanguageMenu.module.css`. Under 640 px it shows a short label and 44 px targets.

### 14. useFreshness.ts
- **Returns:** `modules`, `summary`, `checkedAt`, `loading`, `error`, `forModule(slug)`, `datasets`, `datasetsFor(slug)`, `primary(slug)`, `live`.
- **States:** module-level `Map` keyed `state/district`, with `loading`, `ready` and `error`. 5-minute TTL. One request per district however many components call it.
- **Logic:** `MODULE_TO_FRESHNESS_KEY` maps sidebar slugs to feeds (water to dam). Source-badge styles are CSS only (`.ftp-status`, `.ftp-stale`). The slice has no badge component.

### 15. GlyphEmptyState.tsx
- **Props:** `pick: GlyphPick`, `companions?: GlyphPick[]`, `title: string`, `body?`, `action?`. All text comes from the caller.
- **States:** none. The GlyphScene is decorative (aria-hidden). It wraps to a column on narrow screens.
- **Styling:** white card, `--ftp-border`, `--ftp-radius-card`. The scene pops in via `ftp-pop`.
- **Port:** copy as is. The honest "no data" wording comes from the caller.

## npm dependencies

Versions as written in `package.json`:
- `react` 19.2.3 and `react-dom` 19.2.3 (exact pins). react-dom appears only in ReportButton (`createPortal`).
- `react-simple-maps` ^3.0.0 (lock: 3.0.0), used by 4 map files. Lock peers: react and react-dom `^16.8.0 || 17.x || 18.x`, and prop-types ^15.7.2. Its own deps: d3-geo ^2.0.2, d3-selection ^2.0.0, d3-zoom ^2.0.0, topojson-client ^3.1.0. Its peer range excludes React 19, so this repo's React 19 is outside it. React 18 (rswf) fits.
- `@tanstack/react-query` ^5.90.21 (5 files).
- `lucide-react` ^0.577.0 (19 files).
- `next-intl` ^4.8.3 (26 files, including useDistrictData).
- `next` ^16.3.4, used only for next/link, next/navigation and next/dynamic. Drop it for Vite.
- Not imported by the slice (grep-checked): recharts ^3.8.0, date-fns, @sentry/nextjs, prisma, @anthropic-ai/sdk, razorpay, qrcode, cheerio, @upstash/redis.
- Build-only, drop: tailwindcss ^4 and @tailwindcss/postcss ^4 (globals.css uses `@import "tailwindcss"` and `@theme`), typescript ^5, eslint ^9.

## Theme tokens

Defined in `src/app/globals.css`. Map each to a CSS variable on `:root`.

- **Surfaces:** `--ftp-bg` #F2F4F8, `--ftp-surface` #FFFFFF, `--ftp-surface-2` #F3F6FA, `--ftp-border` #DAE2EE, `--ftp-border-strong` #C3CFE1.
- **Text:** `--ftp-text` #0F1B2D, `--ftp-text-2` #4A5A70.
- **Brand and focus:** `--ftp-brand` #2563EB, `--ftp-brand-deep` #1E40AF, `--ftp-brand-tint` #E8F0FE, `--ftp-focus` #2563EB.
- **Semantic:** live #16A34A (tint #ECFDF5, text #166534); warn #B45309 (tint #FFF6E5, border #F2D7A6, text #7A4A06); danger #B42318 (tint #FEE9E7); features #6E59C0 (tint #EEEDFE); support #B4234F (tint #FDECF1, border #F6C9D6).
- **Map:** live #2563EB, fill #BFD3FB, hover #9DBBF7; locked #E6ECF5, hover #D5DFED.
- **Hues:** 14 sets via `.ftp-hue-<name>`: blue, sky, cyan, teal, green, lime, yellow, amber, orange, rose, pink, violet, indigo, slate. Each sets `--hue`, `--hue-deep`, `--hue-pop`, `--hue-tint`. Default `--hue` #3B68D9.
- **Radii:** card 14px, tile 12px, small 10px, pill 999px. Legacy `--radius-card` 14px and `--radius-sm` 8px.
- **Shadows:** `--ftp-shadow-1` `0 1px 2px rgba(15,27,45,.05), 0 2px 8px -4px rgba(15,27,45,.08)`; `--ftp-shadow-2` `0 2px 6px rgba(15,27,45,.06), 0 12px 26px -12px rgba(15,27,45,.20)`.
- **Fonts:** sans Plus Jakarta Sans; H1 Bricolage Grotesque; mono JetBrains Mono; serif Cormorant Garamond (heritage only); Kannada and Devanagari via Noto variables. Tamil, Bengali and Telugu load from a Google Fonts @import. The next/font variables are set outside the slice (unverified).
- **Type:** H1 34/40 (26 on phones); H2 21/28; title 15/22; body 13/20; label 12/16 semibold; stat value 28/34 (24 on phones).
- **Layout:** container 1200; reading 960; gutter 24 (16 under 768); rail 240 open, 56 closed.
- **Motion:** 120, 160, 180 and 560 ms; ease `cubic-bezier(0.2,0.7,0.2,1)`.
- **Dark:** `[data-theme="dark"]` in two blocks (bg #0E0E0C, surface #1A1A18, text #F5F5F1, brand #8FA0FF). A comment says no toggle ships.
- **Accent ramps:** 10 colours (blue, indigo, teal, forest-green, wheat, slate, amber, purple, coral, pink) at 700, 800 and 900. Defined twice (see Findings).

## Outside this slice

- `src/components/district/ui.tsx`: the kit (Card, Pill, Chips, ToolbarButton, EmptyState, Section), imported by 9 slice files. Port this next.
- Also referenced, all present, not read: `components/district/visuals.tsx`, `lib/design/hues.ts`, `lib/constants/{sidebar-modules,districts,razorpay-plans,state-config}.ts`, `lib/geo/{aliases,fit,district-centroids}.ts`, `i18n/{client,languages,format-date}.ts`, `lib/civic/project-facts.ts`, `components/home/use-popover.ts`, `components/support/{SupporterChip,placement}`, `lib/{freshness,insight-age,platform-facts,social-link}.ts`, `lib/utils/script-lang.ts`.
- API routes named in code, not read: `/api/data/{freshness,insight,contributors,<module>}`, `/api/feedback`, `/api/site-announcement`.
- Static data in `public/geo/` (verified): `india-states.json`, `karnataka-districts.json`, nine `*-taluks.json`, and per-state `*-districts.json`.
- Tests that exist, not run: `tests/map-pins.test.ts`, `tests/category-glyph.test.ts`, `tests/design-tokens.test.ts`.
- `data-theme` also appears in `src/components/home/HeaderBar.tsx`. A theme toggle may live there (unverified).

## Findings

1. **Styling is mostly CSS variables.** 48 of 49 files have no Tailwind. The one utility is `hidden lg:block` in Sidebar.tsx. A plain-CSS port is largely a token copy.
2. **Hex breaks the rule.** globals.css says "NO HEX IN COMPONENTS", yet StateSponsorSection.tsx, SiteHeader.tsx, GenericStateMap.tsx and SiteVisuals.tsx hard-code `#fff`.
3. **Accent ramps are defined twice with different values** in globals.css: `--accent-blue-900` is #062E55 in `@theme` but #082F58 in `:root`; `--accent-purple-700` is #534AB7 vs #3C3489. Which value wins in the built CSS is unverified; the later `:root` values are probably used.
4. **react-simple-maps peers exclude React 19.** It declares React 18 peers, and this repo's React 19 is outside that range. Fine for React 18 (rswf). prop-types must be installed.
5. **Dead and misleading code.** Leaflet rules at globals.css lines 771-819 have no leaflet dependency and no import. `useRealtimeData.ts` is 29 module hooks, not realtime. `TalukMap` notes its taluk files are "simple boxes, not surveyed borders" (Sept 2026 audit).
6. **Licence wording differs.** The `useFreshness.ts` header says "MIT License with Attribution"; package.json says "MIT". Check the LICENSE file (not in this slice).
