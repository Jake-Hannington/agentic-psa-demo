# Margin Watcher: build map for the agents prototype

Read-only map of `agents/index.html` (17,631 lines) for a new **Margin Watcher** agent, with the Budget Risk Agent as the baseline. "L" = line in that file. Nothing was changed.

## 0. Read this first: the file overrides itself

36 functions are declared two to four times, and many are later reassigned with wrappers. In a classic script **the last declaration wins**, and a reassignment replaces it. Edit the live copy, or add a new override at the end of the file in the same style. An edit to an earlier copy has no effect.

| Name | Declared / reassigned | Live |
|---|---|---|
| `runAgentNow` | L15558, L16542; reassigned L16842 (`_f9Run0`), L16983 (`_abAccessCheck`) | chain L16983 → L16842 → L16542 (L16542 only in a setup session) |
| `agentReport` | L15502, L15685 | L15685 |
| `_agentScopeFor` | L15471, L15680, L15939 | L15939 |
| `_mentionedProject` | L15496, L15673 | L15673 |
| `openAgentBuilder` | L11346; reassigned L15610, L16692, L16890, L17360 | all four wrappers run |
| `abNewAgent` | L11277; reassigned L16654 | L16654 (forces Act mode, picks an avatar) |
| `abRenderPermissions` / `abRenderProjectMenu` / `abSetProjects` | L12043 / L12101 / L12152 | L16035 / L15962 / L15945 |
| `abChecklistState` | L11570, L16084 | L16084 (no Knowledge step) |
| `renderManageJobs` | L7511, L14617 | L14617 |
| `toggleBellMenu` | L14865; reassigned L17177 | L17177 (opens the drawer) |
| `_dcCard`, `_applyChange`, `setAgentActive`, `toggleAgentActive` | L16436, L16482, L14657, L11497 | wrapped at L17124, L17134, L17149, L17155 (activity log) |
| `jobIcon` | L7396, L16690 | L16690 (avatar image) |

## 1. New agent page

- **Markup:** `#tmContentJobs` (L5763) holds `.jobs-prompt` (L5766–5780), `#jobsChips` (L5784) and `#jobsSections` (L5787).
- **`renderJobsGallery()` (L7407):**
  - It runs on `switchTeammatesTab('jobs')` (~L7467).
  - L7412: one `button.jobs-chip` per `jobCategories` entry, calling `scrollToJobCategory` (L7401).
  - L7416: one `<section class="jobs-section" id="job-cat-KEY">` per category, with `.jobs-section-label` and `.jobs-grid`, which holds a `.job-hero` then the cards.
- **Card (L7424–7433):** `.job-card[data-slug]` with `onclick="openJobFromCard(catKey, idx)"`, `.job-card-icon` (`jobIcon(name)`), `.job-card-title`, `.job-card-desc`, and an optional skill-icon foot.
- **Click:** `openJobFromCard` (L7440) calls `openAgentBuilder({ template: j })`.
- **Recommended row, cleanest place:** in `renderJobsGallery`, prepend a `<section class="jobs-section" id="job-cat-recommended">` (label "Recommended for you", one `.job-card`) to the string assigned at L7416.
  - Keep the template in its own const, e.g. `MARGIN_WATCHER_TEMPLATE`, with its own opener next to `openJobFromCard`.
  - **Do not** add it to `jobCategories`. That would add a chip, show it in a category, and shift `_tplAvIndex` (L16684), which picks every template's avatar by index. It would also change the `flatMap` users at L9417 and L14412.
  - Outside the list, `_tplAvIndex` falls back to a name hash, which is fine.
- **Budget Risk Agent template (L7332)** and where each field goes in `openAgentBuilder` (template branch L11351–11361, `_abComposePrompt` L11297):

