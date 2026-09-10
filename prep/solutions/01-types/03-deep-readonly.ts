/**
 * SOLUTION 1.3 — DeepReadonly, done properly
 *
 * Talking points:
 *
 * 1. BRANCH ORDER IS THE WHOLE PUZZLE. Functions, arrays, Maps and Sets are
 *    all assignable to `object`. Put the general `object` branch first and the
 *    specific branches become unreachable. Say this before you write code —
 *    it shows you are reasoning about the check, not guessing.
 *
 * 2. HOMOMORPHIC MAPPED TYPES. `{ readonly [K in keyof T]: ... }` over an
 *    array or tuple gives back an array or tuple, preserving arity, labels and
 *    optionality, and `readonly` applies to the index signature. That single
 *    fact removes the need for a separate tuple branch — the naive
 *    `T extends (infer U)[] ? readonly U[] : ...` is what *destroys* tuples.
 *
 * 3. MODIFIER SYNTAX. `+readonly` / `-readonly` and `+?` / `-?` add and remove
 *    modifiers. `-readonly` is how `DeepMutable` unwinds the transform, and
 *    it only works because the mapped type is homomorphic.
 *
 * 4. `(...args: never[]) => unknown` is the correct "any function" shape.
 *    Parameters are contravariant, so `never[]` accepts every parameter list;
 *    using `any[]` works too but leaks `any` into the check.
 *
 * 5. RUNTIME vs TYPES. This type does nothing at runtime. `Object.freeze` is
 *    shallow and throws only in strict mode. If the interviewer asks "is the
 *    data actually immutable?", the answer is no — this is a *convention
 *    enforced by the compiler*, which is usually what you want, because it
 *    costs zero bytes and zero cycles.
 */

type AnyFunction = (...args: never[]) => unknown;

export type DeepReadonly<T> = T extends AnyFunction
  ? T
  : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlySet<infer V>
      ? ReadonlySet<DeepReadonly<V>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

export type DeepMutable<T> = T extends AnyFunction
  ? T
  : T extends ReadonlyMap<infer K, infer V>
    ? Map<DeepMutable<K>, DeepMutable<V>>
    : T extends ReadonlySet<infer V>
      ? Set<DeepMutable<V>>
      : T extends object
        ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
        : T;
