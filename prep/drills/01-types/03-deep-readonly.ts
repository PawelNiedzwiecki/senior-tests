/**
 * DRILL 1.3 — DeepReadonly, done properly
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 20 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * `Readonly<T>` is one level deep. You want the recursive version — but the
 * naive recursive version mangles arrays, tuples, functions, Maps and Sets.
 * That gap between "works on my example" and "works on real data" is exactly
 * what is being probed.
 *
 * REQUIREMENTS
 *   - plain objects        → every property readonly, recursively
 *   - arrays               → `readonly T[]` with readonly elements
 *   - tuples               → stay tuples, keep labels/arity
 *   - functions            → untouched (a frozen function is still callable)
 *   - primitives           → untouched
 *   - Map / Set            → ReadonlyMap / ReadonlySet
 *
 * WHY IT'S ASKED
 * It is the shortest question that separates "I can write a mapped type" from
 * "I know what a mapped type does to an array". Bonus: it forces you to talk
 * about homomorphic mapped types and modifier preservation.
 *
 * YOUR TASK
 * Implement `DeepReadonly` and `DeepMutable`.
 *
 * HINTS
 *   1. Order your conditional branches narrowest-first. Functions and arrays
 *      are both `object`, so an `extends object` check placed too early wins
 *      and you never reach the specific branches.
 *   2. A mapped type over an array type is homomorphic: `{ [K in keyof A]: ... }`
 *      applied to `string[]` gives you back an array, not an object. Use that
 *      to keep tuples intact instead of special-casing them.
 *   3. `T extends (...args: never[]) => unknown` is the safe function test.
 *      `never[]` (not `any[]`) keeps it contravariance-friendly.
 *
 * STRETCH
 *   a. `DeepMutable` — strip `readonly` with the `-readonly` modifier.
 *   b. Why does `DeepReadonly<Date>` need care, and how would you allow-list
 *      built-ins you should not recurse into?
 *   c. What does `Object.freeze` actually guarantee at runtime, and why is
 *      this type NOT that?
 */

export type DeepReadonly<T> = T; // TODO

export type DeepMutable<T> = T; // TODO
