# Navigation and Ask AI audit

Audit of `remi/`, `tsia/` and `agents/` (each one `index.html`) at commit `624aa3d`, to plan:

- (a) giving Remi TSIA's navigation,
- (b) bringing TSIA's Ask AI drawer into Remi,
- (c) adding `#stage=N` deep links to TSIA.

No prototype file was changed. Line numbers are `T:` for `tsia/index.html`, `A:` for `agents/index.html` and `R:` for `remi/index.html`.

## 1. TSIA global navigation

### Markup

- `div.app-shell` T:6405 holds `nav.nav-sidebar` (rail, T:6412–6497) and then `div.right-area`. `nav.global-nav` (top bar, T:6517–~6626) is inside `.right-area` but is `position: fixed`.
- The top bar has three grid columns: `.global-nav-left`, `.global-nav-center` and `.global-nav-right`.
- An inline SVG sprite above the shell (ends T:6403) defines `#aiSparkIcon`, `#aiGrad2`, `#aiGradLine` and `#aiSparkGrad`. The rail's Teamwork AI icon and the drawer use them.

### CSS

- **Rail:** `.nav-sidebar` T:243, `.nav-add-btn` T:262, `.nav-icon-btn` T:274 (`:hover` T:284, `.active` T:288), `.nav-ai-wrap`, `.nav-ai-popover` and `-item` T:295–315, `.nav-spacer` T:326, `.nav-badge` T:329 (`.info` T:342).
- **Top bar:** `.global-nav` T:2537, `.global-nav-left` T:2549, `.global-nav-expand-btn` T:2553, `.global-nav-logo` T:2585, `.global-nav-center` T:2592, `.global-nav-search*` T:2596–2611, `.global-nav-right` T:2618, `.global-nav-icon-btn` T:2622, `.global-nav-badge` T:2633, `.global-nav-dot` T:2642, `.global-nav-user-dot` T:2647, `.ask-ai-btn` T:2655, `.global-nav-avatar-btn` T:2670.
- **Stage menu:** `.stage-menu*` T:2566–2583, with `top: 46px; left: 12px; z-index: 900`.
- **Variables:** all in `:root` T:13–221. The nav uses `--palette-*`, `--color-*`, `--spacing-1..4`, `--border-rounded-*`, `--gradient-ai-action`, and the rail tokens T:216–219: `--nav-sidebar-bg #f5f7fa`, `--nav-sidebar-icon #8f96b3`, `--nav-sidebar-icon-hover` and `--nav-sidebar-icon-active`. The top bar colours are hard-coded: bar `#0b0f1f`, search `#383c4e`, badge `#ff61c7`.
- **Base styles:** a global reset at T:223 (`* { box-sizing: border-box; margin: 0; padding: 0 }`). `body` T:225 is `display: flex; height: 100vh; overflow: hidden; font-size: 13px`.
- **Font:** `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI"`. No web font is loaded, so Inter only applies if it is installed.
- **Icons:** all inline SVG, with no icon font.

### Sizes

- **Top bar:** 40px high, fixed (T:2537–2547). Its grid is `minmax(0,1fr) 400px minmax(0,1fr)`.
- **Rail:** 60px wide, with no collapsed or expanded state (T:244–245). Buttons are 36×36 with 18px icons.
- **Content offset:** only `.app-shell { padding-top: 40px }` (T:236). The rail is the first flex child, and `.right-area` (T:952) is `flex: 1`.
- **Elements that depend on the 40px bar:** `.ai-drawer { top: 40px }` (T:2694) and `.stage-menu { top: 46px }`.

### Rail items, in order

| # | Item | Behaviour |
|---|---|---|
| 1 | New (`.nav-add-btn`, green) T:6414 | decorative |
| 2 | Search T:6420 | decorative |
| 3 | Teamwork AI `#navTeamworkAiBtn` T:6424, `.active` on load | `showTeamworkAi(lastTeamworkAiTab)` (T:9014). Its hover popover (CSS only, T:6427–6440) has Ask AI → `showTeamworkAi('ask')`, AI Agents → `showTeamworkAi('teammates')` and AI Skills → `showTeamworkAi('skills')` |
| 4 | Tasks T:6442 | decorative |
| 5 | Clients `#navClientsBtn` T:6447 | `showClient()` (T:9689) |
| 6 | Projects `#navProjectsBtn` T:6453 | `showProject()` (T:9032) |
| 7 | Time T:6458 | decorative |
| 8 | Reporting `#navReportingBtn` T:6463 | `showReporting()` (T:13366) |
| 9 | Messages T:6466 | decorative |
| — | `.nav-spacer` T:6472 | pushes the next items to the bottom |
| 10 | Notifications, badge "3" T:6475 | decorative |
| 11 | Chat, badge "2" T:6482 | decorative |
| 12 | Apps T:6488 | decorative |
| 13 | Help T:6494 | decorative |

"Teamwork AI" is not a section with a heading. It is one rail button (item 3) and its popover.

### Top bar items, in order

