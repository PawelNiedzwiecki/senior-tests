# Live Coding 1 — Fundamentals & Problem Solving

Preparation for the DeepL algorithms round: **HackerRank's in-browser IDE,
TypeScript, pair programming with one interviewer.**

Built for someone rebuilding DS&A from a long way back, with 5–7 days.

---

## What this round actually is

DeepL told you the mark scheme. Everything here is organised around it:

> **Structure your approach** — decompose, handle constraints, consider edge cases
> **Communicate clearly** — explain your thinking, ask questions, discuss trade-offs
> **Focus on fundamentals** — time and space complexity, the data structures you chose
> **Testing is key** — a working solution, tested; find bugs and fix them

Two consequences worth internalising before you start:

1. **You are not being tested on frontend.** No React, no DOM, no TypeScript
   type gymnastics. Abstract problems on arrays, strings, trees and graphs.
2. **You will be typing in an unfamiliar browser IDE with no Vitest.** If you
   want to demonstrate testing — and it is a stated criterion — you write the
   harness yourself. That is why `hackerrank/` is the first thing here.

---

## Setup

```bash
npm install
npm run drills:watch          # fast feedback while learning
```

| Command | What it does |
| --- | --- |
| `npm run drills -- 01-hash` | Run one module (any filename fragment) |
| `npm run drills:watch` | Re-run on save |
| `npm run drills:solutions` | Run the same tests against `algo/solutions` |
| `node prep/algo/hackerrank/harness.ts` | The no-framework harness, as it runs in the interview |

**Practise both ways.** Vitest is for learning fast. But at least once a day,
open `hackerrank/blank-template.ts`, copy it to a scratch file, and solve
something with nothing but `node file.ts` and your own assertions. That is the
actual interview environment.

---

## Read these first (about 45 minutes, on day 1)

| | |
| --- | --- |
| [`playbook.md`](./playbook.md) | **The most important file here.** Minute-by-minute protocol, the phrases that carry weight, TypeScript-in-HackerRank gotchas, and how to recover when it goes wrong. |
| [`complexity.md`](./complexity.md) | Big-O reference, how to *state* a complexity in one sentence, and the amortised argument you will be asked for. |
| [`hackerrank/harness.ts`](./hackerrank/harness.ts) | The ten-line test harness. Memorise it. |

---

## The modules

Every drill file opens with the pattern, recognition cues, a time box, hints and
follow-ups. Every solution file opens with the narration that earns the marks.

**Tiers**, because you may not get through all twelve:

| Tier | Meaning |
| --- | --- |
| **P0** | Highest frequency in a fundamentals round. Do these whatever happens. |
| **P1** | Very likely. Do these next. |
| **P2** | Possible but less likely for a round framed as "fundamentals". |

| | Module | Tier | Min | Covers |
| --- | --- | --- | --- | --- |
| 01 | Hash maps and counting | **P0** | 45 | two-sum, anagram grouping, frequency |
| 02 | Two pointers | **P0** | 50 | palindrome, sorted pairs, container, compaction |
| 03 | Sliding window | **P0** | 50 | longest-without-repeats, fixed window, min window |
| 04 | Binary search | P1 | 55 | classic, boundaries, rotated, **search the answer** |
| 05 | Stacks and monotonic stacks | **P0** | 50 | brackets, MinStack, daily temperatures |
| 06 | Sorting, comparators, intervals | P1 | 45 | the `.sort()` trap, merge, meeting rooms |
| 07 | Recursion and backtracking | P2 | 55 | subsets, permutations, combination sum |
| 08 | Binary trees | P1 | 55 | traversals (both ways), depth, BST, level order |
| 09 | Graphs: grids, BFS, DFS | P1 | 60 | islands, cycle detection, shortest path |
| 10 | Heaps and top-K | P2 | 55 | write a heap, bucket sort, kth largest |
| 11 | Dynamic programming | P2 | 55 | stairs, house robber, coin change |
| 12 | Strings and Unicode | **P0** | 45 | reverse correctly, word frequency, common prefix |

Module 12 is P0 despite looking soft: you are interviewing at a translation
company, string problems are likely, and raising the Unicode issue *before* the
interviewer does is one of the cheapest differentiators available to you.

---

## The six-day plan

**3–4 hours a day.** Each day: a warm-up, two modules, and a mock on three of
the days.

### Day 1 — Foundations (~3.5h)