| Field | Value | Used as |
|---|---|---|
| `name` | Budget Risk Agent | `agentDraft.name`; chat greeting |
| `desc` | "Warns when a project will run out of budget…" | prompt Objective, `agentDraft.desc` (L11371) |
| `scope[]` | 3 strings | prompt "Focus" bullets (L11313–11315) |
| `output` | "Alert and recommend…" | prompt "Output" paragraph |
| `skills` | project-budget, report-time | `agentDraft.skills` (only ids that exist in `skillsData` L8539) |
| `triggerType` + `trigger` | Scheduled, "Daily check…" | one trigger via `_abTemplateTrigger` (L11327); "Daily…" becomes daily 09:00 |
| `tier` | Read | computed L11353, **never used** |
| `slug` | budget-risk-agent | card `data-slug` only |
| `tools`, `status`, `mode`, `defaultState` | | not read by the builder |

- **What a template can't carry:** focus projects, mode/caps, knowledge, notify recipients, or more than one trigger. Margin Watcher needs those set on `agentDraft` after `openAgentBuilder`, or new template fields read in the L11351 branch.

## 2. Agent builder

- **Layout:**
  - Chat on the left (`#abThread`, `#abComposer`).
  - Config on the right (`.ab-config`), with pills `#abNav` (L6332) over one scroll page `#abScroll`.
  - Sections: `#abSecInstructions`, `#abSecTriggers`, `#abSecSkills`, `#abSecPermissions` (shown as **Focus**) and `#abSecKnowledge`, plus `#abChecklist` and `#abAccessBanner`.
- **`abRenderAll` (L11559):** topbar → checklist → instructions → triggers → skills → permissions → knowledge → nav.
- **`abNewAgent` (L11277, wrapped L16654):** `{name, icon, status:'draft', instructions:{prompt}, triggers[], skills[], permissions:{projects[], caps}, knowledge[]}`. The wrapper calls `_setMode(a,'act')` (L16406), so **every new agent starts in "Take actions"** whatever the template's tier.

| Section | Shows | State | Template pre-fill |
|---|---|---|---|
| Instructions (`abRenderInstructions` L11595) | editable prompt; Role, Objective, Focus, Output, Rules shown as headings | `instructions.prompt` | `_abComposePrompt` |
| Triggers (`abRenderTriggers`, wrapped L15622) | Manual, Schedule, Automated groups | `triggers[]` `{group, name, schedule:{freq,day,time}?, eventKey?, enabled}` | one trigger, plus the built-in manual triggers (@mention, assign, DM; L11373) |
| Skills (`abRenderSkills` L11964, wrapped L15635) | skill cards | `skills[]` `{id, ref}` | `skills` ids |
| Focus (`abRenderPermissions` L16035) | "Works in" chips; "What it may do" radio (Read only / Draft changes / Take actions, `AB_MODES` L15996); Web search | `permissions.projects[]`, `permissions.caps` | none |
| Knowledge (`abRenderKnowledge` L12163) | **hidden**: CSS L4821, and removed from the checklist and `AB_STEPS` (L16084–16092) | `knowledge[]` | none |
| Sharing | topbar share dialog (`_renderShareDialog`) | `sharing:{company, people}` | default |

- **Notify / recipients:** there is **no setting**.
  - `permissions.caps.notify` and `abSetNotify` (L16013) exist, but the live Focus section never renders them.
  - "Notify PM + Ops Manager" needs a new field and UI, or a line in the prompt.
- **Project focus:** yes, `permissions.projects[]`.
  - Keys are project names, or `client:`, `list:` or `task:` keys (`_scopeItem` L15924).
  - The picker is `abRenderProjectMenu` (L15962).
  - `abSetProjects` (L15945) silently drops unknown keys, so a project must exist in `PROJECTS` first.
  - Projects have **no fixed-fee or billing field**, so "active fixed-fee projects" must be a named list, or needs a new project field.
- **Triggers available:**
  - Schedules come from `AB_FREQS` and `AB_TIMES` (daily 09:00 is possible).
  - Events come from `AB_EVENT_PRESETS` (L11663). `task.logged_time` exists ("Time is logged on a task"). **There is no budget-change event**, so one needs adding (e.g. `project.budget_changed`).