| Item | Behaviour |
|---|---|
| Hamburger `#stageMenuBtn` T:6521, title "Jump to a stage" | `toggleStageMenu(event)` (T:10461). Opens `#stageMenu` (T:7922). Demo only. |
| Logo T:6531 | `onclick="return false"`, so inert |
| Search, ⌘K T:6538 | decorative |
| Notifications "999+" T:6554, Chat T:6563, Help T:6574, Automations T:6583, Other apps T:6592 | decorative |
| Ask AI `#askAiBtn.ask-ai-btn` T:6603–6607 | `toggleAiDrawer()` (T:16100) |
| Avatar "DW", title "Dana Whitfield" T:6617–6618 | decorative, no image |

### Nav JS

- The active state is set by hand in each `show*` function on `#navClientsBtn`, `#navProjectsBtn`, `#navTeamworkAiBtn` and `#navReportingBtn`: `showTeammatesPage` T:9006, `showTeamworkAi` T:9014, `showProject` T:9032, `showClient` T:9698–9700 and `showReporting` T:13371–13374.
- Tooltips are native `title` attributes only.

## 2. Agents navigation: differences from TSIA

The classes and CSS are the same as TSIA's (`.app-shell` A:227 with `padding-top: 40px`, `.nav-sidebar` A:234 and `.global-nav` A:2332). The rail is at A:5406–~5504 and the top bar at A:5521–~5630.

- **Rail items:**
  - **Disabled:** almost every item has `disabled`: New, Search, Tasks, Time, Messages, Notifications, Chat, Apps, Help, and the popover's Ask AI and AI Agents.
  - **Live:** only Teamwork AI (A:5418, same handler as TSIA) and Projects (A:5458, `showProjectsList()` A:15328).
  - **Removed:** Clients and Reporting.
  - **Popover:** the third item is "Skills" → `openSkillsGallery()`.
  - **Icon:** Teamwork AI uses an inline masked SVG, not `<use #aiSparkIcon>`.
  - **Avatar:** an extra `div.nav-avatar-placeholder` at the bottom of the rail (A:5503, CSS A:349) shows the persona's initials.
- **Top bar:**
  - **Hamburger:** A:5525 is titled "Expand sidebar" and has no handler. Agents has no stage menu.
  - **Bell:** live, via `toggleBellMenu(event)` (A:14865). Its badge `#navBellBadge` (A:5563) is set by `_renderBellBadge` (A:14858).
  - **Avatar:** A:5621 is titled "Switch persona" and opens `togglePersonaMenu(event)`. Its first text is "O".
  - **Ask AI:** same as TSIA, but hidden for client users (A:15827).
- **"Viewing as" persona switcher:**
  - **Menu:** `togglePersonaMenu` (A:14883) builds `#shPersona` with "Viewing as" and one row per persona. Site admins also get "AI sharing settings".
  - **Switching:** `switchPersona(id)` (A:14897) sets `ME`, then calls `applyPersona` (A:14904).
  - **What `applyPersona` updates:** both avatars, every `.askai-greet-hello` and `#aiDrawerIntroTitle` ("Hello <short>,"), the filters and the bell badge. It also closes open panels and blocks AI for client users.
  - **Personas:** `PEOPLE` A:6691, `PERSONA_IDS` A:6699, `let ME = 'olivia'` A:6701.

  | id | Name | Initials | Role |
  |---|---|---|---|
  | olivia | Ops Manager Olivia | OO | site admin (default) |
  | paula | PM Paula | PP | project admin |
  | william | WB William | WB | standard |
  | colin | Client Colin | CC | client |

- **Greeting:** the static greeting is "Hello Olan," (A:5688, A:6156). `applyPersona` replaces it with "Hello Olivia," on load.

## 3. Remi navigation and what depends on it

### Markup

- **Top bar:** `header.topnav` R:2102–2130. It holds:
  - `button.nav-toggle` R:2103 (`aria-controls="side-nav"`)
  - the logo, the search and `div.nav-right` R:2112–2129
  - in `.nav-right`: decorative icons, `span.bell` with badge "5", `span.ask-ai` R:2122–2127 (`aria-controls="ask-ai"`) and `span.me` "JH" R:2126
- **Shell and rail:** `div.app` (flex row) holds `nav.rail#side-nav` R:2132–2159, then `div.nav-tooltip` R:2160, then the views.
- **Rail contents:** `.nav-item` buttons with `.nav-section` headings ("Manage", "Plan & Insights"), and `div.nav-expanded-only` R:2149–2158 with "Starred projects" and "Recent projects" (5 items).
- **Views:** `main.view#view-scheduler` R:2162, `#view-ai-teammates` R:2691, `#view-remi` R:2767, `#view-projects` R:2833, `#view-project` R:3122 and `#view-timeline` R:3180.

### CSS and sizes

