import { describe, it, expect, vi } from 'vitest';
import { createFrameScheduler } from '@impl/04-dom-a11y/04-frame-scheduler.ts';
import type { ScheduleFn } from '@impl/04-dom-a11y/04-frame-scheduler.ts';

/** A manual "frame": nothing runs until you call `tick()`. */
function manualScheduler() {
  const frames: Array<() => void> = [];
  const schedule: ScheduleFn = (callback) => frames.push(callback);
  return {
    schedule,
    get scheduledCount() {
      return frames.length;
    },
    tick() {
      const callback = frames.shift();
      callback?.();
    },
  };
}

describe('phase ordering', () => {
  it('runs every read before any write', () => {
    const order: string[] = [];
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.write(() => order.push('write-1'));
    scheduler.read(() => order.push('read-1'));
    scheduler.write(() => order.push('write-2'));
    scheduler.read(() => order.push('read-2'));

    frame.tick();

    expect(order).toEqual(['read-1', 'read-2', 'write-1', 'write-2']);
  });

  it('preserves FIFO within a phase', () => {
    const order: number[] = [];
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    for (let i = 0; i < 5; i += 1) scheduler.read(() => order.push(i));
    frame.tick();

    expect(order).toEqual([0, 1, 2, 3, 4]);
  });

  it('runs nothing before the frame fires', () => {
    const task = vi.fn();
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(task);
    expect(task).not.toHaveBeenCalled();

    frame.tick();
    expect(task).toHaveBeenCalledTimes(1);
  });
});

describe('scheduling', () => {
  it('schedules exactly one frame for many tasks', () => {
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(() => {});
    scheduler.read(() => {});
    scheduler.write(() => {});

    expect(frame.scheduledCount).toBe(1);
  });

  it('schedules a new frame after the previous one ran', () => {
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(() => {});
    frame.tick();

    scheduler.read(() => {});
    expect(frame.scheduledCount).toBe(1);
  });

  it('defers tasks queued during a flush to the next frame', () => {
    const order: string[] = [];
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(() => {
      order.push('read-1');
      // A task that queues a task must not extend the current frame.
      scheduler.read(() => order.push('read-2'));
    });
    scheduler.write(() => order.push('write-1'));

    frame.tick();
    expect(order).toEqual(['read-1', 'write-1']);

    frame.tick();
    expect(order).toEqual(['read-1', 'write-1', 'read-2']);
  });

  it('does not schedule a frame when nothing is queued', () => {
    const frame = manualScheduler();
    createFrameScheduler(frame.schedule);
    expect(frame.scheduledCount).toBe(0);
  });
});

describe('error isolation', () => {
  it('keeps running after a task throws', () => {
    const after = vi.fn();
    const write = vi.fn();
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(() => {
      throw new Error('measure blew up');
    });
    scheduler.read(after);
    scheduler.write(write);

    expect(() => frame.tick()).not.toThrow();
    expect(after).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledTimes(1);
  });
});

describe('flush', () => {
  it('drains synchronously', () => {
    const order: string[] = [];
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.write(() => order.push('write'));
    scheduler.read(() => order.push('read'));

    scheduler.flush();
    expect(order).toEqual(['read', 'write']);
  });

  it('leaves nothing pending', () => {
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(() => {});
    scheduler.write(() => {});
    expect(scheduler.size).toBe(2);

    scheduler.flush();
    expect(scheduler.size).toBe(0);
  });

  it('does not re-run tasks when the frame fires later', () => {
    const task = vi.fn();
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    scheduler.read(task);
    scheduler.flush();
    frame.tick();

    expect(task).toHaveBeenCalledTimes(1);
  });
});

describe('size', () => {
  it('counts both queues', () => {
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    expect(scheduler.size).toBe(0);
    scheduler.read(() => {});
    expect(scheduler.size).toBe(1);
    scheduler.write(() => {});
    expect(scheduler.size).toBe(2);

    frame.tick();
    expect(scheduler.size).toBe(0);
  });
});

describe('the thrash it prevents', () => {
  it('groups all measurements before all mutations', () => {
    const log: string[] = [];
    const frame = manualScheduler();
    const scheduler = createFrameScheduler(frame.schedule);

    // The naive version would produce measure/mutate/measure/mutate…,
    // forcing a synchronous layout on every second call.
    for (const row of ['a', 'b', 'c']) {
      scheduler.read(() => log.push(`measure ${row}`));
      scheduler.write(() => log.push(`mutate ${row}`));
    }

    frame.tick();

    expect(log).toEqual([
      'measure a',
      'measure b',
      'measure c',
      'mutate a',
      'mutate b',
      'mutate c',
    ]);
  });
});