- **Chat opening:** `abSeedThread` (L12217).
  - Template path, L12236: "Hi {`PEOPLE[ME].short`}, I'm **{name}**, set up from a template…".
  - Then `_abQuestion` (L12463) asks the next unfinished `AB_STEPS` item: instructions → trigger → projects → caps → skills → activate.
  - With focus pre-set (and caps already done by the Act default), the first question is skills, then activate.

## 3. Run now and the report

- **Chain:** `runAgentNow` L16983 (`_abAccessCheck` L16962 blocks the run with no focus projects) → L16842 (`openAgentChat(a, {title:'Run now', kind:'run', html: 'Here's what I found:' + agentReport(a) + _withChange(a, _runProject(a,''))})`). Only inside a setup session does it fall through to L16542.
- **Projects shown:** `_agentScopeFor` (L15939) takes the runner's focus (`a._scopes[ME]` or `permissions.projects`), maps it via `_projByName`, and filters it by `_canSeeProject` unless admin. No `PROJECTS` filter. Every focus project is listed.
- **`_agentKind` (L15454)** works on the agent's name: /budget|profit|unbilled/ → `budget`; /overdue|stale|late/ → `overdue`; /overload|capacity/ → `capacity`; anything else → `status`. **"Margin Watcher" falls to `status`.**
- **`_projectLine('budget', p)` (L15476–15482):**
  - used = spent ÷ budget.
  - **forecast = spent ÷ progress × 100.** This is already an EAC.
  - over = forecast − budget.
  - 🔴 if used ≥ 90%, 🟠 if over > 0, else 🟢.
  - Text: "€X of €Y used (N%) with P% of the work done. At this rate it will overrun by about €Z." (`_eur` L15453).
- **Live `agentReport` (L15685):**
  - Head is 'Budget check'.
  - Renders `.ag-out` rows of flag, title and text, plus notes.
  - `noFin` (L15703) hides the figures from anyone without `PEOPLE[id].financials` (L15667–15669: olivia, paula, sam).
- **A `margin` kind plugs in at:**
  - `_agentKind` (add /margin/ first);
  - `_projectLine` (a `margin` branch: EAC vs budget, forecast margin vs target, Approaching ≥ 90% / Exceeded > 100%);
  - the `head` map (L15707);
  - `noFin` (L15703) and `_postBlockers` (L15725), which treat only `budget` as financial;
  - `_proposeChange` (L16423);
  - `_abKindOf` (L16713) and `_AB_KIND_COPY`;
  - the icon maps (L7389/7395).

## 4. Proposed changes

- **`_proposeChange(a,p,task)` (L16413)** returns **one** change or null. The budget branch (L16423) only proposes a task, "Review budget burn with {client}".
- **Change types:** `task {project, list, name, assignee, due, desc}`, `comment {project, task, text}`, `update {project, health, title, text}`.
- **`_dcCard(a,ch,mode,intro)` (L16436):**
  - Stores `_DC[id]={a,ch,mode,status:'pending'}` and renders one card.
  - In **draft** mode: Approve (`dcApprove` L16504), Edit (`dcEdit` L16475, which makes the text editable), Discard (`dcDiscard` L16512).
  - In **act** mode it applies straight away.
  - In **read** mode `_withChange` (L16519) shows no card.
  - Mode comes from `_abMode` (L16006). The seeded Budget Watch is `act` (L16407).
- **`dcApprove`:** `_applyChange` (L16482: task → `list.tasks`, comment → `task.comments`, update → `project.updates`), then `_dcResolve` (L16465, which swaps `.dc-actions` for a status line), then a toast.
- **Missing today:** no batch approve, no one-at-a-time, no "margin recovered", no before/after.
- **The three-change flow needs:**
  1. a `_proposeChanges(a,p)` returning 3 changes, each with `marginRecovered`;
  2. a wrapper card listing them, with **Accept all** (loop `dcApprove`), **One at a time** (show the next card after each approve or discard) and **Dismiss** (loop `dcDiscard`), reusing `.dc-card`, `.dc-head`, `.dc-need` and `.nt-btn`;
  3. a new change type (e.g. `margin`, which moves hours, swaps rates or raises a change order) in `_applyChange` that updates the project's spent, budget or progress, so EAC can be recomputed for the before/after;
  4. kind labels in `_dcCard` (L16439–16448) and in the activity wrappers (L17124, L17134).