- **Nav CSS:** R:42–124. `.view[hidden] { display: none }` at R:127 sits just after this block and must stay.
- **Top bar:** 46px high (R:45).
- **Rail:** 72px wide (R:84). With `body.nav-expanded` it is 265px wide (R:89), with a 250ms transition.
- **Variables:** from Remi's own `:root` (R:11–23): `--navy`, `--navy-2`, `--grad`, `--blue`, `--line` and `--text*`.
- **Font:** Inter from Google Fonts (R:5–7).
- **No clashes with TSIA:** Remi uses none of TSIA's `--palette-*`, `--color-*`, `--spacing-*`, `--border-*` or `--gradient-*` variables. Remi's `.nav-badge` (R:102) is used only by the nav being replaced.

### Items

| Item | Behaviour |
|---|---|
| `.nav-toggle` | `setNavExpanded()` toggles `body.nav-expanded` (R:10247–10252) |
| Logo, search, icons, bell, "JH" | decorative |
| `.ask-ai` | `openAskAi('home')` (R:9871–9873) |
| Rail: Task, Home, My work, Recent, Inbox | decorative |
| Rail: AI Teammates | `data-view="ai-teammates"` (R:2138) |
| Rail: Projects | `data-view="projects"` (R:2140) |
| Rail: Templates, Time, Tasks | decorative |
| Rail: Resourcing | `data-view="scheduler"` (R:2145) |
| Rail: Finance, More, the 5 recent projects | decorative |

### View routing

- `VIEWS` R:10266 and `NAV_FOR_VIEW` R:10268 list the views and which nav item each one highlights.
- `showView(name)` R:10270–10276 shows the view, sets `.is-active` on `rail [data-view]` and pushes `#name`.
- The rail's click delegate (R:10285–10288) calls `showView`.
- `showViewFromHash` R:10348–10353 maps `#projects`, `#project`, `#scheduler`, `#ai-teammates`, `#remi` and `#timeline` to views, both on load and on `hashchange`.
- In-content `[data-go-view]` links (R:10277–10283) don't depend on the rail.

### Layout dependencies

- Nothing is offset by the nav's size: there is no `padding-left`, `margin-left`, `top` or `calc()` that uses the rail or the bar.
- The layout is a flex column: `body` is a flex column with `overflow: hidden` (R:25–34), the header is `flex: none`, and `.app { flex: 1; min-height: 0; display: flex }` (R:81). The rail is `flex: none`, and `.main { flex: 1; min-width: 0 }` (R:232).
- **`.pushed`** belongs to the **Plan with Remi** drawer, not Ask AI. There are three `.workspace` > `aside.drawer` + `.pushed` sets:

  | View | Drawer | `.pushed` |
  |---|---|---|
  | scheduler | `#remi-drawer` R:2197 | R:2250 |
  | projects | `#remi-drawer-projects` R:2851 | R:2903 |
  | timeline | `#remi-drawer-timeline` R:3209 | R:3210 |

  - `.pushed` is never toggled. It fills the space next to the drawer.
  - The drawer opens with `body.drawer-open` and `--drawer-w: 432px` (R:242–247), set by `setDrawerOpen` (R:9202–9205).
  - It doesn't depend on the nav.
- **Remi's Ask AI push:** `body.ask-ai-open { padding-right: 500px }` (R:1743) and `.ask-ai-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 500px; z-index: 40 }` (R:1744). The panel covers the top bar.
- **Dialogs:** `#resource-dialog` R:3294, `#stop-dialog` R:3377, `#gaps-dialog` R:3389 and `#ai-canvas` R:3401. They open with `showModal()`, are centred by the browser's default dialog styles, and sit in the top layer, so they don't depend on the nav. The `--rail-w` inside `.canvas` (R:448) is the canvas's chat column, not the nav.
- **Sticky columns:** each is inside its own scroll container, with no nav sizes. Scheduler: R:2010–2016. Plan grid: R:1217–1225. Timeline: R:1965–1972. Projects table header: R:1938.
- **Other fixed elements:** `.proto-fab` (left 12px, bottom 12px, R:998) is hidden in this demo. `.nav-tooltip` is fixed and positioned by JS.

### JS that queries the nav

All of it is in R:10242–10288 except the `.ask-ai` lookup:

| Code | Line | Notes |
|---|---|---|
| `document.querySelector('.nav-toggle')` | 10243 | `addEventListener` at 10252 throws if it's missing |
| `document.querySelector('.nav-tooltip')` | 10244 | |
| `getElementById('side-nav')` | 10245 | used for tooltips (10254–10263), the active state (10274) and clicks (10285) |
| `setNavExpanded` | 10247–10251 | `body.nav-expanded` |
| rail `mouseover` tooltip from `[data-tip]` | 10254–10261 | only while collapsed |
| `topAskAi = querySelector('.topbar .ask-ai, .ask-ai:not(.ask-ai-panel)')` | 9871 | throws at load if no `.ask-ai` exists, which stops the rest of the script |

## 4. TSIA stages

`DEMO_STAGES` T:10448–10459 is a list of `[label, fn]`. `goToStage(i)` T:10470–10475 calls `closeStageMenu()` and `closeTaskDrawer()`, then runs `DEMO_STAGES[i][1]()`. An unknown index does nothing.

Each stage is self-contained: none of them replays earlier stages or needs their state. Only stage 7 sets state first, with `_mrSaved = true`.

