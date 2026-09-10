/**
 * DRILL 4.4 — Batching reads and writes to kill layout thrash
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○ (code) / ●●●●● (the explanation)
 *
 * THE PROBLEM
 *   for (const row of rows) {
 *     const height = row.offsetHeight;      // READ  — forces layout
 *     row.style.height = height * 2 + 'px'; // WRITE — invalidates layout
 *   }
 * Each read after a write forces the browser to recompute layout *synchronously*
 * before it can answer. Interleave them in a loop and you get one forced
 * reflow per row — "layout thrashing". With 200 rows that is a dropped frame
 * you will see in a flame chart as a wall of purple.
 *
 * THE FIX
 * Queue all reads and all writes; run every read first, then every write.
 * One layout instead of N.
 *
 * REQUIREMENTS
 *   1. Within a frame, ALL reads run before ANY write.
 *   2. FIFO within each phase.
 *   3. Queuing many tasks schedules exactly ONE frame.
 *   4. Tasks queued *during* a flush run in the NEXT frame, not this one —
 *      otherwise a task that queues itself locks up the frame forever.
 *   5. A throwing task does not stop the others.
 *   6. `flush()` drains synchronously (for tests, and for when you must have
 *      the DOM settled before returning).
 *
 * WHY IT'S ASKED
 * The code is easy; the explanation is what is being marked. Being able to say
 * *why* `offsetHeight` after a style write is expensive — that it forces the
 * pending layout to be computed so the number is accurate — puts you in a
 * small minority.
 *
 * HINTS
 *   1. Two arrays, one `isScheduled` flag.
 *   2. SWAP THE QUEUES OUT before running them (`const reads = this.reads;
 *      this.reads = []`). That is what implements requirement 4.
 *   3. Inject the scheduler function so tests do not need real rAF.
 *
 * STRETCH
 *   a. Which properties force layout? (`offsetTop/Height`, `scrollTop`,
 *      `getBoundingClientRect`, `getComputedStyle`, `focus()`… — know three.)
 *   b. How do `ResizeObserver` and `IntersectionObserver` avoid this entirely?
 *   c. `requestAnimationFrame` vs `queueMicrotask` vs `setTimeout(0)` — when
 *      does each run relative to layout and paint?
 *   d. What is `will-change` actually doing, and why is leaving it on bad?
 */

export interface FrameScheduler {
  /** Queue a task that only MEASURES. */
  read(task: () => void): void;
  /** Queue a task that only MUTATES. */
  write(task: () => void): void;
  /** Run everything queued right now, synchronously. */
  flush(): void;
  /** How many tasks are waiting. */
  readonly size: number;
}

export type ScheduleFn = (callback: () => void) => void;

export function createFrameScheduler(_schedule?: ScheduleFn): FrameScheduler {
  throw new Error('Not implemented'); // TODO
}