| | |
| --- | --- |
| Read | `playbook.md`, then `complexity.md` (45 min) |
| Warm-up | Type the harness from memory. Time yourself. Repeat until under a minute. |
| Modules | **01 hash maps** · **02 two pointers** |
| Close | Re-read both solution files' narration sections |

Goal today is not volume, it is the *protocol*: restate, clarify, brute force,
optimise, test. Apply it to every single problem even when the problem is easy.

### Day 2 — Windows and search (~4h)

| | |
| --- | --- |
| Warm-up | Redo `twoSum` from a blank file, in the HackerRank template, 10 min |
| Modules | **03 sliding window** · **04 binary search** |
| Mock | **Mock 1 — Longest consecutive run** (45 min, strict timing) |

Binary search is where rusty candidates lose points to off-by-ones. Do not skip
the "state your interval convention out loud" discipline — it is the fix.

### Day 3 — Stacks and ordering (~3.5h)

| | |
| --- | --- |
| Warm-up | `isPalindrome` and `binarySearch` from blank, 15 min total |
| Modules | **05 stacks** · **06 sorting and intervals** |
| Close | Say the amortised argument for the monotonic stack out loud, twice |

### Day 4 — Recursion and trees (~4h)

| | |
| --- | --- |
| Warm-up | `mergeIntervals` from blank, 12 min |
| Modules | **07 backtracking** · **08 trees** |
| Mock | **Mock 2 — Longest window with at most K distinct** (45 min) |

If you are short on time, 07 is the one to cut. Trees are far more likely.

### Day 5 — Graphs (~3.5h)

| | |
| --- | --- |
| Warm-up | `maxDepth` and `levelOrder` from blank, 15 min |
| Modules | **09 graphs** · **10 heaps** (or skip 10 and go deeper on 09) |
| Close | Practise saying "this is a graph problem: cells are nodes, adjacency is edges" |

BFS-vs-DFS is a decision the interviewer is watching you make. If the question
says *shortest* and edges are unweighted, it is BFS. Drill that until automatic.

### Day 6 — Strings, DP, and consolidation (~4h)

| | |
| --- | --- |
| Warm-up | `numIslands` from blank, 20 min |
| Modules | **12 strings and Unicode** · **11 DP** (in that order — 12 matters more) |
| Mock | **Mock 3 — Regions in a grid** (50 min) |

### Day 7, if you have it — Repetition

No new material. Redo, from blank files, timed:
`twoSum` · `lengthOfLongestSubstring` · `binarySearch` · `dailyTemperatures` ·
`numIslands` · `levelOrder`.

Six clean solves in a row is the confidence you want walking in.

---

## If you have fewer than five days

Do this and nothing else:

1. `playbook.md` and the harness (90 min)
2. Modules **01, 02, 03** — the three highest-frequency patterns (2.5h)
3. Module **05** stacks and **12** strings (2h)
4. **Mock 1**, scored honestly (1h)
5. Module **09** graphs — BFS and DFS on a grid (1.5h)
6. **Mock 3** (1h)

That is roughly ten hours and covers most of the probable ground.

---

## The day before

- **No new material.** Redo `twoSum`, `lengthOfLongestSubstring` and
  `numIslands` from blank files, timed, in the HackerRank template.
- Re-read `playbook.md` section 1 (the minute-by-minute protocol).
- Type the harness once more. It should be automatic.
- Check the logistics: the meeting link, screen share, a quiet room, water.
- Sleep beats one more problem, comfortably.

## The morning of

- One easy warm-up — `isPalindrome` or `twoSum`. Never a hard one; a failure at
  09:00 is noise in your head, not information.
- Have the harness in your muscle memory, not in a file you plan to paste from.
  Interviewers notice pasted scaffolding, and typing it is part of the signal.
- Remember the first ninety seconds: **restate, clarify, assume out loud, agree
  the signature.** If you do nothing else deliberately, do that.

---

## What "good" sounds like

The single highest-leverage habit, worth more than any individual algorithm:

> "The brute force is *X*, which is O(n²). The repeated work is *Y*. If I *Z*,
> that becomes O(n) time and O(n) space. Shall I go straight there, or would you
> like to see the brute force first?"

Say that, in some form, on every problem. It demonstrates three of their four
criteria in one breath.

---

## The other track in this repo

[`prep/`](../README.md) (the parent folder) holds a separate kit for a
**frontend TypeScript** round — type-system depth, React hooks, DOM and
accessibility. That is not this interview. Given this stage is called "Live
Coding **1**", there is very likely a Live Coding 2 where that material is
exactly what you need — but ignore it until this round is behind you.