| N | Label | Calls |
|---|---|---|
| 0 | Client · Overview | `showClient('overview')` |
| 1 | Client · Quotes | `showClient('quotes')` |
| 2 | Quote · Enterprise AI Rollout | `showClient('quotes'); openQuote('QTE-014-15-09-2026')` |
| 3 | Client · Role rates | `showClient('rates')` |
| 4 | Project · List | `showProject(); switchProjectTab('list', …)` |
| 5 | Project · Schedule | `showProject(); switchProjectTab('schedule', …)` |
| 6 | Project · Finance | `showProject(); switchProjectTab('finance', …)` |
| 7 | Reporting · AI margin report | `_mrSaved = true; showReporting()` |
| 8 | Teamwork AI · AI Agents | `showTeamworkAi('teammates')` |
| 9 | Teamwork AI · AI Skills | `showTeamworkAi('skills')` |

- **How stages are reached today:** only through the hamburger stage menu (`toggleStageMenu` T:10461, which builds one `goToStage(i)` button per stage). There is no keyboard shortcut.
- **URL handling:** none. The file has no `location.hash`, `hashchange` or `URLSearchParams` (checked).
- **Init:** one inline `<script>` (T:8027–18315) at the end of `<body>`, with no `DOMContentLoaded`. The landing page is set at T:16096 with `showClient('overview')`. About 2,200 lines of top-level `const`s follow, so calling `goToStage` at T:16096 risks a temporal dead zone (TDZ) error for stages 8 and 9.

**How `#stage=N` can work:** add this as the last statements of the script, just before `</script>` at T:18315:

```js
/* Deep link: #stage=N opens DEMO_STAGES[N] */
function stageFromHash() {
  const match = /^#stage=(\d+)$/.exec(location.hash);
  return match ? Number(match[1]) : null;
}
function openStageFromHash() {
  const n = stageFromHash();
  if (n !== null && n < DEMO_STAGES.length) goToStage(n);
}
window.addEventListener('hashchange', openStageFromHash);
openStageFromHash(); // runs after the default showClient('overview')
```

The overview renders first, then the stage, all before the first paint, so a flash is unlikely. If you want stage-menu picks to update the URL, set it with `history.replaceState(null, '', '#stage=' + i)` inside `goToStage`. Don't assign `location.hash`, because that fires `hashchange` and runs the stage again.

## 5. Ask AI drawer: TSIA and Remi

### TSIA (`#aiDrawer`)

- **Markup:**
  - `#aiDrawerOverlay` T:7406 (click → `closeAiDrawer()`)
  - `#aiDrawer` T:7407–7527: header 7408–7437, context banner 7439–7451 (hidden by CSS at T:2750), history panel `#aiDrawerHistory` 7453–7468, `#aiDrawerMessages` 7470–7491 (intro, greeting, "For you" chips), `#aiSuggestions` 7493, composer 7495–7519, feedback 7520–7526
  - separate top-level nodes: the skills popover `#drawerSkillsMenu` T:7531–7545 and `#commentMenu` T:7759. The skills gallery modal (~T:7546–7660) is only needed if "browse all skills" stays.
- **CSS:** T:2684–3230.
  - `.ai-drawer-overlay` is transparent, with `pointer-events: none` even when open, so the drawer doesn't block the page.
  - `.ai-drawer`: fixed, `top: 40px; right: 0; bottom: 0; width: 420px; z-index: 101`, closed at `translateX(100%)`, `.open` → `translateX(0)` over 0.25s (T:2694–2704).
  - `.ai-drawer.wide` is `min(760px, 92vw)` (T:3230).
  - `body.ai-task-split` (T:3318–3324) applies only to TSIA's task drawer.
  - The chat bubble classes (`.chat-msg`, `.chat-thinking`, `.ai-foryou-chip`, `.composer-chips`, `.skills-menu`, `.agent-chips`) are elsewhere in TSIA's stylesheet. None of them exist in Remi.
- **Open and close:**
  - `toggleAiDrawer` T:16100–16124 toggles `.open` on the drawer and overlay and `.drawer-open` on `#askAiBtn`. On open it sets `activeChat = 'drawer'`, calls `setProjectContext(null)`, starts the invoice-page margin offer (TSIA only) and focuses the input after 250ms.
  - `closeAiDrawer` T:16140–16150 removes those classes and calls `closeCommentMenu`, `setProjectContext(null)`, `closeChatHistory` and `_cueRemiCoach` (TSIA only).
  - There is no Esc handler.
- **Header buttons:**
  - New chat → `startNewChat('drawer')` T:17091. It resets the thread, the greeting and "For you".
  - Recent chats → `openChatHistory` T:17082. It uses `renderChatHistoryList` T:17056 and `chatHistoryData` T:16973 (5 canned chats), and `loadChatHistory` T:17116 replays them, using `aiAppendFullUpdate` and TSIA's update data.
  - Back → `closeChatHistory` T:17087.
  - Expand → `toggleDrawerExpand` T:16152 (`.wide`).
  - Close → `closeAiDrawer`.
