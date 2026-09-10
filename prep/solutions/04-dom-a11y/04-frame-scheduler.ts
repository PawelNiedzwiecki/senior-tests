/**
 * SOLUTION 4.4 — Batching reads and writes
 *
 * Talking points (the explanation is the deliverable here):
 *
 * 1. WHY THE READ IS EXPENSIVE. Style changes are queued; the browser would
 *    rather compute layout once, later, right before paint. But
 *    `offsetHeight` has to return a number that is *correct*, so asking for it
 *    while a style change is pending forces layout to be computed right now,
 *    synchronously, on the main thread. One read after one write = one forced
 *    reflow. In a loop over N rows, N forced reflows. That is layout thrashing,
 *    and in a profile it is a solid block of purple "Layout" bars.
 *
 * 2. THE FIX IS ORDERING, NOT SPEED. Nothing here is faster. All the reads
 *    happen while layout is clean (one computation serves all of them), then
 *    all the writes invalidate it once, and the browser lays out a single time
 *    before paint. N reflows become 1.
 *
 * 3. SWAP THE QUEUES BEFORE DRAINING. `const reads = this.reads; this.reads = []`
 *    is requirement 4 in one line. Iterating the live array instead means a
 *    task that queues another task extends the current frame — and a task that
 *    queues itself never returns. This is the same snapshot problem as the
 *    emitter in drill 2.5; recognising it as the same shape is worth saying.
 *
 * 4. ISOLATE ERRORS. One failed measurement must not strand every queued
 *    mutation, leaving the DOM half-updated. Same reasoning as the emitter.
 *
 * 5. rAF IS THE RIGHT PRIMITIVE. It runs after all JS for the frame but before
 *    style/layout/paint — precisely the window where batched DOM work belongs.
 *    `queueMicrotask` runs far too early (before the browser has done
 *    anything), and `setTimeout(0)` is clamped and unaligned to the frame, so
 *    work can land mid-frame and get torn across two paints.
 *
 * 6. WHAT THE PLATFORM GIVES YOU FREE. `ResizeObserver` and
 *    `IntersectionObserver` deliver measurements the browser has *already*
 *    computed, at a defined point in the frame — no forced reflow at all.
 *    Reaching for them instead of measuring in a scroll handler is the single
 *    highest-value performance habit in this area, and the best answer to
 *    "how would you do this in production".
 */

export interface FrameScheduler {
  read(task: () => void): void;
  write(task: () => void): void;
  flush(): void;
  readonly size: number;
}

export type ScheduleFn = (callback: () => void) => void;

const defaultSchedule: ScheduleFn = (callback) => {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => callback());
  } else {
    setTimeout(callback, 0);
  }
};

function runAll(tasks: Array<() => void>): void {
  for (const task of tasks) {
    try {
      task();
    } catch (error) {
      // One bad task must not strand the rest — but stay visible.
      setTimeout(() => {
        throw error;
      }, 0);
    }
  }
}

export function createFrameScheduler(schedule: ScheduleFn = defaultSchedule): FrameScheduler {
  let reads: Array<() => void> = [];
  let writes: Array<() => void> = [];
  let isScheduled = false;

  const flush = () => {
    isScheduled = false;

    // Swap the queues out FIRST: anything queued while draining belongs to the
    // next frame, otherwise a self-queuing task never lets the frame end.
    const pendingReads = reads;
    const pendingWrites = writes;
    reads = [];
    writes = [];

    runAll(pendingReads);
    runAll(pendingWrites);
  };

  const ensureScheduled = () => {
    if (isScheduled) return;
    isScheduled = true;
    schedule(() => {
      // A manual flush() may have already drained everything.
      if (!isScheduled) return;
      flush();
    });
  };

  return {
    read(task) {
      reads.push(task);
      ensureScheduled();
    },

    write(task) {
      writes.push(task);
      ensureScheduled();
    },

    flush,

    get size() {
      return reads.length + writes.length;
    },
  };
}
