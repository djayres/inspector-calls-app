# An Inspector Calls: handover pack for a Microsoft Copilot rebuild

Prepared 26 November 2026. This pack holds everything used to build **An Inspector Calls** with Claude, so the app can be rebuilt or carried on in Microsoft Copilot.

**Which Copilot this assumes.** It is written for **GitHub Copilot** (Copilot Chat in agent mode in VS Code, or the Copilot coding agent on GitHub), because the app is code and it already lives in this GitHub repo. Section 11 covers **Microsoft 365 Copilot / Copilot Studio** for anyone who wants a no-code agent instead; that route can carry the expert brief and document Q&A, but not the trackers or the PDF builder.

**What is in this repo**

| Path | What it is |
|---|---|
| `HANDOVER.md` | This document. |
| `.github/copilot-instructions.md` | Standing instructions GitHub Copilot reads automatically in this repo. |
| `source/an-inspector-calls.html` | The **complete source** of the working web app, as published on 26 Nov 2026 (one HTML file, about 1,480 lines of HTML, CSS and plain JavaScript). This is the reference implementation. |
| `app/`, `src-tauri/`, `resources/` | The Windows launcher (Tauri). It shows the welcome screen and opens the web app in a clean Chrome or Edge window. |
| `.github/workflows/build-windows.yml` | GitHub Actions build that produces `Inspector-Calls-Setup.exe` on the Releases page. |

---

## 1. Purpose and the person it is for

An Inspector Calls is a private working desk for a **senior (Level 3) Planning Inspector** in England. The inspector examines the largest and most complex cases: local plans for major cities (for example Birmingham or London boroughs) and **nationally significant infrastructure projects (NSIPs)** decided through **development consent orders (DCOs)**.

It does five jobs:

1. **Holds the examination library.** Drop in hundreds of PDFs, Word and Excel files; they are read page by page and indexed.
2. **Answers questions from that library with page citations**, either finding passages or reasoning to a view.
3. **Searches the inspector's email** (read-only) in plain words.
4. **Tracks the examination**: soundness matrix, matters/issues/questions (MIQs), hearing action points, main modifications (MMs), deadlines and stage.
5. **Writes outputs**: letters, notes, briefings, schedules and report structures, as formatted PDFs.

**Standard expected of every AI answer** (this was an explicit requirement):

- Always use the **most capable model at the highest reasoning effort**.
- Work to the standard of the Inspectorate's most senior inspectors and of a King's Counsel advising them: rigorous, precise, impartial and robust to legal challenge.
- **Ground every statement in the documents and cite the page.** Never invent facts, figures, dates or citations.
- Separate what the documents say, what the evidence shows, and what is inferred.
- End every substantive answer with a **"Confidence and limits"** section (high, medium or low, and why; what was not checked; what could change the conclusion).
- Do not reach conclusions on soundness or legal compliance that the evidence does not support. Flag gaps and suggest questions instead. The inspector decides.

**Tone and look**: calm and professional, a light wink in the name (the Priestley play) and the badge's "doorbell" dot. Deliberately **not** GOV.UK or Planning Inspectorate branding.

---

## 2. Every feature, screen by screen

The left rail groups screens as **Workspace** (Home, Overview, Library, Ask the library, Email search, Notes & findings), **Examination** (Soundness tests, Matters & questions, Hearing actions, Main modifications, Deadlines) and **Output** (Reports & PDFs). Counts appear beside each item. At the bottom of the rail, four status lights show Workspace (saved to account / this device only), Claude, Mailbox and Files.

On phones and narrow windows the rail folds into a scrolling strip across the top.

### 2.1 Home (landing page)

- Full-width deep green hero band with the large IC badge, the title **An Inspector Calls**, and a time-of-day greeting: **"Good morning, Inspector Smith."** Before 5am or from 10pm it says "Working late". Afternoon runs 12:00 to 16:59, evening from 17:00. The surname is the last word of the Inspector field, ignoring titles such as Mr, Mrs, Ms, Dr and Inspector. If no name is set, a gold "Add your name" link opens Overview's details.
- Under the greeting: today's date, the plan name and current stage.
- A large rounded **ask bar**: "What do you need, Inspector? Ask the examination library…" with a gold Ask button. It runs a library question directly.
- A **"This week" docket card** with a ring dial showing the number of things needing attention: overdue actions (red), actions due within 7 days (amber), deadlines within 7 days (amber if 2 days or fewer), and MIQs with responses to read. Up to five are listed. Button: "Open the workspace →".
- Six **quick tiles**: Ask the library, Search your email (Gmail, read-only), Drop in documents (pages indexed), Notes & findings, Soundness tests (number of concerns), Reports & PDFs.
- Footer: an "Install on this computer" button (Claude desktop only), a privacy line, and "Load an example examination" when the workspace is empty.

### 2.2 Overview

- Header card with the case reference, plan name, LPA, inspector and submission date. **Edit details** reveals fields: Type of examination (**Local plan** or **NSIP / development consent order**), Plan or Project name, LPA or Applicant, Case reference, Inspector or Examining Authority, Programme officer or Case manager, Submission date or Application accepted date. Labels change with the type.
- A **stage stepper** you click to set the stage.
  - Local plan: Submitted, Initial questions, MIQs issued, Hearings, Post-hearing, MM consultation, Report.
  - NSIP: Accepted, Pre-examination, Rule 6 issued, Preliminary meeting, Examination, Examination closed, Recommendation, Decision.
- Five stat tiles: Library documents (pages indexed), Questions open, Actions open (overdue), Main modifications (agreed), Soundness concerns.
- Quick "Ask the library" box, "Coming up" (next six dates and due actions, with overdue/in N days pills), "Latest notes & findings".
- When empty: a three-step welcome (Build the library; Ask and check; Track and write) and **Load an example examination** (the fictional Harrowfield District Local Plan 2024–2041, with dates, MIQs, actions, MMs, soundness rows and a note, all marked "Example" and removable in one click).

### 2.3 Library

- **Drop zone**: drag files or click to choose. Accepts PDF, DOCX, XLSX/XLS/ODS, TXT, MD, CSV, TSV, HTML, EML, JSON, RTF, XML. Any number of files; a queue shows each file's progress (Reading %, Saving, Indexed, or "Stored (no text layer, probably a scan)", or Failed).
- Each file gets a code **D1, D2, D3…** used in citations. You can add the examination library reference (for example SD01); citations then display that reference.
- Category is guessed from the file name and editable: Submission document, Evidence base, Representation, Hearing statement, Council response, Correspondence, National policy & law, Other.
- **Instant search**: keyword search across every page with no AI, showing highlighted excerpts. Click a result to open the page.
- Table: Code, Exam ref, Document, Category, Pages, Original (opens the stored file), Remove (with confirmation).
- **Document viewer** (slide-in drawer): page-by-page text with Previous/Next, a page number box, search terms highlighted, and "Open original" jumping to the PDF page.