- **Composer:**
  - `#aiDrawerInput`: Enter sends through `aiDrawerKey` T:16560 → `aiHandleKey` T:16180. Typing runs `aiAutoResize` T:16174 and `_composerDetect` T:12439, which shows the @-mention and "/" skill pop-ups.
  - Attach (T:7502), Dictate (T:7505) and "Send feedback" (T:7522) have no handlers.
  - AI Skills `#drawerSkillsBtn` → `toggleDrawerSkillsMenu` T:14097, which uses `renderComposerChips` T:14078, `_composerSkills` T:14046 and `skillsData` T:13845.
  - Send `#aiSendBtn` → `aiSend()` T:16276–16415.
- **Functions it relies on:**
  - `activeChat` T:16157 and `_ce()` T:16158 pick the drawer or the Ask AI page.
  - Rendering: `aiAppendMessage` T:16862 (the user bubble hard-codes "DW" at T:16869), `aiAppendThinking` and `aiRemoveThinking` T:16889 and T:16906, `aiAppendFullUpdate` T:16812, `_appendFollowUps` and `AI_FOLLOW_UPS` T:16257–16264, `aiSendSuggestion` T:16188 and `_agentChipsHTML` T:11058.
  - Context and greeting: `setProjectContext` T:12142, `_toggleForYou`, `_captureForYou` and `_restoreForYou` T:12198–12228.
  - Also `showToast` and `closeCommentMenu` T:12481.
  - The drawer has no letter-by-letter typing animation: it shows thinking dots, then swaps in the reply after 1.2–1.8s.
- **How `aiSend` routes a message, in order:**
  1. update-scoped replies
  2. create-tasks and next-meeting intents (`_actionFlowReply` T:14771, `_meetingReply` T:15117)
  3. `aiJobIntents` T:16200–16250 (health, client update, catch-up, digest, notifications, all built on TSIA update data)
  4. @teammate → `_drawerTeammateReply` T:16253
  5. `_projectScopedReply` T:16572, if the project page is visible
  6. `_taskScopedReply` T:16749
  7. `_financeReply` T:16633
  8. a fallback at T:16397

### Remi (`#ask-ai`)

- **Markup:** `aside.ask-ai-panel#ask-ai` R:3251–3271: head R:3252–3259, `.ask-ai-thread` R:3261, composer R:3262–3269. Its gradient `#sparkGrad` is at R:3277.
- **CSS:** R:1740–1835. The panel is 500px wide, full height, `z-index: 40` and shown with `hidden`. It pushes the page with `body.ask-ai-open { padding-right: 500px }`. It does not use `.pushed` (see section 3).
- **Open and close:** `setAskAiOpen(open)` R:9854–9857 and `openAskAi(mode)` R:9858–9862. `'plan'` → `showAskAiPlan` R:9847; otherwise `askAiHome`.
  - **Triggers:** the top bar `.ask-ai` (R:9871–9873) and the timeline's "View resource plan" (R:3224 → R:9866–9870).
- **Header:** New chat `.ask-ai-new` R:3255 → `askAiShown = false; askAiHome()` (R:9865). History (R:3256) and Expand (R:3257) have no handlers. Close (R:3258) → `setAskAiOpen(false)`.
- **Composer:**
  - Enter or the send icon → `submitAskAi` R:9262–9277.
  - While Remi's aftercare chat waits for an answer (`acAwait`), the text goes to that flow.
  - Otherwise `askAiSay` R:9236 shows a canned reply and the `REMI_PROMO` card (R:9235), whose link calls `createPlanFromAskAi`.
  - Attach and mic have no handlers.
- **The "Teammates → Create resource plan" chip** is built in `askAiHome` R:9278–9291, in the Teammates group at R:9284.
  - It shows "View resource plan" when `hasPlan()` (R:9220) is true, and "Create resource plan" otherwise.
  - View → `showAskAiPlan` (R:9288). Create → `createPlanFromAskAi` (R:9289, defined R:9222–9233).
  - `createPlanFromAskAi` closes Ask AI. Outside a project or timeline, it clicks `[data-open-dialog]` to open the project picker. In another project, it sets `remiProject` and `remiAutoStart` in sessionStorage and reloads. Otherwise it calls `startFlow()`.
- **Other code that writes to Remi's panel:**
  - `createPlan` R:8268–8282 clears the thread (R:8277) so Home shows "View resource plan".
  - Plan state: `askAiShown`, `planCreated` and `hasPlan` R:9207–9220.
  - `openPlanSnapshot` (~R:9876) closes the panel.
  - The aftercare chat (`acSay`, `acUser`, `acChips`, `acAsk` and `acAwait`, R:9565–9640) and `showAskAiPlan` R:9847 write into `askAiThread` and read `askAiInput`. They use Remi's `.ask-ai-user`, `.ask-ai-reply`, `.ask-ai-chip` and `.ask-ai-thinking` styles (R:1754–1831).

### TSIA drawer prompts and actions

The greeting's "For you" chips (T:7482–7486) each run `activeChat='drawer'; aiSendSuggestion(q)`, and `_financeReply` answers all of them with fixed text.