## 5. Activate and Manage agents

- **`AGENTS` (L14410)** starts empty and is filled by `_seedAgent(o)` (L14411, via `abNewAgent`). Agent fields: `id, name, icon, status, instructions, triggers, skills, permissions{projects, caps}, knowledge, ownerId, desc, sharing`.
- **`ag2` Budget Watch Agent (L14429):**
  - `tpl:'Budget Risk Agent'`, owner olivia, `people:{paula:'view'}`.
  - Skills: project-budget, find-overrun-budgets, custom-budget-variance.
  - Projects: p1–p5 by name.
  - Mode act; personal scopes via `_ensurePersonal` (L15589).
- **Activate in the builder:** `#abActivateBtn` (L6271) → `toggleAgentActive` (L11497, wrapped L17155).
  - Needs `_canEdit`.
  - Sets the status to active.
  - If the agent is new, `AGENTS.unshift(draft)`, then `_shRefresh()` (L14607).
  - Toast: "{name} is active".
  - The button hides once active (L11453).
- **In Manage:** `setAgentActive` (L14657, wrapped L17149) runs the row menu's Activate/Deactivate.
- **Manage agents:** `renderManageJobs` (L14617), via `switchTeammatesTab('manage-jobs')` (L7478).
  - Rows come from `_visibleAgents()`.
  - Columns: Agent, Owner, Sharing, Your access, Status (Active / Inactive / Draft badge) and a menu.
  - A new active agent appears there with no extra work.

## 6. Notifications and Updates

- **Bell:**
  - `NOTIFS` (L14377) is keyed by persona.
  - The live data is `seedNotifs()` (L17162–17177), which overwrites NOTIFS with rich items `{type: approval|output|run|share, agent, person, line, title, meta, time, unread, open, project}`.
  - The demo user's list is L17165–17169.
  - Rendering:
    - `_renderBellBadge` (L14859) counts unread items;
    - `toggleBellMenu` (live L17177) opens the drawer;
    - `renderNotifDrawer` (L17186) draws Unread and Read rows with agent avatars and `_ACT_BADGE` (L17025).
- **`openNotif(i)` (L17217):**
  - Marks the item read.
  - Checks `_access`.
  - Branches on `n.open`: `timeDraft` (L17225) builds a `comment` `_dcCard` in draft mode; `budgetDraft` (L17228) builds an `update` card.
  - Otherwise it shows an `agentReport`.
  - Then `openAgentChat(a, {kind:'run', html})`, cached in `n.chat`.
- **How the missing-time agent asks for approval:** the notification `{type:'approval', open:'timeDraft'}` opens the agent chat with one draft card ("Needs your approval", Approve / Edit / Discard).
- **Updates feed:**
  - `_combinedUpdatesData()` (L7559) returns `[...scoutUpdates (L7013, ids 101–108), ...updates (L6717, ids 1–10)]`.
  - `renderCombinedUpdates` (L7565) and `renderCombinedFeedList` (L7587) show the icon, title, agent name and time.
  - Opening one calls `renderDetail` (L9296).
  - Item shape: `{id, type, title, preview, time, content:{intro, body (HTML)}}`.
  - Id 10 (L6982–7011) is a `health` update ("CRM Migration — Budget Risk", L6988: h2, section divider, list, "Action required").
  - Type labels: `_updateCategory` (L9111). Icons: `updateJobIconSVG` (L7269).
- **Recommended pattern:**
  - Copy the **Budget Watch approval notification** (L17166, `open:'budgetDraft'`).
  - Add a new `open:'marginAlert'` branch in `openNotif` (next to L17228) that renders the bespoke Margin Watcher card (gap, cause, 3 actions, Accept all / one at a time / Dismiss, EAC before/after).
  - Unshift a matching `type:'health'` item onto `scoutUpdates`, using id-10-style markup, so the Updates feed shows it too.

