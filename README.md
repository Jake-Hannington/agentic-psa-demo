# Agentic PSA demo

A clickable end-to-end demo of Teamwork.com as the agentic PSA: create a project margin-first, deliver it with a delivery agent, prove the profit, then hand the watching to a custom Margin Watcher agent.

Storyboard: "Margin-First Demo Storyboard" (Claude Doc).

## Structure

| Path | What | Source |
| --- | --- | --- |
| `/` | Scene picker and start page | This repo |
| `/remi/` | Scene 1B: create a project from an SOW with Remi | `remi-prototype` |
| `/tsia/` | Scenes 1A and 2–6: quote, delivery agent, invoicing, profitability | TSIA demo (to add) |
| `/agents/` | Scenes 7–8: Margin Watcher agent | Agents concept (to add) |

Each prototype is a static page. They're stitched together by links at the hand-off points, and share one navigation and one cast.

## Running it

Static files, no build step. Vercel serves the folder as-is. Locally, run `npx serve .` from the repo root.