| Prompt or action | Handler | Depends on | For Remi |
|---|---|---|---|
| What is the planned margin on this project? | `_financeReply` T:16676 | Fixed Enterprise AI Rollout figures. The wording changes with TSIA's `_remiApplied` state. It sets `_plannedMarginChecked` for TSIA's Remi coach. | Port as is, without the coach flag. The figures must match Remi (section 6). |
| Which phase carries most cost? (follow-up chip) | `_appendFollowUps` → `_financeReply` T:16692 | chat only | Port as is |
| Which projects are drifting on margin? | `_financeReply` T:16705 | chat only | Port as is |
| How much unbilled time is sitting there? | `_financeReply` T:16714 | chat only | Port as is |
| Show me budget burn before month-end | `_financeReply` T:16724 | chat only | Port as is |
| Which clients are most profitable this quarter? | `_financeReply` T:16735 | chat only | Port as is |
| Typed "tracking" or Halcyon plan questions | `_financeReply` T:16640 | `_billTotals`, `_remiApplied` | Drop |
| Create an AI margin report (invoice page only) | T:16135 → `openMarginReport()` T:13242 | TSIA Reporting | Link to `/tsia/#stage=7` |
| "For this project" cards (milestone, margin on fee, blockers, progress) | `setProjectContext` ~T:12165 → `_projectScopedReply` T:16575–16620 | TSIA project page | Drop |
| "For this task" cards | `_taskSuggestions` T:12276 → `_taskScopedReply` T:16749 | `_currentTask` | Drop |
| "For this update" chips, Create tasks, suggested actions | T:14828, `_actionFlowReply` | update and task data | Drop |
| Typed health, client update, catch-up, digest, notifications | `aiJobIntents` T:16200–16250, `aiAppendFullUpdate` | `_findUpdate` and the updates data | Drop |
| Add recurring job / Run "<job>" on a schedule | `addRecurringJob` T:14715, `addRecurringJobFromUpdate` T:14724 | TSIA job dialog | Drop |
| Recent chats | `chatHistoryData` T:16973 | its job-type items replay TSIA updates | Port the list, but trim it to plain chats |

### Greeting name

- **TSIA:** "Hello Dana," is static at T:7473 (`#aiDrawerIntroTitle`) and on the Ask AI page at T:6681. It is reset at T:12183, T:12260 and T:17105. The user bubble initials are "DW" at T:16869, and the avatar is "Dana Whitfield" at T:6617.
- **Remi:** "Hello Hannah," is built in `askAiHome` at R:9283. The top bar avatar is "JH" (R:2126). Hannah Wright, Delivery Lead (HW), is a person in the content at R:2575–2576.

## 6. Data consistency: Enterprise AI Rollout

| Field | TSIA | Remi (`DEMO_006`) |
|---|---|---|
| Client | Halcyon Logistics | Halcyon Logistics (label only, R:10297, R:10315) |
| Fixed fee | $150,000 (`BUD.fee` T:11486, `SCHED_FEE` T:10517) | $35,000 (`fee` R:3883) |
| Budget | $150,000 | $30,000 (`fee - 5000`, R:3884), raised to $35,000 by the pasted plan |
| Target margin | 35.2% (`BUD.marginTarget` T:11490) | 40% (R:3884), changed to 35% by the pasted plan |
| Cost target | $97,200 (T:11488), profit $52,800 (T:11489) | cost limit $22,750 at $35,000 and 35% (R:10687) |
| Hours | 820 (`BUD.hoursBudget` T:11493) | none at project level; per-task estimates |
| Dates | 5 Oct to 25 Dec 2026, 12 weeks (T:9050–9052) | `PROJECT.start` 2 Nov 2026 (R:4027), 7 weeks of phases (R:4059–4064); budget start 13 Oct (R:3884) |
| Phases | Readiness & Discovery, Roadmap & Business Case, Governance & Enablement, Rollout & Adoption | Phase 1 to Phase 4 |
| Team | 5 people (`schedPeople` T:10523–10529) | 18 people (`DEMO_006.people` from R:3892) |
| Roles | Engagement Partner, Senior Consultant, Change Manager, Junior Consultant, Delivery Agent (AI) | Designer, Developer, Frontend Developer, Product manager, UX Researcher, QA Engineer |
| Bill and cost rates | $150–350 and $10–200 | $140–280 and $60–105; some people have none |
| Capacity | 8h a day (T:10516) | per-person target %, hours booked elsewhere, leave |
| Client totals | $205,000 revenue, $140,100 cost, $64,900 profit, 31.7% (T:9285–9290, T:16739) | none |

TSIA team (`schedPeople`):

| Person | Role | Bill $ | Cost $ |
|---|---|---|---|
| Priya Raman | Engagement Partner | 350 | 200 |
| Tom Okafor | Senior Consultant | 250 | 150 |
| Elena Marsh | Change Manager | 200 | 120 |
| Sam Delaney | Junior Consultant | 150 | 90 |
| Junior Consultant Agent | Delivery Agent (AI) | 150 | 10 |