## 7. Cast and currency

- **Persona:**
  - `ME = 'olivia'` (L6701).
  - `PEOPLE` (L6691–6698): olivia "Ops Manager Olivia" (OO), paula, william, colin, sam, aoife; fields `{id, name, short, initials, color, role, roleLabel, projects, blurb}`.
  - `PERSONA_IDS` (L6699); `switchPersona` (L14897); `applyPersona` (L14904) sets "Hello {short}," (L14908).
  - **Hard-coded "Hello Olan,"** at L5688 and L6156.
- **About 20 `'olivia'` references:** L6692, 6699, 6701, 14378, 14400, 14429, 14434, 14436, 15287 (p4 owner), 15292, 15297, 17010–17020 (ACTIVITY), 17165–17172 (NOTIFS). "Ops Manager Olivia" also appears in NOTIFS HTML (L14380, L14384), and the L17240 wrapper matches names exactly.
- **Currency:**
  - `_eur` (L15453, `'€' + toLocaleString('en-IE')`) has one caller, the budget line (L15482).
  - € literals: L6803, 9660, 9665, 12932, 12938, 14211, 14213.
  - $ already appears elsewhere (e.g. L14212), so the file is mixed.
- **Safest switch:**
  - Add a **`dana`** person rather than renaming olivia: `{id:'dana', name:'Dana Whitfield', short:'Dana', initials:'DW', role: admin, roleLabel:'Ops Manager', projects:'all', financials:true}`.
  - Put her first in `PERSONA_IDS`, set `ME='dana'`, add `NOTIFS.dana` in `seedNotifs`, and fix L5688/L6156.
  - Move ownership of the seeded agents she should edit, or rely on admin access.
  - Leave olivia so owners, shares and activity aren't orphaned.
  - For money, make `_eur` return `'$' + toLocaleString('en-US')` (or add `_money` and alias it), then hand-edit the 7 € literals.

## 8. Projects data

- **`PROJECTS` (L15240–15317), p1–p5:** Northwind Website Redesign, Northwind Mobile App, Brightline Brand Refresh, Contoso CRM Migration, Q4 Marketing Campaign.
- **Project shape:** `{id, name, client, owner (persona id), start, end ('3 Mar 2026'), health ('Good'|'At risk'|'Needs attention'|'Not set'), budget, spent, progress (0–100), risk, lists:[{name, tasks:[_T(...)]}], updates?}`.
- **Tasks:** `_T(name, who, status, start, end, priority, loggedH, estH, desc, subs, comments)` (L15226).
- **Readers:** `_curProject` (L15318), `_projByName` (L15319), `_visibleProjects` (L15320), `_taskStats` (L15461), `_projectLine`, `agentReport`, `_proposeChange`, `_applyChange`, the projects page (~L15956), the scope resolver (L15924–15927), and `AB_PROJECT_DATA` / `AB_PROJECTS` (L11188/11196).
- **Adding the Halcyon Logistics projects:**
  - **p6 "Depot Network Review":** client Halcyon Logistics, budget 48500, owner a PM, health 'At risk'. Pick spent and progress so EAC is over budget (e.g. spent 31,000 at 55% gives an EAC of about $56,400, which is Exceeded).
  - **p7 "Enterprise AI Rollout":** Halcyon Logistics, EAC under 90% of budget.
  - Each needs at least one list of `_T` tasks (`p.lists.flatMap` is used everywhere).
  - Add both to the `keys` map in **both** `_mentionedProject` copies (L15498, L15675). Today `keys[p.id].some` **throws** for any id missing from it. Use e.g. `p6:['depot']`, `p7:['enterprise','rollout']`, and avoid 'ai' (p2 uses 'app').
  - Add both to `AB_PROJECT_DATA` (L11188), and to `PEOPLE.*.projects` for non-admins who should see them.
  - No fixed-fee, fee or target-margin fields exist. Margin Watcher's "forecast margin vs target" needs new fields on these two projects (e.g. `fee`, `targetMargin`) read only by the new `margin` branch.
  - Keep them out of `ag2`'s project list, or Budget Watch will report Depot as well.

