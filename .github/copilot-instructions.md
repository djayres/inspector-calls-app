# Copilot instructions: An Inspector Calls

Read `HANDOVER.md` first. `source/an-inspector-calls.html` is the complete working reference implementation; port from it rather than reinventing.

## What this is
A private working desk for a senior (Level 3) Planning Inspector in England examining the largest local plans and NSIP / development consent order cases: an examination document library with page-cited AI answers, read-only email search, notes, a soundness matrix, MIQ / action / main modification / deadline trackers, and PDF reports. It has a local plan mode and an NSIP mode.

## Rules for the AI features
- Always call the most capable approved model at its highest reasoning setting.
- Every AI call starts with the expert brief in HANDOVER.md section 6.2. Keep the prompts in section 6 word for word unless asked to change them.
- Answers must cite library pages as `[[D3 p.12]]`, `[[D3 pp.12-14]]`, `[[D3 p.12; D7 p.4]]`, and email threads as `[[E:id]]`. The UI turns these into clickable chips. Never let the model cite pages it has not seen.
- Substantive answers end with a "Confidence and limits" section. Drafted documents use `[to confirm: ...]` instead.
- The model never decides soundness for the inspector: suggestions only, applied by the user.

## Rules for the code
- Email access is strictly read-only. Never request or use send, delete or write scopes.
- API keys and tokens stay on the server. Nothing secret in the browser bundle.
- Render Markdown by building DOM nodes; never inject model output as raw HTML.
- Case data stays in the user's storage; the service worker must not cache it.
- UK English in all UI text. Keep the look: deep green and cool grey, gold accents, Newsreader for headings, Hanken Grotesk for body, IBM Plex Mono for codes; light and dark mode; works at phone width. Not GOV.UK or Planning Inspectorate branding.
- The Windows launcher in `src-tauri/` only opens a URL (`URL_IC` in `src-tauri/src/main.rs`).