**How text extraction works**: PDF via pdf.js (one entry per page); Word via mammoth (split into roughly 3,200-character sections); Excel via SheetJS (one section per sheet as CSV); HTML via the browser's parser; text formats split into sections. Word, Excel and text files therefore cite "s." (section) not "p." (page).

### 2.4 Ask the library

- Two modes: **Find passages** (locate and quote, grouped by document) and **Analyse & conclude** (search widely, read in full, reason to a view).
- Scope: whole library or one category.
- Six preset questions shown as chips, for example "How has the Council derived and justified the housing requirement?", "Is there evidence that the duty to cooperate has been met?", "Which policies may not be effective because they are vague or unenforceable?".
- Answers stream in. An activity strip shows each search and page read ("Searched 'housing trajectory' · 8", "Read D3 p.12–14").
- **Citations** like `[[D3 p.12]]` render as clickable chips (showing SD01 p.12 if an exam ref exists) that open the page.
- Follow-up questions keep the last three answers as context. Stop button while running.
- Under each answer: **Save as finding**, Copy (citations become plain text), **Use in a report**.

### 2.5 Email search (read-only)

- Two modes: **Ask Claude** (plain words; the AI turns them into several Gmail searches, opens the best threads, answers briefly, cites threads as `[[E:threadId]]` and lists up to eight thread cards) and **Gmail search** (raw Gmail syntax such as `from:council.gov.uk has:attachment after:2026/10/01`).
- Four preset requests (for example "Emails from the programme officer in the last two weeks").
- Thread cards: subject, sender, date, message count, snippet, **Read thread** (opens a drawer with every message), Open in Gmail, **Add to library** (the thread becomes a Correspondence document, one section per message, so it can be cited).
- Nothing is sent, changed or deleted. Plain-English error messages cover not connected, expired sign-in, blocked by policy and so on.

### 2.6 Notes & findings

- List on the left with filters All / Notes / Findings / Drafts and "+ New note"; editor on the right.
- Each note: type (Note, Finding, Draft), optional Matter/policy tag, title, Markdown body with `[[D3 p.12]]` citations, Write/Preview toggle, autosave after 0.7 seconds, Delete.
- **Work on this note with the AI** (results can be appended, replace the text, copied or discarded):
  - Redraft in report style
  - Turn into questions for the Council
  - Check against the library (searches the documents)
  - **Stress-test for legal challenge** (as counsel seeking to quash, then as the judge; searches the documents)
  - Summarise in five bullets

### 2.7 Soundness tests (matrix)

- One row per policy or site allocation: Policy ref, Title, five test cells, Reasoning.
- Tests: **Legally compliant** (including duty to cooperate, SA and HRA), **Positively prepared**, **Justified**, **Effective**, **Consistent with national policy**.
- Click a cell to cycle: — (not assessed) → Sound (green) → Concern (amber) → Unsound (red).
- **Assess** button: the AI reads the policy, its justification and evidence, and returns a status and a one or two sentence reason with citations for each test, plus a summary ending with a confidence rating. "Apply suggestions" writes them into the row and appends a dated "Claude review" to the reasoning. The inspector decides.

### 2.8 Matters, issues & questions (MIQs tracker)

- Grouped by Matter (editable title), with columns Ref, Issue, Question, Status (Draft, Issued, Responses received, Discussed, Closed) and Hearing date.
- **Draft questions with the AI**: type a matter or topic; it reads the library and returns 8–12 neutral questions grouped by issue (or 8–14 ExQ-style written questions addressed to named parties in NSIP mode). Tick the ones to keep and add them as drafts.

### 2.9 Hearing actions

- Columns Ref (AP1, AP2… auto-numbered), Session/matter, Action, By, Due, Status (Open, In progress, Done). Pills show open and overdue counts. Overdue items feed the Home docket.

### 2.10 Main modifications

- Columns MM (MM1… auto), Policy/para, Main modification (wording as text, for example delete "…", insert "…"), Reason (soundness), Status (Proposed, Agreed, Consulted, Final). "Schedule as PDF" opens the MM schedule template.

### 2.11 Deadlines

- Date, What, Type (Hearing session, Consultation closes, Response due, Report milestone, Site visit, Other). Shows the next date and days to go.

### 2.12 Reports & PDFs

- Template cards. **Local plan**: Letter to the Council, Inspector's note, Findings briefing, Schedule of main modifications, Examination digest, **Report on the examination** (s20(7) structure). **NSIP**: **Rule 6 letter**, **Rule 8 letter**, **Written questions (ExQ)**, **Recommendation report** to the Secretary of State, plus Inspector's note, Findings briefing and digest.
- Settings: title, To, From, Date, Reference, "Number paragraphs", appendices to include (MM schedule, action points, soundness matrix, MIQs, key dates, each with its count), and notes to draw on.
- Body editor (Markdown). **Draft with the AI** writes or improves the body from the chosen notes and records. "Insert selected notes" pastes notes in.
- **Download PDF** / **Preview**: A4, cover block (green rule, examination name in caps, title in serif, To/From/Date/Reference), numbered paragraphs, headings in green, bullet lists, Markdown tables, each appendix on a new page as a green-headed table, footer with the examination name and "Page X of Y". Citations print as "(SD01, p. 12)".
- **Open as editable doc** (Claude Docs, a Claude-only feature). Save and reopen reports.

### 2.13 Examination type switch (local plan or NSIP/DCO)

Choosing NSIP changes: stages, field labels, the legal brief the AI works under, the MIQ drafting style (ExQ written questions to named parties) and the report templates. The soundness matrix is still built around local plan tests.

---

## 3. The IC badge and visual design

### 3.1 Badge

An app-icon tile: a rounded square (corner radius 116 on a 512 grid) filled with a **glossy deep green radial gradient**, a ring of **60 clock-style white ticks** (every fifth longer and brighter), a **white disc with a gold rim**, an **italic serif "IC"** in dark green, a **gold underline** beneath the letters, and the idea of a small **gold "doorbell" dot** (the wink at "An Inspector Calls").

Exact SVG generator from the web app (size is the pixel size):

