/**
 * WHAT YOU TYPE IN THE FIRST TWO MINUTES OF THE INTERVIEW.
 *
 * Do this while you are talking through the problem. It is not dead time —
 * you are restating the problem and listing edge cases out loud while your
 * hands produce the harness. By the time you stop talking you have a runnable
 * file with the prompt's own examples in it.
 *
 * Order of operations:
 *   1. Type the harness (below).
 *   2. Write the signature you agreed with the interviewer.
 *   3. Paste the examples from the prompt in as `eq(...)` lines.
 *   4. Run it. Everything fails. Now you have a target.
 *   5. Solve. Re-run after each meaningful step.
 */

let passed = 0;
let failed = 0;

function eq(actual: unknown, expected: unknown, label = ''): void {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a === b) {
    passed += 1;
    console.log(`  ok   ${label}`);
  } else {
    failed += 1;
    console.log(`FAIL   ${label}\n         expected: ${b}\n         actual:   ${a}`);
  }
}

function summary(): void {
  console.log(`\n${passed} passed, ${failed} failed`);
}

// ─── Signature (agree this with the interviewer before implementing) ────────

function solve(_input: unknown): unknown {
  return null;
}

// ─── Examples from the prompt ───────────────────────────────────────────────

eq(solve(null), null, 'example 1');

// ─── Edge cases you named while framing ─────────────────────────────────────

// eq(solve([]),       ..., 'empty input');
// eq(solve([x]),      ..., 'single element');
// eq(solve([x, x]),   ..., 'all identical');
// eq(solve([-1]),     ..., 'negatives');

summary();