The Remi team is Barry White, Emily Jackson, Jessica Jones, Abbey Born, Hannah Hayes, Kim Dorset, Tom Higgins, Marcus Reid, Leo Brennan, Nina Kowalski, Ravi Patel, Grace Liu, Wakaz Mahad, Priya Shah, Luis Ortega, Olivia Grant, Brad Frost and Ryan Giles.

**Mismatches:**

1. **Fee:** $150,000 against $35,000, about 4.3×.
2. **Margin:** 35.2% against 40% (35% after the pasted plan). The planned-margin reply ported from TSIA would quote TSIA's numbers inside Remi.
3. **Team:** no person appears in both. Priya Raman (TSIA) and Priya Shah (Remi) are different people.
4. **Roles and work:** TSIA is AI-transformation consulting. Remi's tasks are generic web design and build (R:~3970 onwards).
5. **Rates:** the bill and cost ranges differ.
6. **Dates and length:** TSIA starts 5 Oct for 12 weeks. Remi starts 2 Nov for 7 weeks, with a budget start of 13 Oct.
7. **Inside TSIA:** `SCHED_TIME_BUDGET` changes from 820 to 836 at T:11356 but `BUD.hoursBudget` stays 820.
8. **User:** TSIA is Dana Whitfield (DW). Remi greets Hannah and shows "JH".

To make them consistent, `DEMO_006`'s `fee`, `people`, `tasks`, phase names and `PROJECT.start` would need to change. Remi's people also carry `other`, `leave` and `target`, which TSIA doesn't have. That is a separate piece of work, and the Remi flow's copy and checks depend on the current numbers (R:10573, R:10632, R:10668, R:10687).

## 7. Recommended plan

### a. Give Remi TSIA's top bar and rail (without Teamwork AI)

**Changes in `remi/index.html`:**