```js
function badgeSVG(size) {
  const id = 'b' + size; let ticks = '';
  for (let i = 0; i < 60; i++) { const major = i % 5 === 0;
    ticks += `<rect x="253" y="${major ? 34 : 44}" width="6" height="${major ? 40 : 24}" rx="3" fill="#fff" opacity="${major ? .95 : .45}" transform="rotate(${i * 6} 256 256)"/>`; }
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" aria-hidden="true"><defs>
  <radialGradient id="${id}g" cx=".5" cy=".42" r=".78"><stop offset="0" stop-color="#6cc39b"/><stop offset=".38" stop-color="#2f8463"/><stop offset=".75" stop-color="#145040"/><stop offset="1" stop-color="#082a20"/></radialGradient>
  <radialGradient id="${id}h" cx=".5" cy=".28" r=".6"><stop offset="0" stop-color="#f4fff9" stop-opacity=".42"/><stop offset="1" stop-color="#f4fff9" stop-opacity="0"/></radialGradient></defs>
  <rect width="512" height="512" rx="116" fill="url(#${id}g)"/><rect width="512" height="512" rx="116" fill="url(#${id}h)"/>
  <g>${ticks}</g>
  <circle cx="256" cy="256" r="150" fill="#fff"/><circle cx="256" cy="256" r="150" fill="none" stroke="#d6b062" stroke-width="9"/>
  <text x="250" y="304" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-style="italic" font-weight="600" font-size="150" letter-spacing="-6" fill="#0f3b2e">IC</text>
  <path d="M200 334h112" stroke="#c99f4b" stroke-width="12" stroke-linecap="round"/></svg>`;
}
```

Ready-made files: `app/logo.svg` (launcher), `resources/icon.png` (1024 px), `resources/icon.ico` (Windows).

### 3.2 Colours (design tokens)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #F2F3F0 | #111513 | page |
| `--surface` | #FFFFFF | #181D1B | cards |
| `--surface-2` | #EBEEEA | #202725 | subtle fills |
| `--rail` | #E6EAE5 | #151A18 | left rail |
| `--ink` / `--ink-2` / `--ink-3` | #1B2420 / #48544E / #78837D | #E4E9E6 / #B0BAB4 / #828E88 | text |
| `--line` / `--line-2` | #D9DED8 / #C6CDC6 | #2B3330 / #3A4440 | borders |
| `--accent` | #2B5A4B | #82BCA8 | deep green |
| `--accent-soft` | #DFEAE4 | #1E302A | citation chips, tiles |
| `--accent-2` | #8A6A2E | #D3B06C | gold |
| ok / warn / bad / info | #2E7A4C / #9A6210 / #A3392F / #2F5E88 | #72C394 / #E2AE58 / #EA8A80 / #8DB8E2 | status |
| `--mark` | #F3E3A6 | #5B4E1E | search highlight |

Hero band: `radial-gradient(120% 160% at 15% 0%, #23664f 0%, #11392d 50%, #0a241d 100%)`. Gold button `#e7c77f` with text `#10291f`. Greeting text `#c3ead9`.

### 3.3 Type and layout

- Fonts (Google Fonts): **Newsreader** (display serif: page titles, headings), **Hanken Grotesk** (body; the hero title uses weight 300), **IBM Plex Mono** (codes, citations), IBM Plex Sans as fallback.
- Fixed 240 px left rail plus a working canvas up to 1,180 px wide. Cards 14 px radius, 1 px borders, soft shadows. Light and dark mode follow the system.
- Under 900 px wide the rail becomes a top strip and grids stack to one column.

### 3.4 Windows launcher welcome screen

A 520 × 660 window on the same green gradient: the badge pops in, "An Inspector Calls" in light weight, then either "Welcome, Inspector" with a surname box and a gold **Come in** button (first run), or the greeting "Good afternoon, Inspector Smith" with a thin gold loading bar. It then opens the workspace in Chrome `--app` mode (Edge as fallback), sized 1440 × 920, and closes itself after 4 seconds. "Not you? Change name" resets it. The surname is kept in the launcher's local storage.

---

## 4. Architecture of the current build

### 4.1 The web app

- **One HTML file**, plain JavaScript, no framework and no build step. A 15-line `h()` helper builds DOM elements; each screen is a function in `VIEW_FN` that returns elements; navigation uses the URL hash (`#home`, `#library` …).
- **Libraries from cdnjs**: pdf.js 3.11.174 (+ worker), mammoth 1.6.0, SheetJS xlsx 0.18.5, jsPDF 2.5.1, jspdf-autotable 3.8.2. Loaded only when first needed.
- **Search**: a BM25 keyword index built in the browser over overlapping ~1,100-character passages per page, with a small stop-word list, light stemming, a boost for an exact phrase and for matching all terms. Used by Instant search and as the AI's `search_documents` tool. There is no vector/embedding search.
- **AI**: calls Claude through the Claude artifact runtime (`window.claude.use('sample')`), with page-defined **tools** the model can call during an answer (see section 6). Answers stream.
- **Citations**: the model writes `[[D3 p.12]]`, `[[D3 pp.12-14]]`, `[[D3 p.12; D7 p.4]]` or `[[E:threadId]]`; the page turns these into clickable chips and, for PDFs and copying, into "(SD01, p. 12)".
- **Markdown**: a small safe renderer (headings, lists, tables, quotes, bold, italic, code) that builds DOM nodes, never raw HTML.

### 4.2 Data storage

All records live in **one collection per user**, keyed by record id, each with a `kind`:

| kind | Fields |
|---|---|
| `ws` (id `workspace`) | type (`lp`/`nsip`), plan, lpa, caseRef, inspector, po, stage (index), submitted |
| `doc` | code (D1…), ref, name, category, size, type, pages, chars, paged (true for PDF pages, false for sections), addedAt, noText, textAsset, fileAsset, source (`email`), threadId |
| `note` | type (`note`/`finding`/`draft`), title, body (Markdown), matter, source, createdAt, updatedAt |
| `snd` | ref, title, t: {legal, pp, just, eff, cons} each '', 'ok', 'concern' or 'unsound', notes |
| `miq` | matter, ref, issue, question, status, session (date) |
| `act` | ref, session, action, owner, due, status |
| `mm` | ref, policy, change, reason, status |
| `dl` | date, title, type |
| `report` | tpl, title, to, from, date, ref, body, numbered, inc {mm, act, snd, miq, dl}, notes [ids], updatedAt |

Any record can carry `example: true` (sample data).

Where it is kept today:

- **Records**: the artifact's private per-user database (`data/users/<userId>`), live-synced; falls back to the browser's `localStorage` (`exdesk-items`) if unavailable.
- **Extracted page text**: IndexedDB in the browser (database `exdesk`, store `t`, key = doc id, value = array of page strings), plus a JSON copy uploaded as an asset so it follows the user to other devices.
- **Original files**: uploaded as assets (files under 19.5 MB) so "Open original" works anywhere.

### 4.3 Windows app

`src-tauri/` is a Tauri v2 launcher (Rust, about 50 lines in `main.rs`), built by GitHub Actions on `windows-latest` into a ~1.3 MB NSIS installer, per-user install, unsigned. Each build makes a release `v1.0.N`; the stable link is `https://github.com/djayres/inspector-calls-app/releases/latest/download/Inspector-Calls-Setup.exe`. It only opens a URL, so for a Copilot rebuild **change `URL_IC` in `src-tauri/src/main.rs` (and the comment in `app/index.html`)** to the new app's address. An earlier Electron version was dropped because its 82 MB installer hit "Disk full".

---

## 5. What is Claude-specific and must be replaced

| In the Claude build | What it does | Replace with (suggested) |
|---|---|---|
| Hosted as a claude.ai artifact | Hosting, sign-in, sharing | Any static host (Azure Static Web Apps, GitHub Pages for a demo, or an internal server). Add sign-in (Microsoft Entra ID) if hosted centrally. |
| `window.claude.use('db')` + `user` | Private per-user live database | Simplest: IndexedDB in the browser (single user, single device) with **Export/Import workspace (JSON)**. Multi-device: a small API with Azure Cosmos DB / Table Storage, or SharePoint lists, keyed by the signed-in user. |
| `use('assets')` | Stores extracted text and original files | IndexedDB / OPFS locally, or Azure Blob Storage / SharePoint document library. |
| `use('sample')` (Claude calls with tools, streaming, JSON mode) | All AI features | A backend endpoint (Azure Function or small Node/Python server) calling the organisation's approved model: **Azure OpenAI** (most capable approved deployment, highest reasoning setting) or the **Anthropic API** (Claude Opus, extended thinking) if allowed. Keep the API key on the server, never in the browser. Implement tool calling for `search_documents` and `read_pages`, streaming, and a "return only JSON" mode. |
| `use('mcp')` → Gmail `search_threads`, `get_thread` | Read-only email search | Most likely **Outlook via Microsoft Graph** (`Mail.Read` delegated permission only; `GET /me/messages?$search=...`, `GET /me/messages/{id}`, conversations via `conversationId`). Gmail API with `gmail.readonly` if they really use Gmail. Note: Graph search uses KQL, not Gmail syntax, so the "direct search" hint text and the AI's email prompt must change. |
| `use('mcp')` → Claude Docs `batch` | "Open as editable doc" | Export **.docx** in the browser (the `docx` npm library) or create a Word file in OneDrive via Graph. |
| `use('downloads')` | Save the PDF | A normal browser download (`<a download>` with a Blob URL). |
| `use('desktop')` | "Install on this computer" | Make the app a PWA (manifest + service worker) so Edge/Chrome can install it, and/or keep the Tauri launcher pointing at the new URL. |
| Model settings `{ model: 'claude-opus-5-5', modelTier: 'complex', effort: 'high' }` | Top model, deepest reasoning | The equivalent top-tier model and maximum reasoning setting available to the organisation. |
| Error copy mentioning Claude, claude.ai Settings → Connectors, "the page's Permissions menu" | User-facing messages | Rewrite for the new setup. Rename "Claude" in UI text to the new assistant's name or just "the assistant". |

Everything else is plain browser code and ports as is: the layout and CSS, every screen, text extraction, the BM25 search, the citation format and chips, the Markdown renderer, the trackers, the example data, and the jsPDF report builder.

**Before putting real casework in:** check with the organisation's information security and data protection people which AI service, hosting and mailbox access are approved for examination material, and whether Microsoft Graph mail access needs admin consent.

---

## 6. AI design: prompts and tools, verbatim

Placeholders in `{braces}` are filled by the app. The exact code is in `source/an-inspector-calls.html` (search for `EXPERT_LP`, `LIB_RULES`, `NOTE_ACTIONS`, `TEMPLATES`).

### 6.1 Model settings

Every AI call: the most capable model, highest reasoning effort (Claude build: `claude-opus-5-5`, tier complex, effort high).

### 6.2 Expert brief, used at the top of every AI call (`EXPERT()`)

> You are working for a senior Planning Inspector (Level 3) at the top of the Planning Inspectorate, who examines the largest and most complex cases in England, such as local plans for major cities and nationally significant infrastructure projects. Work to the standard expected of the Inspectorate's most senior inspectors and of a King's Counsel advising them: rigorous, precise, impartial and robust to legal challenge (s113 of the 2004 Act or s118 of the 2008 Act).
>
> {EXPERT_LP or EXPERT_NSIP, depending on the examination type}
>
> STANDARDS OF REASONING. Separate what the documents say, what the evidence shows and what you infer. Test evidence: method, assumptions, data dates, sensitivity and whether it was consulted on. Where parties disagree, set out each position fairly before weighing it. Reach a reasoned view only as far as the evidence goes, and say what further evidence or question would resolve the rest. Give paragraph numbers of national policy, guidance or case law only when you are confident they are right and mark any you are unsure of with [check]; prefer citing the library. Never invent facts, figures, dates, document content or citations.
>
> STATE YOUR UNCERTAINTY. End every substantive answer with a short "Confidence and limits" section: your confidence (high, medium or low) and why, what you did not check, and what could change the conclusion.

**EXPERT_LP (local plan):**

> LEGAL AND POLICY FRAME (local plan examination). Work within the Planning and Compulsory Purchase Act 2004: s20(5) (whether the plan meets the requirements of s19 and s24(1) and the regulations, whether it is sound, and whether the duty to cooperate in s33A has been met), s20(7)-(7C) (recommendations and main modifications at the Council's request) and s19 (including s19(1A) climate change, s19(5) sustainability appraisal, the Local Development Scheme and the Statement of Community Involvement). Also the Town and Country Planning (Local Planning) (England) Regulations 2012 (notably regs 18, 19, 20 and 22), the Environmental Assessment of Plans and Programmes Regulations 2004 (SEA), the Conservation of Habitats and Species Regulations 2017 (HRA and appropriate assessment), and the public sector equality duty in s149 of the Equality Act 2010. Soundness means positively prepared, justified, effective and consistent with national policy, as set out in the NPPF. A failure of the duty to cooperate cannot be cured by main modifications. Identify from the documents which version of the NPPF and which transitional arrangements apply (and whether reforms under the Levelling-up and Regeneration Act 2023 affect the plan) rather than assuming.

**EXPERT_NSIP (NSIP / DCO):**

> LEGAL AND POLICY FRAME (nationally significant infrastructure project, development consent order). Work within the Planning Act 2008: s88 and the Infrastructure Planning (Examination Procedure) Rules 2010 (initial assessment of principal issues, the rule 6 letter and Preliminary Meeting, the rule 8 letter and timetable, written questions, issue-specific, open-floor and compulsory acquisition hearings, site inspections), s98 (six-month examination and the period for the recommendation report), s104 (deciding in accordance with any relevant National Policy Statement unless an exception in s104(4)-(8) applies, including where adverse impacts would outweigh benefits) or s105 where no NPS has effect, s120 (what a DCO may include), s122 and s123 (compulsory acquisition: legitimate purpose, a compelling case in the public interest, and the land-related conditions), s60 local impact reports, and the Infrastructure Planning (Environmental Impact Assessment) Regulations 2017. The Secretary of State is the competent authority under the Conservation of Habitats and Species Regulations 2017, so the Examining Authority must gather the information for any appropriate assessment (report on the implications for European sites). Identify the relevant NPS (for example EN-1 and the technology-specific energy NPSs, the National Networks NPS, the Airports NPS, the ports or water resources NPSs) and its designation date from the documents, and use statements of common ground and principal areas of disagreement to locate where parties really differ.

### 6.3 Workspace context line (`wsContext()`)

> Examination: {plan name, or "a local plan" / "an NSIP application"} ({LPA, or "applicant: " + applicant}). Type: {local plan examination | NSIP (development consent order) examination}. Stage: {current stage}. Today is {weekday, day month year}.

### 6.4 Library research rules (`LIB_RULES(mode)`), used for Ask, Check, Stress-test, Assess and MIQ drafting

> {EXPERT brief}
>
> You are the research assistant inside this examination workspace. {workspace context}
>
> Ground every statement in the library documents. Cite inline as [[D3 p.12]] (document code, then page; [[D3 pp.12-14]] for a range; several: [[D3 p.12; D7 p.4]]). Only cite pages you have actually seen in tool results or excerpts. If the library does not answer the question, say so plainly and list what you searched for.
> Write in measured, impartial UK English, as an inspector's working note reads. Use short headings and bullets where they help. Do not reach conclusions on soundness or legal compliance that the evidence does not support: flag gaps and suggest questions for the Council instead.
> {mode line}

Mode line, **Analyse**:

> MODE: ANALYSE. Search widely (at least 6 searches with varied terms, synonyms and the names of key evidence documents), read the key pages in full and check their context, then give: a short answer first; the relevant legal and policy tests; the evidence for and against with citations, including what other parties say; inconsistencies, gaps and weaknesses in method; your reasoned assessment; and, where useful, questions for the Council or applicant and possible main modifications or DCO requirements.

Mode line, **Find**:

> MODE: FIND. Locate the relevant passages. Run several searches with different terms and synonyms. List each finding with a short quotation and its citation, grouped by document. Keep commentary brief.

After the rules the app adds: an optional "Restrict yourself to documents in the category "{category}"." line, then **"Library catalogue (code | exam ref | title | category | length):"** with one line per document, for example `D3 | SD01 | Submission Local Plan.pdf | Submission document | 212 pages` (`| NO TEXT (scan)` where relevant; first 450 documents, then "…and N more (use search_documents)"). If tool calling is unavailable it instead appends the top 16 passages from the keyword index ("Search tools are unavailable, so here are the best-matching passages:"). Conversation history: the last three completed question/answer pairs, then the new question.

### 6.5 Tools the model can call

```json
[
  {"name": "search_documents",
   "description": "Keyword search across the examination library. Returns the best-matching passages with document code, page and an excerpt. Run several searches with different wording and synonyms, because planning documents use varied terms.",
   "input_schema": {"type": "object", "properties": {
     "query": {"type": "string", "description": "keywords"},
     "limit": {"type": "integer", "description": "1-15, default 8"},
     "documents": {"type": "array", "items": {"type": "string"}, "description": "optional document codes (e.g. [\"D3\",\"D7\"]) to restrict the search"}},
     "required": ["query"]}},
  {"name": "read_pages",
   "description": "Read the full text of pages from one document (at most 5 pages per call). Use it to check context before relying on a passage.",
   "input_schema": {"type": "object", "properties": {
     "document": {"type": "string", "description": "document code, e.g. D3"},
     "from": {"type": "integer"}, "to": {"type": "integer"}},
     "required": ["document", "from"]}},
  {"name": "gmail_search",
   "description": "Search the inspector's Gmail with Gmail query syntax (from:, to:, subject:, after:YYYY/MM/DD, before:, has:attachment, filename:, OR, quotes). Returns matching threads with id, subject, sender, date and snippet.",
   "input_schema": {"type": "object", "properties": {"query": {"type": "string"}, "max": {"type": "integer", "description": "1-25, default 15"}}, "required": ["query"]}},
  {"name": "gmail_read_thread",
   "description": "Read every message in one email thread (sender, recipients, date, plain-text body, attachment names).",
   "input_schema": {"type": "object", "properties": {"threadId": {"type": "string"}}, "required": ["threadId"]}}
]
```

Results: `search_documents` returns `{results: [{doc, title, page, excerpt (about 700 chars)}]}`; `read_pages` returns `{doc, title, pages: [{page, text (up to 4,800 chars)}]}`; `gmail_search` returns `{threads: [{threadId, subject, from, date, messages, snippet}]}`; `gmail_read_thread` returns `{threadId, messages: [{from, to, date, subject, body, attachments}]}` with bodies capped at about 26,000 characters in total. For Outlook, rename these `mail_search` / `mail_read_thread` and describe KQL syntax instead.

### 6.6 Email assistant prompt (Ask Claude mode)

> You help a senior UK planning inspector find things in their email, with care and precision. {workspace context}
> Request: {request}
>
> Turn the request into Gmail searches and run several (synonyms, likely senders, date ranges; use quotes only for exact phrases). Open the most promising threads with gmail_read_thread to confirm before relying on them. Then answer briefly: what you found, who sent it and when, and the key content. Cite each thread inline as [[E:threadId]]. If nothing relevant turns up, say so and list the searches you ran.
> Finish with one final line exactly in this form, listing the most relevant thread ids first (at most 8): THREADS: id1, id2

The app strips the THREADS line from the displayed answer and shows those threads as cards.

### 6.7 Note actions

Prompt = (for library-checking actions: the LIB_RULES Analyse block + "Library catalogue:" + catalogue; otherwise: EXPERT brief + workspace context) + the instruction + `NOTE TITLE: {title}` + `NOTE:` + body (first 60,000 characters).

| Action | Uses library tools | Instruction (verbatim) |
|---|---|---|
| Redraft in report style | No | Redraft this note as clear, measured prose suitable for an inspector's report or letter. Keep every substantive point and any [[D.. p..]] citations exactly as they are. UK English. Return only the redrafted text. |
| Turn into questions for the Council | No | Turn the issues in this note into focused, neutrally worded questions an inspector could put to the Council (and, where relevant, other participants). Number them. Keep citations. Return only the questions. |
| Check against the library | Yes | Check each factual claim in this note against the examination library. For each claim say whether the documents support it, contradict it, or are silent, with citations. Finish with any corrections needed. |
| Stress-test for legal challenge | Yes | Stress-test the reasoning in this note as counsel for a party seeking to quash the decision would (s113 of the 2004 Act or s118 of the 2008 Act), then as the judge. Check it against the library. Look for: misreading of policy, failure to take into account a material consideration, inadequate or unintelligible reasons, procedural unfairness (a point not put to the parties), irrationality, and errors on the duty to cooperate, SEA, HRA or the public sector equality duty. For each weakness give its seriousness and the fix. Finish with Confidence and limits. |
| Summarise in five bullets | No | Summarise this note in at most five bullets for a quick briefing. Keep citations. |

### 6.8 Soundness "Assess" (returns JSON)

> {LIB_RULES Analyse block}
>
> Library catalogue:
> {catalogue}
>
> Assess {policy ref} {title} against the legal compliance requirements (including the duty to cooperate, SA/SEA, HRA and the regulations) and the tests of soundness in the NPPF (positively prepared, justified, effective, consistent with national policy). Read the policy text, its reasoned justification and the evidence base behind it, and test the evidence's method and assumptions. Use the library: the policy text, its supporting evidence, the Council's responses and the representations. Be cautious: use "concern" where evidence is thin or contested, "unsound" only where the evidence clearly shows a failing, "ok" where the evidence supports the policy, and "unknown" where the library is silent.
> {if notes exist: The inspector's notes so far: {notes}}
> Reply with only a JSON object: {"legal":{"status":"ok|concern|unsound|unknown","reason":"one or two sentences with [[D3 p.12]] citations"},"pp":{...},"just":{...},"eff":{...},"cons":{...},"summary":"one or two sentences, ending with your confidence (high, medium or low) and the main thing that could change it"}

### 6.9 MIQ / written question drafting (returns JSON)

> {LIB_RULES Analyse block}
>
> Library catalogue:
> {catalogue}
>
> **Local plan:** Draft matters, issues and questions for the hearing on: {topic}.
> Read the relevant policies, evidence and representations first. Write 8-12 questions grouped under issues. Questions must be neutral, specific and answerable by the Council, in the style of a major local plan examination MIQs document (e.g. "Is the housing requirement justified and consistent with national policy? In particular…"). Probe the evidence: method, assumptions, sensitivity and deliverability.
>
> **NSIP:** Draft the Examining Authority's written questions (in the style of ExQ1) on: {topic}.
> Read the application documents, the ES chapters, relevant representations, local impact reports and statements of common ground first. Write 8-14 questions grouped under themes. Each question must be neutral, specific and addressed to named parties, e.g. "[Applicant] Explain how the worst case assumed in ES Chapter 9 …".
>
> Include citations where a question arises from a specific passage.
> Reply with only a JSON array: [{"issue":"Issue 1 - short title (or theme for written questions)","question":"question text with [[D3 p.12]] where relevant"}]

### 6.10 Report drafting

> {EXPERT brief}
>
> You draft documents for this examination. {workspace context}
> {template instruction} titled "{title}"{, addressed to {To}}.
> Style: formal, courteous, plain UK English, as used in Planning Inspectorate correspondence and reports. Leave out the Confidence and limits section from the document itself; instead put anything you could not verify in square brackets as [to confirm: ...]. Write in the first person as the Inspector. Short paragraphs, each making one point (they will be numbered automatically, so do not number them). Use "## " headings for sections. Do not add a salutation block, address, date or signature: the PDF adds those. Keep any [[D3 p.12]] citations from the material. Do not invent facts, dates or figures that are not in the material; where something is needed, write [to confirm].
> {Current draft to improve and complete: … (up to 40,000 chars)}
> {Notes and findings to draw on: … (up to 80,000 chars)}
> {Examination records: main modifications / soundness matrix / actions, as ticked (up to 40,000 chars)}
> Return only the body text in Markdown.

Template instructions (verbatim):

| Template | Instruction |
|---|---|
| Letter to the Council | Draft a letter from the Inspector to the Council |
| Inspector's note | Draft an Inspector's note for publication on the examination website |
| Findings briefing | Draft an internal briefing summarising the findings so far |
| Schedule of main modifications | Draft a short introduction to the schedule of proposed main modifications for consultation |
| Examination digest | Draft a progress digest of the examination |
| Report on the examination (LP) | Draft the Inspector's report on the examination of the plan under s20(7) of the 2004 Act, with these sections: Non-technical summary; Introduction; Context of the plan; Public sector equality duty; Assessment of the duty to cooperate; Assessment of other aspects of legal compliance (consultation, SA, HRA, climate change, LDS and SCI); Assessment of soundness, one section per main issue, each ending with a reasoned conclusion and the main modifications it needs; Overall conclusion and recommendation. Where findings are not yet in the material, write the structure with [to confirm] placeholders rather than inventing conclusions |
| Rule 6 letter (NSIP) | Draft a letter under rule 6 of the Infrastructure Planning (Examination Procedure) Rules 2010 and s88 of the Planning Act 2008, inviting Interested Parties to the Preliminary Meeting. Cover: the appointment of the Examining Authority; the date, time and arrangements for the Preliminary Meeting with its agenda; the Initial Assessment of Principal Issues; the draft examination timetable; procedural decisions already made; how to take part; and the availability of documents. Use [to confirm] for every date and venue not in the material |
| Rule 8 letter (NSIP) | Draft a letter under rule 8 of the Infrastructure Planning (Examination Procedure) Rules 2010 confirming the examination timetable and procedures after the Preliminary Meeting. Cover: the timetable with deadlines; procedural decisions (including any requests for local impact reports, statements of common ground and written representations); hearings and site inspections; the first written questions; and the close of the six-month examination. Use [to confirm] for any date not in the material |
| Written questions (NSIP) | Draft the Examining Authority's written questions. Group them under numbered themes as "## 1. General and cross-topic", "## 2. ..." and so on. Write each question as its own paragraph starting with its reference and addressee in bold, e.g. "**Q1.1.1 [Applicant]** ...". Questions must be neutral, specific and seek evidence, not argument |
| Recommendation report (NSIP) | Draft the Examining Authority's recommendation report to the Secretary of State under the Planning Act 2008, with these sections: Introduction; Description of the proposal and the site; Legal and policy context (including the relevant NPS and s104 or s105); Planning issues, one section per principal issue with the evidence, the parties' positions and the ExA's reasoning and conclusion; Habitats Regulations assessment findings for the Secretary of State as competent authority; Conclusion on the case for development consent and the planning balance; Compulsory acquisition and temporary possession (s122 and s123 tests); The draft DCO and related matters; Summary of findings, conclusions and recommendation. Where findings are not in the material, write the structure with [to confirm] placeholders rather than inventing conclusions |

Numbered paragraphs are on by default for the letter, note, LP report, Rule 6, Rule 8 and recommendation report; off for the written questions.

---

## 7. Known limits (carry these over honestly)

- **No OCR.** Scanned PDFs without a text layer are stored but cannot be searched or cited; they are flagged "No text". A rebuild could add OCR (for example Azure AI Document Intelligence, or Tesseract.js in the browser).
- **Keyword search, not semantic.** BM25 plus the model running several searches with synonyms. Very large libraries (thousands of documents) may benefit from an embedding index.
- **Email is read-only** and reaches only the mailbox of whoever is signed in. Attachments are listed by name only and are not read.
- **AI answer quality inside the live page was never tested end to end** in the Claude build's test browser (PDF reading, PDF export, and Claude and Gmail working in the live page were not exercised there). Test with real documents early.
- The **soundness matrix is built for local plans**; NSIP mode has no equivalent (an NPS/s104 compliance matrix would be the natural addition).
- Each user's workspace is private; there is no shared or team workspace and no audit trail.
- The Windows installer is **not code-signed**, so SmartScreen warns on first run (More info, then Run anyway).
- Legal references in the brief reflect the position as written in November 2026; the brief tells the model to confirm the NPPF version and transitional arrangements from the documents.

---

## 8. Suggested target build for Copilot

Keep it close to the original so the source can be ported, not rewritten:

- **Front end**: the same single-page app, split into modules (Vite + plain TypeScript, or keep plain JS). Port CSS and screens as they are.
- **Back end**: one small service (Azure Functions or Node/Express) with `/api/ai` (proxies the model, runs the tool loop or streams tool calls back to the browser, holds the key), and `/api/mail/*` (Microsoft Graph, read-only), behind Entra ID sign-in.
- **Storage**: start with IndexedDB plus JSON export/import; move to a per-user server store later if needed.
- **Desktop**: PWA install, and the existing Tauri launcher with `URL_IC` changed.

Where the browser does the search and the server calls the model, the tool loop runs like this: browser sends the prompt and tool definitions to `/api/ai`; when the model asks for `search_documents` or `read_pages`, the server streams that request back; the browser runs it on its local index and posts the result; repeat until the model finishes. Alternatively, upload the extracted text to the server and run search there.

---

## 9. Ready-to-paste GitHub Copilot prompts

Use these one at a time in **Copilot Chat (agent mode)** in VS Code with this repo open, or as issues assigned to the **Copilot coding agent**. Each assumes Copilot can read `HANDOVER.md` and `source/an-inspector-calls.html`. Review and test after each step before moving on.

**Prompt 0: orientation**

```
Read HANDOVER.md and source/an-inspector-calls.html in full. Summarise back to me: the screens, the data model (record kinds and fields), every AI call and its prompt, the tools the model can call, and the list of Claude-specific pieces in section 5 that must be replaced. Do not write code yet. Then propose a folder structure for a rebuild as a Vite + TypeScript single-page app in /web with a small Node (Express) or Azure Functions back end in /api, keeping the original look exactly.
```

**Prompt 1: scaffold and look**

```
Create the /web app (Vite, TypeScript, no UI framework) and port the layout, CSS design tokens (light and dark), fonts (Newsreader, Hanken Grotesk, IBM Plex Mono), the left rail with the three groups, hash routing, the h() DOM helper, toast, confirm dialog and slide-in drawer from source/an-inspector-calls.html. Port the badgeSVG() function unchanged. Every screen can be an empty placeholder for now. It must look identical to the original at desktop width and fold the rail into a top strip under 900px.
```

**Prompt 2: storage**

```
Implement a Store module with the same API as the original (init, put(id, data), del(id), all(kind), ws(), putWs(patch)) using IndexedDB for records and a separate IndexedDB store for each document's page text (array of strings, keyed by doc id) and its original file Blob. Add "Export workspace" (one JSON file including page text) and "Import workspace" buttons on the Overview. Keep the record kinds and fields exactly as in HANDOVER.md section 4.2. Replace the rail's status lights with Workspace / Assistant / Mailbox / Files states that make sense for this build.
```

**Prompt 3: library, extraction and search**

```
Port the Library screen: drop zone, processing queue, extract() for PDF (pdf.js, one entry per page), DOCX (mammoth, 3,200-char sections), XLSX/XLS/ODS (SheetJS, one section per sheet), HTML and text formats, D1/D2 codes, editable exam ref and category with guessCat(), the document drawer with page navigation and highlighting, "Open original" (from the stored Blob, jumping to #page=N for PDFs), and Remove. Port the BM25 index (tokens, stem, STOP list, buildIndex, searchIndex, excerpt, highlight) and Instant search exactly. Install the libraries from npm rather than loading them from a CDN.
```

**Prompt 4: AI service with tools**

```
Create /api with an endpoint POST /api/ai that calls our approved model (configure provider, model name and key by environment variables; default to Azure OpenAI with the most capable deployment and the highest reasoning effort setting). It must: accept messages plus optional tool definitions, support tool calling where the browser executes the tools (stream a tool request back, accept the tool result, continue the loop), stream text to the browser, and offer a JSON mode that returns parsed JSON. In /web, write ai.ts with sample(messages, {tools, onText, signal}) and sample.json(prompt, opts) matching how the original uses window.claude sample. Never expose the API key to the browser. Map errors to plain-English messages like SAMPLE_COPY in the original.
```

**Prompt 5: expert brief and Ask the library**

```
Port EXPERT_LP, EXPERT_NSIP, EXPERT(), wsContext(), catalogue(), LIB_RULES(mode) and the search_documents and read_pages tools word for word from HANDOVER.md section 6. Then port the Ask the library screen: Find / Analyse modes, category scope, preset chips, streaming answer, activity strip, last-three-answers history, Stop, and the [[D3 p.12]] citation parser that renders clickable chips (showing the exam ref if set) which open the document drawer at that page. Add Save as finding, Copy (plainCites) and Use in a report. Hook up the Home ask bar and the Overview quick-ask box.
```

**Prompt 6: email search (read-only)**

```
Replace the Gmail connector with Microsoft Graph, read-only. In /api add GET /api/mail/search?q=&top= (uses /me/messages with $search, groups results by conversationId into threads with id, subject, from, date, message count, snippet and webLink) and GET /api/mail/thread/:conversationId (all messages: from, to, date, subject, plain-text body, attachment names). Use delegated Mail.Read only and Entra ID sign-in; never request send or write scopes. In /web port the Email search screen: "Ask the assistant" mode (port the email prompt from HANDOVER.md 6.6, changed to describe KQL search syntax and tools named mail_search and mail_read_thread, keeping the THREADS: final line and [[E:id]] citations) and "Direct search" mode, thread cards, the thread drawer, and Add to library (one section per message, category Correspondence).
```

**Prompt 7: notes**

```
Port Notes & findings: list with All/Notes/Findings/Drafts filters, editor with type, matter, title, Markdown body, Write/Preview, autosave after 700ms, Delete, and the five "Work on this note" actions with their exact instructions from HANDOVER.md 6.7 (Check against the library and Stress-test use the library tools). Results can be appended, replace the text, copied or discarded. Port the safe Markdown renderer renderMd() so no raw HTML is ever injected.
```

**Prompt 8: examination trackers**

```
Port the Soundness tests matrix (five tests, click to cycle Not assessed/Sound/Concern/Unsound, Reasoning, Assess with the exact JSON prompt in HANDOVER.md 6.8, Apply suggestions), the Matters & questions tracker grouped by matter with the AI drafter (prompt 6.9, local plan and NSIP versions), Hearing actions with AP auto-numbering and overdue pills, Main modifications with MM auto-numbering, and Deadlines. Use the generic editTable/cellCtl pattern from the original.
```

**Prompt 9: Overview, Home and example data**

```
Port the Overview (details editor with LP/NSIP type switch and relabelled fields, stage stepper with the two stage lists, five stat tiles, Coming up, Latest notes, welcome steps) and the Home landing page exactly: green hero band, large badge, "An Inspector Calls", greeting() with Good morning/afternoon/evening/Working late + "Inspector" + surname, date and plan line, rounded ask bar with gold button, "This week" docket with the ring dial and up to five items, six tiles, and footer. Port seedExamples() and clearExamples() with the Harrowfield example data.
```

**Prompt 10: reports, PDFs and Word**

```
Port Reports & PDFs: template cards filtered by LP or NSIP, the settings panel, body editor, Insert selected notes, Draft with the assistant (prompt and template instructions in HANDOVER.md 6.10), Save/open saved reports, and buildPdf() with jsPDF and jspdf-autotable exactly as the original (A4, cover block, numbered paragraphs, appendices as tables, footer with page X of Y, pdfSafe text). Download with a normal browser download. Replace "Open as editable doc" with "Download Word (.docx)" using the docx npm package, keeping headings, numbered paragraphs and appendix tables.
```

**Prompt 11: install and desktop**

```
Make /web an installable PWA (manifest with the IC badge icons from resources/icon.png at 192 and 512, theme colour #11392d, service worker that caches the app shell only, never case data). Then update the Windows launcher: change URL_IC in src-tauri/src/main.rs and the comment in app/index.html to our new app URL, keep everything else, and confirm the GitHub Actions workflow still builds Inspector-Calls-Setup.exe.
```

**Prompt 12: test pass**

```
Write a test checklist and Playwright tests for: uploading a PDF, a DOCX and an XLSX and seeing page counts; Instant search finding a phrase; a citation chip opening the right page; creating each tracker row and seeing it on Overview and the Home docket; the LP/NSIP switch changing stages, labels and templates; PDF download with appendices; export and re-import of the workspace; dark mode and a 390px-wide phone layout. Mock the AI and mail endpoints in tests.
```

---

## 10. Standing instructions for Copilot

`.github/copilot-instructions.md` in this repo holds a short version of the rules above (purpose, citation format, the reasoning standard, the read-only email rule, the design). GitHub Copilot reads it automatically in this repository.

---

## 11. If you use Microsoft 365 Copilot or Copilot Studio instead

A Copilot Studio agent (or an M365 Copilot "agent") can give the inspector the **document Q&A and email search** parts quickly, without code:

1. Create an agent called **An Inspector Calls**; use the IC badge (`resources/icon.png`) as its icon.
2. **Instructions**: paste the EXPERT brief (6.2, choosing the LP or NSIP frame), then the research rules from 6.4 adapted to the agent's own citation style (for example "Cite the document name and page for every point"). Keep the "Confidence and limits" requirement.
3. **Knowledge**: point it at a SharePoint or OneDrive folder holding the examination library. Scanned PDFs need OCR first.
4. **Email**: M365 Copilot can already search the user's Outlook; tell the agent it must only read, never send.
5. **Starter prompts**: use the six library presets (2.4) and four email presets (2.5).

What this route **cannot** reproduce well: the soundness matrix, MIQ, action, MM and deadline trackers, the "This week" docket, the page-exact `[[D3 p.12]]` citation chips, and the formatted PDF builder. Those need the GitHub Copilot rebuild above (or Power Apps with Dataverse tables, using section 4.2 as the table design).

---

## 12. Build history (short)

- **25 Nov 2026**: first version built as a Claude artifact ("Examination Desk"): library, cited Q&A, Gmail search, notes, soundness matrix, MIQs, actions, MMs, deadlines, five PDF templates.
- Renamed **An Inspector Calls** with the IC badge and the doorbell dot.
- Landing page with the time-of-day greeting added, modelled on the Life Admin app (`djayres/life-admin-app`, an Android Capacitor wrapper that greets the user and opens the web page).
- Repo created; first an Android build, then switched to Windows on request: Electron (82 MB, failed with "Disk full"), then **Tauri** (1.3 MB). Each build publishes its own release.
- Raised to **senior-inspector grade**: top model and effort on every call, the expert legal brief, "Confidence and limits", **NSIP/DCO mode** (stages, Rule 6 and Rule 8 letters, written questions, recommendation report), the LP report on the examination, and the legal-challenge stress test.
- **26 Nov 2026**: this handover pack.

Live Claude version (owner-only): https://claude.ai/artifact/Dq6idUVy5f5mZRYDLS4iuQ