## 9. Recommended build plan

**Phase 1: entry, builder pre-fill, Dana and $, projects**

1. **Projects:** add p6 and p7 with the `keys`, `AB_PROJECT_DATA` and new margin fields.
2. **Dana:** add the `dana` persona (`financials:true`, admin), set `ME='dana'`, add `NOTIFS.dana`, and fix the "Hello Olan," literals.
3. **Money:** switch `_eur` to $ and fix the € literals.
4. **Template:** add a `MARGIN_WATCHER_TEMPLATE` const and render the "Recommended for you" section at the top in `renderJobsGallery` (L7416) with its own opener. The opener calls `openAgentBuilder({template})`, then sets `agentDraft`:
   - triggers: daily 09:00, `task.logged_time`, and a new `project.budget_changed` preset in `AB_EVENT_PRESETS`;
   - focus: `permissions.projects = ['Depot Network Review', 'Enterprise AI Rollout']`;
   - mode: `_setMode(agentDraft,'draft')`, so changes need approval;
   - knowledge: `knowledge[]` (hidden today; unhide L4821, or state it in the prompt);
   - notify: add a "Notify" heading to the prompt and `_AB_HEAD`, or a new Focus field;
   - finally `abRenderAll()`.
5. **Check:** the card shows above the categories; the chips and category order are unchanged; the builder opens with every section filled; the greeting says "Hi Dana"; money shows $; existing templates keep their avatars.

**Phase 2: Run now and Activate**

1. Add `margin` to `_agentKind`, `_projectLine` (EAC vs budget and forecast margin vs target: 🟠 Approaching ≥ 90%, 🔴 Exceeded > 100%), the `head` map, `noFin`, `_postBlockers` and `_abKindOf`.
2. Activate works as is.
3. **Check:** Run now flags only Depot Network Review (Enterprise AI Rollout is 🟢); `_abAccessCheck` passes; Activate puts it in Manage agents as Active, owned by Dana.

**Phase 3: alert, Updates, Proposed changes, EAC before and after**

1. Add an `approval` item to `NOTIFS.dana` with `open:'marginAlert'`, and an `openNotif` branch rendering a `_marginCard`: budget vs EAC (gap in $ and %, amber or red), cause, 3 actions with margin recovered, Accept all / one at a time / Dismiss.
2. Add a `margin` change type to `_applyChange` and the activity wrappers (L17124/17134).
3. Add a matching `scoutUpdates` health item.
4. **Check:** the badge counts it; opening it shows the card; Accept all applies all three changes and shows EAC before → after; one at a time steps through; Dismiss leaves the project unchanged; the Updates item matches.

**Risks to the rest of the prototype**

- **Overrides:** an edit to a dead copy does nothing (section 0). Add new code as end-of-file overrides, like the file's later flows.
- **The `keys` map** in `_mentionedProject` throws for new project ids unless both copies are updated.
- **`ME` change:** owner checks (`_canEdit`, `_access`), seeded shares, ACTIVITY people and NOTIFS are keyed to olivia. A new `dana` person avoids breaking them; renaming olivia touches about 20 places.
- **Financial access:** without `financials:true`, Dana's budget and margin reports come back without figures (`noFin`).
- **Template list:** adding the template to `jobCategories` changes other templates' avatars (`_tplAvIndex`).
- **Builder defaults:** every new agent is forced to Act mode by the L16654 wrapper; Margin Watcher must set draft explicitly.
- **Budget Watch** (ag2) will also report Depot if Depot joins its focus list.
- **Currency** stays mixed until every € literal is changed.
- **Knowledge** is hidden. Unhiding it changes the setup checklist and `AB_STEPS` for every agent.
