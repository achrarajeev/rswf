# Feature Map — rswf

<!--
  READ THIS BEFORE FILLING IT IN.

  A feature → file-list map goes stale within days and is then actively harmful.
  So this file stores ANCHORS, not inventories:

    - the entry point (stable — changes rarely)
    - the owning module (stable)
    - a grep key (stable — and finds the CURRENT files, always correct)

  Grep keys are COMMA-SEPARATED terms, never regex pipes — pipes break markdown tables.
  `gst, taxRate, TAX_` becomes `gst|taxRate|TAX_` when the command runs.

  The actual file list is derived on demand:  llmw feature <name>

  If you find yourself listing files here, stop. That's what the grep key is for.
-->

| Feature | Entry point | Owning module | Grep key | Route | Shot |
|---|---|---|---|---|---|
| GST | `api/invoice/create` | `services/tax/` | `gst, taxRate, TAX_` | `/invoices/new` | auto |
| Refunds | | | | | |

**Route** and **Shot** drive `llmw docs` (screenshots).

- `Route` — the URL path where this feature is visible. Blank = not captured.
- `Shot` — `auto` (navigate + screenshot), `skip`, or a short action list:
  `click:Add User; fill:#email=demo@x.com; wait:.modal`

Leave both blank while a feature is in progress; fill them when it's done and
`llmw docs` picks it up on the next run.

## Feature notes

Only for things the code doesn't say — cross-cutting concerns, surprising ownership,
features that are half-migrated.

### GST

- Rates live in config, not code. Changing one is a config deploy, not a release.
- (inferred) reports read tax directly rather than via the service — verify before trusting.
