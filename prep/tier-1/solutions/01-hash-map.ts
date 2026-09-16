/**
 * SOLUTIONS — Hash map / frequency counting
 *
 * Read the prose, not the code. The code is ten lines you could have written;
 * the commentary is why these ten and not the other ten.
 */

/**
 * EXAM 1 — Two sum
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * NARRATION:
 *   "Brute force is every pair, O(n²). The inner loop only ever asks 'is
 *    target - x somewhere in the array', so I'll record values as I go and ask
 *    a map instead. One pass, O(n) time for O(n) space."
 *
 * WHY THE LOOKUP COMES FIRST: checking before inserting is what guarantees the
 * two indices are distinct. Insert first and [5, 1, 2] with target 10 happily
 * pairs the 5 with itself. It also handles [3, 3] correctly — the first 3 is
 * already in the map when the second one looks for its complement — whereas
 * building the whole map up front makes duplicate keys collide and lose an
 * index.
 */
export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // value → index

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i]!;
    const at = seen.get(need);
    if (at !== undefined) return [at, i];
    seen.set(nums[i]!, i);
  }

  return null;
}

/**
 * EXAM 2 — Group anagrams
 *
 * COMPLEXITY: O(n · k log k) time for n words of length k, O(n · k) space.
 *
 * NARRATION:
 *   "Anagrams are the equivalence classes of 'same multiset of letters', so I
 *    need a canonical representative of that multiset. Sorted letters is the
 *    cheapest one to write; a 26-slot count signature is the cheapest one to
 *    compute."
 *
 * THE FOLLOW-UP, ready to say: with a fixed alphabet, build the key as counts
 * joined by a separator — `'1#0#0#...'` — and the whole thing is O(n · k) with
 * no sort. The separator matters: without it, 1,11 and 11,1 collide.
 *
 * INSERTION ORDER: Map preserves it, so the groups come out in first-seen
 * order. That is not required here, but it is free and it makes the output
 * stable, which is worth a sentence in a code review.
 */
export function groupAnagrams(words: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of words) {
    const key = [...word].sort().join('');
    const bucket = groups.get(key);
    if (bucket === undefined) groups.set(key, [word]);
    else bucket.push(word);
  }

  return [...groups.values()];
}

/**
 * EXAM 3 — Isomorphic strings
 *
 * COMPLEXITY: O(n) time, O(1) space — the maps hold at most one entry per
 * distinct character, and the alphabet is fixed.
 *
 * NARRATION:
 *   "Isomorphism is a bijection, not a function. A single forward map only
 *    checks that each character of a maps to one character of b; I also need
 *    that no two characters of a share a target, which is the reverse map."
 *
 * THE TRAP, concretely: 'badc' → 'baba' passes the forward check (b→b, a→a,
 * d→b, c→a) and is wrong, because d and c collide onto b and a. Interviewers
 * keep this case in their pocket.
 *
 * THE ONE-MAP ALTERNATIVE worth mentioning: two strings are isomorphic iff the
 * index of the first occurrence of each character agrees at every position.
 * Same cost, no bijection bookkeeping — but harder to justify on the spot, so
 * write the two maps and mention this one.
 */
export function isIsomorphic(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const forward = new Map<string, string>();
  const backward = new Map<string, string>();

  for (let i = 0; i < a.length; i += 1) {
    const from = a[i]!;
    const to = b[i]!;

    const mapped = forward.get(from);
    if (mapped !== undefined && mapped !== to) return false;

    const origin = backward.get(to);
    if (origin !== undefined && origin !== from) return false;

    forward.set(from, to);
    backward.set(to, from);
  }

  return true;
}

/**
 * EXAM 4 — Top k frequent elements
 *
 * COMPLEXITY: O(n) time, O(n) space. Sorting the distinct values by count is
 * O(d log d) and a size-k heap is O(d log k); both are fine answers, but the
 * bucket version is the one that impresses, and it is shorter.
 *
 * NARRATION:
 *   "Count in a map, then I need the k largest counts. A count is an integer
 *    in [1, n], so instead of comparing counts I can index by them — bucket
 *    sort. Linear, no comparisons."
 *
 * THE BOUND IS THE ARGUMENT. Bucket sort is only legal because the key space
 * is small and known; say "counts are bounded by n" and the O(n) claim is
 * justified rather than asserted.
 *
 * WALK THE BUCKETS DOWNWARD and stop as soon as you have k — the early return
 * is what keeps the second loop from being a full scan in spirit (it is still
 * O(n) in the worst case, which is fine).
 */
export function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);

  // buckets[c] holds every value seen exactly c times; c can never exceed n.
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) buckets[count]!.push(value);

  const out: number[] = [];
  for (let count = buckets.length - 1; count >= 1 && out.length < k; count -= 1) {
    for (const value of buckets[count]!) {
      out.push(value);
      if (out.length === k) break;
    }
  }

  return out;
}

/**
 * EXAM 5 — Valid Sudoku
 *
 * COMPLEXITY: 81 cells and one set operation each, so O(1) — but describe it
 * as "one pass over the cells, three constant-time checks per cell".
 *
 * NARRATION:
 *   "Three rules, but I don't need three passes. Each filled cell produces
 *    three observations — this digit in this row, this column, this box — and
 *    the board is invalid the first time an observation repeats. One set, one
 *    pass."
 *
 * THE BOX INDEX is the part worth getting right out loud:
 * `(row / 3 | 0) * 3 + (col / 3 | 0)` maps the nine boxes to 0..8.
 *
 * WHY STRING KEYS: they make the three namespaces disjoint without three data
 * structures. In production you would use three arrays of 9 bitmasks and check
 * with a shift and an AND — worth naming as the optimisation, not worth
 * writing while someone watches.
 */
export function isValidSudoku(board: string[][]): boolean {
  const seen = new Set<string>();

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const cell = board[row]![col]!;
      if (cell === '.') continue;

      const box = ((row / 3) | 0) * 3 + ((col / 3) | 0);
      const keys = [`r${row}-${cell}`, `c${col}-${cell}`, `b${box}-${cell}`];

      for (const key of keys) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
    }
  }

  return true;
}
