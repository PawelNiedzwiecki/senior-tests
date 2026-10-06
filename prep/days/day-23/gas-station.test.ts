import { describe, it, expect } from 'vitest';
import { canCompleteCircuit } from './gas-station.ts';



describe('canCompleteCircuit', () => {
  it('handles the prompt examples', () => {
    expect(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])).toBe(3);
    expect(canCompleteCircuit([2, 3, 4], [3, 4, 3])).toBe(-1);
    expect(canCompleteCircuit([5], [4])).toBe(0);
  });

  it('handles a station that cannot even leave itself', () => {
    expect(canCompleteCircuit([1], [2])).toBe(-1);
  });

  it('handles exactly enough fuel overall', () => {
    expect(canCompleteCircuit([1, 2, 3], [3, 1, 2])).toBe(1);
  });

  it('handles the answer being the last station', () => {
    expect(canCompleteCircuit([1, 1, 5], [2, 2, 1])).toBe(2);
  });

  it('agrees with a brute-force simulation', () => {
    const brute = (gas: number[], cost: number[]) => {
      const n = gas.length;
      for (let start = 0; start < n; start += 1) {
        let tank = 0;
        let ok = true;
        for (let step = 0; step < n; step += 1) {
          const i = (start + step) % n;
          tank += gas[i]! - cost[i]!;
          if (tank < 0) {
            ok = false;
            break;
          }
        }
        if (ok) return start;
      }
      return -1;
    };

    const cases: Array<[number[], number[]]> = [
      [
        [1, 2, 3, 4, 5],
        [3, 4, 5, 1, 2],
      ],
      [
        [2, 3, 4],
        [3, 4, 3],
      ],
      [
        [3, 1, 1],
        [1, 2, 2],
      ],
      [
        [5, 1, 2, 3, 4],
        [4, 4, 1, 5, 1],
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
      ],
    ];
    for (const [gas, cost] of cases) expect(canCompleteCircuit(gas, cost)).toBe(brute(gas, cost));
  });

  it('stays linear on a large circuit', () => {
    const n = 100_000;
    const gas = Array.from({ length: n }, (_, i) => (i === n - 1 ? 10 : 1));
    const cost = Array.from({ length: n }, () => 1);
    const started = Date.now();
    expect(canCompleteCircuit(gas, cost)).toBe(0);
    expect(Date.now() - started).toBeLessThan(1000);
  });
});