1. **Top bar:** replace `header.topnav` (R:2102–2130) with TSIA's `nav.global-nav` markup (T:6517–6626).
   - Keep it in the flex column with `.global-nav { position: relative }` (Remi's layout has no `padding-top`). Alternatively, keep it fixed and add `padding-top: 40px` to `.app`.
   - Remove the stage hamburger, or leave it inert.
   - Make the logo a link to `/`.
2. **Rail:** replace `nav.rail#side-nav` (R:2132–2159) with TSIA's `nav.nav-sidebar` (T:6412–6497).
   - Keep `id="side-nav"` on it.
   - Remove the Teamwork AI button and popover (T:6424–6440).
   - Remove `div.nav-tooltip` (R:2160).
3. **CSS:** replace Remi's nav CSS (R:42–124, keeping R:127 `.view[hidden]`) with TSIA's rail and top bar CSS (T:243–342 and T:2537–2670, minus `.stage-menu` if the hamburger goes).
   - Add the `:root` variables they use: `--palette-*`, `--color-*`, `--spacing-1..4`, `--border-*`, `--gradient-ai-action` and `--nav-sidebar-*`. None of these clash with Remi's.
   - Don't copy TSIA's global reset (T:223) or its 13px `body` font size, because they would change Remi's content area. Instead, scope `margin: 0; padding: 0; box-sizing: border-box` to `.global-nav *` and `.nav-sidebar *`.
4. **Avatar:** "DW", title "Dana Whitfield".
5. **JS** (R:10242–10288):
   - Delete the `navToggle` and tooltip code (10243–10263).
   - Keep `rail = getElementById('side-nav')`, the `[data-view]` click delegate and the active state in `showView`.
   - Map TSIA's `.active` to Remi's `.is-active` in R:10274, or rename it, so the TSIA style applies.
   - Change R:9871 to query the new Ask AI button. With the old `.ask-ai` gone, the current selector returns `null` and the script stops at load.

**Where each rail item goes:**

| TSIA rail item | In Remi |
|---|---|
| New, Search, Tasks, Time, Messages | inert |
| Teamwork AI (and Ask AI, AI Agents, AI Skills) | removed (Ask AI stays in the top bar) |
| Clients | link to `/tsia/#stage=0` (Client · Overview) |
| Projects | Remi `data-view="projects"`, active for `projects`, `project` and `timeline` (`NAV_FOR_VIEW`) |
| Reporting | link to `/tsia/#stage=7` (Reporting · AI margin report) |
| Notifications, Chat, Apps, Help | inert |

Remi's AI Teammates (`#ai-teammates`) and Resourcing (`#scheduler`) views lose their rail entries. They remain reachable by hash and `[data-go-view]`. If the demo needs them, Time could open `scheduler`, but that isn't TSIA behaviour. With Teamwork AI removed, nothing links to `/agents/`. If that link is wanted, keep the Teamwork AI button and point it at `/agents/`.

**Likely to break:**

| Risk | Cause |
|---|---|
| The script stops at load | R:9871 and the null `navToggle` listener at R:10252 |
| No active state | Remi sets `.is-active`, but TSIA's CSS styles `.active` |
| Shifted content spacing | TSIA's reset, if it's copied unscoped |
| Ask AI covers the top bar | the old `.ask-ai-panel` (z-index 40), until (b) replaces it |
| Different layout widths | the bar changes from 46px to 40px and the rail from 72px to 60px. The sticky offsets don't depend on these, but check widths at 1280px. |

**Test:**

- Load `/remi/`, `#projects`, `#scheduler` and `#timeline`: there should be no console errors.
- Rail Projects switches the view and is highlighted on the project and timeline views.
- Clients and Reporting open the right TSIA stage (after c).
- Run the full flow: Create resource plan → Enterprise AI Rollout → Resource with Remi. The dialogs and canvas should still be centred above the new nav.
- Check scheduler and timeline scrolling, and that the sticky columns stay aligned.

### b. TSIA's Ask AI drawer in Remi, as an overlay

**Changes in `remi/index.html`:**

1. **Markup:** replace `aside#ask-ai` (R:3251–3271) with TSIA's `#aiDrawerOverlay` and `#aiDrawer` (T:7406–7527), `#drawerSkillsMenu` (T:7531–7545) and `#commentMenu` (T:7759). Copy the SVG defs `#aiSparkIcon` and `#aiGrad2`.
2. **CSS:** copy T:2684–3230 plus the chat-bubble, chip, composer and skills-menu classes.
   - Set `.ai-drawer { top: 40px }` to match the new bar from (a).
   - Delete `body.ask-ai-open { padding-right: 500px }` (R:1743), so the drawer overlays the page like TSIA's.
3. **JS:** copy `toggleAiDrawer`, `closeAiDrawer`, `toggleDrawerExpand`, `startNewChat`, the chat history functions, `aiAppendMessage`, `aiAppendThinking`, `aiRemoveThinking`, `aiSendSuggestion`, `_appendFollowUps` and `AI_FOLLOW_UPS`, `aiAutoResize`, `aiHandleKey` and `aiDrawerKey`, the skills menu and composer-chip functions with `skillsData`, `_composerDetect`, `closeCommentMenu`, `showToast`, `_financeReply` and `aiSend`.
   - Reduce `aiSend` to @teammate replies, `_financeReply` and the fallback.
   - Drop `_cueRemiCoach`, `_plannedMarginChecked`, the invoice-page offer, `setProjectContext` scoping, job intents, and the task and update logic.
   - `_ce()` can always return the drawer surface.
4. **Remi's chip:** put Remi's Teammates group (the "Create resource plan" or "View resource plan" chip from R:9284 and R:9288–9289) at the top of `#aiDrawerIntro`, above "For you", and set the greeting to "Hello Dana,". Re-render the chip when `hasPlan()` changes, where `createPlan` clears the thread today (R:8277).
5. **Rewire Remi's callers:**
   - `setAskAiOpen` and `openAskAi` → open or close `#aiDrawer`.
   - Point `askAiThread` at `#aiDrawerMessages` and `askAiInput` at `#aiDrawerInput`, so `showAskAiPlan` and the aftercare chat (`ac*`) write into the new drawer. Keep Remi's `.ask-ai-user`, `.ask-ai-reply`, `.ask-ai-chip` and `.ask-ai-thinking` CSS for those messages.
   - Route Enter and Send to Remi's `acAwait` handling first (as `submitAskAi` does), then to TSIA's `aiSend`.
   - Keep the timeline's "View resource plan" → `openAskAi('plan')`.
   - The user bubble keeps TSIA's "DW" (T:16869), which matches Dana.

**Likely to break:**

| Risk | Cause |
|---|---|
| Messages end up in the wrong place | the aftercare and plan-health replies assume one thread and one textarea |
| The chip disappears | `startNewChat` wipes everything except `#aiDrawerIntro`, so the Teammates group must live inside it |
| Errors when opening history | history items replay TSIA updates through `aiAppendFullUpdate` |
| Remi's own flow overlaps the drawer | the Plan with Remi drawer (`body.drawer-open`) and the canvas dialog can be open at the same time |
| The drawer sits behind content | z-index 101 against Remi's spotlight (900) and toasts. The modal dialogs are in the top layer, so the drawer sits under them, which is correct. |

**Test:**

- Open and close the drawer from the top bar, and check the overlay and the page don't shift.
- Try new chat, history, expand, close, Enter to send, a skill chip and @mention.
- Run each "For you" prompt and its follow-up.
- The Teammates chip → Create resource plan, from the projects list, from a project and from another project (reload path).
- After a plan is created, the chip says View resource plan and shows the plan.
- The timeline's View resource plan opens the drawer on the plan.
- The aftercare questions and answers land in the drawer.
- Check for no console errors, in both normal and wide widths.

### c. `#stage=N` in TSIA

**Change:** add the snippet from section 4 just before `</script>` at T:18315. Optionally make `goToStage` call `history.replaceState`.

**Likely to break:** very little. Stage 2 depends on the quote id `QTE-014-15-09-2026`. Stage 7 sets `_mrSaved`. Out-of-range numbers do nothing.

**Test:**

- Load `/tsia/#stage=0` to `#stage=9`. Each one opens its stage with no console errors.
- Change the hash on an open page: it opens the new stage.
- `/tsia/` with no hash still lands on Client · Overview.
- The stage menu still works.
